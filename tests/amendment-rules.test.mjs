// Runs every Examples row of the @decision feature files against the rule module.
// The acceptance criteria are the test data: if a business rule changes, the analyst updates
// the .feature file and this test shows exactly which examples changed meaning.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "../site/assets/amendment-rules.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const featureDir = join(root, "docs/04-backlog/features");

function examplesFrom(text) {
  const rows = text.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  const cells = (l) => l.slice(1, -1).split("|").map((c) => c.trim());
  const [header, ...data] = rows.map(cells);
  return data.map((row) => Object.fromEntries(header.map((h, i) => [h, row[i]])));
}

const yes = (v) => v === "yes";
const toRequest = (e) => ({
  channel: e.channel,
  duplicateMessage: yes(e.dup),
  noEffectiveChange: yes(e.nochange),
  sameRoute: yes(e.same_route),
  bookingStatus: e.booking,
  unitStatus: e.unit,
  dangerousGoods: yes(e.dg),
  customerTier: e.tier,
  targetCapacity: e.capacity,
  minutesToTargetDeparture: Number(e.to_target),
  minutesToCurrentDeparture: Number(e.to_current),
  processingDelayMinutes: Number(e.delay ?? 0),
  crossesCustomsBorder: yes(e.customs),
});

const features = readdirSync(featureDir).filter((f) => f.endsWith(".feature"));
const decisionFeatures = features.filter((f) => readFileSync(join(featureDir, f), "utf8").includes("@decision"));

test("at least one executable feature file exists", () => {
  assert.ok(decisionFeatures.length > 0);
});

for (const file of decisionFeatures) {
  for (const e of examplesFrom(readFileSync(join(featureDir, file), "utf8"))) {
    test(`${e.id} ${e.title}`, () => {
      const result = evaluate(toRequest(e));
      assert.equal(result.outcome, e.outcome);
      assert.equal(result.reason, e.reason);
      const expectedFlags = e.flags === "-" ? [] : e.flags.split(",").sort();
      assert.deepEqual(result.flags, expectedFlags);
    });
  }
}

test("the channel never changes the outcome (BR-17)", () => {
  const base = toRequest({
    channel: "PORTAL", dup: "no", nochange: "no", same_route: "yes", booking: "ACTIVE", unit: "GATED_IN",
    dg: "no", tier: "STANDARD", capacity: "AVAILABLE", to_target: "60", to_current: "500", customs: "yes",
  });
  const results = ["PORTAL", "EDI", "AGENT"].map((channel) => evaluate({ ...base, channel }));
  for (const r of results) assert.deepEqual(r, results[0]);
});
