//
//  QuizFixedHeader.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 13/07/26.
//

import SwiftUI

struct QuizFixedHeader: View {
    let score: Int
    let remainingSeconds: Int
    let onClose: () -> Void

    var body: some View {
        VStack(spacing: 14) {
            HStack {
                Button(action: onClose) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(.black)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Fechar quiz")

                Spacer()

                Text("Score : \(score)")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.black)
            }

            QuizTimerBar(remainingSeconds: remainingSeconds)
        }
        .padding(.horizontal, 20)
        .padding(.top, 8)
        .padding(.bottom, 12)
        .background(Color.white)
    }
}

struct QuizTimerBar: View {
    let remainingSeconds: Int

    var body: some View {
        ZStack {
            RoundedRectangle(
                cornerRadius: 15,
                style: .continuous
            )
            .fill(Color.black)
            .offset(y: 4)

            RoundedRectangle(
                cornerRadius: 15,
                style: .continuous
            )
            .fill(Color.white)
            .overlay {
                RoundedRectangle(
                    cornerRadius: 15,
                    style: .continuous
                )
                .stroke(Color.black, lineWidth: 2)
            }

            RoundedRectangle(
                cornerRadius: 11,
                style: .continuous
            )
            .fill(Color.black)
            .padding(4)

            HStack {
                Text("\(remainingSeconds) Sec")
                    .font(.system(size: 13, weight: .bold))

                Spacer()

                Image(systemName: "timer")
                    .font(.system(size: 16, weight: .semibold))
            }
            .foregroundColor(.white)
            .padding(.horizontal, 14)
        }
        .frame(height: 42)
        .padding(.bottom, 4)
    }
}
