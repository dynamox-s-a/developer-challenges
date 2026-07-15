//
//  QuizConfigurator.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import dDependencies
import dNetwork

class QuizConfigurator {

    struct Dependencies {
        let networkClient: any NetworkClient

        init() {
            @Dependency
            var networkClient: any NetworkClient

            self.networkClient = networkClient
        }

        init(
            networkClient: any NetworkClient
        ) {
            self.networkClient = networkClient
        }
    }

    @MainActor
    static func make(
        dependencies: Dependencies = .init(),
        questionNumber: Int = 1,
        totalQuestions: Int = 1,
        remainingSeconds: Int = 5,
        onClose: @escaping () -> Void,
        onFinish: @escaping (Int) -> Void
    ) -> QuizView {
        let service = QuizService(
            networkClient: dependencies.networkClient
        )

        let fetchQuestionUseCase = FetchQuizQuestionUseCase(service: service)
        let answerQuestionUseCase = AnswerQuizQuestionUseCase(service: service)

        let viewState = QuizViewState()

        let presenter = QuizPresenter(
            view: viewState
        )

        let router = QuizRouter(onClose: onClose, onFinish: onFinish)

        let interactor = QuizInteractor(
            useCases: .init(
                fetchQuestion: fetchQuestionUseCase,
                answerQuestion: answerQuestionUseCase
            ),
            presenter: presenter,
            router: router,
            totalQuestions: totalQuestions
        )

        return QuizView(
            state: viewState,
            interactor: interactor,
            totalQuestions: totalQuestions,
            remainingSeconds: remainingSeconds
        )
    }
}
