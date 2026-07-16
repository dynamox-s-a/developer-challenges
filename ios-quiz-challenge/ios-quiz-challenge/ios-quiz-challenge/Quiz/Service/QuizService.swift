//
//  QuizService.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import dDependencies
import dNetwork

protocol QuizServiceProtocol {
    func fetchQuestion() async throws -> QuizQuestionDTO
    func answerQuestion(
        questionID: String,
        answer: String
    ) async throws -> AnswerQuizQuestionResponseDTO
}

final class QuizService: QuizServiceProtocol {
    
    private let networkClient: NetworkClient
    private let encoder: JSONEncoder
    
    init(
        networkClient: NetworkClient,
        encoder: JSONEncoder = JSONEncoder()
    ) {
        self.networkClient = networkClient
        self.encoder = encoder
    }
    
    func fetchQuestion() async throws -> QuizQuestionDTO {
        let request = NetworkRequest(
            path: "question",
            method: .get
        )
        
        return try await networkClient.send(
            request,
            as: QuizQuestionDTO.self
        )
    }
    
    func answerQuestion(
        questionID: String,
        answer: String
    ) async throws -> AnswerQuizQuestionResponseDTO {
        let body = try encoder.encode(
            AnswerQuizQuestionRequestDTO(
                answer: answer
            )
        )
        
        let request = NetworkRequest(
            path: "answer",
            method: .post,
            queryItems: [
                URLQueryItem(
                    name: "questionId",
                    value: questionID
                )
            ],
            body: body
        )
        
        return try await networkClient.send(
            request,
            as: AnswerQuizQuestionResponseDTO.self
        )
    }
}
