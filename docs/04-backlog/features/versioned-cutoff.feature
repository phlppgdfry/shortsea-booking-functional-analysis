@decision
Feature: CR-01 versioned cut-off and terminal freshness
  Scenario Outline: Decision stays explainable across a policy change
    Given the immutable rule version and terminal observation age at receipt
    When the request is evaluated with current safety conditions
    Then the outcome, reason and flags match the expected result

    Examples:
      | id | title | version | age | channel | dup | nochange | same_route | booking | unit | dg | tier | capacity | to_target | to_current | customs | outcome | reason | flags |
      | AC-12.1 | v1 T-75 requires approval | v1 | 0 | PORTAL | no | no | yes | ACTIVE | GATED_IN | no | STANDARD | AVAILABLE | 75 | 2000 | no | PENDING_APPROVAL | LATE_ACCEPTANCE | - |
      | AC-12.2 | v2 T-75 is on time | v2 | 0 | PORTAL | no | no | yes | ACTIVE | GATED_IN | no | STANDARD | AVAILABLE | 75 | 2000 | no | ACCEPTED | BEFORE_CUTOFF | TERMINAL_NOTIFY |
      | AC-12.3 | v2 T-60 inclusive | v2 | 0 | PORTAL | no | no | yes | ACTIVE | NOT_ARRIVED | no | STANDARD | AVAILABLE | 60 | 2000 | no | ACCEPTED | BEFORE_CUTOFF | - |
      | AC-12.4 | v2 T-59 gated-in requires approval | v2 | 0 | PORTAL | no | no | yes | ACTIVE | GATED_IN | no | STANDARD | AVAILABLE | 59 | 2000 | no | PENDING_APPROVAL | LATE_ACCEPTANCE | - |
      | AC-12.5 | v2 DG stays 24 hours | v2 | 0 | PORTAL | no | no | yes | ACTIVE | GATED_IN | yes | STANDARD | AVAILABLE | 600 | 2000 | no | REJECTED | DG_CUTOFF_PASSED | - |
      | AC-12.6 | unknown is explicit | v1 | 0 | PORTAL | no | no | yes | ACTIVE | UNKNOWN | no | STANDARD | AVAILABLE | 300 | 2000 | no | REJECTED | TERMINAL_STATUS_UNKNOWN | - |
      | AC-12.7 | stale is explicit | v2 | 6 | PORTAL | no | no | yes | ACTIVE | GATED_IN | no | STANDARD | AVAILABLE | 300 | 2000 | no | REJECTED | TERMINAL_STATUS_STALE | - |
      | AC-12.8 | exactly 5 minutes fresh enough | v2 | 5 | PORTAL | no | no | yes | ACTIVE | NOT_ARRIVED | no | STANDARD | AVAILABLE | 60 | 2000 | no | ACCEPTED | BEFORE_CUTOFF | - |
