//
//  APIService.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import Foundation
import Alamofire

struct APIService: APIServiceDelegate {
    private let baseURL = "https://quiz-api-bwi5hjqyaq-uc.a.run.app"

    nonisolated func fetchRandomQuestion() async throws -> Question {
//        let url = "\(baseURL)/question"
        let url = String(format: "%@/question", baseURL)

        return try await AF.request(url)
            .validate()
            .serializingDecodable(Question.self)
            .value
    }

    nonisolated func validateAnswer(questionId: String, answer: String) async throws -> Bool {
        let url = "\(baseURL)/answer?questionId=\(questionId)"

        let parameters: [String: String] = [
            "questionId": questionId,
            "answer": answer
        ]

        let response = try await AF.request(
            url,
            method: .post,
            parameters: parameters,
            encoder: JSONParameterEncoder.default
        )
        .validate()
        .serializingDecodable(AnswerResponse.self)
        .value

        return response.result
    }
}

