# Glossary

> **What this is:** the shared language of this case. In the event storming, every disagreement about a word ended up here. **For:** developers, testers and support who are new to RoRo.

| Term | Meaning in this case |
|---|---|
| **Amendment** | A request to change an existing booking. In release 1: moving the unit to another sailing on the same route. |
| **Applied** | The booking change is committed and notifications are durably queued. Delivery status is tracked separately. |
| **Booking** | One customer's reservation of space for one unit on one sailing. |
| **Cut-off** | The last moment a request for a sailing is on time. Standard: 90 min before departure; dangerous goods: 24 h *(illustrative)*. A request exactly at cut-off is on time. |
| **DG / dangerous goods** | Cargo classified under the IMDG Code. Needs a declaration before the DG cut-off. |
| **EDI** | Electronic data interchange: structured messages between the customer's system and ours. Here in a simplified IFTMIN-like (booking) and IFTMBC-like (confirmation) form. |
| **Gated in** | The unit has passed the terminal gate and is in the yard. |
| **Key account** | A customer with a commercial agreement. Gets **priority** in the approval queue, never automatic approval. |
| **Late acceptance** | An amendment after cut-off for a unit already in the terminal, decided by terminal operations. |
| **Loading closed** | At exactly T-30 and throughout the final 30 min before departure *(illustrative)*: no amendments at all. |
| **Route** | A fixed origin–destination pair, e.g. "BE-UK East". |
| **Sailing** | One departure of one vessel on one route at one time. |
| **Unaccompanied trailer** | A trailer shipped without a driver or tractor; hauliers drop it at the origin terminal and collect it at the destination. |
| **Customs reference** | A pre-notification reference that the customer or haulier registers for a specific crossing (for example the UK's goods movement reference). Changing the sailing can invalidate it. |

---

[Documentation map](../00-documentation-map.md)
