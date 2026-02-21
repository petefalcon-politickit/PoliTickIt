# VS Code Setup Guide: Error Prevention & Detection
## For PoliTickIt Mobile & Backend Teams

---

## Overview

This guide helps you configure VS Code to automatically catch and prevent syntax errors before they even occur. Follow these steps to set up your development environment optimally.

---

## Step 1: Install Required Extensions

### Must-Have Extensions

1. **C# Dev Kit** (Microsoft)
   - ID: `ms-dotnettools.csharp`
   - Provides IntelliSense, debugging, and code analysis
   - Search "C# Dev Kit" in Extensions marketplace

2. **EditorConfig for VS Code** (EditorConfig)
   - ID: `editorconfig.editorconfig`
   - Applies consistent formatting rules
   - Search "EditorConfig" in Extensions marketplace

3. **Code Spell Checker** (Street Side Software)
   - ID: `streetsidesoftware.code-spell-checker`
   - Catches typos in comments and strings
   - Search "Spell Checker" in Extensions marketplace

### Recommended Extensions

4. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - Keeps code consistently formatted

5. **GitLens**
   - ID: `eamodio.gitlens`
   - Helps track code changes and understand history

**Install all at once:**
```bash
code --install-extension ms-dotnettools.csharp
code --install-extension editorconfig.editorconfig
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
```

---

## Step 2: Configure VS Code Settings

Create or update `.vscode/settings.json` in your workspace root:

```json
{
  // C# Configuration
  "[csharp]": {
    "editor.defaultFormatter": "ms-dotnettools.csharp",
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": true,
      "source.organizeImports": true,
      "source.removeUnusedImports": true
    }
  },

  // Editor Settings
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.trimAutoWhitespace": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",

  // IntelliSense & Code Analysis
  "omnisharp.enableRoslynAnalyzers": true,
  "omnisharp.enableEditorConfigSupport": true,
  "omnisharp.enableAnalyzerSupport": true,
  "omnisharp.analyzeOpenDocumentsOnly": false,

  // Error Detection
  "problems.decorations.enabled": true,
  "problems.showCurrentInStatus": true,

  // File Formatting
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  },

  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.formatOnSave": false
  },

  // Exclude unnecessary files from search
  "search.exclude": {
    "**/node_modules": true,
    "**/bin": true,
    "**/obj": true,
    "**/.vs": true
  },

  // Auto-save
  "files.autoSave": "onFocusChange",

  // Git Integration
  "git.autorefresh": true,
  "git.autofetch": true
}
```

---

## Step 3: Create Workspace Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/PoliTickIt.Api/bin/Debug/net9.0/PoliTickIt.Api.dll",
      "args": [],
      "cwd": "${workspaceFolder}/PoliTickIt.Api",
      "stopAtEntry": false,
      "serverReadyAction": {
        "pattern": "\\bNow listening on:\\s+(https?://\\S+)",
        "uriFormat": "{0}",
        "action": "openExternally"
      }
    },
    {
      "name": ".NET Core Attach",
      "type": "coreclr",
      "request": "attach"
    }
  ]
}
```

---

## Step 4: Create Build Task Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "command": "dotnet",
      "type": "process",
      "args": [
        "build",
        "${workspaceFolder}/PoliTickIt.Api/PoliTickIt.Api.csproj",
        "/property:GenerateFullPaths=true",
        "/consoleloggerparameters:NoSummary"
      ],
      "problemMatcher": "$msCompile",
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "test",
      "command": "dotnet",
      "type": "process",
      "args": [
        "test",
        "${workspaceFolder}/PoliTickIt.Api.Tests/PoliTickIt.Api.Tests.csproj"
      ],
      "problemMatcher": "$msCompile"
    },
    {
      "label": "clean",
      "command": "dotnet",
      "type": "process",
      "args": [
        "clean",
        "${workspaceFolder}"
      ]
    },
    {
      "label": "restore",
      "command": "dotnet",
      "type": "process",
      "args": [
        "restore",
        "${workspaceFolder}"
      ]
    }
  ]
}
```

---

## Step 5: Enable Code Analysis

Update your `.csproj` files to enable analyzers. Add this to `PropertyGroup`:

