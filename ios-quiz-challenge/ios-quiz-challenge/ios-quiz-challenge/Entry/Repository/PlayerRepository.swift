//
//  PlayerRepository.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

protocol PlayerRepository: Sendable {
    func setCurrentNickname(_ nickname: String) async
    func currentNickname() async -> String?

    func save(
        score: Int,
        for nickname: String
    ) async throws

    func ranking() async -> [PlayerScore]
}
