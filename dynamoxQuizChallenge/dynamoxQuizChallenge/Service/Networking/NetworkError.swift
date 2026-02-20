//
//  NetworkError.swift
//  dynamoxQuizzChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation

enum NetworkError: Error {
    case noDataAvailable
    case unableToDecode(Error)
    case unableToEncode(Error)
    case invalidURL
    case httpStatus(code: Int, data: Data?)
    case invalidResponse
    case transportError(Error)

    var debugDescription: String {
        switch self {
        case .noDataAvailable:
            return "No data was returned from the network request"
        case .unableToDecode(let error):
            return "Failed to decode JSON: \(error.localizedDescription)"
        case .unableToEncode(let error):
            return "Failed to encode JSON: \(error.localizedDescription)"
        case .invalidURL:
            return "The URL was malformed"
        case .httpStatus(let code, _):
            return "Http status code: \(code)"
        case .invalidResponse:
            return "Response is invalid"
        case .transportError(let error):
            return "An unknown error occurred. Please try again. \(error.localizedDescription)"
        }
    }
}
