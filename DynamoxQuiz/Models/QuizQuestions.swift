//
//  QuestionModels.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//
import Foundation

nonisolated struct Question: Decodable, Sendable {
    let id: String
    let statement: String
    let options: [String]
    

}

nonisolated struct AnswerResponse: Decodable, @unchecked Sendable {
    let result: Bool
}
