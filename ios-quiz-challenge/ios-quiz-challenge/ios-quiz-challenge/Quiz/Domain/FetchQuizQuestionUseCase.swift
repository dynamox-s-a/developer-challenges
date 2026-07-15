//
//  FetchQuizQuestionUseCaseProtocol.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

protocol FetchQuizQuestionUseCaseProtocol {
    func execute() async throws -> QuizQuestion
}

final class FetchQuizQuestionUseCase: FetchQuizQuestionUseCaseProtocol {

    private let service: QuizServiceProtocol
    private let questionNumber: Int

    init(
        service: QuizServiceProtocol,
        questionNumber: Int
    ) {
        self.service = service
        self.questionNumber = questionNumber
    }

    func execute() async throws -> QuizQuestion {
        let dto = try await service.fetchQuestion()

        return QuizQuestion(
            id: dto.id,
            number: questionNumber,
            title: dto.statement,
            imageName: nil,
            options: dto.options.map { option in
                QuizOption(title: option)
            }
        )
    }
}
