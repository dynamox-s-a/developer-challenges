//
//  AnswerQuizQuestionDTO.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

struct AnswerQuizQuestionRequestDTO: Encodable {
    let answer: String
}

struct AnswerQuizQuestionResponseDTO: Decodable, Equatable, Sendable {
    let result: Bool
}
