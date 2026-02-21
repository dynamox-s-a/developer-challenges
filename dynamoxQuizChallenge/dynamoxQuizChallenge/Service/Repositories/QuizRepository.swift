//
//  QuizRepository.swift
//  dynamoxQuizzChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation

protocol QuizRepositoryProtocol {
    func fetchQuiz() async throws -> QuizDTO
    func submitAnswer(_ questionId: String, answer: String) async throws -> AnswerResponseDTO
}

final class QuizRepository: QuizRepositoryProtocol {
    private let apiClient: NetworkClientProtocol
    private let encoder: JSONEncoder
    private let decoder: JSONDecoder
    
    init(
        apiClient: NetworkClientProtocol,
        encoder: JSONEncoder = .init(),
        decoder: JSONDecoder = .init()
    ) {
        self.apiClient = apiClient
        self.decoder = decoder
        self.encoder = encoder
    }
    
    
    func fetchQuiz() async throws -> QuizDTO {
        let endpoint = QuizApiEndpoint.question()
        
        do {
            return try await apiClient.requestDecodable(endpoint)
        } catch let error as NetworkError {
            throw error
        }
    }
    
    func submitAnswer(_ questionId: String, answer: String) async throws -> AnswerResponseDTO {
        do {
            let payload = AnswerDTO(answer: answer)
            let body = try encoder.encode(payload)
            let endpoint = QuizApiEndpoint.answer(questionId: questionId, answer: body)

            return try await apiClient.requestDecodable(endpoint)
        }
    }
}
