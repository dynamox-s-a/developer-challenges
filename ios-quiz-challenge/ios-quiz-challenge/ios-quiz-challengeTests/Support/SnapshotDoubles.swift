//
//  SnapshotDoubles.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

@testable import ios_quiz_challenge

@MainActor
final class QuizEntryInteractorSpy: QuizEntryInteracting {
    private(set) var loadCallCount = 0
    private(set) var updatedNicknames: [String] = []
    private(set) var startQuizCallCount = 0
    private(set) var openRankingCallCount = 0

    func load() async {
        loadCallCount += 1
    }

    func updateNickname(_ nickname: String) {
        updatedNicknames.append(nickname)
    }

    func startQuiz() async {
        startQuizCallCount += 1
    }

    func openRanking() async {
        openRankingCallCount += 1
    }
}

@MainActor
final class QuizResultInteractorSpy: QuizResultInteracting {
    private(set) var loadCallCount = 0
    private(set) var restartQuizCallCount = 0
    private(set) var openRankingCallCount = 0
    private(set) var closeCallCount = 0

    func load() async {
        loadCallCount += 1
    }

    func restartQuiz() {
        restartQuizCallCount += 1
    }

    func openRanking() {
        openRankingCallCount += 1
    }

    func close() {
        closeCallCount += 1
    }
}

@MainActor
final class RankingInteractorSpy: RankingInteracting {
    private(set) var loadCallCount = 0
    private(set) var closeCallCount = 0

    func load() async {
        loadCallCount += 1
    }

    func close() {
        closeCallCount += 1
    }
}

final class QuizAnswerSpy {
    private(set) var answeredOptions: [QuizOption] = []

    func answer(_ option: QuizOption) {
        answeredOptions.append(option)
    }
}
