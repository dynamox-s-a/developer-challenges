//
//  QuizResultView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import DynaUI
import SwiftUI
import Combine

@MainActor
protocol QuizResultDisplaying: AnyObject {
    func displaySavingScore()
    func displaySavedScore()
    func displaySaveError(message: String)
}

@MainActor
final class QuizResultViewState: ObservableObject, QuizResultDisplaying {
    @Published private(set) var isSavingScore = false
    @Published private(set) var saveErrorMessage: String?

    func displaySavingScore() {
        isSavingScore = true
        saveErrorMessage = nil
    }

    func displaySavedScore() {
        isSavingScore = false
        saveErrorMessage = nil
    }

    func displaySaveError(message: String) {
        isSavingScore = false
        saveErrorMessage = message
    }
}

@MainActor
struct QuizResultView: View {
    @StateObject private var state: QuizResultViewState

    private let interactor: any QuizResultInteracting
    private let nickname: String
    private let score: Int
    private let totalQuestions: Int

    init(
        state: QuizResultViewState,
        interactor: any QuizResultInteracting,
        nickname: String,
        score: Int,
        totalQuestions: Int
    ) {
        _state = StateObject(wrappedValue: state)
        self.interactor = interactor
        self.nickname = nickname
        self.score = score
        self.totalQuestions = totalQuestions
    }

    var body: some View {
        ZStack {
            Color.white
                .ignoresSafeArea()

            VStack(spacing: .zero) {
                QuizFlowHeader(
                    title: "Resultado",
                    detail: "Score : \(score)",
                    isCloseEnabled: !state.isSavingScore,
                    onClose: interactor.close
                )

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 32) {
                        resultTitle

                        resultPanel
                    }
                    .padding(.horizontal, 18)
                    .padding(.top, 34)
                    .padding(.bottom, 32)
                }
            }
        }
        .task {
            await interactor.load()
        }
    }
}

private extension QuizResultView {
    var resultTitle: some View {
        VStack(spacing: 8) {
            Text("Quiz finalizado")
                .font(.system(size: 28, weight: .black, design: .rounded))
                .foregroundStyle(.black)

            Text(nickname)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(.black.opacity(0.58))
        }
        .frame(maxWidth: .infinity)
    }

    var resultPanel: some View {
        DynaPanel(
            title: "Sua pontuação",
            titleFont: .system(size: 18, weight: .bold),
            titleColor: .white
        ) {
            VStack(spacing: 14) {
                scoreCard

                saveStatus

                DynaOptionButton(
                    "Jogar novamente",
                    isEnabled: !state.isSavingScore,
                    action: interactor.restartQuiz
                )

                DynaOptionButton(
                    "Ver ranking",
                    isEnabled: !state.isSavingScore,
                    action: interactor.openRanking
                )

                DynaOptionButton(
                    "Voltar ao início",
                    isEnabled: !state.isSavingScore,
                    action: interactor.close
                )
            }
            .padding(.horizontal, 4)
        }
    }

    var scoreCard: some View {
        RaisedCard {
            VStack(spacing: 4) {
                Text("\(score)/\(totalQuestions)")
                    .font(.system(size: 58, weight: .black, design: .rounded))
                    .foregroundStyle(.black)

                Text(resultMessage)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(.black.opacity(0.58))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 22)
        }
        .padding(.bottom, 4)
    }

    @ViewBuilder
    var saveStatus: some View {
        if state.isSavingScore {
            HStack(spacing: 8) {
                ProgressView()
                    .tint(.white)

                Text("Salvando pontuação...")
                    .font(.system(size: 13, weight: .semibold))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
        } else if let saveErrorMessage = state.saveErrorMessage {
            Text("Não foi possível salvar sua pontuação: \(saveErrorMessage)")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 8)
        }
    }

    var resultMessage: String {
        score == totalQuestions
        ? "Perfeito!"
        : "Continue tentando"
    }
}

#Preview {
    QuizResultView(
        state: QuizResultViewState(),
        interactor: QuizResultInteractorMock(),
        nickname: "Kiyo",
        score: 0,
        totalQuestions: 0
    )
}


class QuizResultInteractorMock: QuizResultInteracting {
    func load() async {}
    func restartQuiz() {}
    func openRanking() {}
    func close() {}
}
