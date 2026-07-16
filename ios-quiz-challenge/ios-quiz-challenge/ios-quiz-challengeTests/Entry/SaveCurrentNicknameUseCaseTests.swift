//
//  SaveCurrentNicknameUseCaseTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

struct SaveCurrentNicknameUseCaseTests {

    @Test func trimsAndPersistsNickname() async throws {
        let repository = PlayerRepositorySpy()
        let sut = await SaveCurrentNicknameUseCase(repository: repository)

        let nickname = try await sut.execute(nickname: "  kiyo  ")

        #expect(nickname == "kiyo")
        #expect(await repository.currentNickname() == "kiyo")
        #expect(await repository.savedNicknames() == ["kiyo"])
    }

    @Test func throwsWhenNicknameIsEmptyAfterTrimming() async {
        let repository = PlayerRepositorySpy()
        let sut = await SaveCurrentNicknameUseCase(repository: repository)

        do {
            _ = try await sut.execute(nickname: "   ")
            #expect(Bool(false))
        } catch NicknameValidationError.empty {
            #expect(await repository.savedNicknames().isEmpty)
        } catch {
            #expect(Bool(false))
        }
    }
}
