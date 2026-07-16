//
//  QuizFlowHeader.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import SwiftUI

struct QuizFlowHeader: View {
    let title: String
    let detail: String
    let isCloseEnabled: Bool
    let onClose: () -> Void

    init(
        title: String,
        detail: String,
        isCloseEnabled: Bool = true,
        onClose: @escaping () -> Void
    ) {
        self.title = title
        self.detail = detail
        self.isCloseEnabled = isCloseEnabled
        self.onClose = onClose
    }

    var body: some View {
        HStack(spacing: 12) {
            Button(action: onClose) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(.black)
            }
            .buttonStyle(.plain)
            .disabled(!isCloseEnabled)
            .accessibilityLabel("Fechar")

            Text(title)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.black)

            Spacer()

            Text(detail)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.black)
                .lineLimit(1)
                .minimumScaleFactor(0.72)
        }
        .padding(.horizontal, 20)
        .padding(.top, 8)
        .padding(.bottom, 12)
        .background(Color.white)
    }
}
