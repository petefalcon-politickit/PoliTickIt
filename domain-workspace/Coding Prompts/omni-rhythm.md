# **AI Command**

## 🤖 Meta Tasks

- **Standard SOP**: Execute all boilerplate tasks defined in [Global Guardrails](../documentation/AI%20Commands/global-command-guardrails.md).

## 🎯 Outcome

- **Name**: **Forensic Rhythm Auditor**
- **Scope**: **PoliTickIt Mobile** UI Molecules and Rendering Gutters.
- **Triggers**: `OMNI-RHYTHM`

### Goal

- To enforce the 4px mechanical vertical rhythm and forensic font density across the entire layout engine.

### Command Tasks

- **Gutter Audit**: Scrutinize `polisnap-renderer.tsx` and all elements for 15px-to-4px rhythm intercepts.
- **Hook Isolation Check**: Ensure all complex molecules are rendered as JSX components to prevent `useMemoCache` instability.
- **Contrast Polish**: Verify all serial numbers and forensic anchors use the `Slate 500` high-contrast standard.

### Requirements

- All vertical adjustments must be calibrated via the `PoliSnapRenderer` rhythm override logic (`-11px` margin offset).
- No molecule may use inline padding that breaks the "Mechanical Grid."
- [Reference Global Standards for Naming, Formatting, and Safety]

### Background

- [Standard baseline: Always read the latest SESSION_LOG.md]

### Terms

- **Rhythm Intercept**: A logic block that compensates for container gutters to force a target spacing.
- **Mechanical Grid**: The 4px vertical increment standard used for institutional trust elements.
