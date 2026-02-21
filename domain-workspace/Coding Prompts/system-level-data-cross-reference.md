# System Level Data

- Need a set of oracles for system level data like representatives, policy areas (interests), committees, and many more.
- It extremely important that PoliTickIt manages the cross-referencing of the entity across all other transactional oracles data like bills.

## Problem Space

- PoliTickIt will be sourcing many disparate system each using different entity identifiers. PoliTickIt must to able to connect a representative from a bill in congress.gov with a representative in a FEC filing.
- PoliTickIt needs a flexible cross-reference strategy that all data ingestion processor can use to nomalize data.

## Instrcuctions

- Identify current connections based on our know Oracles and devise a strategy

## Requirements

- Must be responsive as it will be use by many attributes of many ingestions.

## Normalization

- Is hyper important to normize all system data identifiers across many Oracles. Transactional data many require cross-reference as well.

## Outcome

- Whitepaper on approach, in documentation hub
- Throgough, extensibiltiy that addresses today's known cross references and can support tomorrow's discovered ones.
