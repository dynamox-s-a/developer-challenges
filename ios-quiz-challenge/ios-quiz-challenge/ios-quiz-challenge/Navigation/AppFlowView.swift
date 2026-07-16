//
//  AppFlowView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import SwiftUI

@MainActor
struct AppFlowView: View {
    @State private var navigationPath: [AppRoute] = []

    init(
        initialNavigationPath: [AppRoute] = AppLaunchConfiguration.initialNavigationPath()
    ) {
        _navigationPath = State(
            initialValue: initialNavigationPath
        )
    }

    var body: some View {
        NavigationStack(path: $navigationPath) {
            entryScene
                .navigationDestination(
                    for: AppRoute.self,
                    destination: destination
                )
        }
    }
}

private extension AppFlowView {
    var entryScene: some View {
        QuizEntryConfigurator.make(
            onStartQuiz: { nickname in
                openQuiz(nickname: nickname)
            },
            onOpenRanking: { nickname in
                openRanking(nickname: nickname)
            }
        )
        .toolbar(.hidden, for: .navigationBar)
    }

    @ViewBuilder
    func destination(for route: AppRoute) -> some View {
        switch route {
        case let .quiz(nickname):
            quizScene(nickname: nickname)

        case let .result(nickname, score):
            resultScene(
                nickname: nickname,
                score: score
            )

        case let .ranking(nickname):
            rankingScene(nickname: nickname)
        }
    }

    func quizScene(nickname: String) -> some View {
        QuizConfigurator.make(
            questionNumber: 1,
            totalQuestions: 10,
            remainingSeconds: 5,
            onClose: {
                closeCurrentScene()
            },
            onFinish: { score in
                showResult(
                    nickname: nickname,
                    score: score
                )
            }
        )
        .toolbar(.hidden, for: .navigationBar)
    }

    func resultScene(
        nickname: String,
        score: Int
    ) -> some View {
        QuizResultConfigurator.make(
            nickname: nickname,
            score: score,
            totalQuestions: 10,
            onRestart: {
                restartQuiz(nickname: nickname)
            },
            onOpenRanking: {
                openRanking(nickname: nickname)
            },
            onClose: {
                closeFlow()
            }
        )
        .toolbar(.hidden, for: .navigationBar)
    }

    func rankingScene(
        nickname: String
    ) -> some View {
        RankingConfigurator.make(
            nickname: nickname,
            onClose: {
                closeCurrentScene()
            }
        )
        .toolbar(.hidden, for: .navigationBar)
    }

    func openQuiz(nickname: String) {
        navigationPath.append(
            .quiz(nickname: nickname)
        )
    }

    func openRanking(nickname: String) {
        navigationPath.append(
            .ranking(nickname: nickname)
        )
    }

    func showResult(
        nickname: String,
        score: Int
    ) {
        let previousPath = navigationPath.dropLast()

        navigationPath = Array(previousPath) + [
            .result(
                nickname: nickname,
                score: score
            )
        ]
    }

    func restartQuiz(nickname: String) {
        navigationPath = [
            .quiz(nickname: nickname)
        ]
    }

    func closeCurrentScene() {
        guard !navigationPath.isEmpty else {
            return
        }

        navigationPath = Array(
            navigationPath.dropLast()
        )
    }

    func closeFlow() {
        navigationPath = []
    }
}
