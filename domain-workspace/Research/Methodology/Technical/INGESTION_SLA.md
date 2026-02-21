# PoliTickIt: Oracle Release Windows (SLA)

This document tracks the official release windows for verified data oracles to ensure our **Precision Pulse** jobs trigger exactly after the data is committed.

| Oracle ID    | Source Name   | Primary Release Window (ET) | Refresh Type            |
| :----------- | :------------ | :-------------------------- | :---------------------- |
| **TREAS-01** | U.S. Treasury | 4:00 PM - 4:10 PM           | Daily                   |
| **FEC-01**   | FEC           | 1:00 AM - 3:00 AM           | Nightly (Materialized)  |
| **CONG-01**  | Congress.gov  | 8:00 AM - 9:00 AM           | Daily (Legislative Day) |
| **GRN-01**   | Grants.gov    | 12:00 AM - 2:00 AM          | Daily Extract           |
| **USA-01**   | USAspending   | 3:00 AM - 5:00 AM           | Nightly Pipeline        |

## Accuracy Policy

1. **Window + Offset**: Precision pulses are scheduled at `Window Start + 15 Minutes` to allow for propagation across CDNs/Official API proxies.
2. **Heartbeat Priming**: The Heartbeat Monitor interval increases to every 5 minutes during the Release Window.
3. **Drift Warning**: If the Heartbeat Monitor fails to detect an update 60 minutes after the Release Window, a `Source.De-sync` element is added to the next Snap to inform the user of institutional lag.
