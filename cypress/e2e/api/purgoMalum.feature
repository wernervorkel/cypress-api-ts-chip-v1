Feature: PurgoMalum API Filtering
  As a user
  I want to filter profanity from text using the PurgoMalum API
  So that I can ensure the text is clean and appropriate

  Scenario: Verify PurgoMalum API is operational with plain text
    Given I have a text "Things Happens"
    When I filter it with format "plain"
    Then the response status should be 200

  Scenario: Verify JSON schema for successful response
    Given I have a text "Things Happens"
    When I filter it with format "json"
    Then the response status should be 200
    And the result should be "Things Happens"
    And the response schema should be valid

  Scenario: Verify XML schema for error response
    Given I have a text ""
    When I filter it with format "xml"
    Then the response status should be 200
    And the result should be error with message "No Input"
    And the response schema should be valid

  Scenario Outline: Filter various text inputs across different formats
    Given I have a text "<input>"
    When I filter it with format "<format>"
    Then the response status should be 200
    And the result should be "<expected>"

    Examples:
      | input          | format            | expected       |
      | Things Happens | plain             | Things Happens |
      | Things Happens | json              | Things Happens |
      | Things Happens | xml               | Things Happens |
      | Things Happens | containsprofanity | false          |
      | ✫❋✿✽⁂          | plain             | ✫❋✿✽⁂          |
      | ✫❋✿✽⁂          | json              | ✫❋✿✽⁂          |
      | ✫❋✿✽⁂          | xml               | ✫❋✿✽⁂          |
      | ₤¥﷼€฿$         | plain             | ₤¥﷼€฿$         |
      | ₤¥﷼€฿$         | json              | ₤¥﷼€฿$         |
      | ₤¥﷼€฿$         | xml               | ₤¥﷼€฿$         |

  Scenario Outline: Filter text with custom words and fill character across formats
    Given I have a text "<input>"
    And I add extra words to filter "<words>"
    And I use a fill character "<replace>"
    When I filter it with format "<format>"
    Then the response status should be 200
    And the result should be "<expected>"

    Examples:
      | input            | format | words      | replace | expected         |
      | Who is Super Man | plain  | man, super | _       | Who is _____ ___ |
      | Who is Super Man | json   | super, man | _       | Who is _____ ___ |
      | Who is Super Man | xml    | super man  | _       | Who is _________ |

  Scenario Outline: Filter text with custom words and fill text across formats
    Given I have a text "<input>"
    And I add extra words to filter "<words>"
    And I use a fill text "<replace>"
    When I filter it with format "<format>"
    Then the response status should be 200
    And the result should be "<expected>"

    Examples:
      | input            | format | words      | replace | expected      |
      | Who is Super Man | plain  | super, man | []      | Who is []  [] |
      | Who is Super Man | json   | super, man | []      | Who is []  [] |
      | Who is Super Man | xml    | man, super | []      | Who is []  [] |

  Scenario Outline: Verify error messages with fill character across formats
    Given I have a text "<input>"
    And I add extra words to filter "<words>"
    And I use a fill character "<replace>"
    When I filter it with format "<format>"
    Then the response status should be 200
    And the result should be error with message "<expected>"

    Examples:
      | input     | format | words | replace | expected                              |
      |           | plain  |       |         | No Input                              |
      |           | json   |       |         | No Input                              |
      |           | xml    |       |         | No Input                              |
      | Super Man | plain  | Man   | _       | Invalid Characters in User Black List |
      | Super Man | json   | Man   | _       | Invalid Characters in User Black List |
      | Super Man | xml    | Man   | _       | Invalid Characters in User Black List |
      | Super Man | plain  | man   | X       | Invalid User Replacement Characters   |
      | Super Man | json   | man   | XX      | Invalid User Replacement Characters   |
      | Super Man | xml    | man   | XX      | Invalid User Replacement Characters   |

  Scenario Outline: Verify error messages with fill text across formats
    Given I have a text "<input>"
    And I add extra words to filter "<words>"
    And I use a fill character ""
    And I use a fill text "<replace>"
    When I filter it with format "<format>"
    Then the response status should be 200
    And the result should be error with message "<expected>"

    Examples:
      | input     | format | words | replace                                 | expected                                              |
      | Siper Man | plain  | Man   | this is curiously long replacement text | User Replacement Text Exceeds Limit of 20 Characters. |
      | Siper Man | json   | Man   | this is curiously long replacement text | User Replacement Text Exceeds Limit of 20 Characters. |
      | Siper Man | xml    | Man   | this is curiously long replacement text | User Replacement Text Exceeds Limit of 20 Characters. |
      | Siper Man | plain  | Man   | ✫❋✿✽                                    | Invalid User Replacement Text                         |
      | Siper Man | json   | Man   | ✫❋✿✽                                    | Invalid User Replacement Text                         |
      | Siper Man | xml    | Man   | ✫❋✿✽                                    | Invalid User Replacement Text                         |
