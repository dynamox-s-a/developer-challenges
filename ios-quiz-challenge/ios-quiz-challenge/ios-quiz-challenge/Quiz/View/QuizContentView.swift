//
//  QuizContentView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 13/07/26.
//

import SwiftUI

struct QuizContentView: View {
    let question: QuizQuestion
    let totalQuestions: Int

    @Binding var selectedOptionID: QuizOption.ID?

    let answerResult: Bool?
    let isAnswering: Bool

    let onAnswer: (QuizOption) -> Void

    @State private var showProgress = false
    @State private var showQuestion = false
    @State private var showPinkShadow = false
    @State private var showPurpleCard = false
    @State private var visibleOptionCount = 0

    var body: some View {
        GeometryReader { geometry in
            ScrollView(showsIndicators: false) {
                VStack(spacing: .zero) {
                    Spacer(minLength: 16)

                    progressView
                        .padding(.top, 8)

                    Spacer(minLength: 32)

                    questionView
                        .padding(.top, 14)

                    Spacer(minLength: 48)

                    optionsPanel
                        .padding(.top, 15)
                        .padding(.horizontal, 18)

                    Spacer(minLength: 115)
                }
                .frame(
                    maxWidth: .infinity,
                    minHeight: geometry.size.height
                )
            }
        }
        .task(id: question.id) {
            await runEntranceAnimation()
        }
    }
}

// MARK: - Content

private extension QuizContentView {
    var progressView: some View {
        Text("\(question.number)/\(totalQuestions)")
            .font(
                .system(
                    size: 17,
                    weight: .medium
                )
            )
            .foregroundStyle(.black)
            .opacity(showProgress ? 1 : .zero)
            .scaleEffect(showProgress ? 1 : 0.9)
    }

    var questionView: some View {
        Text(question.title)
            .font(
                .system(
                    size: 19,
                    weight: .semibold
                )
            )
            .foregroundStyle(.black)
            .multilineTextAlignment(.center)
            .padding(.horizontal, 24)
            .opacity(showQuestion ? 1 : .zero)
            .offset(
                x: showQuestion ? .zero : 180
            )
    }

    var optionsPanel: some View {
        QuizOptionsPanel(
            options: question.options,
            selectedOptionID: $selectedOptionID,
            answerResult: answerResult,
            isAnswering: isAnswering,
            showPinkShadow: showPinkShadow,
            showPurpleCard: showPurpleCard,
            visibleOptionCount: visibleOptionCount,
            onAnswer: onAnswer
        )
    }
}

// MARK: - Entrance animation

private extension QuizContentView {
    @MainActor
    func runEntranceAnimation() async {
        resetAnimation()

        do {
            try await wait(milliseconds: 100)

            withAnimation(
                .easeOut(duration: 0.22)
            ) {
                showProgress = true
            }

            try await wait(milliseconds: 100)

            withAnimation(
                .spring(
                    response: 0.52,
                    dampingFraction: 0.76,
                    blendDuration: .zero
                )
            ) {
                showQuestion = true
            }

            try await wait(milliseconds: 160)

            withAnimation(
                .spring(
                    response: 0.62,
                    dampingFraction: 0.78,
                    blendDuration: .zero
                )
            ) {
                showPinkShadow = true
            }

            try await wait(milliseconds: 70)

            withAnimation(
                .spring(
                    response: 0.62,
                    dampingFraction: 0.78,
                    blendDuration: .zero
                )
            ) {
                showPurpleCard = true
            }

            try await wait(milliseconds: 210)

            for index in question.options.indices {
                try Task.checkCancellation()

                withAnimation(
                    .interpolatingSpring(
                        mass: 0.58,
                        stiffness: 290,
                        damping: 15,
                        initialVelocity: 0.8
                    )
                ) {
                    visibleOptionCount = index + 1
                }

                try await wait(milliseconds: 105)
            }
        } catch is CancellationError {
            assertionFailure(
                "Unexpected error"
            )
        } catch {
            assertionFailure(
                "Unexpected quiz animation error: \(error)"
            )
        }
    }

    @MainActor
    func resetAnimation() {
        var transaction = Transaction()
        transaction.disablesAnimations = true

        withTransaction(transaction) {
            showProgress = false
            showQuestion = false
            showPinkShadow = false
            showPurpleCard = false
            visibleOptionCount = .zero
            selectedOptionID = nil
        }
    }

    func wait(
        milliseconds: UInt64
    ) async throws {
        try await Task.sleep(
            nanoseconds: milliseconds * 1_000_000
        )
    }
}
