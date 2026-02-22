//
//  QuizView.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import SwiftUI

struct QuizView: View {
    @State var viewModel: QuizViewModel
    let onFinish: (_ userName: String, _ score: Int) -> Void
    @State private var animateHeader = false
    
    var body: some View {
        ZStack {
            background
            
            VStack(spacing: 0) {
                header
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                
                progressBar
                    .padding(.horizontal, 18)
                    .padding(.top, 14)
                
                DividerLine()
                    .padding(.top, 18)
                ScrollView {
                    content
                        .padding(.bottom, 18)
                    
                }
                Spacer()
                
                bottomButton
                    .padding(.horizontal, 18)
                    .padding(.bottom, 18)
            }
            
            if viewModel.screenState == .loading {
                LoadingOverlay()
            }
            
            if case let .showingFeedBack(isCorrect) = viewModel.screenState {
                FeedbackOverlay(isCorrect: isCorrect)
            }
        }
        .onAppear {
            viewModel.start()
            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                animateHeader = true
            }
        }
        .onChange(of: viewModel.screenState) { _, newValue in
            if newValue == .finished {
                onFinish(viewModel.userName, viewModel.score)
            }
        }
        .alert("Erro", isPresented: $viewModel.isShowingErrorAlert) {
            Button("Ok", role: .cancel) {}
        } message: {
            Text(viewModel.errorMessage)
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
    
    var header: some View {
        HStack {
            Spacer()
            Text("DYNAMOX QUIZ!")
                .font(.system(size: 16, weight: .heavy, design: .rounded))
                .foregroundStyle(QuizColors.magenta)
                .tracking(1.2)
            Spacer()
        }
    }

    var progressBar: some View {
        VStack(spacing: 10) {
            HStack {
                Text(viewModel.questionHeaderText)
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundStyle(.white.opacity(0.60))
                Spacer()
                Text(viewModel.progressPercentText)
                    .font(.system(size: 16, weight: .heavy, design: .rounded))
                    .foregroundStyle(QuizColors.magenta)
            }
            
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(Color.white.opacity(0.12))
                    .frame(height: 0)
                Capsule()
                    .fill(QuizColors.magenta)
                    .frame(width: max(12, progressWidth), height: 8)
                    .animation(
                        .spring(
                            response: 0.35,
                            dampingFraction: 0.85
                        ),
                        value: viewModel.questionIndex
                    )
            }
        }
    }

    var progressWidth: CGFloat {
        let screenWidth = UIScreen.current?.bounds.width ?? 0
        let full = screenWidth - 36
        return full * CGFloat(viewModel.progressFraction)
    }

    @ViewBuilder
    var content: some View {
        if let question  = viewModel.currentQuestion {
            VStack(spacing: 22) {
                Text(question.statement)
                    .lineLimit(nil)
                    .font(.system(size: 34, weight: .heavy, design: .rounded))
                    .foregroundStyle(.white.opacity(0.92))
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
                    .minimumScaleFactor(0.7)
                    .padding(.horizontal, 6)
                    .padding(.top, 6)
                
                VStack(spacing: 14) {
                    ForEach(
                        Array(
                            question.options.enumerated()
                        ),
                        id: \.offset
                    ) { index, option in
                        OptionRow(
                            index: index,
                            text: option,
                            isSelected: viewModel.selectedIndex == index
                        ) {
                            viewModel.selectOption(index: index)
                        }
                    }
                }
                .padding(.top, 6)
            }
        }
    }

    var bottomButton: some View {
        Button {
            viewModel.submit()
        } label: {
            HStack {
                Text("Responder")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                Image(systemName: "arrow.right")
                    .font(.system(size: 18, weight: .bold))
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
            .opacity(viewModel.canSubmit ? 1.0 : 0.45)
        }
        .buttonStyle(.plain)
        .disabled(!viewModel.canSubmit)
    }
}
