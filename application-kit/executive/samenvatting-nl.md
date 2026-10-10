# Late booking amendments — samenvatting

> Onafhankelijke portfoliocase over een fictieve organisatie. Bevat geen vertrouwelijke informatie van een bestaande werkgever. Alle cijfers zijn illustratieve aannames. [English version](one-page-summary.md)

## De uitdaging

Een RoRo-shortsea-rederij laat klanten trailers omboeken naar een andere afvaart via vier kanalen: portaal, EDI, e-mail en telefoon. Elk kanaal hanteert andere regels. Gevolg: trailers op de verkeerde afvaart, een derde van de omboekingen via de telefoon, en geen historiek bij discussies over toeslagen.

## Mijn aanpak

1. **Interviews** per stakeholdergroep (booking desk, terminal operations, commercial, finance, EDI-klanten), met aandacht voor tegenstrijdigheden.
2. **Event storming** om die tegenstrijdigheden zichtbaar te maken als hotspots, met per hotspot opties en een eigenaar die beslist.
3. **Eén set business rules** (18 regels, één beslistabel) voor alle kanalen.
4. **User stories** met acceptatiecriteria in Given/When/Then; 27 voorbeelden draaien als test in CI.
5. **Modellen en interfaces:** procesflow, statusmodel, logisch datamodel, EDI- en portaalinterface.
6. **Refinement en validatie** met developers en testers; UAT met echte rollen.
7. **Overdracht aan support:** functionele release note en KB-artikel voor de eerste lijn.

## Wat dit toont

Dat ik een operationeel probleem kan ontleden tot regels die developers kunnen bouwen, testers kunnen testen en support kan uitleggen, en dat ik beslissingen bij de juiste eigenaar leg.

**Live:** https://phlppgdfry.github.io/shortsea-booking-functional-analysis/

## Correcties en beperkingen

Op precies T-30 zijn aanvragen en approvals gesloten. Ontvangsttijd bepaalt tijdigheid; actuele tijd/status/capaciteit bepalen uitvoering. Applied en notificatie-aflevering zijn aparte statussen. 43 automatische checks slagen lokaal; echte interviews, UAT en productie-uitrol zijn niet uitgevoerd. [PDF case study](../exports/case-study.pdf).
