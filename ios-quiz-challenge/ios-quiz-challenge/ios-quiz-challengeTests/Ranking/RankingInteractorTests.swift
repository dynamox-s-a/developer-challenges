//
//  RankingInteractorTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

@MainActor
struct RankingInteractorTests {

    @Test func loadPresentsLoadingAndScores() async {
        let scores = [
            PlayerScore(nickname: "Ana", score: 10),
            PlayerScore(nickname: "Bia", score: 8)
        ]
        let loadRanking = LoadRankingUseCaseSpy(scores: scores)
        let presenter = RankingPresenterSpy()
        let router = RankingRouterSpy()
        let sut = makeSUT(
            loadRanking: loadRanking,
            presenter: presenter,
            router: router
        )

        await sut.load()

        #expect(loadRanking.executeCallCount == 1)
        #expect(presenter.events == [.loading, .scores(scores)])
    }

    @Test func closeRoutesBack() {
        let loadRanking = LoadRankingUseCaseSpy(scores: [])
        let presenter = RankingPresenterSpy()
        let router = RankingRouterSpy()
        let sut = makeSUT(
            loadRanking: loadRanking,
            presenter: presenter,
            router: router
        )

        sut.close()

        #expect(router.closeCallCount == 1)
    }
}

private extension RankingInteractorTests {
    func makeSUT(
        loadRanking: LoadRankingUseCaseSpy,
        presenter: RankingPresenterSpy,
        router: RankingRouterSpy
    ) -> RankingInteractor {
        RankingInteractor(
            useCases: .init(loadRanking: loadRanking),
            presenter: presenter,
            router: router
        )
    }
}
