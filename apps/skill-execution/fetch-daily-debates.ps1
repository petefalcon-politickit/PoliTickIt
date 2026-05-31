# ========================================================================
# fetch-daily-debates.ps1
# PoliTickIt — Daily Congressional Floor Debate Fetcher
#
# PURPOSE: Calls Congress.gov API + GovInfo.gov to fetch yesterday's
#          floor debates, extracts top N bills by speaker count, and
#          writes a debates manifest JSON for use by /daily-floor-debates.
#
# USAGE:
#   .\fetch-daily-debates.ps1
#   .\fetch-daily-debates.ps1 -Date "2026-05-29"
#   .\fetch-daily-debates.ps1 -Chamber "senate"
#   .\fetch-daily-debates.ps1 -Limit 3
#   .\fetch-daily-debates.ps1 -Date "2026-05-29" -Chamber "house" -Limit 5
#
# OUTPUT: daily-debates-{YYYY-MM-DD}.json
#         Written to: C:\Projects\Alithix\Products\PoliTickIt\apps\skill-execution\PoliSnaps\spawn\
# ========================================================================

param(
    [string]$Date    = "",
    [string]$Chamber = "both",   # "senate" | "house" | "both"
    [int]$Limit      = 5,
    [int]$MinSpeakers = 3
)

# ── Config ──────────────────────────────────────────────────────────────
$ApiKey      = "da8cb9e9-19ac-4e33-9a4a-81a3bc44c8a2"
$CongressBase = "https://api.congress.gov/v3"
$GovInfoBase  = "https://api.govinfo.gov"
$OutputDir   = "C:\Projects\Alithix\Products\PoliTickIt\apps\skill-execution\PoliSnaps\spawn"

# ── Date resolution ─────────────────────────────────────────────────────
if ($Date -eq "") {
    $TargetDate = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
} else {
    try {
        $TargetDate = ([datetime]::ParseExact($Date, "yyyy-MM-dd", $null)).ToString("yyyy-MM-dd")
    } catch {
        Write-Host "❌ Invalid date format. Use YYYY-MM-DD (e.g., 2026-05-29)" -ForegroundColor Red
        exit 1
    }
}

$DateObj  = [datetime]::ParseExact($TargetDate, "yyyy-MM-dd", $null)
$Year     = $DateObj.Year
$Month    = $DateObj.Month
$Day      = $DateObj.Day
$DateSlug = $TargetDate -replace "-", ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 Fetching floor debates for: $TargetDate" -ForegroundColor Cyan
Write-Host "   Chamber: $Chamber | Min speakers: $MinSpeakers | Limit: $Limit" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# ── Step 1: Fetch Congressional Record Index ────────────────────────────
Write-Host "`n[1/4] Fetching Congressional Record index..." -ForegroundColor Yellow

$CrUrl = "$CongressBase/congressional-record?y=$Year&m=$Month&d=$Day&api_key=$ApiKey&format=json"

