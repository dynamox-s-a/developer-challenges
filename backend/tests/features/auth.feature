Feature: User Authentication
  As a user of the system
  I want to be able to sign up and log in
  So that I can access protected resources

  Scenario: Successful user signup
    Given I am a new user
    When I sign up with name "New User", email "newuser@example.com" and password "password123"
    Then the signup should return status 201
    And I should receive my user id
    And my email should be "newuser@example.com"

  Scenario: Successful login with correct credentials
    Given I am a registered user with email "test@example.com" and password "testpass123"
    When I log in with email "test@example.com" and password "testpass123"
    Then the login should return status 200
    And I should receive an access token
    And the token type should be "bearer"
    And I should receive my user information

  Scenario: Failed login with wrong password
    Given I am a registered user with email "test@example.com" and password "testpass123"
    When I log in with email "test@example.com" and password "wrongpass"
    Then the login should return status 401

  Scenario: Duplicate email signup
    Given I am a registered user with email "test@example.com" and password "testpass123"
    When I sign up with name "Another User", email "test@example.com" and password "newpass123"
    Then the signup should return status 400
