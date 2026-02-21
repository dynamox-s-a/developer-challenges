//
//  MatchResultViewModel.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Foundation
import Observation
import SwiftUI

@Observable
@MainActor
final class MatchResultViewModel {
    struct Item: Identifiable, Equatable {
        let id: String
        let userName: String
        let score: Int
        let playedAt: Date
    }
    
    private let scoreStore: ScoreStoreProtocol
    
    var lastGame: Item? = nil
    var previous: [Item] = []
    
    var isShowingResetConfirm: Bool = false
    var isShowingErrorAlert: Bool = false
    var errorMessage: String? = nil
    
    init(scoreStore: ScoreStoreProtocol) {
        self.scoreStore = scoreStore
    }

    func load() {
        do {
            let games = try scoreStore.recentGames()
            let items = games.map {
                Item(
                    id: $0.id,
                    userName: $0.username,
                    score: $0.score,
                    playedAt: $0.playedAt
                )
            }
            
            lastGame = items.first
            previous = Array(items.dropFirst())
        } catch {
            errorMessage = "Ocorreu um erro ao carregar os dados."
            isShowingErrorAlert = true
        }
    }

    func askReset() {
        isShowingResetConfirm = true
    }

    func resetHistory() {
        do {
            try scoreStore.resetGames()
            lastGame = nil
            previous.removeAll()
        } catch {
            errorMessage = "Ocorreu um erro ao resetar os dados."
            isShowingErrorAlert = true
        }
    }

    var scoreText: String {
        guard let lastGame else { return "--/10" }
        return "\(lastGame.score)/10"
    }
    
    var congratsTitle: String {
        guard let lastGame else { return "Resultado" }
        return lastGame.score > 7 ? "Parabéns! \(lastGame.userName)" : "Tente novamente. Vc consegue \(lastGame.userName)"
    }

    var performanceSubtitle: String {
        guard let lastGame else { return "--" }
        switch lastGame.score {
        case 0..<5:
            return "Dá para melhorar - tente novamente!"
        case 5..<8:
            return "Bom trabalho,Continue assim!"
        default:
            return "Excelente, você é um verdadeiro mestre!"
        }
    }

    func dateLabel(for date: Date) -> String {
        let calendar = Calendar.current
        let time = date.formatted(.dateTime.hour().minute())
        
        if calendar.isDateInToday(date) {
            return "Hoje, \(time)"
        }
        if calendar.isDateInYesterday(date) {
            return "Ontem, \(time)"
        }
        let day = date.formatted(.dateTime.day().month().year())
        return "\(day), \(time)"
    }
}
