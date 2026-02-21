//
//  ScoreStore.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation
import SwiftData

protocol ScoreStoreProtocol {
    func recordGame(username: String, score: Int) throws -> Void
    func recentGames() throws -> [GameSummary]
    func resetGames() throws
}

struct GameSummary: Identifiable, Codable {
    let id: String
    let username: String
    let score: Int
    let playedAt: Date
}

final class ScoreStore: ScoreStoreProtocol {
    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
    }

    func recordGame(username: String, score: Int) throws {
        let name = normalize(username)
        guard !name.isEmpty else { return }

        let result = GameResultEntity(username: name, score: score, playedAt: .now)
        context.insert(result)
        try context.save()
    }

    func recentGames() throws -> [GameSummary] {
        let descriptor = FetchDescriptor<GameResultEntity>(predicate: nil, sortBy: [SortDescriptor(\.playedAt, order: .reverse)])
        let games = try context.fetch(descriptor)
        return games.map { game in
            GameSummary(
                id: persistentIDString(for: game),
                username: game.username,
                score: game.score,
                playedAt: game.playedAt
            )
        }
    }

    func resetGames() throws {
        let all = try context.fetch(FetchDescriptor<GameResultEntity>())
        all.forEach { context.delete($0) }
        try context.save()
    }
    

    private func normalize(_ username: String) -> String {
        username.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func persistentIDString(for entity: GameResultEntity) -> String {
        String(describing: entity.persistentModelID)
    }
}
