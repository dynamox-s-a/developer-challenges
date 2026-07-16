//
//  RankingView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import DynaUI
import SwiftUI
import Combine

@MainActor
protocol RankingDisplaying: AnyObject {
    func displayLoading()
    func display(scores: [PlayerScore])
}

@MainActor
final class RankingViewState: ObservableObject, RankingDisplaying {
    @Published private(set) var scores: [PlayerScore] = []
    @Published private(set) var isLoading = false

    func displayLoading() {
        isLoading = true
    }

    func display(scores: [PlayerScore]) {
        self.scores = scores
        isLoading = false
    }
}

@MainActor
struct RankingView: View {
    @StateObject private var state: RankingViewState

    private let interactor: any RankingInteracting
    private let nickname: String

    init(
        state: RankingViewState,
        interactor: any RankingInteracting,
        nickname: String
    ) {
        _state = StateObject(wrappedValue: state)
        self.interactor = interactor
        self.nickname = nickname
    }

    var body: some View {
        ZStack {
            Color.white
                .ignoresSafeArea()

            VStack(spacing: .zero) {
                QuizFlowHeader(
                    title: "Ranking",
                    detail: "Jogador : \(nickname)",
                    onClose: interactor.close
                )

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 32) {
                        rankingTitle

                        rankingPanel
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

private extension RankingView {
    var rankingTitle: some View {
        VStack(spacing: 8) {
            Text("Ranking")
                .font(.system(size: 28, weight: .black, design: .rounded))
                .foregroundStyle(.black)

            Text(positionText)
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(.black.opacity(0.58))
        }
        .frame(maxWidth: .infinity)
    }

    var rankingPanel: some View {
        DynaPanel(
            title: "Melhores scores",
            titleFont: .system(size: 18, weight: .bold),
            titleColor: .white
        ) {
            VStack(spacing: 10) {
                content

                DynaOptionButton(
                    "Voltar",
                    action: interactor.close
                )
                .padding(.top, 6)
            }
            .padding(.horizontal, 4)
        }
    }

    @ViewBuilder
    var content: some View {
        if state.isLoading {
            ProgressView()
                .tint(.white)
                .controlSize(.large)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 36)
        } else if state.scores.isEmpty {
            RaisedCard {
                Text("Nenhuma pontuação salva ainda.")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 18)
            }
            .padding(.bottom, 4)
        } else {
            ForEach(
                Array(state.scores.enumerated()),
                id: \.element.id
            ) { index, score in
                rankingRow(
                    score,
                    position: index + 1
                )
                .padding(.bottom, 4)
            }
        }
    }

    func rankingRow(
        _ score: PlayerScore,
        position: Int
    ) -> some View {
        let isCurrentPlayer = score.nickname.compare(
            nickname,
            options: .caseInsensitive
        ) == .orderedSame

        return RaisedCard {
            HStack(spacing: 12) {
                Text("\(position)")
                    .font(.system(size: 13, weight: .black, design: .rounded))
                    .frame(width: 32, height: 32)
                    .background {
                        Circle()
                            .fill(isCurrentPlayer ? QuizPalette.pink : .black)
                    }
                    .foregroundStyle(.white)

                VStack(alignment: .leading, spacing: 3) {
                    Text(score.nickname)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundStyle(.black)

                    if isCurrentPlayer {
                        Text("Você")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundStyle(QuizPalette.purple)
                    }
                }

                Spacer()

                Text("\(score.score) pts")
                    .font(.system(size: 14, weight: .black, design: .rounded))
                    .foregroundStyle(.black)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
        }
    }

    var positionText: String {
        guard let index = state.scores.firstIndex(
            where: {
                $0.nickname.compare(
                    nickname,
                    options: .caseInsensitive
                ) == .orderedSame
            }
        ) else {
            return "Jogador: \(nickname)"
        }

        return "Você está na \(index + 1)ª posição"
    }
}
