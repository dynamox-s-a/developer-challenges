//
//  QuizEntryView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import SwiftUI
import Combine

@MainActor
protocol QuizEntryDisplaying: AnyObject {
    func display(nickname: String, canContinue: Bool)
    func displayProcessing(_ isProcessing: Bool)
    func display(errorMessage: String?)
}

@MainActor
final class QuizEntryViewState: ObservableObject, QuizEntryDisplaying {
    
    @Published private(set) var nickname = ""
    @Published private(set) var canContinue = false
    @Published  private(set) var isProcessing = false
    @Published private(set) var errorMessage: String?
    
    func display(nickname: String, canContinue: Bool) {
        self.nickname = nickname
        self.canContinue = canContinue
    }
    
    func displayProcessing(_ isProcessing: Bool) {
        self.isProcessing = isProcessing
    }
    
    func display(errorMessage: String?) {
        self.errorMessage = errorMessage
    }
}

@MainActor
struct QuizEntryView: View {
    
    @StateObject private var state: QuizEntryViewState
    
    private let interactor: any QuizEntryInteracting
    
    init(
        state: QuizEntryViewState,
        interactor: any QuizEntryInteracting
    ) {
        _state = StateObject(
            wrappedValue: state
        )
        
        self.interactor = interactor
    }
    
    var body: some View {
        ZStack {
            Color(
                red: 0.42,
                green: 0.20,
                blue: 1
            )
            .ignoresSafeArea()
            
            VStack(spacing: 36) {
                title
                
                entryPanel
            }
            .padding(.horizontal, 24)
        }
        .task {
            await interactor.load()
        }
    }
}

private extension QuizEntryView {
    
    var title: some View {
        VStack(spacing: 8) {
            Text("Quiz App")
                .font(
                    .system(
                        size: 42,
                        weight: .black,
                        design: .rounded
                    )
                )
                .foregroundStyle(.white)
            
            Text("Teste seus conhecimentos")
                .font(.subheadline)
                .foregroundStyle(
                    .white.opacity(0.8)
                )
        }
    }
    
    var entryPanel: some View {
        VStack(spacing: 20) {
            VStack(
                alignment: .leading,
                spacing: 8
            ) {
                Text("Seu nick")
                    .font(.headline)
                
                TextField(
                    "Digite seu nick",
                    text: Binding(
                        get: {
                            state.nickname
                        },
                        set: {
                            interactor.updateNickname($0)
                        }
                    )
                )
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
                .padding(.horizontal, 16)
                .frame(height: 52)
                .background(
                    RoundedRectangle(
                        cornerRadius: 14,
                        style: .continuous
                    )
                    .fill(Color.white)
                )
                .overlay {
                    RoundedRectangle(
                        cornerRadius: 14,
                        style: .continuous
                    )
                    .stroke(Color.black, lineWidth: 2)
                }
                
                if let errorMessage = state.errorMessage {
                    Text(errorMessage)
                        .font(.footnote)
                        .foregroundStyle(.red)
                }
            }
            
            Button {
                Task {
                    await interactor.startQuiz()
                }
            } label: {
                buttonLabel(
                    title: "Iniciar",
                    systemImage: "play.fill"
                )
            }
            .buttonStyle(
                QuizEntryPrimaryButtonStyle()
            )
            .disabled(
                !state.canContinue ||
                state.isProcessing
            )
            
            Button {
                Task {
                    await interactor.openRanking()
                }
            } label: {
                buttonLabel(
                    title: "Minha posição no ranking",
                    systemImage: "trophy.fill"
                )
            }
            .buttonStyle(
                QuizEntrySecondaryButtonStyle()
            )
            .disabled(
                !state.canContinue ||
                state.isProcessing
            )
        }
        .padding(24)
        .background {
            RoundedRectangle(
                cornerRadius: 24,
                style: .continuous
            )
            .fill(Color.white)
        }
        .overlay {
            RoundedRectangle(
                cornerRadius: 24,
                style: .continuous
            )
            .stroke(Color.black, lineWidth: 2)
        }
        .background {
            RoundedRectangle(
                cornerRadius: 24,
                style: .continuous
            )
            .fill(
                Color(
                    red: 1,
                    green: 0.23,
                    blue: 0.52
                )
            )
            .overlay {
                RoundedRectangle(
                    cornerRadius: 24,
                    style: .continuous
                )
                .stroke(Color.black, lineWidth: 2)
            }
            .offset(x: 8, y: 8)
        }
        .padding(.trailing, 8)
        .padding(.bottom, 8)
    }
    
    func buttonLabel(title: String, systemImage: String) -> some View {
        HStack {
            Image(systemName: systemImage)
            
            Text(title)
                .fontWeight(.bold)
            
            Spacer()
            
            if state.isProcessing {
                ProgressView()
                    .tint(Color.purple)
            }
        }
        .frame(maxWidth: .infinity)
    }
    
    private struct QuizEntryPrimaryButtonStyle: ButtonStyle {
        
        func makeBody(configuration: Configuration) -> some View {
            configuration.label
                .foregroundStyle(.white)
                .padding(.horizontal, 18)
                .frame(height: 52)
                .background {
                    RoundedRectangle(
                        cornerRadius: 16,
                        style: .continuous
                    )
                    .fill(Color.black)
                }
                .scaleEffect(
                    configuration.isPressed ? 0.97 : 1
                )
                .animation(
                    .spring(
                        response: 0.25,
                        dampingFraction: 0.7
                    ),
                    value: configuration.isPressed
                )
        }
    }
    
    private struct QuizEntrySecondaryButtonStyle: ButtonStyle {
        
        func makeBody(configuration: Configuration) -> some View {
            configuration.label
                .foregroundStyle(.black)
                .padding(.horizontal, 18)
                .frame(height: 52)
                .background {
                    RoundedRectangle(
                        cornerRadius: 16,
                        style: .continuous
                    )
                    .fill(Color.white)
                }
                .overlay {
                    RoundedRectangle(
                        cornerRadius: 16,
                        style: .continuous
                    )
                    .stroke(Color.black, lineWidth: 2)
                }
                .scaleEffect(
                    configuration.isPressed ? 0.97 : 1
                )
                .animation(
                    .spring(
                        response: 0.25,
                        dampingFraction: 0.7
                    ),
                    value: configuration.isPressed
                )
        }
    }
}
