//
//  LoadRankingUseCaseTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

struct LoadRankingUseCaseTests {

    @Test func returnsRepositoryRanking() async {
        let repository = PlayerRepositorySpy()
        let expectedScores = [
            PlayerScore(nickname: "Ana", score: 10),
            PlayerScore(nickname: "Bia", score: 8)
        ]
        await repository.setScores(expectedScores)
        let sut = await LoadRankingUseCase(repository: repository)

        let scores = await sut.execute()

        #expect(scores == expectedScores)
    }
}
