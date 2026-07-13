//
//  QuizQuestion.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 13/07/26.
//

import Foundation

struct QuizQuestion: Identifiable, Equatable {
    let id: UUID
    let number: Int
    let title: String
    let imageName: String
    let options: [QuizOption]

    init(
        id: UUID = UUID(),
        number: Int,
        title: String,
        imageName: String,
        options: [QuizOption]
    ) {
        self.id = id
        self.number = number
        self.title = title
        self.imageName = imageName
        self.options = options
    }
}

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
