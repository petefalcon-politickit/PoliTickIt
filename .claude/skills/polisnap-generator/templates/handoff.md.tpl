# PoliSnap Generation Specification

**Document ID:** `SPEC-PSG-{{docId}}`
**Date:** `{{creationDate}}`
**Author:** `Vanguard-OS Skill: polisnap-generator`
**Status:** `Ready for Execution`

---

## 1. Objective

This document specifies the requirements for generating a new `PoliSnap` and its associated `PoliElement` components within the PoliTickIt mobile application codebase.

---

## 2. Execution Mandate

You are mandated to use the `polisnap-generator` skill to perform this task. This skill is designed to automate the creation of `PoliSnap` and `PoliElement` components in a manner consistent with the project's architecture.

---

## 3. Input for `polisnap-generator` Skill

Use the following business intent as the primary input prompt for the skill:

```prompt
{{prompt}}
```

---

## 4. Architectural & Execution Context

To successfully execute this task, you must be aware of the following architectural patterns in the target codebase (`c:/Projects/Alithix/Products/PoliTickIt/`):

-   **Component Factory:** UI components (`PoliElement`s) are dynamically rendered via a `ComponentFactory`.
-   **Component Registration:** Every new `PoliElement` must be registered with the factory. This is achieved by adding an `import` statement for the new component file into the central registration file: `apps/mobile/components/polisnap-elements/index.ts`.
-   **Metadata-Driven UI:** `PoliSnap`s are defined as JSON objects. The UI is rendered based on the `elements` array within these objects.
-   **Mock Data:** For development and testing, all mock `PoliSnap` data is stored in `apps/mobile/constants/snapLibrary.ts`. New mock data must be added here to be visible in the app.
-   **Styling:** All styling must use the shared theme constants located at `apps/mobile/constants/theme.ts`. **Do not use hardcoded style values.**

---

## 5. Approval Gate

The `polisnap-generator` skill is configured to present a detailed execution summary before writing any files. This summary will include:
- A list of new files to be created.
- A list of existing files to be modified.
- A preview of the mock `PoliSnap` JSON data.

**You must receive explicit user approval after presenting this summary before proceeding with the file generation and modification steps.**

---

## 6. Definition of Done (Acceptance Criteria)

The task is considered complete when all the following criteria are met:

1.  **New `PoliElement` component files have been created** in the appropriate subdirectories under `apps/mobile/components/polisnap-elements/`.
2.  The central registration file, `apps/mobile/components/polisnap-elements/index.ts`, has been **modified to include `import` statements** for the new components.
3.  The mock data library, `apps/mobile/constants/snapLibrary.ts`, has been **modified to include a new `PoliSnap` JSON object** that utilizes the new elements.
4.  All generated code is free of linting errors and adheres to the project's styling and architectural conventions.
5.  The final generated `PoliSnap` is successfully rendered in the mobile application.
