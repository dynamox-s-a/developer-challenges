//
//  QuizResultSnapshotTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

@testable import ios_quiz_challenge

final class QuizResultSnapshotTests: ViewSnapshotTestCase {

    @MainActor
    func testResultScreenSnapshot() throws {
        try assertSnapshot(
            matching: makeSUT(),
            named: "result-score-8"
        )
    }
}

@MainActor
private extension QuizResultSnapshotTests {
    func makeSUT() -> QuizResultView {
        let state = QuizResultViewState()
        let interactor = QuizResultInteractorSpy()
        state.displaySavedScore()

        return QuizResultView(
            state: state,
            interactor: interactor,
            nickname: "kiyo",
            score: 8,
            totalQuestions: 10
        )
    }
}
