# Acceptance criteria for US-02, US-05, US-06, US-07 and US-10.
# Tagged @manual: these describe behaviour over time and between screens.
# Testers turn them into test cases; the decision itself is tested in amendment-decision.feature.

@manual
Feature: Late acceptance, notifications and history

  Background:
    Given route "BE-UK East" has a sailing departing at 22:00
    And loading closes at 21:30
    And booking B-1001 is for a gated-in trailer currently on the 18:00 sailing

  Scenario: AC-02.2 An agent cannot override a rejection
    Given a booking agent submits a change that is rejected with reason CUTOFF_PASSED
    Then the agent sees the reason and the script line for the customer
    And there is no option to force the change

  Scenario: AC-05.1 Pending request appears in the approval queue
    Given at 21:00 a change of B-1001 to the 22:00 sailing is pending approval
    When the terminal ops planner opens the approval queue
    Then the request is shown with booking, unit, requested sailing, requester, channel and deadline 21:30
    And space for the trailer is held on the 22:00 sailing

  Scenario: AC-05.2 Key accounts are on top, then by deadline
    Given three pending requests: standard with deadline 21:30, key account with deadline 23:30, standard with deadline 21:10
    When the planner opens the approval queue
    Then the order is: key account (23:30), standard (21:10), standard (21:30)

  Scenario: AC-05.3 Planner approves
    Given the change of B-1001 to the 22:00 sailing is pending
    When the planner approves it at 21:05
    Then the booking is on the 22:00 sailing
    And the terminal is notified that the unit moved
    And the requester is informed in their channel

  Scenario: AC-05.4 Planner declines with a reason
    Given the change of B-1001 to the 22:00 sailing is pending
    When the planner declines it with reason "yard: unit blocked behind loaded stack"
    Then the amendment is rejected with that reason
    And the held space on the 22:00 sailing is released
    And the requester is informed

  Scenario: AC-05.5 Nobody decides before loading closes
    Given the change of B-1001 to the 22:00 sailing is pending
    When it is 21:30 and nobody has decided
    Then the amendment is rejected with reason APPROVAL_EXPIRED
    And it disappears from the approval queue
    And the requester is informed that it expired

  Scenario: AC-05.6 A newer request supersedes the pending one
    Given the change of B-1001 to the 22:00 sailing is pending
    When the customer requests the 23:59 sailing for B-1001
    Then the pending request is superseded and removed from the queue
    And the new request is evaluated on its own

  Scenario: AC-06.1 Customer sees pending status and expiry
    Given the customer requested a change in the portal that is pending approval
    Then the portal shows "The terminal is checking your request" and the time it will expire

  Scenario: AC-06.2 Customer is told the final outcome
    Given a pending request is approved, declined or expired
    Then the customer receives the outcome in the channel they used

  Scenario: AC-07.2 Terminal notification fails
    Given an amendment moved gated-in trailer B-1001 to the 22:00 sailing
    And the terminal system does not confirm the notification
    When three attempts have failed
    Then Application Support receives an alert with booking B-1001 and the unit number
    And the amendment stays applied

  Scenario: AC-10.1 History shows every request
    Given booking B-1001 had a portal change accepted, an EDI duplicate ignored and an agent change declined
    When the agent opens the history of B-1001
    Then they see the accepted and the declined amendment with requester, channel, received time, outcome and reason
    And the ignored duplicate is visible in the message log, not as an amendment
