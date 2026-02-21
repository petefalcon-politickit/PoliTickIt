# Analysis

- data-acquisition-pipe.md

## Goal

- To deliver a full architectural approach to the data acquisition pipeline based on the data-acquisition-pipe.png.

## Problem Space

- Given the vast amount and diversity of the Snaps that can be created, PoliTickIt needs a robust data acquisition process that goes from unstructured data to metadata driven PoliSnaps.
  - The metadata driven Snaps completely decouple the UI from the process and data visualized.
    - This is important for highly structured automation of Snap acquistion coupled with the ability to introduce endless Snaps without a clientside release

## Assumptions

- A separate analysis concluded with Politickit Application Tier storage will be Cosmos on Azure exposed by the Application Tier with REST APIs.
  - The optimize partition strategy for representatives in data store may conflict with the query patterns needed by a user when navigating the app

## Considerations

- Consider the entire architecture approach including client (native mobile) - application tier (C# API Services) - storage approaches (Azure Cosmos and Services)
- This analysis can be a discussion where you pose questions that I may answer before completing the task.
- Produce diagramming in the documentation if valuable

## Instructions

- Analyze the politickit data process flow.png image and extract the architecture approach described.
- Considate, refine, and expand the details and/or approach as appropriate

## Requirements

- If local store is chosen it must work on both Android and iOS platforms
- Maintain the Presentation to Data Services separation pattern used on the clientside
- With the Snap UI Isolation Principle via Metadata
  - Propose strategies to document and share the interfaces that couple the steps in the process
  - Propose strategies on how to context for AI to bridge the gaps when generating code in each tier

## Outcome

- Place markdown files in the documentation folder under an appropriate subfolder
