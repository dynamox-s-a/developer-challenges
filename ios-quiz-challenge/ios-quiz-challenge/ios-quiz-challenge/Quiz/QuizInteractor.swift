//
//  QuizInteracting.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

@MainActor
protocol QuizInteracting: AnyObject {
    func loadQuestion() async
    func retry() async
    func close()
    func selectAnswer(_ option: QuizOption)
}

@MainActor
final class QuizInteractor: QuizInteracting {
    struct UseCases {
        let fetchQuestion: FetchQuizQuestionUseCaseProtocol
    }

    private let useCases: UseCases
    private let presenter: QuizPresenting
    private let router: QuizRouting

    private var isLoading = false

    init(
        useCases: UseCases,
        presenter: QuizPresenting,
        router: QuizRouting
    ) {
        self.useCases = useCases
        self.presenter = presenter
        self.router = router
    }

    func loadQuestion() async {
        guard !isLoading else {
            return
        }

        isLoading = true
        presenter.presentLoading()

        defer {
            isLoading = false
        }

        do {
            let question = try await useCases
                .fetchQuestion
                .execute()

            presenter.present(
                question: question
            )
        } catch {
            presenter.present(
                error: error
            )
        }
    }

    func retry() async {
        await loadQuestion()
    }

    func close() {
        router.close()
    }

    func selectAnswer(
        _ option: QuizOption
    ) {
        router.didSelectAnswer(option)
    }
}
