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
    func display(errorMessage: String)
}

@MainActor
final class QuizViewState: ObservableObject, QuizDisplaying {

    @Published private(set) var question: QuizQuestion?
    @Published private(set) var isLoading = false
    @Published private(set) var errorMessage: String?

    func displayLoading() {
        isLoading = true
        errorMessage = nil
    }

    func display(question: QuizQuestion) {
        self.question = question
        isLoading = false
        errorMessage = nil
    }

    func display(errorMessage: String) {
        question = nil
        isLoading = false
        self.errorMessage = errorMessage
    }
}

@MainActor
struct QuizView: View {

    @StateObject
    private var state: QuizViewState

    private let interactor: any QuizInteracting

    let totalQuestions: Int
    let score: Int
    let remainingSeconds: Int

    @State
    private var selectedOptionID: QuizOption.ID?

    init(
        state: QuizViewState,
        interactor: any QuizInteracting,
        totalQuestions: Int,
        score: Int,
        remainingSeconds: Int
    ) {
        _state = StateObject(
            wrappedValue: state
        )

        self.interactor = interactor
        self.totalQuestions = totalQuestions
        self.score = score
        self.remainingSeconds = remainingSeconds
    }

    var body: some View {
        ZStack {
            VStack(spacing: .zero) {
                QuizFixedHeader(
                    score: score,
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
        .onChange(of: state.question?.id) { _ in
            selectedOptionID = nil
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
            selectedOptionID: $selectedOptionID,
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
        selectedOptionID = option.id
        interactor.selectAnswer(option)
    }
}

#Preview {
    QuizConfigurator.make(
        questionNumber: 1,
        totalQuestions: 10,
        score: 120,
        remainingSeconds: 5
    )
}
