//
//  QuizEntrySnapshotTests.swift
//  ios-quiz-challengeUITests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import XCTest

final class QuizEntrySnapshotTests: SnapshotTestCase {

    @MainActor
    func testEntryScreenSnapshots() throws {
        let app = makeSnapshotApp()
        app.launch()

        XCTAssertTrue(
            app.staticTexts["Quiz App"].waitForExistence(timeout: 3)
        )

        try assertSnapshot(
            matching: app,
            named: "entry-empty"
        )

        let textField = app.textFields["Digite seu nick"]
        XCTAssertTrue(
            textField.waitForExistence(timeout: 3)
        )

        textField.tap()
        textField.typeText("kiyo")

        try assertSnapshot(
            matching: app,
            named: "entry-filled"
        )
    }
}
