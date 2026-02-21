//
//  RootView.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import SwiftUI

enum QuizRoute: Hashable {
//    case score
    case quiz(userName: String)
//    case registerPlayer
}

struct RootView: View {
    @State private var path: [QuizRoute] = []
    
    var body: some View {
        NavigationStack(path: $path) {
            PlayerRegisterView { name in
                path.append(.quiz(userName: name))
            }
            .navigationBarHidden(true)
            .navigationDestination(for: QuizRoute.self) { route in
                switch route {
                case .quiz(let userName):
                    let repository = QuizRepository()
                    let viewModel = QuizViewModel(
                        repository: repository,
                        userName: userName)
                    QuizView(viewModel: viewModel) { _, _ in
                        
                    }
                    .navigationBarBackButtonHidden(true)
                }
            }
        }
    }
}
