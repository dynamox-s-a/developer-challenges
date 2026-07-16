//
//  QuizResultConfigurator.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import dDependencies

enum QuizResultConfigurator {
    struct Dependencies {
        let playerRepository: any PlayerRepository

        init() {
            @Dependency
            var playerRepository: any PlayerRepository

            self.playerRepository = playerRepository
        }

        init(playerRepository: any PlayerRepository) {
            self.playerRepository = playerRepository
        }
    }

    @MainActor
    static func make(
        dependencies: Dependencies = .init(),
        nickname: String,
        score: Int,
        totalQuestions: Int,
        onRestart: @escaping () -> Void,
        onOpenRanking: @escaping () -> Void,
        onClose: @escaping () -> Void
    ) -> QuizResultView {
        let viewState = QuizResultViewState()

        let presenter = QuizResultPresenter(view: viewState)

        let router = QuizResultRouter(
            onRestart: onRestart,
            onOpenRanking: onOpenRanking,
            onClose: onClose
        )

        let saveResult = SaveQuizResultUseCase(
            repository: dependencies.playerRepository
        )

        let interactor = QuizResultInteractor(
            nickname: nickname,
            score: score,
            useCases: .init(saveResult: saveResult),
            presenter: presenter,
            router: router
        )

        return QuizResultView(
            state: viewState,
            interactor: interactor,
            nickname: nickname,
            score: score,
            totalQuestions: totalQuestions
        )
    }
}
