//
//  QuizOptionsPanelSnapshotTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import SwiftUI
@testable import ios_quiz_challenge

final class QuizOptionsPanelSnapshotTests: ViewSnapshotTestCase {

    @MainActor
    func testAnsweredOptionsPanelSnapshot() throws {
        let options = makeOptions()

        try assertSnapshot(
            matching: makeSUT(
                options: options,
                selectedOptionID: options[1].id,
                answerResult: true
            ),
            named: "answered-options-panel"
        )
    }
}

@MainActor
private extension QuizOptionsPanelSnapshotTests {
    func makeSUT(
        options: [QuizOption],
        selectedOptionID: QuizOption.ID?,
        answerResult: Bool?
    ) -> some View {
        let answerSpy = QuizAnswerSpy()

        return ZStack {
            Color.white

            QuizOptionsPanel(
                options: options,
                selectedOptionID: selectedOptionID,
                answerResult: answerResult,
                isAnswering: false,
                showPinkShadow: true,
                showPurpleCard: true,
                visibleOptionCount: options.count,
                onAnswer: answerSpy.answer
            )
            .padding(.horizontal, 18)
        }
    }

    func makeOptions() -> [QuizOption] {
        [
            QuizOption(id: UUID(uuidString: "00000000-0000-0000-0000-000000000001")!, title: "Google"),
            QuizOption(id: UUID(uuidString: "00000000-0000-0000-0000-000000000002")!, title: "Dynamox"),
            QuizOption(id: UUID(uuidString: "00000000-0000-0000-0000-000000000003")!, title: "Spotify"),
            QuizOption(id: UUID(uuidString: "00000000-0000-0000-0000-000000000004")!, title: "Amazon")
        ]
    }
}
