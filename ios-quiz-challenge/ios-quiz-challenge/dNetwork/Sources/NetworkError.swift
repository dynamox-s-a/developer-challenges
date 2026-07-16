//
//  NetworkError.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

public enum NetworkError: Error {
    case invalidURL
    case transportFailure(underlyingError: Error)
    case invalidResponse
    case unacceptableStatusCode(
        statusCode: Int,
        data: Data
    )
    case decodingFailure(
        underlyingError: Error,
        data: Data
    )
}

extension NetworkError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Não foi possível construir a URL da requisição."

        case let .transportFailure(error):
            return "A requisição falhou: \(error.localizedDescription)"

        case .invalidResponse:
            return "A resposta recebida não é uma resposta HTTP válida."

        case let .unacceptableStatusCode(statusCode, _):
            return "O servidor respondeu com o status HTTP \(statusCode)."

        case let .decodingFailure(error, _):
            return "Não foi possível decodificar a resposta: \(error.localizedDescription)"
        }
    }
}
