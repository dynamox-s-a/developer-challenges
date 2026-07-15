//
//  QuizPresenting.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

@MainActor
protocol QuizPresenting: AnyObject {
    func presentLoading()
    func present(question: QuizQuestion)
    func present(error: Error)
}

@MainActor
final class QuizPresenter: QuizPresenting {

    private weak var view: QuizDisplaying?

    init(view: QuizDisplaying) {
        self.view = view
    }

    func presentLoading() {
        view?.displayLoading()
    }

    func present(question: QuizQuestion) {
        let formattedQuestion = format(question)

        view?.display(
            question: formattedQuestion
        )
    }

    func present(error: Error) {
        let message = format(error)

        view?.display(
            errorMessage: message
        )
    }
}

private extension QuizPresenter {

    func format(
        _ question: QuizQuestion
    ) -> QuizQuestion {
        QuizQuestion(
            id: question.id,
            number: question.number,
            title: format(question.title),
            imageName: question.imageName,
            options: question.options.map { option in
                QuizOption(
                    id: option.id,
                    title: format(option.title)
                )
            }
        )
    }

    func format(
        _ text: String
    ) -> String {
        text.trimmingCharacters(
            in: .whitespacesAndNewlines
        )
    }

    func format(
        _ error: Error
    ) -> String {
        error.localizedDescription
    }
}
