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
    private let answerResultDelayNanoseconds: UInt64
    private let timerTickNanoseconds: UInt64

    private var currentQuestion: QuizQuestion?
    private var currentQuestionNumber = 0
    private var score = 0
    private var remainingSeconds: Int

    private var isLoadingQuestion = false
    private var isAnswering = false
    private var isFinished = false
    private var timerTask: Task<Void, Never>?

    init(
        useCases: UseCases,
        presenter: any QuizPresenting,
        router: any QuizRouting,
        totalQuestions: Int,
        quizDurationSeconds: Int = 120,
        timerTickNanoseconds: UInt64 = 1_000_000_000,
        answerResultDelayNanoseconds: UInt64 = 1_000_000_000
    ) {
        self.useCases = useCases
        self.presenter = presenter
        self.router = router
        self.totalQuestions = totalQuestions
        self.remainingSeconds = quizDurationSeconds
        self.timerTickNanoseconds = timerTickNanoseconds
        self.answerResultDelayNanoseconds = answerResultDelayNanoseconds
    }

    deinit {
        timerTask?.cancel()
    }

    func loadQuestion() async {
        guard currentQuestion == nil else {
            return
        }

        startTimerIfNeeded()

        do {
            try await fetchNextQuestion(displaysLoading: true)
        } catch {
            guard !isFinished else {
                return
            }

            presenter.present(error: error)
        }
    }

    func retry() async {
        startTimerIfNeeded()

        do {
            try await fetchNextQuestion(displaysLoading: true)
        } catch {
            guard !isFinished else {
                return
            }

            presenter.present(error: error)
        }
    }

    func selectAnswer(_ option: QuizOption) async {
        guard
            !isAnswering,
            !isLoadingQuestion,
            !isFinished,
            let question = currentQuestion,
            question.options.contains(
                where: { $0.id == option.id }
            )
        else {
            return
        }

        startTimerIfNeeded()
        isAnswering = true
        presenter.presentAnswering(optionID: option.id)

        let isCorrect: Bool

        do {
            isCorrect = try await useCases
                .answerQuestion
                .execute(questionID: question.id, answer: option.title)
        } catch {
            guard !isFinished else {
                return
            }

            presenter.presentAnswerError(error)
            isAnswering = false
            pauseTimer()
            return
        }

        guard !isFinished else {
            return
        }

        if isCorrect {
            score += 1
            presenter.present(score: score)
        }
        
        presenter.presentAnswerResult(
            isCorrect: isCorrect
        )
        
        try? await Task.sleep(
            nanoseconds: answerResultDelayNanoseconds
        )

        guard !isFinished else {
            return
        }

        if currentQuestionNumber >= totalQuestions {
            finishQuiz()
            return
        }

        do {
            try await fetchNextQuestion(
                displaysLoading: false
            )
            isAnswering = false
        } catch {
            guard !isFinished else {
                return
            }

            isAnswering = false
            presenter.present(error: error)
        }
    }

    func close() {
        isFinished = true
        timerTask?.cancel()
        router.close()
    }
}

private extension QuizInteractor {
    func startTimerIfNeeded() {
        guard timerTask == nil else {
            return
        }

        presenter.present(remainingSeconds: remainingSeconds)
        let timerTickNanoseconds = timerTickNanoseconds

        timerTask = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(
                    nanoseconds: timerTickNanoseconds
                )

                if Task.isCancelled {
                    return
                }

                await self?.tickTimer()
            }
        }
    }

    func pauseTimer() {
        timerTask?.cancel()
        timerTask = nil
    }

    func tickTimer() {
        guard !isFinished, remainingSeconds > 0 else {
            return
        }

        remainingSeconds -= 1
        presenter.present(remainingSeconds: remainingSeconds)

        if remainingSeconds == 0 {
            finishQuiz()
        }
    }

    func finishQuiz() {
        guard !isFinished else {
            return
        }

        isFinished = true
        timerTask?.cancel()
        router.finishQuiz(
            score: score * remainingSeconds
        )
    }

    func fetchNextQuestion(displaysLoading: Bool) async throws {
        guard !isLoadingQuestion, !isFinished else {
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

        guard !isFinished else {
            return
        }

        currentQuestionNumber = nextQuestionNumber
        currentQuestion = question

        presenter.present(
            question: question
        )
    }
}