```xml
<!-- PoliTickIt.Api.csproj example -->
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    
    <!-- Enable all analyzers -->
    <EnableNETAnalyzers>true</EnableNETAnalyzers>
    <AnalysisLevel>latest</AnalysisLevel>
    <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
  </PropertyGroup>

  <!-- ... rest of project file ... -->
</Project>
```

---

## Step 6: Install .NET Code Analysis Rules

Add analyzer package to each project:

```bash
dotnet add PoliTickIt.Api package Microsoft.CodeAnalysis.NetAnalyzers --version 9.0.0
dotnet add PoliTickIt.Ingestion package Microsoft.CodeAnalysis.NetAnalyzers --version 9.0.0
dotnet add PoliTickIt.Infrastructure package Microsoft.CodeAnalysis.NetAnalyzers --version 9.0.0
dotnet add PoliTickIt.Domain package Microsoft.CodeAnalysis.NetAnalyzers --version 9.0.0
```

---

## Step 7: Create `.rulesets` for Code Analysis

Create `.ruleset` file in your solution root:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RuleSet Name="PoliTickIt Code Analysis Rules" Description="Rules for PoliTickIt solution" ToolsVersion="16.0">
  <Localization ResourceAssembly="Microsoft.VisualStudio.CodeAnalysis.RuleSets.Strings.dll" ResourceBaseName="Microsoft.VisualStudio.CodeAnalysis.RuleSets.Strings.Localized">
    <Name Resource="MinimumRecommendedRules_Name" />
    <Description Resource="MinimumRecommendedRules_Description" />
  </Localization>

  <!-- Enable all CA (Code Analysis) rules -->
  <Rules AnalyzerId="Microsoft.Analyzers.ManagedCodeAnalysis" RuleNamespace="Microsoft.Rules.Managed">
    <Rule Id="CA1001" Action="Warning" />
    <Rule Id="CA1009" Action="Warning" />
    <Rule Id="CA1016" Action="Warning" />
    <Rule Id="CA1033" Action="Warning" />
    <Rule Id="CA1049" Action="Warning" />
    <Rule Id="CA1060" Action="Warning" />
    <Rule Id="CA1061" Action="Warning" />
    <Rule Id="CA1063" Action="Warning" />
    <Rule Id="CA1065" Action="Warning" />
    <Rule Id="CA1301" Action="Warning" />
    <Rule Id="CA1400" Action="Warning" />
    <Rule Id="CA1401" Action="Warning" />
    <Rule Id="CA1403" Action="Warning" />
    <Rule Id="CA1404" Action="Warning" />
    <Rule Id="CA1405" Action="Warning" />
    <Rule Id="CA1410" Action="Warning" />
    <Rule Id="CA1415" Action="Warning" />
    <Rule Id="CA1821" Action="Warning" />
    <Rule Id="CA1900" Action="Warning" />
    <Rule Id="CA1901" Action="Warning" />
    <Rule Id="CA2002" Action="Warning" />
    <Rule Id="CA2100" Action="Warning" />
    <Rule Id="CA2101" Action="Warning" />
    <Rule Id="CA2108" Action="Warning" />
    <Rule Id="CA2111" Action="Warning" />
    <Rule Id="CA2112" Action="Warning" />
    <Rule Id="CA2114" Action="Warning" />
    <Rule Id="CA2116" Action="Warning" />
    <Rule Id="CA2117" Action="Warning" />
    <Rule Id="CA2122" Action="Warning" />
    <Rule Id="CA2123" Action="Warning" />
    <Rule Id="CA2124" Action="Warning" />
    <Rule Id="CA2126" Action="Warning" />
    <Rule Id="CA2131" Action="Warning" />
    <Rule Id="CA2132" Action="Warning" />
    <Rule Id="CA2134" Action="Warning" />
    <Rule Id="CA2137" Action="Warning" />
    <Rule Id="CA2138" Action="Warning" />
    <Rule Id="CA2139" Action="Warning" />
    <Rule Id="CA2140" Action="Warning" />
    <Rule Id="CA2141" Action="Warning" />
    <Rule Id="CA2146" Action="Warning" />
    <Rule Id="CA2147" Action="Warning" />
    <Rule Id="CA2149" Action="Warning" />
    <Rule Id="CA2200" Action="Warning" />
    <Rule Id="CA2202" Action="Warning" />
    <Rule Id="CA2207" Action="Warning" />
    <Rule Id="CA2212" Action="Warning" />
    <Rule Id="CA2213" Action="Warning" />
    <Rule Id="CA2214" Action="Warning" />
    <Rule Id="CA2216" Action="Warning" />
    <Rule Id="CA2220" Action="Warning" />
    <Rule Id="CA2229" Action="Warning" />
    <Rule Id="CA2231" Action="Warning" />
    <Rule Id="CA2232" Action="Warning" />
    <Rule Id="CA2235" Action="Warning" />
    <Rule Id="CA2236" Action="Warning" />
    <Rule Id="CA2237" Action="Warning" />
    <Rule Id="CA2238" Action="Warning" />
    <Rule Id="CA2240" Action="Warning" />
    <Rule Id="CA2241" Action="Warning" />
    <Rule Id="CA2242" Action="Warning" />
  </Rules>
