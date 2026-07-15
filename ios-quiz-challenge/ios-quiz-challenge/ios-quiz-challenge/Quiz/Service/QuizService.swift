//
//  QuizService.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import dDependencies
import dNetwork

protocol QuizServiceProtocol {
    func fetchQuestion() async throws -> QuizQuestionDTO
}

final class QuizService: QuizServiceProtocol {
    
    private let networkClient: NetworkClient

    init(
        networkClient: NetworkClient
    ) {
        self.networkClient = networkClient
    }

    func fetchQuestion() async throws -> QuizQuestionDTO {
        let request = NetworkRequest(
            path: "",
            method: .get
        )

        return try await networkClient.send(
            request,
            as: QuizQuestionDTO.self
        )
    }
}
