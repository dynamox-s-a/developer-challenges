//
//  QuizEntrySnapshotTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

@testable import ios_quiz_challenge

final class QuizEntrySnapshotTests: ViewSnapshotTestCase {

    @MainActor
    func testEmptyEntryScreenSnapshot() throws {
        try assertSnapshot(
            matching: makeSUT(),
            named: "entry-empty"
        )
    }

    @MainActor
    func testFilledEntryScreenSnapshot() throws {
        try assertSnapshot(
            matching: makeSUT(nickname: "kiyo", canContinue: true),
            named: "entry-filled"
        )
    }
}

@MainActor
private extension QuizEntrySnapshotTests {
    func makeSUT(
        nickname: String = "",
        canContinue: Bool = false
    ) -> QuizEntryView {
        let state = QuizEntryViewState()
        let interactor = QuizEntryInteractorSpy()
        state.display(
            nickname: nickname,
            canContinue: canContinue
        )

        return QuizEntryView(
            state: state,
            interactor: interactor
        )
    }
}
