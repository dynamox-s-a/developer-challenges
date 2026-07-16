//
//  LoadCurrentNicknameUseCaseTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

struct LoadCurrentNicknameUseCaseTests {

    @Test func returnsPersistedNickname() async {
        let repository = PlayerRepositorySpy()
        await repository.setCurrentNickname("Kiyo")
        let sut = await LoadCurrentNicknameUseCase(repository: repository)

        let nickname = await sut.execute()

        #expect(nickname == "Kiyo")
    }
}
