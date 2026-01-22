Feature: Monitoring Points Management
  As a user of the system
  I want to manage monitoring points on machines
  So that I can track specific locations

  Background:
    Given I am an authenticated user
    And I have created a machine with name "Test Machine" and type "Fan"

  Scenario: Create monitoring point
    When I create a monitoring point "Point 1" with machine_id on the machine
    Then the response status should be 201
    And the monitoring point should have name "Point 1"

  Scenario: Cannot create more than 2 monitoring points
    Given the machine has a monitoring point "Point 1" with correct payload
    And the machine has a monitoring point "Point 2" with correct payload
    When I try to create a monitoring point "Point 3" with machine_id on the machine
    Then the response status should be 400
    And the error should mention "Limite de 2 pontos"

  Scenario: List monitoring points paginated
    Given I have multiple machines with monitoring points
    When I request monitoring points with pagination
    Then the response status should be 200
    And the response should contain paginated items
