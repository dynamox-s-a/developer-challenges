//
//  MockQuizRepository.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Foundation
@testable import dynamoxQuizChallenge

final class MockQuizRepository: QuizRepositoryProtocol {
    enum Mode {
        case successSequence(questions: [QuizDTO], results: [Bool])
        case failOnFetch(Error)
        case failOnSubmit(Error)
    }

    var mode: Mode
    
    private var fetchIndex = 0
    private var submitIndex = 0
    
    init(mode: Mode) {
        self.mode = mode
    }

    func fetchQuiz() async throws -> dynamoxQuizChallenge.QuizDTO {
        switch mode {
        case .successSequence(let questions, _):
            guard fetchIndex < questions.count else {
                return questions.last!
            }
            let question = questions[fetchIndex]
            fetchIndex += 1
            return question
        case .failOnFetch(let err):
            throw err
        case .failOnSubmit:
            fatalError("Use .successSequence(...) quando precisar de perguntas no modo failOnSubmit")
        }
    }
    
    func submitAnswer(_ questionId: String, answer: String) async throws -> dynamoxQuizChallenge.AnswerResponseDTO {
        switch mode {
        case .successSequence(_, let results):
            guard !results.isEmpty else {
                return .init(result: false)
            }
            
            let index = min(submitIndex, results.count - 1)
            let response = results[index]
            submitIndex += 1
            return .init(result: response)
        case .failOnFetch(_):
            return .init(result: false)
        case .failOnSubmit(let error):
            throw error
        }
    }
    
    
}
