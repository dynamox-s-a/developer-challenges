//
//  QuizRouter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

@MainActor
protocol QuizRouting: AnyObject {
    func close()
    func finishQuiz(score: Int)
}

@MainActor
final class QuizRouter: QuizRouting {

    private let onClose: () -> Void
    private let onFinish: (Int) -> Void
    
    init(
        onClose: @escaping () -> Void,
        onFinish: @escaping (Int) -> Void
    ) {
        self.onClose = onClose
        self.onFinish = onFinish
    }

    func close() {
        onClose()
    }

    func finishQuiz(score: Int) {
        onFinish(score)
    }
}
