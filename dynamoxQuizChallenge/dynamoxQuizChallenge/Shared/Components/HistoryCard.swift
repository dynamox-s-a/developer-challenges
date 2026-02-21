//
//  HistoryCard.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import SwiftUI

struct HistoryCard: View {
    let name: String
    let date: String
    let score: String

    var body: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 6) {
                Text(name)
                    .font(.system(size: 20, weight: .heavy, design: .rounded))
                    .foregroundStyle(.white.opacity(0.92))
                    .lineLimit(1)

                Text(date)
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundStyle(.white.opacity(0.45))
            }

            Spacer()

            Text(score)
                .font(.system(size: 20, weight: .heavy, design: .rounded))
                .foregroundStyle(QuizColors.magenta)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 18)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.06))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Color.white.opacity(0.06), lineWidth: 1)
        )
    }
}
