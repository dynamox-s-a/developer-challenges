//
//  RankingInteractor.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

@MainActor
protocol RankingInteracting: AnyObject {
    func load() async
    func close()
}

@MainActor
final class RankingInteractor: RankingInteracting {
    struct UseCases {
        let loadRanking: any LoadRankingUseCaseProtocol
    }

    private let useCases: UseCases
    private let presenter: any RankingPresenting
    private let router: any RankingRouting

    private var isLoading = false

    init(
        useCases: UseCases,
        presenter: any RankingPresenting,
        router: any RankingRouting
    ) {
        self.useCases = useCases
        self.presenter = presenter
        self.router = router
    }

    func load() async {
        guard !isLoading else {
            return
        }

        isLoading = true
        presenter.presentLoading()

        let scores = await useCases.loadRanking.execute()

        presenter.present(scores: scores)
        isLoading = false
    }

    func close() {
        router.close()
    }
}
