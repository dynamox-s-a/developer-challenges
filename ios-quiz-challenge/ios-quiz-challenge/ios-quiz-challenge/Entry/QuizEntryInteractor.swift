//
//  QuizEntryInteractor.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

@MainActor
protocol QuizEntryInteracting: AnyObject {
    func load() async

    func updateNickname(
        _ nickname: String
    )

    func startQuiz() async
    func openRanking() async
}

@MainActor
final class QuizEntryInteractor: QuizEntryInteracting {

    struct UseCases {
        let loadCurrentNickname:
            any LoadCurrentNicknameUseCaseProtocol

        let saveCurrentNickname:
            any SaveCurrentNicknameUseCaseProtocol
    }

    private let useCases: UseCases
    private let presenter: any QuizEntryPresenting
    private let router: any QuizEntryRouting

    private var nickname = ""
    private var isProcessing = false

    init(
        useCases: UseCases,
        presenter: any QuizEntryPresenting,
        router: any QuizEntryRouting
    ) {
        self.useCases = useCases
        self.presenter = presenter
        self.router = router
    }

    func load() async {
        let savedNickname = await useCases
            .loadCurrentNickname
            .execute() ?? ""

        nickname = savedNickname

        presenter.present(
            nickname: savedNickname
        )
    }

    func updateNickname(
        _ nickname: String
    ) {
        self.nickname = nickname

        presenter.clearError()
        presenter.present(nickname: nickname)
    }

    func startQuiz() async {
        guard let nickname = await persistNickname() else {
            return
        }

        router.routeToQuiz(
            nickname: nickname
        )
    }

    func openRanking() async {
        guard let nickname = await persistNickname() else {
            return
        }

        router.routeToRanking(
            nickname: nickname
        )
    }
}

private extension QuizEntryInteractor {

    func persistNickname() async -> String? {
        guard !isProcessing else {
            return nil
        }

        isProcessing = true
        presenter.presentProcessing(true)

        defer {
            isProcessing = false
            presenter.presentProcessing(false)
        }

        do {
            let savedNickname = try await useCases
                .saveCurrentNickname
                .execute(nickname: nickname)

            nickname = savedNickname
            presenter.present(nickname: savedNickname)

            return savedNickname
        } catch {
            presenter.present(error: error)
            return nil
        }
    }
}
