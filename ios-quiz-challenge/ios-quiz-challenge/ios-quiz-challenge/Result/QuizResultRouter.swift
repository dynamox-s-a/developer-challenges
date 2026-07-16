//
//  QuizResultRouter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

@MainActor
protocol QuizResultRouting: AnyObject {
    func restartQuiz()
    func openRanking()
    func close()
}

@MainActor
final class QuizResultRouter: QuizResultRouting {
    private let onRestart: () -> Void
    private let onOpenRanking: () -> Void
    private let onClose: () -> Void

    init(
        onRestart: @escaping () -> Void,
        onOpenRanking: @escaping () -> Void,
        onClose: @escaping () -> Void
    ) {
        self.onRestart = onRestart
        self.onOpenRanking = onOpenRanking
        self.onClose = onClose
    }

    func restartQuiz() {
        onRestart()
    }

    func openRanking() {
        onOpenRanking()
    }

    func close() {
        onClose()
    }
}
