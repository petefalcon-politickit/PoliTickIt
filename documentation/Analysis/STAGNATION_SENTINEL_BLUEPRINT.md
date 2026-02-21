# **Omni-OS Blueprint: Stagnation Sentinel (SNP-004)**

- **Context**: /documentation/Analysis/Blueprints/
- **Subject**: Legislative Friction Implementation
- **Standard**: Omni Analysis Standard (Meta-Engine v1.1.0)
- **Status**: BLUEPRINT
- **Mission Reference**: EVO-012

---

## 📄 Component Logic: The Friction Coefficient ($\mu_f$)

The **Stagnation Sentinel** provides forensic visibility into why legislation stops moving. It calculates the **Friction Coefficient** using the pattern:

$$\mu_f = \frac{T_{last} - T_{intro}}{T_{session}} \times W_{committee}$$

_Where:_

- $T_{last}$: Date of last recorded action.
- $T_{intro}$: Date of bill introduction.
- $W_{committee}$: Weighted factor based on committee historical velocity.

---

## 🧬 UI Manifestation (Molecule)

The metadata defined in `stagnation-sentinel.schema.json` maps to the **Universal.Gauge** molecule (Polymorphic Registry).

- **Primary Visual**: A horizontal gradient bar (Green $\rightarrow$ Red) in `Linear` mode.
- **Secondary Visual**: "Days Since Movement" ticker.
- **Forensic Anchor**: Deep-link to the official Congress.gov action log.

---

## 🛠️ Extraction Tasks (Next Actions)

1. [ ] **Provider Logic**: Extend `CongressionalActivityProvider.cs` to fetch `/actions` for tracked bills.
2. [ ] **Normalization**: Add the `FrictionCalculator` to the `UniversalIngestionEngine`.
3. [ ] **UX Rendering**: Implement `Linear` mode in `UniversalGauge.tsx` to support the sentinel logic.

_SGV Grade A Established. Ready for Mission Embarkation._
