//
//  QuizView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 12/07/26.
//

import Combine
import DynaUI
import Foundation
import SwiftUI

// WIP
enum QuizPalette {
    static let purple = Color(
        red: 0.42,
        green: 0.20,
        blue: 1
    )

    static let pink = Color(
        red: 1,
        green: 0.23,
        blue: 0.52
    )
}

@MainActor
protocol QuizDisplaying: AnyObject {
    func displayLoading()
    func display(question: QuizQuestion)
    func display(score: Int)
    func displayAnswering(optionID: QuizOption.ID)
    func displayAnswerResult(isCorrect: Bool)
    func display(errorMessage: String)
    func displayAnswerError(message: String)
}

@MainActor
final class QuizViewState: ObservableObject, QuizDisplaying {

    @Published private(set) var question: QuizQuestion?
    @Published private(set) var selectedOptionID: QuizOption.ID?
    @Published private(set) var score = 0
    @Published private(set) var isLoading = false
    @Published private(set) var isAnswering = false
    @Published private(set) var answerResult: Bool?
    @Published private(set) var errorMessage: String?
    @Published private(set) var answerErrorMessage: String?

    func displayLoading() {
        isLoading = true
        errorMessage = nil
        question = nil
    }
    
    func display(question: QuizQuestion) {
        self.question = question
        selectedOptionID = nil
        answerResult = nil
        isAnswering = false
    }
    
    func display(score: Int) {
        self.score = score
    }
    
    func displayAnswering(optionID: QuizOption.ID) {
        selectedOptionID = optionID
        answerResult = nil
        isAnswering = true
    }
    
    func displayAnswerResult(isCorrect: Bool) {
        answerResult = isCorrect
        isAnswering = false
    }
    
    func display(errorMessage: String) {
        question = nil
        isLoading = false
        self.errorMessage = errorMessage
    }
    
    func displayAnswerError( message: String) {
        answerErrorMessage = message
    }
}

@MainActor
struct QuizView: View {

    @StateObject
    private var state: QuizViewState

    private let interactor: any QuizInteracting

    let totalQuestions: Int
    let remainingSeconds: Int

    init(
        state: QuizViewState,
        interactor: any QuizInteracting,
        totalQuestions: Int,
        remainingSeconds: Int
    ) {
        _state = StateObject(
            wrappedValue: state
        )

        self.interactor = interactor
        self.totalQuestions = totalQuestions
        self.remainingSeconds = remainingSeconds
    }

    var body: some View {
        ZStack {
            VStack(spacing: .zero) {
                QuizFixedHeader(
                    score: state.score,
                    remainingSeconds: remainingSeconds,
                    onClose: {
                        interactor.close()
                    }
                )

                content
            }
        }
        .preferredColorScheme(.light)
        .task {
            await interactor.loadQuestion()
        }
    }
}

private extension QuizView {

    @ViewBuilder
    var content: some View {
        if let question = state.question {
            questionContent(question)
        } else if let errorMessage = state.errorMessage {
            errorContent(
                message: errorMessage
            )
        } else {
            loadingContent
        }
    }
    
    func questionContent(_ question: QuizQuestion) -> some View {
        QuizContentView(
            question: question,
            totalQuestions: totalQuestions,
            selectedOptionID: state.selectedOptionID,
            answerResult: state.answerResult,
            isAnswering: state.isAnswering,
            onAnswer: handleAnswer
        )
    }

    var loadingContent: some View {
        ZStack {
            Color.white

            ProgressView()
                .controlSize(.large)
        }
        .frame(
            maxWidth: .infinity,
            maxHeight: .infinity
        )
    }

    func errorContent(message: String) -> some View {
        VStack(spacing: 16) {
            Image(
                systemName: "exclamationmark.triangle.fill"
            )
            .font(.system(size: 32))

            Text(
                "Não foi possível carregar a pergunta"
            )
            .font(.headline)

            Text(message)
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            Button("Tentar novamente") {
                Task {
                    await interactor.retry()
                }
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(24)
        .frame(
            maxWidth: .infinity,
            maxHeight: .infinity
        )
    }

    func handleAnswer( _ option: QuizOption) {
        Task {
            await interactor.selectAnswer(option)
        }
    }
}

#Preview {
    QuizConfigurator.make(
        questionNumber: 1,
        totalQuestions: 10,
        remainingSeconds: 5,
        onClose: {},
        onFinish: { _ in }
    )
}
