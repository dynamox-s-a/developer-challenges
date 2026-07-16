//
//  QuizEntryConfigurator.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import dDependencies

class QuizEntryConfigurator {

    struct Dependencies {
        let playerRepository: any PlayerRepository

        init() {
            @Dependency
            var playerRepository: any PlayerRepository

            self.playerRepository = playerRepository
        }

        init(
            playerRepository: any PlayerRepository
        ) {
            self.playerRepository = playerRepository
        }
    }

    @MainActor
    static func make(
        dependencies: Dependencies = .init(),
        onStartQuiz: @escaping (String) -> Void,
        onOpenRanking: @escaping (String) -> Void
    ) -> QuizEntryView {
        let viewState = QuizEntryViewState()

        let presenter = QuizEntryPresenter(
            view: viewState
        )

        let router = QuizEntryRouter(
            onStartQuiz: onStartQuiz,
            onOpenRanking: onOpenRanking
        )

        let loadCurrentNickname =
            LoadCurrentNicknameUseCase(
                repository: dependencies.playerRepository
            )

        let saveCurrentNickname =
            SaveCurrentNicknameUseCase(
                repository: dependencies.playerRepository
            )

        let interactor = QuizEntryInteractor(
            useCases: .init(
                loadCurrentNickname: loadCurrentNickname,
                saveCurrentNickname: saveCurrentNickname
            ),
            presenter: presenter,
            router: router
        )

        return QuizEntryView(
            state: viewState,
            interactor: interactor
        )
    }
}
