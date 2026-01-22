Feature: Sensor Management
  As a user of the system
  I want to associate sensors with monitoring points
  So that I can monitor machine conditions

  Background:
    Given I am an authenticated user

  Scenario: Associate HF+ sensor to Pump machine
    Given I have created a machine with name "Pump Machine" and type "Pump"
    And the machine has a monitoring point "Point 1" with correct payload
    When I associate a sensor with id "SENSOR-HF-001", model "HF+" to the monitoring point
    Then the response status should be 201
    And the sensor model should be "HF+"

  Scenario: Associate TcAg sensor to Fan machine
    Given I have created a machine with name "Fan Machine" and type "Fan"
    And the machine has a monitoring point "Point 1" with correct payload
    When I associate a sensor with id "SENSOR-TCAG-001", model "TcAg" to the monitoring point
    Then the response status should be 201
    And the sensor model should be "TcAg"

  Scenario: Cannot associate TcAg sensor to Pump machine
    Given I have created a machine with name "Pump Machine" and type "Pump"
    And the machine has a monitoring point "Point 1" with correct payload
    When I try to associate a sensor with id "SENSOR-FAIL", model "TcAg" to the monitoring point
    Then the response status should be 400
    And the error should mention "Bombas nao aceitam sensores"

  Scenario: Cannot associate TcAs sensor to Pump machine
    Given I have created a machine with name "Pump Machine" and type "Pump"
    And the machine has a monitoring point "Point 1" with correct payload
    When I try to associate a sensor with id "SENSOR-FAIL-2", model "TcAs" to the monitoring point
    Then the response status should be 400
    And the error should mention "Bombas nao aceitam sensores"

  Scenario: Cannot associate sensor to point that already has one
    Given I have created a machine with name "Fan Machine" and type "Fan"
    And the machine has a monitoring point "Point 1" with correct payload
    And the monitoring point has a sensor with id "SENSOR-FIRST", model "HF+"
    When I try to associate a sensor with id "SENSOR-SECOND", model "HF+" to the monitoring point
    Then the response status should be 400
    And the error should mention "ja possui um sensor"
