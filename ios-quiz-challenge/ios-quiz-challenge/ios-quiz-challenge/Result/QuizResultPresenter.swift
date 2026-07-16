//
//  QuizResultPresenter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

@MainActor
protocol QuizResultPresenting: AnyObject {
    func presentSavingScore()
    func presentSavedScore()
    func presentSaveError(_ error: Error)
}

@MainActor
final class QuizResultPresenter: QuizResultPresenting {
    private weak var view: QuizResultDisplaying?

    init(view: QuizResultDisplaying) {
        self.view = view
    }

    func presentSavingScore() {
        view?.displaySavingScore()
    }

    func presentSavedScore() {
        view?.displaySavedScore()
    }

    func presentSaveError(_ error: Error) {
        view?.displaySaveError(
            message: error.localizedDescription
        )
    }
}
