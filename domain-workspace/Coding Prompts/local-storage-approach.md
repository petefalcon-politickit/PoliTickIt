# Analysis

- local-storage-approach.md

## Goal

- To assess and decide whether a local storage approach will be the best overall approach and user exeperience.

## Problem Space

-

## Prework

- Given the

## Assumptions

- A separate analysis concluded with Politickit Application Tier storage will be Cosmos on Azure exposed by the Application Tier with REST APIs.
  - optimize partition strategy for representatives in data store may conflict with the query patterns of the mobile app's queries that are needed by a user.
- With the knowledge of the Snaps and how the data will be mined Data Acquistion Pipeline (data-acquisition-pipe.md)

## Considerations

- Consider the entire architecture approach including client (native mobile) - application tier (C# API Services) - storage approaches (Azure Cosmos and Services)
- If local store is chosen it must work on both Android and iOS platforms

## Instructions

- Analyze the Pros and Cons of local storage
- Pay special attention to how the mobile app groups it Snaps and the flexibility the user has in filtering Snaps
-

## Requirements

- Maintain our UI - Application Layer separation pattern used on the clientside

## Outcome

- Record output markdown files in the documentation folder under an appropriate subfolder
