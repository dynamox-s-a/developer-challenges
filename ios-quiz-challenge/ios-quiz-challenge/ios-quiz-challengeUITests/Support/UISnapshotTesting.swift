//
//  UISnapshotTesting.swift
//  ios-quiz-challengeUITests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import XCTest

class SnapshotTestCase: XCTestCase {

    override func setUpWithError() throws {
        try super.setUpWithError()
        continueAfterFailure = false
    }

    func makeSnapshotApp(
        initialRoute: String? = nil,
        nickname: String = "snapshot-player",
        score: Int = 7
    ) -> XCUIApplication {
        let app = XCUIApplication()
        app.launchEnvironment["UITEST_MODE"] = "1"
        app.launchEnvironment["UITEST_RESET_DATA"] = "1"
        app.launchEnvironment["UITEST_NICKNAME"] = nickname
        app.launchEnvironment["UITEST_SCORE"] = "\(score)"

        if let initialRoute {
            app.launchEnvironment["UITEST_INITIAL_ROUTE"] = initialRoute
        }

        return app
    }

    func assertSnapshot(
        matching app: XCUIApplication,
        named name: String,
        record: Bool = false,
        filePath: StaticString = #filePath,
        line: UInt = #line
    ) throws {
        let screenshot = app.screenshot()
        let data = screenshot.pngRepresentation
        let snapshotURL = snapshotFileURL(
            named: name,
            filePath: filePath
        )

        if record {
            try write(data, to: snapshotURL)
            attach(
                screenshot,
                named: "Recorded \(name)"
            )
            return
        }

        guard FileManager.default.fileExists(
            atPath: snapshotURL.path
        ) else {
            let receivedURL = snapshotURL
                .deletingPathExtension()
                .appendingPathExtension("received.png")

            try write(data, to: receivedURL)
            attach(
                screenshot,
                named: "Missing \(name)"
            )
            XCTFail(
                "Missing snapshot at \(snapshotURL.path). Set record: true to record it. Received image: \(receivedURL.path)",
                file: filePath,
                line: line
            )
            return
        }

        let referenceData = try Data(contentsOf: snapshotURL)

        guard data == referenceData else {
            let failedURL = snapshotURL
                .deletingPathExtension()
                .appendingPathExtension("failed.png")

            try write(data, to: failedURL)
            attach(
                screenshot,
                named: "Failed \(name)"
            )
            XCTFail(
                "Snapshot mismatch for \(snapshotURL.lastPathComponent). Failed image: \(failedURL.path)",
                file: filePath,
                line: line
            )
            return
        }
    }
}

private extension SnapshotTestCase {

    func snapshotFileURL(
        named name: String,
        filePath: StaticString
    ) -> URL {
        let testFileURL = URL(
            fileURLWithPath: String(describing: filePath)
        )
        let testFileName = testFileURL
            .deletingPathExtension()
            .lastPathComponent
        let snapshotDirectory = testFileURL
            .deletingLastPathComponent()
            .appendingPathComponent("__Snapshots__")
            .appendingPathComponent(testFileName)

        return snapshotDirectory
            .appendingPathComponent("\(sanitized(name)).png")
    }

    func sanitized(_ name: String) -> String {
        name
            .replacingOccurrences(of: "(", with: "")
            .replacingOccurrences(of: ")", with: "")
            .replacingOccurrences(of: " ", with: "-")
            .replacingOccurrences(of: "/", with: "-")
    }

    func write(
        _ data: Data,
        to url: URL
    ) throws {
        try FileManager.default.createDirectory(
            at: url.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )

        try data.write(to: url)
    }

    func attach(
        _ screenshot: XCUIScreenshot,
        named name: String
    ) {
        let attachment = XCTAttachment(screenshot: screenshot)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
