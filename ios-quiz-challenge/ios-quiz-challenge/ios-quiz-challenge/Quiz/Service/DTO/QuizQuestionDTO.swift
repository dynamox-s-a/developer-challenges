//
//  QuizQuestionDTO.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

struct QuizQuestionDTO: Decodable, Equatable, Sendable {
    let id: String
    let statement: String
    let options: [String]
}
