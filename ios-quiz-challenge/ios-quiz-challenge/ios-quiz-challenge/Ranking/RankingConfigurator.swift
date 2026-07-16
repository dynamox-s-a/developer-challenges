//
//  RankingConfigurator.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import dDependencies

enum RankingConfigurator {
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
        onClose: @escaping () -> Void
    ) -> RankingView {
        let viewState = RankingViewState()

        let presenter = RankingPresenter(view: viewState)
        let router = RankingRouter(onClose: onClose)

        let loadRanking = LoadRankingUseCase(
            repository: dependencies.playerRepository
        )

        let interactor = RankingInteractor(
            useCases: .init(loadRanking: loadRanking),
            presenter: presenter,
            router: router
        )

        return RankingView(
            state: viewState,
            interactor: interactor,
            nickname: nickname
        )
    }
}
