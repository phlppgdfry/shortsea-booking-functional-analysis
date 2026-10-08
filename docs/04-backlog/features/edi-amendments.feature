# Acceptance criteria for US-03 (EDI responses).
# The decision for EDI requests is tested in amendment-decision.feature (AC-03.1 … AC-03.3).
# Message names are simplified, IFTMIN-like / IFTMBC-like / APERAK-like. See docs/06-interfaces/edi-amendment.md.

@manual
Feature: EDI amendment responses

  Scenario: AC-03.4 Accepted amendment is confirmed
    Given an EDI amendment for booking B-2002 is accepted
    Then a booking confirmation is sent with the booking number, the new sailing and the customer's message reference
    And the confirmation is sent within 5 minutes of gateway receipt

  Scenario: AC-03.5 Pending amendment gets an interim status, then a final answer
    Given an EDI amendment for booking B-2002 is pending approval with expiry 21:30
    Then an interim status "pending terminal approval" with expiry 21:30 is sent
    And when the request is approved, a booking confirmation follows
    And when it is declined or expires, a rejection with the reason code follows

  Scenario: AC-03.6 Rejection carries a reason code the customer system can use
    Given an EDI amendment is rejected
    Then the rejection contains the customer's message reference and one reason code from:
      | ROUTE_CHANGE | NOT_AMENDABLE | LOADING_CLOSED | NO_CAPACITY | DG_CUTOFF_PASSED | CUTOFF_PASSED | APPROVAL_EXPIRED | DECLINED_BY_TERMINAL |
