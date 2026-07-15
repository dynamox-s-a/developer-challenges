//
//  QuizEntryPresenter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

@MainActor
protocol QuizEntryPresenting: AnyObject {
    func present(nickname: String)
    func presentProcessing(_ isProcessing: Bool)
    func present(error: Error)
    func clearError()
}

@MainActor
final class QuizEntryPresenter: QuizEntryPresenting {

    private weak var view: (any QuizEntryDisplaying)?

    init(
        view: any QuizEntryDisplaying
    ) {
        self.view = view
    }

    func present(
        nickname: String
    ) {
        let canContinue = !nickname
            .trimmingCharacters(
                in: .whitespacesAndNewlines
            )
            .isEmpty

        view?.display(
            nickname: nickname,
            canContinue: canContinue
        )
    }

    func presentProcessing(
        _ isProcessing: Bool
    ) {
        view?.displayProcessing(isProcessing)
    }

    func present(
        error: Error
    ) {
        view?.display(
            errorMessage: error.localizedDescription
        )
    }

    func clearError() {
        view?.display(errorMessage: nil)
    }
}
