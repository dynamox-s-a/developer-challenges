//
//  MockScoreRepository.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Foundation
@testable import dynamoxQuizChallenge

final class MockScoreRepository: ScoreStoreProtocol {
    private(set) var records: [GameSummary] = []
    private var counter = 0
    
    func recordGame(username: String, score: Int) throws {
        counter += 1
        let gameSummary = GameSummary(
            id: "\(counter)",
            username: username,
            score: score,
            playedAt: Date()
        )
        records.insert(gameSummary, at: 0)
    }
    
    func recentGames() throws -> [dynamoxQuizChallenge.GameSummary] {
        return records
    }
    
    func resetGames() throws {
        records.removeAll()
    }
}