</RuleSet>
```

---

## Step 8: Keyboard Shortcuts for Common Tasks

Add these to `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+alt+f",
    "command": "editor.action.formatDocument",
    "when": "editorHasDocumentFormattingProvider"
  },
  {
    "key": "ctrl+shift+alt+i",
    "command": "editor.action.organizeImports",
    "when": "editorHasCodeActionsProvider"
  },
  {
    "key": "ctrl+shift+b",
    "command": "workbench.action.tasks.runTask",
    "args": "build"
  },
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.tasks.runTask",
    "args": "test"
  }
]
```

---

## Step 9: Workspace Recommendations

Create `.vscode/extensions.json` to recommend extensions to team members:

```json
{
  "recommendations": [
    "ms-dotnettools.csharp",
    "editorconfig.editorconfig",
    "streetsidesoftware.code-spell-checker",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "ms-dotnettools.test-explorer",
    "GitHub.copilot"
  ]
}
```

---

## Step 10: Test Your Setup

1. **Open the workspace:**
   ```bash
   code .
   ```

2. **Let C# extension download dependencies** (wait 1-2 minutes)

3. **Test IntelliSense:** Type `Dictiona` and press `Ctrl+Space` - should auto-complete

4. **Test Diagnostics:** Intentionally add a trailing comma in a dictionary and save - should show error

5. **Test Formatting:** Make messy code and press `Ctrl+Shift+Alt+F` - should clean it up

6. **Test Build Task:** Press `Ctrl+Shift+B` - should build successfully

---

## Troubleshooting

### IntelliSense Not Working
```bash
# Solution 1: Restart extension
Ctrl+Shift+P ? "C#: Restart OmniSharp"

# Solution 2: Reload Window
Ctrl+Shift+P ? "Developer: Reload Window"

# Solution 3: Reinstall extension
- Uninstall "C# Dev Kit"
- Restart VS Code
- Reinstall from Extensions marketplace
```

### Build Errors After Setup
```bash
# Full reset
dotnet clean
dotnet restore
dotnet build
```

### EditorConfig Not Applied
- Ensure `.editorconfig` is in workspace root (same level as `.sln`)
- Restart VS Code
- Check that EditorConfig extension is enabled

---

## Team Sharing

Copy these files to your repository so everyone gets the same setup:

```
PoliTickIt/
??? .vscode/
?   ??? settings.json
?   ??? launch.json
?   ??? tasks.json
?   ??? extensions.json
??? .editorconfig
??? PoliTickIt.sln
??? ... (other projects)
```

Then when team members clone and open, VS Code will:
1. Suggest installing recommended extensions ?
2. Apply `.editorconfig` rules ?
3. Load workspace settings ?
4. Be ready to develop! ?

---

## Quick Reference: What Each File Does

| File | Purpose | Auto-fixes Errors? |
|------|---------|-------------------|
| `.editorconfig` | Formatting rules | Yes - on save |
| `.vscode/settings.json` | VS Code configuration | Yes - formatting |
| `.vscode/launch.json` | Debugging setup | No - manual |
| `.vscode/tasks.json` | Build/test tasks | No - manual |
| `.ruleset` | Code analysis rules | Yes - at build time |

---

**Setup Complete! You're now protected against most syntax errors!** ??

When errors happen, your editor will now:
- ? Highlight them immediately (red squiggles)
- ? Suggest fixes automatically
- ? Format code consistently
- ? Organize imports correctly

---

**Questions?** Reference the main `NEXUS_SYNTAX_ERRORS_GUIDE.md` document or check the `SYNTAX_ERRORS_QUICK_REFERENCE.md`.
