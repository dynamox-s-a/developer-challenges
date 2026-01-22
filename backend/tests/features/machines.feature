Feature: Machine Management
  As a user of the system
  I want to manage industrial machines
  So that I can track assets

  Background:
    Given I am an authenticated user

  Scenario: Create a new machine
    When I create a machine with name "Test Machine" and type "Pump"
    Then the response status should be 201
    And the machine should have name "Test Machine"
    And the machine should have type "Pump"

  Scenario: List all machines
    Given I have created a machine with name "Machine 1" and type "Pump"
    And I have created a machine with name "Machine 2" and type "Fan"
    When I request the list of machines
    Then the response status should be 200
    And I should see at least 2 machines

  Scenario: Get specific machine
    Given I have created a machine with name "My Machine" and type "Fan"
    When I request the machine by its id
    Then the response status should be 200
    And the machine should have name "My Machine"

  Scenario: Update machine name
    Given I have created a machine with name "Old Name" and type "Pump"
    When I update the machine name to "New Name"
    Then the response status should be 200
    And the machine should have name "New Name"

  Scenario: Delete machine
    Given I have created a machine with name "To Delete" and type "Pump"
    When I delete the machine
    Then the response status should be 200
    And the response should contain a success message
