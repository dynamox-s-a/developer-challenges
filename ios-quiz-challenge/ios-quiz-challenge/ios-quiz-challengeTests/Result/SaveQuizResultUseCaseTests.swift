//
//  SaveQuizResultUseCaseTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

struct SaveQuizResultUseCaseTests {

    @Test func savesScoreForNickname() async throws {
        let repository = PlayerRepositorySpy()
        let sut = await SaveQuizResultUseCase(repository: repository)

        try await sut.execute(
            nickname: "kiyo",
            score: 9
        )

        let saves = await repository.savedScores()
        #expect(saves.count == 1)
        #expect(saves.first?.nickname == "kiyo")
        #expect(saves.first?.score == 9)
    }

    @Test func propagatesRepositoryError() async {
        let repository = PlayerRepositorySpy()
        await repository.setSaveError(TestError.expected)
        let sut = await SaveQuizResultUseCase(repository: repository)

        do {
            try await sut.execute(
                nickname: "kiyo",
                score: 9
            )
            #expect(Bool(false))
        } catch TestError.expected {
            #expect(true)
        } catch {
            #expect(Bool(false))
        }
    }
}
