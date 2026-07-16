//
//  RankingSnapshotTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

@testable import ios_quiz_challenge

final class RankingSnapshotTests: ViewSnapshotTestCase {

    @MainActor
    func testEmptyRankingScreenSnapshot() throws {
        try assertSnapshot(
            matching: makeSUT(scores: []),
            named: "ranking-empty"
        )
    }

    @MainActor
    func testRankingWithCurrentPlayerSnapshot() throws {
        try assertSnapshot(
            matching: makeSUT(
                scores: [
                    PlayerScore(nickname: "kiyo", score: 8),
                    PlayerScore(nickname: "ana", score: 6)
                ]
            ),
            named: "ranking-current-player"
        )
    }
}

@MainActor
private extension RankingSnapshotTests {
    func makeSUT(scores: [PlayerScore]) -> RankingView {
        let state = RankingViewState()
        let interactor = RankingInteractorSpy()
        state.display(scores: scores)

        return RankingView(
            state: state,
            interactor: interactor,
            nickname: "kiyo"
        )
    }
}
