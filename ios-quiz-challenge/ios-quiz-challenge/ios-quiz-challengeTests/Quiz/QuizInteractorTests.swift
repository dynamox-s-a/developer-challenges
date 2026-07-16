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
        #expect(presenter.events == [.loading, .question(question)])
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
        #expect(router.finishedScores == [1])
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
        totalQuestions: Int = 10
    ) -> QuizInteractor {
        QuizInteractor(
            useCases: .init(
                fetchQuestion: fetchQuestion,
                answerQuestion: answerQuestion
            ),
            presenter: presenter,
            router: router,
            totalQuestions: totalQuestions
        )
    }
}
