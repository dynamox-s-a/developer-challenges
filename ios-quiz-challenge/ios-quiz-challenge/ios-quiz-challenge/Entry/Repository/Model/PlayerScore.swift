//
//  PlayerScore.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

struct PlayerScore: Codable, Equatable, Identifiable, Sendable {
    let nickname: String
    let score: Int

    var id: String {
        nickname.lowercased()
    }
}
