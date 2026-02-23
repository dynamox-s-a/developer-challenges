//
//  RootView.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import SwiftUI

enum QuizRoute: Hashable {
    case matchResult
    case quiz(userName: String)
}

struct RootView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var path: [QuizRoute] = []
    @State private var lastName: String? = nil
    
    @State private var container: AppContainer? = nil
    
    var body: some View {
        NavigationStack(path: $path) {
            if let container {
                PlayerRegisterView(
                    viewModel: container.makePlayerRegisterViewModel()
                ) { name in
                    path.append(.quiz(userName: name))
                } onOpenResults: {
                    path.append(.matchResult)
                }
                .navigationBarHidden(true)
                .navigationDestination(for: QuizRoute.self) { route in
                    switch route {
                    case .quiz(let userName):
                        let viewModel = container.makeQuizViewModel(userName: userName)
                        QuizView(
                            viewModel: viewModel
                        ) { userName, score in
                            lastName = userName
                            path.append(.matchResult)
                        }
                        .navigationBarBackButtonHidden(true)
                    case .matchResult:
                        let viewModel = container.makeMatchResultViewModel()
                        MatchResultView(
                            viewModel: viewModel,
                            onRestartQuiz: {
                                guard let name = lastName, !name.isEmpty else {
                                    path = []
                                    return
                                }
                                if path.last == .matchResult { _ = path.popLast() }
                            },
                            onGoHome: { path = [] }
                        )
                            .navigationBarBackButtonHidden(true)
                    }
                }
            }
        }
        .onAppear {
            if container == nil {
                let cntr = AppContainer(modelContext: modelContext)
                container = cntr
            }
        }
    }
}
