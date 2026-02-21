//
//  LoadingOverlay.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import SwiftUI

struct LoadingOverlay: View {
    var body: some View {
        ZStack {
            Color.black.opacity(0.35).ignoresSafeArea()
            VStack(spacing: 12) {
                ProgressView().tint(.white)
                Text("Carregando...")
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
                    .foregroundStyle(.white.opacity(0.85))
            }
            .padding(.horizontal, 22)
            .padding(.vertical, 18)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color.white.opacity(0.10))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(Color.white.opacity(0.10), lineWidth: 1)
            )
        }
        .transition(.opacity)
    }
}
