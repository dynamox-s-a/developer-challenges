//
//  QuizResultInteractor.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

@MainActor
protocol QuizResultInteracting: AnyObject {
    func load() async
    func restartQuiz()
    func openRanking()
    func close()
}

@MainActor
final class QuizResultInteractor: QuizResultInteracting {
    struct UseCases {
        let saveResult: any SaveQuizResultUseCaseProtocol
    }

    private let nickname: String
    private let score: Int
    private let useCases: UseCases
    private let presenter: any QuizResultPresenting
    private let router: any QuizResultRouting

    private var didSaveResult = false

    init(
        nickname: String,
        score: Int,
        useCases: UseCases,
        presenter: any QuizResultPresenting,
        router: any QuizResultRouting
    ) {
        self.nickname = nickname
        self.score = score
        self.useCases = useCases
        self.presenter = presenter
        self.router = router
    }

    func load() async {
        guard !didSaveResult else {
            return
        }

        didSaveResult = true
        presenter.presentSavingScore()

        do {
            try await useCases.saveResult.execute(
                nickname: nickname,
                score: score
            )

            presenter.presentSavedScore()
        } catch {
            presenter.presentSaveError(error)
        }
    }

    func restartQuiz() {
        router.restartQuiz()
    }

    func openRanking() {
        router.openRanking()
    }

    func close() {
        router.close()
    }
}
