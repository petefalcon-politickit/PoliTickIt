# Initiative Analysis

## Analyze

- API needs
- UI/UX needs
- Local Storage needs

### Problem/Challenge Statement.

- PolitickIt current support add a Snap to a watchlist. This work ok for some types of snaps (.e.g., A introduction of a bill that will go through stages). However, there are a few problems with this.

* When a user watches a snap like a bill the real intent to have easy access to not only the bill and it status but for other ancillary activities or Snaps. For example, a user may want to have a list of amendments, public statements, bill status updates.
* This problem is more generalized. For example, if a cabinet seat becomes available the user is interested in "wathcing" the open seat not just adding a committee hearing to the list.

### Strategy Developement

- We need a more robust Watchlist section that accomodates more then a list of bookmarks.

* When processing Snaps metadata for correlation must be extracted
* We may have a tree of related items and not just a Trust thread.

- Outline one or potential solutions

### Scope of Impact

- The Snap generation workflow as Snaps will need more meta data to tie related Snaps together
- How the Watchlist section in the App can handle a more robust presentation to make the UX support complex relations (e.g., grouping, drilldown, filtering, etc.)

### Requirements

- When wiring correlated Snaps this must be done in a deterministic manner using code and not inferred in the Snaps generation workflow.
- Manadatory that this is scalable and repeatable.

## Considerations

- There may be two distinct features here.

* The ability to save a Snap to bring up during a family debate, and another to watch the procees of a new cabinet seat or bill transitions.

## Outcome

- Place the analysis and what is needed to implement this project in politickit/documentation/analysis
