//
//  GameResultEntity.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation
import SwiftData

@Model
final class GameResultEntity {
    var username: String
    var score: Int
    var playedAt: Date
    
    init(username: String, score: Int, playedAt: Date = .now) {
        self.username = username
        self.score = score
        self.playedAt = playedAt
    }
}
