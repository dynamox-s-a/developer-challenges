//
//  AnswerQuizQuestionUseCase.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

protocol AnswerQuizQuestionUseCaseProtocol {
    func execute(questionID: String, answer: String) async throws -> Bool
}

final class AnswerQuizQuestionUseCase: AnswerQuizQuestionUseCaseProtocol {

    private let service: QuizServiceProtocol

    init(
        service: QuizServiceProtocol
    ) {
        self.service = service
    }

    func execute(questionID: String, answer: String) async throws -> Bool {
        let response = try await service.answerQuestion(
            questionID: questionID,
            answer: answer
        )

        return response.result
    }
}
