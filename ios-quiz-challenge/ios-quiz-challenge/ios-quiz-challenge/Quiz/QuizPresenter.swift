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
    func present(score: Int)
    func presentAnswering(optionID: QuizOption.ID)
    func presentAnswerResult(isCorrect: Bool)
    func present(error: Error)
    func presentAnswerError(_ error: Error)
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
        view?.display(
            question: format(question)
        )
    }
    
    func present(score: Int) {
        view?.display(score: score)
    }
    
    func presentAnswering(optionID: QuizOption.ID) {
        view?.displayAnswering(optionID: optionID)
    }
    
    func presentAnswerResult(isCorrect: Bool) {
        view?.displayAnswerResult(isCorrect: isCorrect)
    }
    
    func present(error: Error) {
        view?.display(
            errorMessage: error.localizedDescription
        )
    }
    
    func presentAnswerError( _ error: Error) {
        view?.displayAnswerError(
            message: error.localizedDescription
        )
    }
}

private extension QuizPresenter {
    
    func format(_ question: QuizQuestion) -> QuizQuestion {
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
    
    func format(_ text: String) -> String {
        text.trimmingCharacters(
            in: .whitespacesAndNewlines
        )
    }
}
