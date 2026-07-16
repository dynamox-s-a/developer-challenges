//
//  QuizInteractorTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

@MainActor
struct QuizInteractorTests {

    @Test func loadQuestionFetchesFirstQuestionAndPresentsLoadingState() async {
        let question = makeQuestion(number: 1)
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(question)
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .success(true)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router
        )

        await sut.loadQuestion()

        #expect(fetchQuestion.receivedQuestionNumbers == [1])
        #expect(
            presenter.events == [
                .remainingSeconds(120),
                .loading,
                .question(question)
            ]
        )
    }

    @Test func loadQuestionDoesNotFetchAgainWhenQuestionIsAlreadyLoaded() async {
        let question = makeQuestion(number: 1)
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(question)
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .success(true)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router
        )

        await sut.loadQuestion()
        await sut.loadQuestion()

        #expect(fetchQuestion.receivedQuestionNumbers == [1])
    }

    @Test func selectingCorrectAnswerUpdatesScoreAndFinishesQuiz() async {
        let question = makeQuestion(number: 1)
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(question)
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .success(true)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router,
            totalQuestions: 1
        )

        await sut.loadQuestion()
        await sut.selectAnswer(question.options[0])

        #expect(answerQuestion.receivedAnswers.count == 1)
        #expect(answerQuestion.receivedAnswers.first?.questionID == question.id)
        #expect(answerQuestion.receivedAnswers.first?.answer == question.options[0].title)
        #expect(presenter.events.contains(.answering(question.options[0].id)))
        #expect(presenter.events.contains(.score(1)))
        #expect(presenter.events.contains(.answerResult(true)))
        #expect(router.finishedScores == [120])
    }

    @Test func answerFailurePresentsErrorAndAllowsRetry() async {
        let question = makeQuestion(number: 1)
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(question)
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .failure(TestError.expected)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router
        )

        await sut.loadQuestion()
        await sut.selectAnswer(question.options[0])
        answerQuestion.result = .success(false)
        await sut.selectAnswer(question.options[1])
        let didPresentAnswerError = presenter.events.contains { event in
            if case .answerError = event {
                return true
            }

            return false
        }

        #expect(answerQuestion.receivedAnswers.count == 2)
        #expect(answerQuestion.receivedAnswers[0].answer == question.options[0].title)
        #expect(answerQuestion.receivedAnswers[1].answer == question.options[1].title)
        #expect(didPresentAnswerError)
        #expect(presenter.events.contains(.answerResult(false)))
    }

    @Test func answerFailurePausesTimer() async throws {
        let question = makeQuestion(number: 1)
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(question)
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .failure(TestError.expected)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router,
            quizDurationSeconds: 1,
            timerTickNanoseconds: 1_000_000
        )

        await sut.loadQuestion()
        await sut.selectAnswer(question.options[0])
        try await Task.sleep(nanoseconds: 5_000_000)

        #expect(!presenter.events.contains(.remainingSeconds(0)))
        #expect(router.finishedScores.isEmpty)
    }

    @Test func nextQuestionFailureAfterAnswerPresentsQuestionError() async {
        let question = makeQuestion(number: 1)
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(question)
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .success(true)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router,
            totalQuestions: 2
        )

        await sut.loadQuestion()
        fetchQuestion.result = .failure(TestError.expected)
        await sut.selectAnswer(question.options[0])
        let didPresentQuestionError = presenter.events.contains { event in
            if case .error = event {
                return true
            }

            return false
        }
        let didPresentAnswerError = presenter.events.contains { event in
            if case .answerError = event {
                return true
            }

            return false
        }

        #expect(fetchQuestion.receivedQuestionNumbers == [1, 2])
        #expect(didPresentQuestionError)
        #expect(!didPresentAnswerError)
    }

    @Test func quizFinishesWhenTimerReachesZero() async throws {
        let question = makeQuestion(number: 1)
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(question)
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .success(true)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router,
            quizDurationSeconds: 1,
            timerTickNanoseconds: 1_000_000
        )

        await sut.loadQuestion()
        await Task.yield()
        try await Task.sleep(nanoseconds: 5_000_000)

        #expect(presenter.events.contains(.remainingSeconds(0)))
        #expect(router.finishedScores == [0])
    }

    @Test func closeRoutesBack() {
        let fetchQuestion = FetchQuizQuestionUseCaseSpy(
            result: .success(makeQuestion())
        )
        let answerQuestion = AnswerQuizQuestionUseCaseSpy(
            result: .success(true)
        )
        let presenter = QuizPresenterSpy()
        let router = QuizRouterSpy()
        let sut = makeSUT(
            fetchQuestion: fetchQuestion,
            answerQuestion: answerQuestion,
            presenter: presenter,
            router: router
        )

        sut.close()

        #expect(router.closeCallCount == 1)
    }
}

private extension QuizInteractorTests {
    func makeSUT(
        fetchQuestion: FetchQuizQuestionUseCaseSpy,
        answerQuestion: AnswerQuizQuestionUseCaseSpy,
        presenter: QuizPresenterSpy,
        router: QuizRouterSpy,
        totalQuestions: Int = 10,
        quizDurationSeconds: Int = 120,
        timerTickNanoseconds: UInt64 = 1_000_000_000
    ) -> QuizInteractor {
        QuizInteractor(
            useCases: .init(
                fetchQuestion: fetchQuestion,
                answerQuestion: answerQuestion
            ),
            presenter: presenter,
            router: router,
            totalQuestions: totalQuestions,
            quizDurationSeconds: quizDurationSeconds,
            timerTickNanoseconds: timerTickNanoseconds,
            answerResultDelayNanoseconds: 0
        )
    }
}
