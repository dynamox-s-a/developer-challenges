//
//  MatchResultView.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import SwiftUI

struct MatchResultView: View {
    @State var viewModel: MatchResultViewModel
    
    let onRestartQuiz: () -> Void
    let onGoHome: () -> Void
    var canRestart: Bool { viewModel.lastGame != nil }
    
    var body: some View {
        ZStack {
            background
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    Spacer()
                        .frame(height: 44)
                    
                    trophyHeader
                        .padding(.top, 10)
                    
                    scoreBlock
                        .padding(.top, 22)
                    
                    historySection
                        .padding(.top, 34)
                    
                    Spacer()
                        .frame(height: 26)
                    
                    primaryButton
                        .padding(.horizontal, 18)

                    Spacer()
                        .frame(height: 12)
                    
                    secondaryButton
                        .padding(.horizontal, 18)
                
                    Spacer()
                        .frame(height: 16)
                    
                    resetHistoryButton
                        .padding(.bottom, 28)
                }
            }
        }
        .onAppear() {
            viewModel.load()
        }
        .alert("Erro", isPresented: $viewModel.isShowingErrorAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
        .alert("Resetar histórico", isPresented: $viewModel.isShowingResetConfirm) {
            Button("Cancelar", role: .cancel) { }
            Button("Resetar", role: .destructive) {
                viewModel.resetHistory()
            }
        } message: {
            Text("Isso apagará todas as jogadas salvas.")
        }
    }

    var background: some View {
        LinearGradient(
            stops: [
                .init(color: Color(hex: 0x25101A), location: 0.0),
                .init(color: Color(hex: 0x160A12), location: 0.55),
                .init(color: Color(hex: 0x0F070D), location: 1.0)
            ],
            startPoint: .top,
            endPoint: .bottom
        )
        .ignoresSafeArea()
    }

    var trophyHeader: some View {
        ZStack {
            Circle()
                .fill(QuizColors.magenta.opacity(0.12))
                .frame(width: 112, height: 112)
                .overlay {
                    Circle()
                        .stroke(QuizColors.magenta.opacity(0.25), lineWidth: 1)
                }
            Image(systemName: "trophy.fill")
                .font(.system(size: 34, weight: .bold))
                .foregroundStyle(QuizColors.magenta)
        }
    }

    var scoreBlock: some View {
        VStack(spacing: 10) {
            Text(viewModel.scoreText)
                .font(.system(size: 78, weight: .heavy, design: .rounded))
                .foregroundStyle(QuizColors.magenta)
            Text(viewModel.congratsTitle)
                .font(.system(size: 30, weight: .heavy, design: .rounded))
                .foregroundStyle(.white.opacity(0.92))
            Text(viewModel.performanceSubtitle)
                .font(.system(size: 16, weight: .medium, design: .rounded))
                .foregroundStyle(.white.opacity(0.50))
        }
        .multilineTextAlignment(.center)
        .padding(.horizontal, 18)
    }

    var historySection: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Jogos Anteriores")
                    .font(.system(size: 16, weight: .heavy, design: .rounded))
                    .foregroundStyle(.white.opacity(0.55))
                    .tracking(2)
                
                Spacer()
                
                Button {
                    viewModel.askReset()
                } label: {
                    Image(systemName: "arrow.counterclockwise")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.55))
                        .padding(10)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 18)
            
            VStack(spacing: 12) {
                ForEach(viewModel.previous.prefix(10)) { game in
                    HistoryCard(
                        name: game.userName,
                        date: viewModel.dateLabel(for: game.playedAt),
                        score: "\(game.score)/10"
                    )
                }
                
                if viewModel.lastGame == nil && viewModel.previous.isEmpty {
                    EmptyHistoryCard()
                        .padding(.horizontal, 18)
                }
            }
        }
        .padding(.horizontal, 18)
    }

    var primaryButton: some View {
        Button {
            onRestartQuiz()
        } label: {
            HStack(spacing: 10) {
                Image(systemName: "arrow.clockwise")
                    .font(.system(size: 18, weight: .bold))
                Text("Recomeçar Quiz")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 18)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(QuizColors.magenta)
                    .shadow(
                        color: QuizColors.magenta.opacity(0.35),
                        radius: 18,
                        x: 0,
                        y: 10
                    )
            )
        }
        .buttonStyle(.plain)
        .disabled(!canRestart)
        .opacity(canRestart ? 1 : 0.45)
    }

    var secondaryButton: some View {
        Button {
            onGoHome()
        } label: {
            HStack(spacing: 10) {
                Image(systemName: "house.fill")
                    .font(.system(size: 18, weight: .bold))
                Text("Voltar ao Início")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
            }
            .foregroundStyle(QuizColors.magenta)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 18)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(.white.opacity(0.02))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(QuizColors.magenta.opacity(0.35), lineWidth: 2)
            )
        }
        .buttonStyle(.plain)
    }

    var resetHistoryButton: some View {
        Button {
            viewModel.askReset()
        } label: {
            HStack(spacing: 8) {
                Image(systemName: "trash")
                    .font(.system(size: 14, weight: .semibold))
                Text("Resetar Histórico")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    
            }
            .foregroundStyle(.white.opacity(0.45))
            .padding(.vertical, 6)
        }
        .buttonStyle(.plain)
    }
}
