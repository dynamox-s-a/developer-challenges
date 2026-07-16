//
//  SaveQuizResultUseCase.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

protocol SaveQuizResultUseCaseProtocol {
    func execute(
        nickname: String,
        score: Int
    ) async throws
}

final class SaveQuizResultUseCase: SaveQuizResultUseCaseProtocol {
    private let repository: PlayerRepository

    init(repository: PlayerRepository) {
        self.repository = repository
    }

    func execute(
        nickname: String,
        score: Int
    ) async throws {
        try await repository.save(
            score: score,
            for: nickname
        )
    }
}
