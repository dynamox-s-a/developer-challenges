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
    func display(remainingSeconds: Int)
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
    @Published private(set) var remainingSeconds: Int
    @Published private(set) var isLoading = false
    @Published private(set) var isAnswering = false
    @Published private(set) var answerResult: Bool?
    @Published private(set) var errorMessage: String?
    @Published private(set) var answerErrorMessage: String?

    init(remainingSeconds: Int = 120) {
        self.remainingSeconds = remainingSeconds
    }

    func displayLoading() {
        isLoading = true
        errorMessage = nil
        question = nil
    }
    
    func display(question: QuizQuestion) {
        self.question = question
        selectedOptionID = nil
        answerResult = nil
        answerErrorMessage = nil
        isAnswering = false
        isLoading = false
    }
    
    func display(score: Int) {
        self.score = score
    }

    func display(remainingSeconds: Int) {
        self.remainingSeconds = remainingSeconds
    }
    
    func displayAnswering(optionID: QuizOption.ID) {
        selectedOptionID = optionID
        answerResult = nil
        answerErrorMessage = nil
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
    
    func displayAnswerError(message: String) {
        selectedOptionID = nil
        answerResult = nil
        isAnswering = false
        answerErrorMessage = message
    }

    func dismissAnswerError() {
        answerErrorMessage = nil
    }
}

@MainActor
struct QuizView: View {

    @StateObject
    private var state: QuizViewState

    private let interactor: any QuizInteracting

    let totalQuestions: Int

    init(
        state: QuizViewState,
        interactor: any QuizInteracting,
        totalQuestions: Int
    ) {
        _state = StateObject(
            wrappedValue: state
        )

        self.interactor = interactor
        self.totalQuestions = totalQuestions
    }

    var body: some View {
        ZStack {
            VStack(spacing: .zero) {
                QuizFixedHeader(
                    score: state.score,
                    remainingSeconds: state.remainingSeconds,
                    onClose: {
                        interactor.close()
                    }
                )

                content
            }

            if let answerErrorMessage = state.answerErrorMessage {
                answerErrorOverlay(message: answerErrorMessage)
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
        ZStack {
            Color.white

            DynaPanel(
                title: "Algo deu errado",
                titleFont: .system(size: 18, weight: .bold),
                titleColor: .white
            ) {
                VStack(spacing: 14) {
                    RaisedCard {
                        VStack(spacing: 12) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .font(.system(size: 34, weight: .black))
                                .foregroundStyle(QuizPalette.pink)

                            Text("Não foi possível carregar a pergunta")
                                .font(.system(size: 17, weight: .black, design: .rounded))
                                .foregroundStyle(.black)
                                .multilineTextAlignment(.center)

                            Text(message)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(.black.opacity(0.58))
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .padding(.horizontal, 12)
                    }
                    .padding(.bottom, 4)

                    DynaOptionButton("Tentar novamente") {
                        Task {
                            await interactor.retry()
                        }
                    }
                }
                .padding(.horizontal, 4)
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    func answerErrorOverlay(message: String) -> some View {
        ZStack {
            Color.black
                .opacity(0.34)
                .ignoresSafeArea()

            DynaPanel(
                title: "Ops!",
                titleFont: .system(size: 18, weight: .black, design: .rounded),
                titleColor: .white
            ) {
                VStack(spacing: 14) {
                    RaisedCard {
                        VStack(spacing: 12) {
                            Image(systemName: "wifi.exclamationmark")
                                .font(.system(size: 36, weight: .black))
                                .foregroundStyle(QuizPalette.pink)

                            Text("Não foi possível enviar sua resposta")
                                .font(.system(size: 17, weight: .black, design: .rounded))
                                .foregroundStyle(.black)
                                .multilineTextAlignment(.center)

                            Text(message)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(.black.opacity(0.58))
                                .multilineTextAlignment(.center)

                            Text("O tempo está pausado. Escolha uma alternativa para tentar novamente.")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundStyle(QuizPalette.purple)
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .padding(.horizontal, 12)
                    }

                    DynaOptionButton("Escolher novamente") {
                        withAnimation(.easeOut(duration: 0.18)) {
                            state.dismissAnswerError()
                        }
                    }
                }
                .padding(.horizontal, 4)
            }
            .padding(.horizontal, 18)
            .padding(.bottom, 8)
        }
        .transition(.opacity)
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
        onClose: {},
        onFinish: { _ in }
    )
}
