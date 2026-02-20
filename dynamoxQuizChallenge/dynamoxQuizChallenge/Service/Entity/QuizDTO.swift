//
//  QuizDTO.swift
//  dynamoxQuizzChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation

struct QuizDTO: Codable, Identifiable {
    let id: String
    let statement: String
    let options: [String]
}
