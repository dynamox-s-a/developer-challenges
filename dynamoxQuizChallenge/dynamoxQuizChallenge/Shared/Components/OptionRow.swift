//
//  OptionRow.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//


import SwiftUI

struct OptionRow: View {
    let index: Int
    let text: String
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button {
            withAnimation(.spring(response: 0.25, dampingFraction: 0.8)) {
                onTap()
            }
        } label: {
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .stroke(isSelected ? QuizColors.magenta : QuizColors.magenta.opacity(0.25), lineWidth: 2)
                        .frame(width: 44, height: 44)

                    if isSelected {
                        Circle()
                            .fill(QuizColors.magenta)
                            .frame(width: 44, height: 44)
                    }

                    Text(String(index+1))
                        .font(.system(size: 18, weight: .heavy, design: .rounded))
                        .foregroundStyle(isSelected ? .white : QuizColors.magenta)
                }

                Text(text)
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                    .foregroundStyle(.white.opacity(0.90))
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
                    .fixedSize(horizontal: false, vertical: true)

                Spacer()
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 18)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color.white.opacity(0.06))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(isSelected ? QuizColors.magenta : Color.white.opacity(0.06), lineWidth: 2)
            )
        }
        .buttonStyle(.plain)
    }
}
