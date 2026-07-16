//
//  AppLaunchConfiguration.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

enum AppLaunchConfiguration {

    static func configureForUITestsIfNeeded() {
        guard isRunningUITests else {
            return
        }

        resetStoredDataIfNeeded()
    }

    static func initialNavigationPath() -> [AppRoute] {
        guard isRunningUITests else {
            return []
        }

        switch environment["UITEST_INITIAL_ROUTE"] {
        case "result":
            return [
                .result(
                    nickname: nickname,
                    score: score
                )
            ]

        case "ranking":
            return [
                .ranking(nickname: nickname)
            ]

        default:
            return []
        }
    }
}

private extension AppLaunchConfiguration {

    static var environment: [String: String] {
        ProcessInfo.processInfo.environment
    }

    static var isRunningUITests: Bool {
        environment["UITEST_MODE"] == "1"
    }

    static var nickname: String {
        environment["UITEST_NICKNAME"] ?? "snapshot-player"
    }

    static var score: Int {
        Int(environment["UITEST_SCORE"] ?? "7") ?? 7
    }

    static func resetStoredDataIfNeeded() {
        guard environment["UITEST_RESET_DATA"] == "1" else {
            return
        }

        UserDefaults.standard.removeObject(
            forKey: "quiz.currentNickname"
        )
        UserDefaults.standard.removeObject(
            forKey: "quiz.playerScores"
        )
    }
}
