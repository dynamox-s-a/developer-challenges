//
//  RankingSnapshotTests.swift
//  ios-quiz-challengeUITests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import XCTest

final class RankingSnapshotTests: SnapshotTestCase {

    @MainActor
    func testEmptyRankingScreenSnapshot() throws {
        let app = makeSnapshotApp(
            initialRoute: "ranking",
            nickname: "kiyo"
        )
        app.launch()

        XCTAssertTrue(
            app.staticTexts["Nenhuma pontuação salva ainda."].waitForExistence(timeout: 3)
        )

        try assertSnapshot(
            matching: app,
            named: "ranking-empty"
        )
    }

    @MainActor
    func testRankingWithCurrentPlayerSnapshot() throws {
        let app = makeSnapshotApp(
            initialRoute: "result",
            nickname: "kiyo",
            score: 8
        )
        app.launch()

        let rankingButton = app.buttons["Ver ranking"]
        XCTAssertTrue(
            rankingButton.waitForExistence(timeout: 3)
        )

        expectation(
            for: NSPredicate(format: "isEnabled == true"),
            evaluatedWith: rankingButton
        )
        waitForExpectations(timeout: 3)

        rankingButton.tap()

        XCTAssertTrue(
            app.staticTexts["Você está na 1ª posição"].waitForExistence(timeout: 3)
        )

        try assertSnapshot(
            matching: app,
            named: "ranking-current-player"
        )
    }
}
