//
//  QuizResultSnapshotTests.swift
//  ios-quiz-challengeUITests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import XCTest

final class QuizResultSnapshotTests: SnapshotTestCase {

    @MainActor
    func testResultScreenSnapshot() throws {
        let app = makeSnapshotApp(
            initialRoute: "result",
            nickname: "kiyo",
            score: 8
        )
        app.launch()

        XCTAssertTrue(
            app.staticTexts["Quiz finalizado"].waitForExistence(timeout: 3)
        )

        try assertSnapshot(
            matching: app,
            named: "result-score-8"
        )
    }
}
