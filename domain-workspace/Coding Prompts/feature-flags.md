# Feature Flags

- Let's finetune the Feature Flag offering.

## Goal

- To release features dark on the mobile app via the serverside backend switch.

## Requirements

- Serverside configuration is checked and if exist uses it, otherwise the mobile app falls back to the client side defaults
- All missing features in the mobile app need to be failsafe.
- Need to tie configuration to mobile app versions or version tags to support beta cohorts or release canaries.
- Should check serverside configuration on app start or activation in the background
- Need to document the serverside contract that will be needed to server the mobile app.

## Contraints

- Must support a mock service implementation to get the feature flags for the UI until we develop the Application Tier.

## Outcomes

-
