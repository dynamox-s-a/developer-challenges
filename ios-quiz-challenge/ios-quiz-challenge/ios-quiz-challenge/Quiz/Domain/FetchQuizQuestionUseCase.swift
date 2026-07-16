//
//  FetchQuizQuestionUseCaseProtocol.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

protocol FetchQuizQuestionUseCaseProtocol {
    func execute(questionNumber: Int) async throws -> QuizQuestion
}

final class FetchQuizQuestionUseCase: FetchQuizQuestionUseCaseProtocol {

    private let service: QuizServiceProtocol

    init(service: QuizServiceProtocol) {
        self.service = service
    }

    func execute(questionNumber: Int) async throws -> QuizQuestion {
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
