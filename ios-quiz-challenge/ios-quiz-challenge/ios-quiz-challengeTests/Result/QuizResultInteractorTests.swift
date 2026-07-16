//
//  QuizResultInteractorTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

@MainActor
struct QuizResultInteractorTests {

    @Test func loadSavesScoreAndPresentsSuccess() async {
        let saveResult = SaveQuizResultUseCaseSpy()
        let presenter = QuizResultPresenterSpy()
        let router = QuizResultRouterSpy()
        let sut = makeSUT(
            saveResult: saveResult,
            presenter: presenter,
            router: router
        )

        await sut.load()

        #expect(saveResult.calls.count == 1)
        #expect(saveResult.calls.first?.nickname == "kiyo")
        #expect(saveResult.calls.first?.score == 8)
        #expect(presenter.events == [.saving, .saved])
    }

    @Test func loadDoesNotSaveTwice() async {
        let saveResult = SaveQuizResultUseCaseSpy()
        let presenter = QuizResultPresenterSpy()
        let router = QuizResultRouterSpy()
        let sut = makeSUT(
            saveResult: saveResult,
            presenter: presenter,
            router: router
        )

        await sut.load()
        await sut.load()

        #expect(saveResult.calls.count == 1)
        #expect(presenter.events == [.saving, .saved])
    }

    @Test func loadPresentsSaveError() async {
        let saveResult = SaveQuizResultUseCaseSpy()
        saveResult.error = TestError.expected
        let presenter = QuizResultPresenterSpy()
        let router = QuizResultRouterSpy()
        let sut = makeSUT(
            saveResult: saveResult,
            presenter: presenter,
            router: router
        )

        await sut.load()

        #expect(saveResult.calls.count == 1)
        #expect(presenter.events.count == 2)
        #expect(presenter.events.first == .saving)

        if case .some(.error) = presenter.events.last {
            #expect(true)
        } else {
            #expect(Bool(false))
        }
    }

    @Test func routeActionsAreDelegatedToRouter() {
        let saveResult = SaveQuizResultUseCaseSpy()
        let presenter = QuizResultPresenterSpy()
        let router = QuizResultRouterSpy()
        let sut = makeSUT(
            saveResult: saveResult,
            presenter: presenter,
            router: router
        )

        sut.restartQuiz()
        sut.openRanking()
        sut.close()

        #expect(router.restartCallCount == 1)
        #expect(router.openRankingCallCount == 1)
        #expect(router.closeCallCount == 1)
    }
}

private extension QuizResultInteractorTests {
    func makeSUT(
        saveResult: SaveQuizResultUseCaseSpy,
        presenter: QuizResultPresenterSpy,
        router: QuizResultRouterSpy
    ) -> QuizResultInteractor {
        QuizResultInteractor(
            nickname: "kiyo",
            score: 8,
            useCases: .init(saveResult: saveResult),
            presenter: presenter,
            router: router
        )
    }
}
