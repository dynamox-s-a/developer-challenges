//
//  AppFlowView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import SwiftUI

@MainActor
struct AppFlowView: View {
    
    @State
    private var navigationPath: [AppRoute] = []
    
    var body: some View {
        NavigationStack(path: $navigationPath) {
            entryScene
                .navigationDestination(
                    for: AppRoute.self,
                    destination: destination
                )
        }
    }
}

private extension AppFlowView {
    
    var entryScene: some View {
        QuizEntryConfigurator.make(
            onStartQuiz: { nickname in
                openQuiz(nickname: nickname)
            },
            onOpenRanking: { nickname in
                openRanking(nickname: nickname)
            }
        )
        .toolbar(.hidden, for: .navigationBar)
    }
    
    @ViewBuilder
    func destination(for route: AppRoute) -> some View {
        switch route {
        case let .quiz(nickname):
            quizScene(nickname: nickname)
            
        case let .ranking(nickname):
            rankingScene(nickname: nickname)
        }
    }
    
    func quizScene(nickname: String) -> some View {
        QuizConfigurator.make(
            questionNumber: 1,
            totalQuestions: 9,
            remainingSeconds: 5,
            onClose: {
                closeCurrentScene()
            },
            onFinish: { score in
                closeCurrentScene()
            }
        )
        .toolbar(.hidden, for: .navigationBar)
    }
    
    func rankingScene(
        nickname: String
    ) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "trophy.fill")
                .font(.system(size: 48))
            
            Text("Ranking")
                .font(.largeTitle.bold())
            
            Text("Jogador: \(nickname)")
                .foregroundStyle(.secondary)
            
            Text("A tela de ranking será implementada em seguida.")
                .multilineTextAlignment(.center)
        }
        .padding(24)
        .toolbar(.hidden, for: .navigationBar)
    }
    
    func openQuiz(
        nickname: String
    ) {
        navigationPath.append(
            .quiz(nickname: nickname)
        )
    }
    
    func openRanking(nickname: String) {
        navigationPath.append(
            .ranking(nickname: nickname)
        )
    }
    
    func closeCurrentScene() {
        guard !navigationPath.isEmpty else {
            return
        }
        
        navigationPath = Array(
            navigationPath.dropLast()
        )
    }
}
