//
//  QuizQuestion.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 13/07/26.
//

import Foundation

struct QuizOption: Identifiable, Equatable {
    let id: UUID
    let title: String

    init(
        id: UUID = UUID(),
        title: String
    ) {
        self.id = id
        self.title = title
    }
}

struct QuizQuestion: Identifiable, Equatable {
    let id: String
    let number: Int
    let title: String
    let imageName: String?
    let options: [QuizOption]
}
