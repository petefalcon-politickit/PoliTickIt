# PoliSnap Representatives Reference — 119th Congress

**Owner:** `polisnap-normalizer`
**Used by:** Normalizer only — no other skill validates rep IDs directly.
**Congress:** 119th (2025–2027)
**Last synced:** 2026-05-30
**Jurisdiction scope:** This file covers all levels: Federal, State, County, City, School District.
**ID conventions:** See `jurisdictions.md` for the full ID format specification by level.

---

## Canonical Model Strategy

This file is the **Politickit Canonical Model** for representatives. All normalizer lookups resolve against this file before making live API calls.

### ID Conventions

| Chamber | ID Field | Source | Format |
|---|---|---|---|
| Senate | `bioguide_id` | [senate.gov XML](https://www.senate.gov/general/contact_information/senators_cfm.xml) | 7-char alphanumeric (e.g. `T000250`) |
| House (voting) | `bioguide_id` | Congress.gov API `GET /v3/member?congress=119&chamber=house` | 7-char alphanumeric |
| House (seat ref) | `HR-{STATE2}-{DIST}` | Derived from house.gov directory | e.g. `C001131`, `B001323` |
| Delegates | `HD-{TERRITORY}` | Derived | e.g. `N000147`, `M001219` |
| Resident Commissioner | `H001103` | Derived | Fixed |

> **Bioguide ID resolution for House:** House members' `bioguide_id` values must be resolved via `GET https://api.congress.gov/v3/member?congress=119&chamber=house&stateCode={state}&district={district}&api_key={key}`. Until resolved, the `bioguide_id` column contains the seat reference ID. Run resolution script to populate.

### Source Mapping

| Data | Source URL | Auth | Sync cadence |
|---|---|---|---|
| Senate members + bioguide IDs | `https://www.senate.gov/general/contact_information/senators_cfm.xml` | None | Weekly |
| House members (name/party/district) | `https://www.house.gov/representatives` | None | Weekly |
| House bioguide IDs | `https://api.congress.gov/v3/member?congress=119&chamber=house` | `api_key` | One-time + on vacancy |
| State legislatures | OpenStates v3 `https://v3.openstates.org/` | API key | Activated per state |
| County/City | Legistar `https://webapi.legistar.com/` | None | Activated per jurisdiction |

### Vacancy Handling

- Retain the row; append `(VACANT)` to the name.
- When a new member is sworn in: update name, re-resolve bioguide ID, remove `(VACANT)`.
- Vacancy warning code: `UNKNOWN_REPRESENTATIVE` — emitted in spawn `warnings[]`.

---

## Federal — Senate (119th Congress, 100 Members)

*Source: senate.gov XML · Last synced: 2026-05-30*

| Bioguide ID | Last Name | First Name | Party | State | Class |
|---|---|---|---|---|---|
| `A000382` | Alsobrooks | Angela D. | D | MD | I |
| `A000383` | Armstrong | Alan | R | OK | II |
| `B001230` | Baldwin | Tammy | D | WI | I |
| `B001299` | Banks | Jim | R | IN | I |
| `B001261` | Barrasso | John | R | WY | I |
| `B001267` | Bennet | Michael F. | D | CO | III |
| `B001243` | Blackburn | Marsha | R | TN | I |
| `B001277` | Blumenthal | Richard | D | CT | III |
| `B001303` | Blunt Rochester | Lisa | D | DE | I |
| `B001288` | Booker | Cory A. | D | NJ | II |
| `B001236` | Boozman | John | R | AR | III |
| `B001319` | Britt | Katie Boyd | R | AL | III |
| `B001305` | Budd | Ted | R | NC | III |
| `C000127` | Cantwell | Maria | D | WA | I |
| `C001047` | Capito | Shelley Moore | R | WV | II |
| `C001075` | Cassidy | Bill | R | LA | II |
| `C001035` | Collins | Susan M. | R | ME | II |
| `C001088` | Coons | Christopher A. | D | DE | II |
| `C001056` | Cornyn | John | R | TX | II |
| `C001113` | Cortez Masto | Catherine | D | NV | III |
| `C001095` | Cotton | Tom | R | AR | II |
| `C001096` | Cramer | Kevin | R | ND | I |
| `C000880` | Crapo | Mike | R | ID | III |
| `C001098` | Cruz | Ted | R | TX | I |
| `C001114` | Curtis | John R. | R | UT | I |
| `D000618` | Daines | Steve | R | MT | II |
| `D000622` | Duckworth | Tammy | D | IL | III |
| `D000563` | Durbin | Richard J. | D | IL | II |
| `E000295` | Ernst | Joni | R | IA | II |
| `F000479` | Fetterman | John | D | PA | III |
| `F000463` | Fischer | Deb | R | NE | I |
| `G000574` | Gallego | Ruben | D | AZ | I |
| `G000555` | Gillibrand | Kirsten E. | D | NY | I |
| `G000359` | Graham | Lindsey | R | SC | II |
| `G000386` | Grassley | Chuck | R | IA | III |
| `H000601` | Hagerty | Bill | R | TN | II |
| `H001076` | Hassan | Margaret Wood | D | NH | III |
| `H001089` | Hawley | Josh | R | MO | I |
| `H001046` | Heinrich | Martin | D | NM | I |
| `H000273` | Hickenlooper | John W. | D | CO | II |
| `H001042` | Hirono | Mazie K. | D | HI | I |
| `H001061` | Hoeven | John | R | ND | III |
| `H001104` | Husted | Jon | R | OH | III |
| `H001079` | Hyde-Smith | Cindy | R | MS | II |
| `J000293` | Johnson | Ron | R | WI | III |
| `J000312` | Justice | James C. | R | WV | I |
| `K000384` | Kaine | Tim | D | VA | I |
| `K000377` | Kelly | Mark | D | AZ | III |
| `K000393` | Kennedy | John | R | LA | III |
| `K000394` | Kim | Andy | D | NJ | I |
| `K000383` | King | Angus S. Jr. | I | ME | I |
| `K000367` | Klobuchar | Amy | D | MN | I |
| `L000575` | Lankford | James | R | OK | III |
| `L000577` | Lee | Mike | R | UT | III |
| `L000570` | Luján | Ben Ray | D | NM | II |
| `L000571` | Lummis | Cynthia M. | R | WY | II |
| `M000133` | Markey | Edward J. | D | MA | II |
| `M001198` | Marshall | Roger | R | KS | II |
| `M000355` | McConnell | Mitch | R | KY | II |
| `M001243` | McCormick | David | R | PA | I |
| `M001176` | Merkley | Jeff | D | OR | II |
| `M001244` | Moody | Ashley | R | FL | III |
| `M000934` | Moran | Jerry | R | KS | III |
| `M001242` | Moreno | Bernie | R | OH | I |
| `M001153` | Murkowski | Lisa | R | AK | III |
| `M001169` | Murphy | Christopher | D | CT | I |
| `M001111` | Murray | Patty | D | WA | III |
| `O000174` | Ossoff | Jon | D | GA | II |
| `P000145` | Padilla | Alex | D | CA | III |
| `P000603` | Paul | Rand | R | KY | III |
| `P000595` | Peters | Gary C. | D | MI | II |
| `R000122` | Reed | Jack | D | RI | II |
| `R000618` | Ricketts | Pete | R | NE | II |
| `R000584` | Risch | James E. | R | ID | II |
| `R000608` | Rosen | Jacky | D | NV | I |
| `R000605` | Rounds | Mike | R | SD | II |
| `S000033` | Sanders | Bernard | I | VT | I |
| `S001194` | Schatz | Brian | D | HI | III |
| `S001150` | Schiff | Adam B. | D | CA | I |
| `S001227` | Schmitt | Eric | R | MO | III |
| `S000148` | Schumer | Charles E. | D | NY | III |
| `S001217` | Scott | Rick | R | FL | I |
| `S001184` | Scott | Tim | R | SC | III |
| `S001181` | Shaheen | Jeanne | D | NH | II |
| `S001232` | Sheehy | Tim | R | MT | I |
| `S001208` | Slotkin | Elissa | D | MI | I |
| `S001203` | Smith | Tina | D | MN | II |
| `S001198` | Sullivan | Dan | R | AK | II |
| `T000250` | Thune | John | R | SD | III |
| `T000476` | Tillis | Thom | R | NC | II |
| `T000278` | Tuberville | Tommy | R | AL | II |
| `V000128` | Van Hollen | Chris | D | MD | III |
| `W000805` | Warner | Mark R. | D | VA | II |
| `W000790` | Warnock | Raphael G. | D | GA | III |
| `W000817` | Warren | Elizabeth | D | MA | I |
| `W000800` | Welch | Peter | D | VT | III |
| `W000802` | Whitehouse | Sheldon | D | RI | I |
| `W000437` | Wicker | Roger F. | R | MS | I |
| `W000779` | Wyden | Ron | D | OR | III |
| `Y000064` | Young | Todd | R | IN | III |

---

## Federal — House of Representatives (119th Congress, 435 Voting Members)

*Source: house.gov directory · Last synced: 2026-05-30*
*Bioguide IDs resolved via Congress.gov API v3 Â· Synced: 2026-05-30 Â· Remaining seat-refs = unresolved*

| Bioguide ID | Name | Party | State | District |
|---|---|---|---|---|
| `M001212` | Moore, Barry | R | AL | 1 |
| `F000481` | Figures, Shomari | D | AL | 2 |
| `R000575` | Rogers, Mike | R | AL | 3 |
| `A000055` | Aderholt, Robert | R | AL | 4 |
| `S001220` | Strong, Dale | R | AL | 5 |
| `P000609` | Palmer, Gary | R | AL | 6 |
| `S001185` | Sewell, Terri | D | AL | 7 |
| `B001323` | Begich, Nicholas | R | AK | At-Large |
| `S001183` | Schweikert, David | R | AZ | 1 |
| `C001132` | Crane, Elijah | R | AZ | 2 |
| `A000381` | Ansari, Yassamin | D | AZ | 3 |
| `S001211` | Stanton, Greg | D | AZ | 4 |
| `B001302` | Biggs, Andy | R | AZ | 5 |
| `C001133` | Ciscomani, Juan | R | AZ | 6 |
| `G000606` | Grijalva, Adelita | D | AZ | 7 |
| `H001098` | Hamadeh, Abraham | R | AZ | 8 |
| `G000565` | Gosar, Paul | R | AZ | 9 |
| `C001087` | Crawford, Eric | R | AR | 1 |
| `H001072` | Hill, J. | R | AR | 2 |
| `W000809` | Womack, Steve | R | AR | 3 |
| `W000821` | Westerman, Bruce | R | AR | 4 |
| `L000578` | LaMalfa, Doug | R | CA | 1 |
| `H001068` | Huffman, Jared | D | CA | 2 |
| `K000401` | Kiley, Kevin | I | CA | 3 |
| `T000460` | Thompson, Mike | D | CA | 4 |
| `M001177` | McClintock, Tom | R | CA | 5 |
| `B001287` | Bera, Ami | D | CA | 6 |
| `M001163` | Matsui, Doris | D | CA | 7 |
| `G000559` | Garamendi, John | D | CA | 8 |
| `H001090` | Harder, Josh | D | CA | 9 |
| `D000623` | DeSaulnier, Mark | D | CA | 10 |
| `P000197` | Pelosi, Nancy | D | CA | 11 |
| `HR-CA-12` | Simon, Lateefah | D | CA | 12 |
| `G000605` | Gray, Adam | D | CA | 13 |
| `S001193` | Swalwell, Eric | D | CA | 14 |
| `M001225` | Mullin, Kevin | D | CA | 15 |
| `L000607` | Liccardo, Sam | D | CA | 16 |
| `K000389` | Khanna, Ro | D | CA | 17 |
| `L000397` | Lofgren, Zoe | D | CA | 18 |
| `P000613` | Panetta, Jimmy | D | CA | 19 |
| `F000480` | Fong, Vince | R | CA | 20 |
| `C001059` | Costa, Jim | D | CA | 21 |
| `V000129` | Valadao, David | R | CA | 22 |
| `O000019` | Obernolte, Jay | R | CA | 23 |
| `C001112` | Carbajal, Salud | D | CA | 24 |
| `R000599` | Ruiz, Raul | D | CA | 25 |
| `B001285` | Brownley, Julia | D | CA | 26 |
| `W000830` | Whitesides, George | D | CA | 27 |
| `C001080` | Chu, Judy | D | CA | 28 |
| `HR-CA-29` | Rivas, Luz | D | CA | 29 |
| `F000483` | Friedman, Laura | D | CA | 30 |
| `C001123` | Cisneros, Gilbert | D | CA | 31 |
| `S000344` | Sherman, Brad | D | CA | 32 |
| `A000371` | Aguilar, Pete | D | CA | 33 |
| `G000585` | Gomez, Jimmy | D | CA | 34 |
| `T000474` | Torres, Norma | D | CA | 35 |
| `L000582` | Lieu, Ted | D | CA | 36 |
| `K000400` | Kamlager-Dove, Sydney | D | CA | 37 |
| `HR-CA-38` | Sanchez, Linda | D | CA | 38 |
| `T000472` | Takano, Mark | D | CA | 39 |
| `K000397` | Kim, Young | R | CA | 40 |
| `C000059` | Calvert, Ken | R | CA | 41 |
| `G000598` | Garcia, Robert | D | CA | 42 |
| `W000187` | Waters, Maxine | D | CA | 43 |
| `B001300` | Barragan, Nanette | D | CA | 44 |
| `T000491` | Tran, Derek | D | CA | 45 |
| `C001110` | Correa, J. | D | CA | 46 |
| `M001241` | Min, Dave | D | CA | 47 |
| `I000056` | Issa, Darrell | R | CA | 48 |
| `L000593` | Levin, Mike | D | CA | 49 |
| `P000608` | Peters, Scott | D | CA | 50 |
| `J000305` | Jacobs, Sara | D | CA | 51 |
| `V000130` | Vargas, Juan | D | CA | 52 |
| `D000197` | DeGette, Diana | D | CO | 1 |
| `N000191` | Neguse, Joe | D | CO | 2 |
| `H001100` | Hurd, Jeff | R | CO | 3 |
| `B000825` | Boebert, Lauren | R | CO | 4 |
| `C001137` | Crank, Jeff | R | CO | 5 |
| `C001121` | Crow, Jason | D | CO | 6 |
| `P000620` | Pettersen, Brittany | D | CO | 7 |
| `E000300` | Evans, Gabe | R | CO | 8 |
| `L000557` | Larson, John | D | CT | 1 |
| `C001069` | Courtney, Joe | D | CT | 2 |
| `D000216` | DeLauro, Rosa | D | CT | 3 |
| `H001047` | Himes, James | D | CT | 4 |
| `H001081` | Hayes, Jahana | D | CT | 5 |
| `M001238` | McBride, Sarah | D | DE | At-Large |
| `P000622` | Patronis, Jimmy | R | FL | 1 |
| `D000628` | Dunn, Neal | R | FL | 2 |
| `C001039` | Cammack, Kat | R | FL | 3 |
| `B001314` | Bean, Aaron | R | FL | 4 |
| `R000609` | Rutherford, John | R | FL | 5 |
| `F000484` | Fine, Randy | R | FL | 6 |
| `M001216` | Mills, Cory | R | FL | 7 |
| `H001099` | Haridopolos, Mike | R | FL | 8 |
| `S001200` | Soto, Darren | D | FL | 9 |
| `F000476` | Frost, Maxwell | D | FL | 10 |
| `W000806` | Webster, Daniel | R | FL | 11 |
| `B001257` | Bilirakis, Gus | R | FL | 12 |
| `L000596` | Luna, Anna Paulina | R | FL | 13 |
| `C001066` | Castor, Kathy | D | FL | 14 |
| `L000597` | Lee, Laurel | R | FL | 15 |
| `B001260` | Buchanan, Vern | R | FL | 16 |
| `S001214` | Steube, W. | R | FL | 17 |
| `F000472` | Franklin, Scott | R | FL | 18 |
| `D000032` | Donalds, Byron | R | FL | 19 |
| `C001127` | Cherfilus-McCormick, Sheila | D | FL | 20 |
| `M001199` | Mast, Brian | R | FL | 21 |
| `F000462` | Frankel, Lois | D | FL | 22 |
| `M001217` | Moskowitz, Jared | D | FL | 23 |
| `W000808` | Wilson, Frederica | D | FL | 24 |
| `W000797` | Wasserman Schultz, Debbie | D | FL | 25 |
| `D000600` | Diaz-Balart, Mario | R | FL | 26 |
| `S000168` | Salazar, Maria | R | FL | 27 |
| `G000593` | Gimenez, Carlos | R | FL | 28 |
| `C001103` | Carter, Earl | R | GA | 1 |
| `B000490` | Bishop, Sanford | D | GA | 2 |
| `J000311` | Jack, Brian | R | GA | 3 |
| `J000288` | Johnson, Henry | D | GA | 4 |
| `W000788` | Williams, Nikema | D | GA | 5 |
| `M001208` | McBath, Lucy | D | GA | 6 |
| `M001218` | McCormick, Richard | R | GA | 7 |
| `S001189` | Scott, Austin | R | GA | 8 |
| `C001116` | Clyde, Andrew | R | GA | 9 |
| `C001129` | Collins, Mike | R | GA | 10 |
| `L000583` | Loudermilk, Barry | R | GA | 11 |
| `A000372` | Allen, Rick | R | GA | 12 |
| `S001157` | Scott, David | D | GA | 13 |
| `F000485` | Fuller, Clay | R | GA | 14 |
| `C001055` | Case, Ed | D | HI | 1 |
| `T000487` | Tokuda, Jill | D | HI | 2 |
| `F000469` | Fulcher, Russ | R | ID | 1 |
| `S001148` | Simpson, Michael | R | ID | 2 |
| `J000309` | Jackson, Jonathan | D | IL | 1 |
| `K000385` | Kelly, Robin | D | IL | 2 |
| `R000617` | Ramirez, Delia | D | IL | 3 |
| `G000586` | Garcia, Jesus | D | IL | 4 |
| `Q000023` | Quigley, Mike | D | IL | 5 |
| `C001117` | Casten, Sean | D | IL | 6 |
| `D000096` | Davis, Danny | D | IL | 7 |
| `K000391` | Krishnamoorthi, Raja | D | IL | 8 |
| `S001145` | Schakowsky, Janice | D | IL | 9 |
| `S001190` | Schneider, Bradley | D | IL | 10 |
| `F000454` | Foster, Bill | D | IL | 11 |
| `B001295` | Bost, Mike | R | IL | 12 |
| `B001315` | Budzinski, Nikki | D | IL | 13 |
| `U000040` | Underwood, Lauren | D | IL | 14 |
| `M001211` | Miller, Mary | R | IL | 15 |
| `L000585` | LaHood, Darin | R | IL | 16 |
| `S001225` | Sorensen, Eric | D | IL | 17 |
| `M001214` | Mrvan, Frank | D | IN | 1 |
| `Y000067` | Yakym, Rudy | R | IN | 2 |
| `S001188` | Stutzman, Marlin | R | IN | 3 |
| `B001307` | Baird, James | R | IN | 4 |
| `S000929` | Spartz, Victoria | R | IN | 5 |
| `S001229` | Shreve, Jefferson | R | IN | 6 |
| `C001072` | Carson, Andre | D | IN | 7 |
| `M001233` | Messmer, Mark | R | IN | 8 |
| `H001093` | Houchin, Erin | R | IN | 9 |
| `M001215` | Miller-Meeks, Mariannette | R | IA | 1 |
| `H001091` | Hinson, Ashley | R | IA | 2 |
| `N000193` | Nunn, Zachary | R | IA | 3 |
| `F000446` | Feenstra, Randy | R | IA | 4 |
| `M000871` | Mann, Tracey | R | KS | 1 |
| `S001228` | Schmidt, Derek | R | KS | 2 |
| `D000629` | Davids, Sharice | D | KS | 3 |
| `E000298` | Estes, Ron | R | KS | 4 |
| `C001108` | Comer, James | R | KY | 1 |
| `G000558` | Guthrie, Brett | R | KY | 2 |
| `M001220` | McGarvey, Morgan | D | KY | 3 |
| `M001184` | Massie, Thomas | R | KY | 4 |
| `R000395` | Rogers, Harold | R | KY | 5 |
| `B001282` | Barr, Andy | R | KY | 6 |
| `S001176` | Scalise, Steve | R | LA | 1 |
| `C001125` | Carter, Troy | D | LA | 2 |
| `H001077` | Higgins, Clay | R | LA | 3 |
| `J000299` | Johnson, Mike | R | LA | 4 |
| `L000595` | Letlow, Julia | R | LA | 5 |
| `F000110` | Fields, Cleo | D | LA | 6 |
| `P000597` | Pingree, Chellie | D | ME | 1 |
| `G000592` | Golden, Jared | D | ME | 2 |
| `H001052` | Harris, Andy | R | MD | 1 |
| `O000176` | Olszewski, Johnny | D | MD | 2 |
| `E000301` | Elfreth, Sarah | D | MD | 3 |
| `I000058` | Ivey, Glenn | D | MD | 4 |
| `HR-MD-05` | Hoyer, Steny (STALE — retired 118th) | D | MD | 5 |
| `M001232` | McClain Delaney, April | D | MD | 6 |
| `M000687` | Mfume, Kweisi | D | MD | 7 |
| `R000606` | Raskin, Jamie | D | MD | 8 |
| `N000015` | Neal, Richard | D | MA | 1 |
| `M000312` | McGovern, James | D | MA | 2 |
| `T000482` | Trahan, Lori | D | MA | 3 |
| `A000148` | Auchincloss, Jake | D | MA | 4 |
| `C001101` | Clark, Katherine | D | MA | 5 |
| `M001196` | Moulton, Seth | D | MA | 6 |
| `P000617` | Pressley, Ayanna | D | MA | 7 |
| `L000562` | Lynch, Stephen | D | MA | 8 |
| `K000375` | Keating, William | D | MA | 9 |
| `B001301` | Bergman, Jack | R | MI | 1 |
| `M001194` | Moolenaar, John | R | MI | 2 |
| `S001221` | Scholten, Hillary | D | MI | 3 |
| `H001058` | Huizenga, Bill | R | MI | 4 |
| `W000798` | Walberg, Tim | R | MI | 5 |
| `D000624` | Dingell, Debbie | D | MI | 6 |
| `B001321` | Barrett, Tom | R | MI | 7 |
| `M001237` | McDonald Rivet, Kristen | D | MI | 8 |
| `M001136` | McClain, Lisa | R | MI | 9 |
| `J000307` | James, John | R | MI | 10 |
| `S001215` | Stevens, Haley | D | MI | 11 |
| `T000481` | Tlaib, Rashida | D | MI | 12 |
| `T000488` | Thanedar, Shri | D | MI | 13 |
| `F000475` | Finstad, Brad | R | MN | 1 |
| `C001119` | Craig, Angie | D | MN | 2 |
| `M001234` | Morrison, Kelly | D | MN | 3 |
| `M001143` | McCollum, Betty | D | MN | 4 |
| `O000173` | Omar, Ilhan | D | MN | 5 |
| `E000294` | Emmer, Tom | R | MN | 6 |
| `F000470` | Fischbach, Michelle | R | MN | 7 |
| `S001212` | Stauber, Pete | R | MN | 8 |
| `K000388` | Kelly, Trent | R | MS | 1 |
| `T000193` | Thompson, Bennie | D | MS | 2 |
| `G000591` | Guest, Michael | R | MS | 3 |
| `E000235` | Ezell, Mike | R | MS | 4 |
| `B001324` | Bell, Wesley | D | MO | 1 |
| `W000812` | Wagner, Ann | R | MO | 2 |
| `O000177` | Onder, Robert | R | MO | 3 |
| `A000379` | Alford, Mark | R | MO | 4 |
| `C001061` | Cleaver, Emanuel | D | MO | 5 |
| `G000546` | Graves, Sam | R | MO | 6 |
| `B001316` | Burlison, Eric | R | MO | 7 |
| `S001195` | Smith, Jason | R | MO | 8 |
| `Z000018` | Zinke, Ryan | R | MT | 1 |
| `D000634` | Downing, Troy | R | MT | 2 |
| `F000474` | Flood, Mike | R | NE | 1 |
| `B001298` | Bacon, Don | R | NE | 2 |
| `S001172` | Smith, Adrian | R | NE | 3 |
| `T000468` | Titus, Dina | D | NV | 1 |
| `A000369` | Amodei, Mark | R | NV | 2 |
| `L000590` | Lee, Susie | D | NV | 3 |
| `H001066` | Horsford, Steven | D | NV | 4 |
| `P000614` | Pappas, Chris | D | NH | 1 |
| `G000604` | Goodlander, Maggie | D | NH | 2 |
| `N000188` | Norcross, Donald | D | NJ | 1 |
| `V000133` | Van Drew, Jefferson | R | NJ | 2 |
| `C001136` | Conaway, Herbert | D | NJ | 3 |
| `S000522` | Smith, Christopher | R | NJ | 4 |
| `G000583` | Gottheimer, Josh | D | NJ | 5 |
| `P000034` | Pallone, Frank | D | NJ | 6 |
| `K000398` | Kean, Thomas | R | NJ | 7 |
| `M001226` | Menendez, Robert | D | NJ | 8 |
| `P000621` | Pou, Nellie | D | NJ | 9 |
| `M001229` | McIver, LaMonica | D | NJ | 10 |
| `M001246` | Mejia, Analilia | D | NJ | 11 |
| `W000822` | Watson Coleman, Bonnie | D | NJ | 12 |
| `S001218` | Stansbury, Melanie | D | NM | 1 |
| `V000136` | Vasquez, Gabe | D | NM | 2 |
| `L000273` | Leger Fernandez, Teresa | D | NM | 3 |
| `L000598` | LaLota, Nick | R | NY | 1 |
| `G000597` | Garbarino, Andrew | R | NY | 2 |
| `S001201` | Suozzi, Thomas R. | D | NY | 3 |
| `G000602` | Gillen, Laura | D | NY | 4 |
| `M001137` | Meeks, Gregory | D | NY | 5 |
| `M001188` | Meng, Grace | D | NY | 6 |
| `V000081` | Velazquez, Nydia | D | NY | 7 |
| `J000294` | Jeffries, Hakeem | D | NY | 8 |
| `C001067` | Clarke, Yvette | D | NY | 9 |
| `G000599` | Goldman, Daniel | D | NY | 10 |
| `M000317` | Malliotakis, Nicole | R | NY | 11 |
| `N000002` | Nadler, Jerrold | D | NY | 12 |
| `E000297` | Espaillat, Adriano | D | NY | 13 |
| `O000172` | Ocasio-Cortez, Alexandria | D | NY | 14 |
| `T000486` | Torres, Ritchie | D | NY | 15 |
| `L000606` | Latimer, George | D | NY | 16 |
| `L000599` | Lawler, Michael | R | NY | 17 |
| `R000579` | Ryan, Patrick | D | NY | 18 |
| `R000622` | Riley, Josh | D | NY | 19 |
| `T000469` | Tonko, Paul | D | NY | 20 |
| `S001196` | Stefanik, Elise | R | NY | 21 |
| `M001231` | Mannion, John | D | NY | 22 |
| `L000600` | Langworthy, Nicholas | R | NY | 23 |
| `T000478` | Tenney, Claudia | R | NY | 24 |
| `M001206` | Morelle, Joseph | D | NY | 25 |
| `K000402` | Kennedy, Timothy | D | NY | 26 |
| `D000230` | Davis, Donald | D | NC | 1 |
| `R000305` | Ross, Deborah | D | NC | 2 |
| `M001210` | Murphy, Gregory | R | NC | 3 |
| `F000477` | Foushee, Valerie | D | NC | 4 |
| `F000450` | Foxx, Virginia | R | NC | 5 |
| `M001240` | McDowell, Addison | R | NC | 6 |
| `R000603` | Rouzer, David | R | NC | 7 |
| `H001102` | Harris, Mark | R | NC | 8 |
| `H001067` | Hudson, Richard | R | NC | 9 |
| `H001101` | Harrigan, Pat | R | NC | 10 |
| `E000246` | Edwards, Chuck | R | NC | 11 |
| `A000370` | Adams, Alma | D | NC | 12 |
| `K000405` | Knott, Brad | R | NC | 13 |
| `M001236` | Moore, Tim | R | NC | 14 |
| `F000482` | Fedorchak, Julie | R | ND | At-Large |
| `L000601` | Landsman, Greg | D | OH | 1 |
| `T000490` | Taylor, David | R | OH | 2 |
| `B001281` | Beatty, Joyce | D | OH | 3 |
| `J000289` | Jordan, Jim | R | OH | 4 |
| `L000566` | Latta, Robert | R | OH | 5 |
| `R000619` | Rulli, Michael A. | R | OH | 6 |
| `M001222` | Miller, Max | R | OH | 7 |
| `D000626` | Davidson, Warren | R | OH | 8 |
| `K000009` | Kaptur, Marcy | D | OH | 9 |
| `T000463` | Turner, Michael | R | OH | 10 |
| `B001313` | Brown, Shontel | D | OH | 11 |
| `B001306` | Balderson, Troy | R | OH | 12 |
| `S001223` | Sykes, Emilia | D | OH | 13 |
| `J000295` | Joyce, David | R | OH | 14 |
| `C001126` | Carey, Mike | R | OH | 15 |
| `H001082` | Hern, Kevin | R | OK | 1 |
| `B001317` | Brecheen, Josh | R | OK | 2 |
| `L000491` | Lucas, Frank | R | OK | 3 |
| `C001053` | Cole, Tom | R | OK | 4 |
| `B000740` | Bice, Stephanie | R | OK | 5 |
| `B001278` | Bonamici, Suzanne | D | OR | 1 |
| `B000668` | Bentz, Cliff | R | OR | 2 |
| `D000635` | Dexter, Maxine | D | OR | 3 |
| `H001094` | Hoyle, Val | D | OR | 4 |
| `B001326` | Bynum, Janelle | D | OR | 5 |
| `S001226` | Salinas, Andrea | D | OR | 6 |
| `F000466` | Fitzpatrick, Brian | R | PA | 1 |
| `B001296` | Boyle, Brendan | D | PA | 2 |
| `E000296` | Evans, Dwight | D | PA | 3 |
| `D000631` | Dean, Madeleine | D | PA | 4 |
| `S001205` | Scanlon, Mary Gay | D | PA | 5 |
| `H001085` | Houlahan, Chrissy | D | PA | 6 |
| `M001230` | Mackenzie, Ryan | R | PA | 7 |
| `B001327` | Bresnahan, Robert | R | PA | 8 |
| `M001204` | Meuser, Daniel | R | PA | 9 |
| `P000605` | Perry, Scott | R | PA | 10 |
| `S001199` | Smucker, Lloyd | R | PA | 11 |
| `L000602` | Lee, Summer | D | PA | 12 |
| `J000302` | Joyce, John | R | PA | 13 |
| `R000610` | Reschenthaler, Guy | R | PA | 14 |
| `T000467` | Thompson, Glenn | R | PA | 15 |
| `K000376` | Kelly, Mike | R | PA | 16 |
| `D000530` | Deluzio, Christopher | D | PA | 17 |
| `A000380` | Amo, Gabe | D | RI | 1 |
| `M001223` | Magaziner, Seth | D | RI | 2 |
| `M000194` | Mace, Nancy | R | SC | 1 |
| `W000795` | Wilson, Joe | R | SC | 2 |
| `B001325` | Biggs, Sheri | R | SC | 3 |
| `T000480` | Timmons, William | R | SC | 4 |
| `N000190` | Norman, Ralph | R | SC | 5 |
| `C000537` | Clyburn, James | D | SC | 6 |
| `F000478` | Fry, Russell | R | SC | 7 |
| `J000301` | Johnson, Dusty | R | SD | At-Large |
| `H001086` | Harshbarger, Diana | R | TN | 1 |
| `B001309` | Burchett, Tim | R | TN | 2 |
| `F000459` | Fleischmann, Charles | R | TN | 3 |
| `D000616` | DesJarlais, Scott | R | TN | 4 |
| `O000175` | Ogles, Andrew | R | TN | 5 |
| `R000612` | Rose, John | R | TN | 6 |
| `V000139` | Van Epps, Matt | R | TN | 7 |
| `K000392` | Kustoff, David | R | TN | 8 |
| `C001068` | Cohen, Steve | D | TN | 9 |
| `M001224` | Moran, Nathaniel | R | TX | 1 |
| `C001120` | Crenshaw, Dan | R | TX | 2 |
| `S001224` | Self, Keith | R | TX | 3 |
| `F000246` | Fallon, Pat | R | TX | 4 |
| `G000589` | Gooden, Lance | R | TX | 5 |
| `E000071` | Ellzey, Jake | R | TX | 6 |
| `F000468` | Fletcher, Lizzie | D | TX | 7 |
| `L000603` | Luttrell, Morgan | R | TX | 8 |
| `G000553` | Green, Al | D | TX | 9 |
| `M001157` | McCaul, Michael | R | TX | 10 |
| `P000048` | Pfluger, August | R | TX | 11 |
| `G000601` | Goldman, Craig | R | TX | 12 |
| `J000304` | Jackson, Ronny | R | TX | 13 |
| `W000814` | Weber, Randy | R | TX | 14 |
| `D000594` | De La Cruz, Monica | R | TX | 15 |
| `E000299` | Escobar, Veronica | D | TX | 16 |
| `S000250` | Sessions, Pete | R | TX | 17 |
| `M001245` | Menefee, Christian | D | TX | 18 |
| `A000375` | Arrington, Jodey | R | TX | 19 |
| `C001091` | Castro, Joaquin | D | TX | 20 |
| `R000614` | Roy, Chip | R | TX | 21 |
| `N000026` | Nehls, Troy | R | TX | 22 |
| `G000594` | Gonzales, Tony | R | TX | 23 |
| `V000134` | Van Duyne, Beth | R | TX | 24 |
| `W000816` | Williams, Roger | R | TX | 25 |
| `G000603` | Gill, Brandon | R | TX | 26 |
| `C001115` | Cloud, Michael | R | TX | 27 |
| `C001063` | Cuellar, Henry | D | TX | 28 |
| `G000587` | Garcia, Sylvia | D | TX | 29 |
| `C001130` | Crockett, Jasmine | D | TX | 30 |
| `C001051` | Carter, John | R | TX | 31 |
| `J000310` | Johnson, Julie | D | TX | 32 |
| `V000131` | Veasey, Marc | D | TX | 33 |
| `G000581` | Gonzalez, Vicente | D | TX | 34 |
| `C001131` | Casar, Greg | D | TX | 35 |
| `B001291` | Babin, Brian | R | TX | 36 |
| `D000399` | Doggett, Lloyd | D | TX | 37 |
| `H001095` | Hunt, Wesley | R | TX | 38 |
| `M001213` | Moore, Blake | R | UT | 1 |
| `M001228` | Maloy, Celeste | R | UT | 2 |
| `K000403` | Kennedy, Mike | R | UT | 3 |
| `O000086` | Owens, Burgess | R | UT | 4 |
| `B001318` | Balint, Becca | D | VT | At-Large |
| `W000804` | Wittman, Robert | R | VA | 1 |
| `K000399` | Kiggans, Jennifer | R | VA | 2 |
| `S000185` | Scott, Robert | D | VA | 3 |
| `M001227` | McClellan, Jennifer | D | VA | 4 |
| `M001239` | McGuire, John | R | VA | 5 |
| `C001118` | Cline, Ben | R | VA | 6 |
| `V000138` | Vindman, Eugene | D | VA | 7 |
| `B001292` | Beyer, Donald | D | VA | 8 |
| `G000568` | Griffith, H. | R | VA | 9 |
| `S001230` | Subramanyam, Suhas | D | VA | 10 |
| `W000831` | Walkinshaw, James | D | VA | 11 |
| `D000617` | DelBene, Suzan | D | WA | 1 |
| `L000560` | Larsen, Rick | D | WA | 2 |
| `G000600` | Perez, Marie | D | WA | 3 |
| `N000189` | Newhouse, Dan | R | WA | 4 |
| `B001322` | Baumgartner, Michael | R | WA | 5 |
| `HR-WA-06` | Randall, Emily | D | WA | 6 |
| `J000298` | Jayapal, Pramila | D | WA | 7 |
| `S001216` | Schrier, Kim | D | WA | 8 |
| `S000510` | Smith, Adam | D | WA | 9 |
| `S001159` | Strickland, Marilyn | D | WA | 10 |
| `M001205` | Miller, Carol | R | WV | 1 |
| `M001235` | Moore, Riley | R | WV | 2 |
| `S001213` | Steil, Bryan | R | WI | 1 |
| `P000607` | Pocan, Mark | D | WI | 2 |
| `V000135` | Van Orden, Derrick | R | WI | 3 |
| `M001160` | Moore, Gwen | D | WI | 4 |
| `F000471` | Fitzgerald, Scott | R | WI | 5 |
| `G000576` | Grothman, Glenn | R | WI | 6 |
| `T000165` | Tiffany, Thomas | R | WI | 7 |
| `W000829` | Wied, Tony | R | WI | 8 |
| `H001096` | Hageman, Harriet | R | WY | At-Large |

---

## Federal — Non-Voting Delegates & Resident Commissioner

*Source: house.gov directory*

| Seat ID | Name | Party | Territory | Role |
|---|---|---|---|---|
| `N000147` | Norton, Eleanor | D | DC | Delegate |
| `P000610` | Plaskett, Stacey | D | VI | Delegate |
| `M001219` | Moylan, James | R | GU | Delegate |
| `R000600` | Radewagen, Aumua Amata | R | AS | Delegate |
| `K000404` | King-Hinds, Kimberlyn | R | CNMI | Delegate |
| `H001103` | Hernandez, Pablo | D | PR | Resident Commissioner |

### Executive & Judicial

| ID | Name | Party | Role | `jurisdictionLevel` |
|---|---|---|---|---|
| *(register as needed)* | President of the United States | — | POTUS | `federal` |
| *(register as needed)* | Vice President | — | VPOTUS | `federal` |
| *(register as needed)* | Chief Justice | — | SCOTUS | `federal` |

> POTUS ID format: `POTUS-{LastName}` · SCOTUS ID format: `SCOTUS-{LastName}` · See `jurisdictions.md`

---

## State Officials

*(Populated as state-level coverage is activated. See ID format in `jurisdictions.md`.)*

| ID | Name | Party | State | Role | `jurisdictionLevel` |
|---|---|---|---|---|---|
| *(add rows as needed)* | | | | | `state` |

**ID format:** `{STATE_FIPS}-{ROLE}` or `{STATE_FIPS}-{CHAMBER}-{DistrictNumber}`
**Example:** `48-GOV` = Texas Governor · `48-SSEN-21` = Texas State Senate District 21

---

## County Officials

*(Populated as county-level coverage is activated.)*

| ID | Name | Party | County | Role | `jurisdictionLevel` |
|---|---|---|---|---|---|
| *(add rows as needed)* | | | | | `county` |

**ID format:** `{COUNTY_FIPS}-{ROLE}-{DistrictNumber}`
**Example:** `48453-COM-2` = Travis County Commissioner Precinct 2

---

## City / Municipal Officials

*(Populated as city-level coverage is activated.)*

| ID | Name | Party | City | Role | `jurisdictionLevel` |
|---|---|---|---|---|---|
| *(add rows as needed)* | | | | | `city` |

**ID format:** `{COUNTY_FIPS}-{CitySlug}-{ROLE}`
**Example:** `48453-austin-MAYOR` = Mayor of Austin, TX

---

## School District Officials

*(Populated as school district coverage is activated.)*

| ID | Name | District Name | NCES ID | Role | `jurisdictionLevel` |
|---|---|---|---|---|---|
| *(add rows as needed)* | | | | | `school-district` |

**ID format:** `{NCES_ID}-{ROLE}`
**Example:** `4813560-SUPT` = Austin ISD Superintendent

---

## Adding a New Representative

When the normalizer encounters a rep name not in this table, it emits an `UNKNOWN_REPRESENTATIVE` warning. To add a new rep:

1. Identify the `jurisdictionLevel` from `jurisdictions.md`.
2. Assign the correct ID format for that level (see `jurisdictions.md` ID Conventions).
3. Add a row to the appropriate table in this file.
4. For Federal reps: add to `apps/mobile/components/ui/representative-and-policy-area-filter-bottom-sheet.tsx` in the `REPRESENTATIVES` array with `isFollowing: true`.
5. For State/Local reps: *(UI filter extension for sub-federal levels is a future task)*.

**Congressional photo CDN (federal only):** `https://unitedstates.github.io/images/congress/225x275/{BioguideID}.jpg`

> **Bioguide lookup (federal):** https://bioguide.congress.gov/search/bio/{LastName}
> **FIPS lookup:** https://www.census.gov/library/reference/code-lists/ansi/ansi-codes-for-states.html
> **NCES lookup:** https://nces.ed.gov/ccd/schoolsearch/

---

## Common Name Aliases

| Name variant | Resolved ID | Chamber |
|---|---|---|
| "Thune" | `T000250` | Senate |
| "AOC", "Ocasio-Cortez" | `O000172` | House |
| "Schumer" | `S000148` | Senate |
| "Cruz" | `C001098` | Senate |
| "Warren" | `W000817` | Senate |
| "Sanders" | `S000033` | Senate |
| "Pelosi" | `P000197` | House |
| "Johnson" (Speaker) | `J000299` | House |
| "Warren" | `W000817` |
| "Sanders", "Bernie" | `S000033` |
| "Schumer" | `S000148` |
| "Cruz" | `C001098` |
| "Collins" | `C001035` |
| "Pelosi" | `P000197` |

