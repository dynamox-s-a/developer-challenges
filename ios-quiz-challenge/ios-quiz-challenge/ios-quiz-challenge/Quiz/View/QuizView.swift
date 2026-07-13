//
//  QuizView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 12/07/26.
//

import DynaUI
import SwiftUI

// WIP
enum QuizPalette {
    static let purple = Color(
        red: 0.42,
        green: 0.20,
        blue: 1
    )

    static let pink = Color(
        red: 1,
        green: 0.23,
        blue: 0.52
    )
}

struct QuizView: View {
    let question: QuizQuestion
    let totalQuestions: Int
    let score: Int
    let remainingSeconds: Int

    let onClose: () -> Void
    let onAnswer: (QuizOption) -> Void

    @State private var selectedOptionID: QuizOption.ID?

    var body: some View {
        ZStack {

            VStack(spacing: .zero) {
                QuizFixedHeader(
                    score: score,
                    remainingSeconds: remainingSeconds,
                    onClose: onClose
                )

                QuizContentView(
                    question: question,
                    totalQuestions: totalQuestions,
                    selectedOptionID: $selectedOptionID,
                    onAnswer: onAnswer
                )
            }
        }
        .preferredColorScheme(.light)
    }
}

#Preview {
    QuizView(
        question: .init(
            number: 1,
            title: "Quem é o cachorro da tropa",
            imageName: "",
            options: [
                .init(title: "Husky"),
                .init(title: "Pitbull"),
                .init(title: "Shiba Inu"),
                .init(title: "Golden Retriever"),
                .init(title: "Poodle")
            ]
        ),
        totalQuestions: 1,
        score: 0,
        remainingSeconds: 60
    ) {
        
    } onAnswer: { option in
        
    }
}
