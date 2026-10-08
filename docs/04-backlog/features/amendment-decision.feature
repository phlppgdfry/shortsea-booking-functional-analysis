# Acceptance criteria for US-01, US-02, US-03, US-04, US-07, US-08, US-09.
# This Examples table is executable: tests/amendment-rules.test.mjs runs every row
# against site/assets/amendment-rules.mjs. Rule IDs: docs/03-analysis/business-rules.md.
# Times are minutes from receipt of the request. Illustrative parameters: cut-off 90 min,
# DG cut-off 1440 min, loading closed 30 min, late fee window 1440 min.

@decision
Feature: Decide on a sailing-change request
  So that every channel gives the same answer,
  a sailing-change request is evaluated with one set of business rules.

  Background:
    Given a booking for one unaccompanied trailer on a sailing of route "BE-UK East"
    And the requested sailing is another sailing on the same route unless stated otherwise

  Scenario Outline: <id> <title>
    Given the request arrives through <channel>
    And the unit is <unit> and dangerous goods is <dg>
    And the customer is <tier>
    And the requested sailing has <capacity> capacity and departs in <to_target> minutes
    And the current sailing departs in <to_current> minutes
    And duplicate message is <dup>, no effective change is <nochange>, same route is <same_route>, booking is <booking>, customs border is <customs>
    When the request is evaluated
    Then the outcome is <outcome> with reason <reason>
    And the flags are <flags>

    Examples:
      | id      | title                                         | channel | dup | nochange | same_route | booking   | unit        | dg  | tier        | capacity  | to_target | to_current | customs | outcome           | reason              | flags                 |
      | AC-01.1 | Before cut-off: accepted automatically        | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 300       | 2000       | no      | ACCEPTED          | BEFORE_CUTOFF       | -                     |
      | AC-01.2 | Exactly at cut-off still counts as on time    | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 90        | 2000       | no      | ACCEPTED          | BEFORE_CUTOFF       | -                     |
      | AC-01.3 | One minute after cut-off, unit not in terminal | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 89        | 2000       | no      | REJECTED          | CUTOFF_PASSED       | -                     |
      | AC-01.4 | DG exactly at the 24 h DG cut-off             | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | yes | STANDARD    | AVAILABLE | 1440      | 3000       | no      | ACCEPTED          | BEFORE_CUTOFF       | -                     |
      | AC-01.5 | Requested sailing is full                     | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | FULL      | 300       | 2000       | no      | REJECTED          | NO_CAPACITY         | -                     |
      | AC-01.6 | Other route is not an amendment               | PORTAL  | no  | no       | no         | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 300       | 2000       | no      | REJECTED          | ROUTE_CHANGE        | -                     |
      | AC-01.7 | Unit already loaded                           | PORTAL  | no  | no       | yes        | ACTIVE    | LOADED      | no  | STANDARD    | AVAILABLE | 300       | 20         | no      | REJECTED          | NOT_AMENDABLE       | -                     |
      | AC-01.8 | Cancelled booking                             | PORTAL  | no  | no       | yes        | CANCELLED | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 300       | 2000       | no      | REJECTED          | NOT_AMENDABLE       | -                     |
      | AC-02.1 | Agent gets the same answer as the portal      | AGENT   | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 89        | 2000       | no      | REJECTED          | CUTOFF_PASSED       | -                     |
      | AC-03.1 | EDI message reference already processed       | EDI     | yes | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 300       | 2000       | no      | DUPLICATE_IGNORED | DUPLICATE_MESSAGE   | -                     |
      | AC-03.2 | EDI full re-send without a real change        | EDI     | no  | yes      | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 300       | 2000       | no      | NO_CHANGE         | NO_EFFECTIVE_CHANGE | -                     |
      | AC-03.3 | EDI follows the same rules as the portal      | EDI     | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 300       | 2000       | no      | ACCEPTED          | BEFORE_CUTOFF       | -                     |
      | AC-04.1 | After cut-off, unit in terminal: approval     | AGENT   | no  | no       | yes        | ACTIVE    | GATED_IN    | no  | STANDARD    | AVAILABLE | 60        | 2000       | no      | PENDING_APPROVAL  | LATE_ACCEPTANCE     | -                     |
      | AC-04.2 | Key account gets priority, not auto-approval  | PORTAL  | no  | no       | yes        | ACTIVE    | GATED_IN    | no  | KEY_ACCOUNT | AVAILABLE | 45        | 600        | no      | PENDING_APPROVAL  | LATE_ACCEPTANCE     | LATE_FEE,PRIORITY     |
      | AC-04.3 | Exactly 30 min before departure: still late window | EDI | no  | no       | yes        | ACTIVE    | GATED_IN    | no  | STANDARD    | AVAILABLE | 30        | 2000       | no      | PENDING_APPROVAL  | LATE_ACCEPTANCE     | -                     |
      | AC-04.4 | Inside 30 min: loading closed                 | PORTAL  | no  | no       | yes        | ACTIVE    | GATED_IN    | no  | KEY_ACCOUNT | AVAILABLE | 29        | 2000       | no      | REJECTED          | LOADING_CLOSED      | -                     |
      | AC-04.5 | DG after DG cut-off is never late-accepted    | AGENT   | no  | no       | yes        | ACTIVE    | GATED_IN    | yes | KEY_ACCOUNT | AVAILABLE | 600       | 2000       | no      | REJECTED          | DG_CUTOFF_PASSED    | -                     |
      | AC-04.6 | Key account, unit not in terminal: rejected   | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | KEY_ACCOUNT | AVAILABLE | 60        | 2000       | no      | REJECTED          | CUTOFF_PASSED       | -                     |
      | AC-07.1 | Unit in terminal moved: terminal notified     | PORTAL  | no  | no       | yes        | ACTIVE    | GATED_IN    | no  | STANDARD    | AVAILABLE | 300       | 2000       | no      | ACCEPTED          | BEFORE_CUTOFF       | TERMINAL_NOTIFY       |
      | AC-08.1 | Missed sailing rolled over: late fee          | EDI     | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 400       | -120       | no      | ACCEPTED          | BEFORE_CUTOFF       | LATE_FEE              |
      | AC-08.2 | Exactly 24 h before current departure: no fee | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 2000      | 1440       | no      | ACCEPTED          | BEFORE_CUTOFF       | -                     |
      | AC-08.3 | One minute inside 24 h: late fee              | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 2000      | 1439       | no      | ACCEPTED          | BEFORE_CUTOFF       | LATE_FEE              |
      | AC-09.1 | Customs border: reference must be updated     | PORTAL  | no  | no       | yes        | ACTIVE    | NOT_ARRIVED | no  | STANDARD    | AVAILABLE | 300       | 2000       | yes     | ACCEPTED          | BEFORE_CUTOFF       | CUSTOMS_REF_UPDATE    |
