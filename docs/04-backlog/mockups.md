# Mock-ups

> **What this is:** low-fidelity mock-ups of the two screens that change most: the sailing-change panel (portal and agent screen share it) and the terminal approval queue. They exist to make the stories concrete in refinement, not to fix the visual design. **Previous:** [user stories](user-stories.md).

View them on the case site: **[mock-ups](https://phlppgdfry.github.io/shortsea-booking-functional-analysis/mockups/)**.

| Screen | Stories | What to notice |
|---|---|---|
| Sailing-change panel (portal / agent) | US-01, US-02, US-06, US-09 | only same-route sailings; full sailings visible but not selectable with the next free one highlighted; the outcome is shown as information, not as an error; agent view has the script line and **no override** |
| Terminal approval queue | US-05 | sorted key accounts first, then by deadline; deadline countdown; approve / decline with mandatory reason; held space shown |

Built as wireframes in HTML so they live next to the stories and can be reviewed in a pull request. For a real team I would draw them in Figma and link the frames from the stories.

---

Previous: [← User stories](user-stories.md) · [Documentation map](../00-documentation-map.md)

## CR-01 Figma flow

[Request → terminal approval → applied decision → history](https://www.figma.com/design/W6hussB5UmQf2wwWEkeJnI?node-id=3-139), imported as editable SVG vectors into the existing design file on a separate Shortsea Booking page, 2026-10-17. [Source](../../site/assets/design/booking-flow.svg). The live checker/delivery lab demonstrates behaviour; the Figma handover is a static four-screen flow, not a wired prototype.
