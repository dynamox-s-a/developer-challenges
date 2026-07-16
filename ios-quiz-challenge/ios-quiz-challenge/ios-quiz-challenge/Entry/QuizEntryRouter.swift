//
//  QuizEntryRouter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

@MainActor
protocol QuizEntryRouting: AnyObject {
    func routeToQuiz(
        nickname: String
    )

    func routeToRanking(
        nickname: String
    )
}

@MainActor
final class QuizEntryRouter: QuizEntryRouting {

    private let onStartQuiz: (String) -> Void
    private let onOpenRanking: (String) -> Void

    init(
        onStartQuiz: @escaping (String) -> Void,
        onOpenRanking: @escaping (String) -> Void
    ) {
        self.onStartQuiz = onStartQuiz
        self.onOpenRanking = onOpenRanking
    }

    func routeToQuiz(
        nickname: String
    ) {
        onStartQuiz(nickname)
    }

    func routeToRanking(
        nickname: String
    ) {
        onOpenRanking(nickname)
    }
}
