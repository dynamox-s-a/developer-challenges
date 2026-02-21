//
//  MatchResultViewModelTests.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Testing
@testable import dynamoxQuizChallenge

@MainActor
struct MatchResultViewModelTests {

    @Test
    func load_setsCurrentAndPrevious() {
        let mockScoreStore = MockScoreRepository()
        try? mockScoreStore.recordGame(username: "Hyago", score: 8)
        try? mockScoreStore.recordGame(username: "Hyago Henrique", score: 6)

        let viewModel = MatchResultViewModel(scoreStore: mockScoreStore)
        viewModel.load()

        #expect(viewModel.lastGame?.userName == "Hyago Henrique")
        #expect(viewModel.previous.count == 1)
        #expect(viewModel.previous.first?.userName == "Hyago")
        #expect(viewModel.scoreText == "6/10")
    }

    @Test
    func reset_clearsHistory() {
        let mockScoreStore = MockScoreRepository()
        try? mockScoreStore.recordGame(username: "Hyago", score: 7)

        let viewModel = MatchResultViewModel(scoreStore: mockScoreStore)
        viewModel.load()
        #expect(viewModel.lastGame != nil)

        viewModel.resetHistory()

        #expect(viewModel.lastGame == nil)
        #expect(viewModel.previous.isEmpty)
    }
}
