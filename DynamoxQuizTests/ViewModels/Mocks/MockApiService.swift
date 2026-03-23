//
//  ApiServiceTest.swift
//  DynamoxQuizTests
//
//  Created by Mateus on 07/03/26.
//

import XCTest
@testable import DynamoxQuiz

final class MockApiService: APIServiceDelegate {
    
    var questionMock: Question?
    var shouldThrowError = false
    
    func fetchRandomQuestion() async throws -> Question {
        if shouldThrowError { throw NSError(domain: "test", code: 0) }
        return questionMock!
    }
    
    
    func validateAnswer(questionId: String, answer: String) async throws -> Bool {
        return true
    }
    
}
