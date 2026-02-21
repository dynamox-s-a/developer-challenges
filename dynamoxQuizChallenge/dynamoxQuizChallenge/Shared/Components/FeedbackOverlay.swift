//
//  FeedbackOverlay.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import SwiftUI

struct FeedbackOverlay: View {
    let isCorrect: Bool

    var body: some View {
        VStack {
            Spacer().frame(height: 90)

            HStack(spacing: 10) {
                Image(systemName: isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .font(.system(size: 18, weight: .bold))
                Text(isCorrect ? "Resposta correta!" : "Resposta incorreta!")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
            }
            .foregroundStyle(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(
                Capsule()
                    .fill(isCorrect ? Color.green.opacity(0.85) : Color.red.opacity(0.85))
            )
            .shadow(color: .black.opacity(0.25), radius: 18, x: 0, y: 10)

            Spacer()
        }
        .transition(.move(edge: .top).combined(with: .opacity))
        .animation(.spring(response: 0.35, dampingFraction: 0.85), value: isCorrect)
    }
}
