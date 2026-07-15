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
    func selectAnswer(_ option: QuizOption) async
    func close()
}

@MainActor
final class QuizInteractor: QuizInteracting {

    struct UseCases {
        let fetchQuestion: FetchQuizQuestionUseCaseProtocol
        let answerQuestion: AnswerQuizQuestionUseCaseProtocol
    }

    private let useCases: UseCases
    private let presenter: any QuizPresenting
    private let router: any QuizRouting
    private let totalQuestions: Int

    private var currentQuestion: QuizQuestion?
    private var currentQuestionNumber = 0
    private var score = 0

    private var isLoadingQuestion = false
    private var isAnswering = false

    init(
        useCases: UseCases,
        presenter: any QuizPresenting,
        router: any QuizRouting,
        totalQuestions: Int
    ) {
        self.useCases = useCases
        self.presenter = presenter
        self.router = router
        self.totalQuestions = totalQuestions
    }

    func loadQuestion() async {
        guard currentQuestion == nil else {
            return
        }

        do {
            try await fetchNextQuestion(displaysLoading: true)
        } catch {
            presenter.present(error: error)
        }
    }

    func retry() async {
        do {
            try await fetchNextQuestion(displaysLoading: true)
        } catch {
            presenter.present(error: error)
        }
    }

    func selectAnswer(_ option: QuizOption) async {
        guard
            !isAnswering,
            !isLoadingQuestion,
            let question = currentQuestion,
            question.options.contains(
                where: { $0.id == option.id }
            )
        else {
            return
        }

        isAnswering = true
        presenter.presentAnswering(optionID: option.id)

        do {
            let isCorrect = try await useCases
                .answerQuestion
                .execute(questionID: question.id, answer: option.title)

            if isCorrect {
                score += 1
                presenter.present(score: score)
            }
            
            presenter.presentAnswerResult(
                isCorrect: isCorrect
            )
            
            try? await Task.sleep(
                nanoseconds: 1_000_000_000
            )

            if currentQuestionNumber >= totalQuestions {
                router.finishQuiz(score: score)
                return
            }

            try await fetchNextQuestion(
                displaysLoading: false
            )
            isAnswering = false
        } catch {
            presenter.presentAnswerError(error)
            presenter.presentAnswering(optionID: option.id)
            isAnswering = false
        }
    }

    func close() {
        router.close()
    }
}

private extension QuizInteractor {
    func fetchNextQuestion(displaysLoading: Bool) async throws {
        guard !isLoadingQuestion else {
            return
        }

        isLoadingQuestion = true

        defer {
            isLoadingQuestion = false
        }

        if displaysLoading {
            presenter.presentLoading()
        }

        let nextQuestionNumber =
            currentQuestionNumber + 1

        let question = try await useCases
            .fetchQuestion
            .execute(questionNumber: nextQuestionNumber)

        currentQuestionNumber = nextQuestionNumber
        currentQuestion = question

        presenter.present(
            question: question
        )
    }
}
