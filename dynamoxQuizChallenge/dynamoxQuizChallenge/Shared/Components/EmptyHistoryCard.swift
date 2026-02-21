//
//  EmptyHistoryCard.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import SwiftUI

struct EmptyHistoryCard: View {
    var body: some View {
        VStack(spacing: 8) {
            Text("Sem histórico ainda")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(.white.opacity(0.80))
            Text("Jogue um quiz para ver suas jogadas anteriores aqui.")
                .font(.system(size: 14, weight: .medium, design: .rounded))
                .foregroundStyle(.white.opacity(0.45))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 22)
        .padding(.horizontal, 18)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.04))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Color.white.opacity(0.06), lineWidth: 1)
        )
    }
}
