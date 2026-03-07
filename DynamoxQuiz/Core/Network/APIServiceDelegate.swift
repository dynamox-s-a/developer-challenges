//
//  APIServiceDelegate.swift
//  DynamoxQuiz
//
//  Created by Mateus on 07/03/26.
//

protocol APIServiceDelegate {
    func fetchRandomQuestion() async throws -> Question
    func validateAnswer(questionId: String, answer: String) async throws -> Bool
}
