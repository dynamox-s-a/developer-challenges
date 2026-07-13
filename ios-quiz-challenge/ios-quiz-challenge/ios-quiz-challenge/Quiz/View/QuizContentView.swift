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

    let onAnswer: (QuizOption) -> Void

    @State private var showProgress = false
    @State private var showQuestion = false
    @State private var showImage = false
    @State private var showPinkShadow = false
    @State private var showPurpleCard = false
    @State private var visibleOptionCount = 0

    var body: some View {
        GeometryReader { geometry in
            ScrollView(showsIndicators: false) {
                ZStack(alignment: .bottom) {
                    VStack(spacing: 0) {
                        Spacer(minLength: 16)
                        
                        progressView
                            .padding(.top, 8)
                        
                        Spacer(minLength: 32)
                        
                        questionView
                            .padding(.top, 14)
                        
                        Spacer(minLength: 48)
                        
                        QuizOptionsPanel(
                            options: question.options,
                            selectedOptionID: $selectedOptionID,
                            showPinkShadow: showPinkShadow,
                            showPurpleCard: showPurpleCard,
                            visibleOptionCount: visibleOptionCount,
                            onAnswer: onAnswer
                        )
                        .padding(.top, 15)
                        .padding(.horizontal, 18)

                        Spacer(minLength: 115)
                    }
                    .frame(
                        maxWidth: .infinity
                    )
                }
            }
        }
        .task(id: question.id) {
            await runEntranceAnimation()
        }
    }

    private var progressView: some View {
        Text("\(question.number)/\(totalQuestions)")
            .font(.system(size: 17, weight: .medium))
            .foregroundColor(.black)
            .opacity(showProgress ? 1 : 0)
            .scaleEffect(showProgress ? 1 : 0.9)
    }

    private var questionView: some View {
        Text(question.title)
            .font(.system(size: 19, weight: .semibold))
            .foregroundColor(.black)
            .multilineTextAlignment(.center)
            .padding(.horizontal, 24)
            .opacity(showQuestion ? 1 : 0)
            .offset(x: showQuestion ? 0 : 180)
    }

    @MainActor
    private func runEntranceAnimation() async {
        resetAnimation()

        await sleep(milliseconds: 100)

        withAnimation(.easeOut(duration: 0.22)) {
            showProgress = true
        }

        await sleep(milliseconds: 100)

        withAnimation(
            .spring(
                response: 0.52,
                dampingFraction: 0.76,
                blendDuration: 0
            )
        ) {
            showQuestion = true
        }

        await sleep(milliseconds: 170)

        withAnimation(
            .spring(
                response: 0.45,
                dampingFraction: 0.67,
                blendDuration: 0
            )
        ) {
            showImage = true
        }

        await sleep(milliseconds: 160)

        withAnimation(
            .spring(
                response: 0.62,
                dampingFraction: 0.78,
                blendDuration: 0
            )
        ) {
            showPinkShadow = true
        }

        await sleep(milliseconds: 70)

        withAnimation(
            .spring(
                response: 0.62,
                dampingFraction: 0.78,
                blendDuration: 0
            )
        ) {
            showPurpleCard = true
        }

        await sleep(milliseconds: 210)

        for index in question.options.indices {
            guard !Task.isCancelled else {
                return
            }

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

            await sleep(milliseconds: 105)
        }
    }

    @MainActor
    private func resetAnimation() {
        var transaction = Transaction()
        transaction.disablesAnimations = true

        withTransaction(transaction) {
            showProgress = false
            showQuestion = false
            showImage = false
            showPinkShadow = false
            showPurpleCard = false
            visibleOptionCount = 0
            selectedOptionID = nil
        }
    }

    private func sleep(milliseconds: UInt64) async {
        try? await Task.sleep(
            nanoseconds: milliseconds * 1_000_000
        )
    }
}