try {
    $CrResponse = Invoke-RestMethod -Uri $CrUrl -Method Get -ErrorAction Stop
} catch {
    Write-Host "❌ Congress.gov API error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Congress may be in recess or the record for $TargetDate is not yet published." -ForegroundColor Yellow
    Write-Host "   Try: .\fetch-daily-debates.ps1 -Date `"$(($DateObj.AddDays(-1)).ToString('yyyy-MM-dd'))`"" -ForegroundColor Yellow
    exit 1
}

if (-not $CrResponse.Results -or -not $CrResponse.Results.Issues) {
    Write-Host "⚠️  No Congressional Record issues found for $TargetDate." -ForegroundColor Yellow
    Write-Host "   Congress may be in recess." -ForegroundColor Yellow
    exit 0
}

$Issue = $CrResponse.Results.Issues | Select-Object -First 1
$Links = $Issue.Links

Write-Host "   ✅ CR issue found: $($Issue.volumeNumber) — $($Issue.congress)th Congress" -ForegroundColor Green

# ── Step 2: Identify chamber sections ───────────────────────────────────
$SectionLinks = @()

if ($Chamber -eq "both" -or $Chamber -eq "senate") {
    $SenateLink = $Links | Where-Object { $_.name -like "*Senate*" } | Select-Object -First 1
    if ($SenateLink) { $SectionLinks += @{ chamber = "Senate"; url = $SenateLink.url } }
}

if ($Chamber -eq "both" -or $Chamber -eq "house") {
    $HouseLink = $Links | Where-Object { $_.name -like "*House*" } | Select-Object -First 1
    if ($HouseLink) { $SectionLinks += @{ chamber = "House"; url = $HouseLink.url } }
}

if ($SectionLinks.Count -eq 0) {
    Write-Host "⚠️  No matching chamber sections found in the CR for $TargetDate." -ForegroundColor Yellow
    exit 0
}

# ── Step 3: Fetch GovInfo full text for speaker extraction ───────────────
Write-Host "`n[2/4] Searching GovInfo.gov for floor debate text..." -ForegroundColor Yellow

$AllBills = @()

foreach ($Section in $SectionLinks) {
    Write-Host "   Scanning $($Section.chamber) proceedings..." -ForegroundColor Gray

    # Search GovInfo for CREC entries on the target date
    $SearchQuery = [uri]::EscapeDataString("floor debate $TargetDate")
    $GovInfoUrl  = "$GovInfoBase/search?query=$SearchQuery&dateIssuedStartDate=$TargetDate&dateIssuedEndDate=$TargetDate&docClass=CREC&pageSize=20&api_key=$ApiKey"

    try {
        $GovInfoResponse = Invoke-RestMethod -Uri $GovInfoUrl -Method Get -ErrorAction Stop
        $Packages = $GovInfoResponse.results
    } catch {
        Write-Host "   ⚠️  GovInfo search failed for $($Section.chamber): $($_.Exception.Message)" -ForegroundColor Yellow
        $Packages = @()
    }

    foreach ($Pkg in $Packages) {
        $PkgTitle  = $Pkg.title ?? ""
        $PackageId = $Pkg.packageId ?? ""

        # Filter to items that look like bill debates (contain bill number patterns)
        if ($PkgTitle -notmatch "[SH]\.\s*\d+|[SH]\.J\.Res\.|[SH]\.R\.|[SH]\.Con\.Res\.") { continue }

        # Extract bill ID from title
        $BillMatch = [regex]::Match($PkgTitle, "([SH]\.(?:J\.Res\.|Con\.Res\.|R\.|Res\.)?\s*\d+)")
        $BillId    = if ($BillMatch.Success) { $BillMatch.Value -replace "\s+", "" } else { "UNKNOWN" }

        # Fetch full text for speaker extraction
        $FullTextUrl = "$GovInfoBase/packages/$PackageId/content-detail?api_key=$ApiKey"
        $FullText    = ""
        try {
            $ContentResponse = Invoke-RestMethod -Uri $FullTextUrl -Method Get -ErrorAction Stop
            # Attempt to get the HTM version (most parseable)
            $HtmLink = $ContentResponse.detailsLink
            if ($HtmLink) {
                $RawText = Invoke-RestMethod -Uri "$HtmLink&api_key=$ApiKey" -Method Get -ErrorAction SilentlyContinue
                $FullText = $RawText -replace "<[^>]+>", " " # strip HTML tags
            }
        } catch {
            # Continue without full text — will produce speaker stubs
        }

        # ── Speaker extraction from CR full text ────────────────────────
        $Speakers = @()
        $SpeakerPattern = "(Mr\.|Mrs\.|Ms\.|SPEAKER|PRESIDING OFFICER)\s+([A-Z][A-Z\s\-]+)\."

        $SpeakerMatches = [regex]::Matches($FullText, $SpeakerPattern)
        $SeenSpeakers   = @{}

        foreach ($Match in $SpeakerMatches) {
            $RawName = $Match.Groups[2].Value.Trim()
            if ($SeenSpeakers.ContainsKey($RawName)) { continue }
            if ($RawName -in @("PRESIDING", "SPEAKER", "PRO TEM", "CHAIR")) { continue }
            $SeenSpeakers[$RawName] = $true

            # Extract the text block after this speaker's recognition
            $StartIdx = $Match.Index + $Match.Length
            $EndIdx   = [Math]::Min($StartIdx + 800, $FullText.Length)
            $SpeakerBlock = $FullText.Substring($StartIdx, $EndIdx - $StartIdx)

            # Extract first sentence as direct quote
            $FirstSentenceMatch = [regex]::Match($SpeakerBlock, "([A-Z][^.!?]{20,200}[.!?])")
            $Quote = if ($FirstSentenceMatch.Success) { $FirstSentenceMatch.Value.Trim() } else { "[Quote extraction unavailable — see Congressional Record]" }

            # Infer position from language cues
            $ForPhrases     = @("I support", "I urge.*passage", "vote yes", "vote aye", "this bill will", "proud to support", "I rise in support")
            $AgainstPhrases = @("I oppose", "I urge.*defeat", "vote no", "vote nay", "this bill fails", "I rise in opposition", "I cannot support")
            $Position = "Neutral"
            foreach ($p in $ForPhrases)     { if ($SpeakerBlock -match $p) { $Position = "For"; break } }
            foreach ($p in $AgainstPhrases) { if ($SpeakerBlock -match $p) { $Position = "Against"; break } }

            # Build summary
            $SecondSentenceMatch = [regex]::Match($SpeakerBlock.Substring([Math]::Min($FirstSentenceMatch.Index + $FirstSentenceMatch.Length, $SpeakerBlock.Length - 1)), "([A-Z][^.!?]{20,200}[.!?])")
            $Summary = if ($SecondSentenceMatch.Success) { "$($FirstSentenceMatch.Value.Trim()) $($SecondSentenceMatch.Value.Trim())" } else { $Quote }

            $Speakers += @{
                name            = $RawName  # TODO: full-name resolution via representatives.md
                representativeId = "PENDING" # resolved downstream by normalizer
                party           = "Unknown"  # resolved downstream by normalizer
                position        = $Position
                quote           = $Quote
                summary         = $Summary
            }
        }

        if ($Speakers.Count -lt $MinSpeakers) { continue }

        $AllBills += @{
            billId        = $BillId
            billTitle     = $PkgTitle
            chamber       = $Section.chamber
            congress      = "119"
            voteOutcome   = $null  # enriched below
            lastActionDate = $TargetDate
            policyArea    = "Unknown"  # resolved by normalizer
            speakerCount  = $Speakers.Count
            speakers      = $Speakers
        }
    }
}

# ── Step 4: Enrich with vote outcomes from Congress.gov ─────────────────
Write-Host "`n[3/4] Enriching with vote outcomes from Congress.gov..." -ForegroundColor Yellow

foreach ($Bill in $AllBills) {
    if ($Bill.billId -eq "UNKNOWN") { continue }

    # Parse chamber + type + number from billId (e.g., "S.2541", "H.J.Res.88")
    $BillType   = if ($Bill.chamber -eq "Senate") { "s" } else { "hr" }
    if ($Bill.billId -match "J\.Res") { $BillType = if ($Bill.chamber -eq "Senate") { "sjres" } else { "hjres" } }
    if ($Bill.billId -match "Con\.Res") { $BillType = if ($Bill.chamber -eq "Senate") { "sconres" } else { "hconres" } }

    $BillNumber = [regex]::Match($Bill.billId, "\d+").Value
    if (-not $BillNumber) { continue }

    $VoteUrl = "$CongressBase/bill/119/$BillType/$BillNumber/actions?api_key=$ApiKey&format=json&limit=5"
    try {
        $VoteResponse = Invoke-RestMethod -Uri $VoteUrl -Method Get -ErrorAction Stop
        $VoteActions  = $VoteResponse.actions | Where-Object { $_.text -match "Passed|Failed|Agreed|Defeated" } | Select-Object -First 1
        if ($VoteActions) {
            $Bill.voteOutcome = $VoteActions.text -replace "^.*(Passed|Failed|Agreed to|Defeated).*?(\d+-\d+).*$", '$1 $2'
            $Bill.lastActionDate = $VoteActions.actionDate
        }
    } catch {
        # Non-fatal — voteOutcome stays null
    }
}

# ── Step 5: Sort, deduplicate, and select top N ──────────────────────────
Write-Host "`n[4/4] Selecting top $Limit bills by speaker count..." -ForegroundColor Yellow

$TopBills = $AllBills |
    Sort-Object { $_.speakerCount } -Descending |
    Select-Object -Unique -First $Limit

if ($TopBills.Count -eq 0) {
    Write-Host "`n⚠️  No bills with $MinSpeakers+ speakers found for $TargetDate." -ForegroundColor Yellow
    Write-Host "   Try lowering -MinSpeakers or using a different date." -ForegroundColor Yellow
    exit 0
}

# Add rank
$Rank = 1
foreach ($Bill in $TopBills) {
    $Bill["rank"] = $Rank
    $Rank++
}

# ── Write manifest ───────────────────────────────────────────────────────
$Manifest = @{
    fetchDate       = $TargetDate
    fetchedAt       = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    chamber         = $Chamber
    targetsSelected = $TopBills.Count
    bills           = $TopBills
}

$ManifestPath = Join-Path $OutputDir "daily-debates-$TargetDate.json"
$Manifest | ConvertTo-Json -Depth 10 | Set-Content -Path $ManifestPath -Encoding UTF8

# ── Summary ─────────────────────────────────────────────────────────────
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ FLOOR DEBATES FETCHED — $TargetDate" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$TableRows = $TopBills | ForEach-Object {
    $Outcome = if ($_.voteOutcome) { $_.voteOutcome } else { "No vote taken" }
    "{0,-4} {1,-18} {2,-8} {3,-9} {4}" -f "$($_.rank).", $_.billId, $_.chamber, "$($_.speakerCount) speakers", $Outcome
}

Write-Host "Rank  Bill               Chamber   Speakers  Vote Outcome"
Write-Host "────  ─────────────────  ────────  ────────  ──────────────────"
$TableRows | ForEach-Object { Write-Host $_ }

Write-Host "`n📄 Manifest written to:" -ForegroundColor Gray
Write-Host "   $ManifestPath" -ForegroundColor White
Write-Host "`n▶  Now run in VS Code: /daily-floor-debates $TargetDate" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
