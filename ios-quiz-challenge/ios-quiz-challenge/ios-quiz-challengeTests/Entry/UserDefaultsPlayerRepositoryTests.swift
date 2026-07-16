//
//  UserDefaultsPlayerRepositoryTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation
import Testing
@testable import ios_quiz_challenge

struct UserDefaultsPlayerRepositoryTests {

    @Test func storesAndLoadsCurrentNickname() async {
        let userDefaults = makeUserDefaults()
        let sut = await UserDefaultsPlayerRepository(userDefaults: userDefaults)

        await sut.setCurrentNickname("maria")

        #expect(await sut.currentNickname() == "maria")
    }

    @Test func rankingIsSortedByScoreDescendingAndNicknameAscending() async throws {
        let userDefaults = makeUserDefaults()
        let sut = await UserDefaultsPlayerRepository(userDefaults: userDefaults)

        try await sut.save(score: 8, for: "Bruno")
        try await sut.save(score: 10, for: "Ana")
        try await sut.save(score: 10, for: "Carlos")

        let ranking = await sut.ranking()

        #expect(ranking.map(\.nickname) == ["Ana", "Carlos", "Bruno"])
        #expect(ranking.map(\.score) == [10, 10, 8])
    }

    @Test func keepsBestScoreForSameNicknameIgnoringCase() async throws {
        let userDefaults = makeUserDefaults()
        let sut = await UserDefaultsPlayerRepository(userDefaults: userDefaults)

        try await sut.save(score: 4, for: "Ana")
        try await sut.save(score: 7, for: "ana")
        try await sut.save(score: 5, for: "ANA")

        let ranking = await sut.ranking()

        #expect(ranking.count == 1)
        #expect(ranking.first?.nickname == "ANA")
        #expect(ranking.first?.score == 7)
    }
}

private func makeUserDefaults() -> UserDefaults {
    let suiteName = "ios-quiz-challenge-tests-\(UUID().uuidString)"
    let userDefaults = UserDefaults(suiteName: suiteName)!
    userDefaults.removePersistentDomain(forName: suiteName)
    return userDefaults
}
