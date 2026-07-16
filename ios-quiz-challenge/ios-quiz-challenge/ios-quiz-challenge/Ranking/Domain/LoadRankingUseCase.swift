//
//  LoadRankingUseCase.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

protocol LoadRankingUseCaseProtocol {
    func execute() async -> [PlayerScore]
}

final class LoadRankingUseCase: LoadRankingUseCaseProtocol {
    private let repository: PlayerRepository

    init(repository: PlayerRepository) {
        self.repository = repository
    }

    func execute() async -> [PlayerScore] {
        await repository.ranking()
    }
}
