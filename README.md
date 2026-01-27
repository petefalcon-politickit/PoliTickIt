# PoliTickIt Mobile

A high-fidelity political transparency platform built with React Native and Expo.

## Overview

PoliTickIt uses a metadata-driven **Vertical Block Architecture** to deliver "PoliSnaps"—bite-sized, actionable insights into legislative activity, campaign finance, and representative accountability.

### Key Features

- **PoliSnap Feed**: A dynamic list of political insights (Accountability, Knowledge, Representative, Economics).
- **Signal Ripple™ Engagement**: Advanced interactive constituent feedback loop using the **Quantum Feedback** methodology.
- **Service-Oriented Architecture**: Powered by Awilix for robust dependency injection and modularity.
- **Dynamic Correlation Engine**: Real-time cross-referencing of FEC data with legislative voting records.
- **Unified Design System**: Consistent typography (14px base / 22px line-height), monochromatic branding, and accessibility using a token-based theme.

## Architecture

Detailed documentation can be found in the `/documentation` directory:

- [Architecture Overview](documentation/ARCHITECTURE.md)
- [PoliSnap Registry](documentation/POLISNAP_REGISTRY.md)
- [Pro Roadmap & Backlog](documentation/PRO_BACKLOG.md)

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Design Tokens

We follow a strict set of typography and spacing tokens defined in `constants/theme.ts`.

- **XS**: 10px (Metadata/Captions)
- **SM**: 12px (Small body/Labels)
- **Base**: 14px (Standard text)
- **MD**: 16px (Medium emphasis)

---

Developed for the Citizen Accountability Initiative.
