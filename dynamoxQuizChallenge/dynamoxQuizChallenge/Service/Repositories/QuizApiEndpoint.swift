//
//  QuizApiEndpoint.swift
//  dynamoxQuizzChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation

enum QuizApiEndpoint {
    static func question() -> Endpoint {
        Endpoint(path: "question", method: .get, headers: [:])
    }

    static func answer(questionId: String, answer body: Data) -> Endpoint {
        Endpoint(
            path: "answer",
            method: .post,
            queryItems: [URLQueryItem(name: "questionId", value: questionId)],
            headers: [:],
            body: body)
    }
}
