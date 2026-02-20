//
//  URLSessionNetworkClient.swift
//  dynamoxQuizzChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation

protocol NetworkClientProtocol {
    var baseURL: URL { get }
    
    func fetchData(_ endpoint: Endpoint) async throws -> Data
    func requestDecodable<T: Decodable>(_ endpoint: Endpoint) async throws -> T
}

final class URLURLSessionNetworkClient: NetworkClientProtocol {
    private let session: URLSession
    let baseURL: URL
    
    init(baseURL: URL = URL(string: "https://quiz-api-bwi5hjqyaq-uc.a.run.app")!, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    func fetchData(_ endpoint: Endpoint) async throws -> Data {
        let request = try requestWith(endpoint)
        do {
            let (data, response) = try await session.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw NetworkError.invalidResponse
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                throw NetworkError.httpStatus(code: httpResponse.statusCode, data: data)
            }
            
            return data
        } catch let urlError as URLError {
            throw NetworkError.transportError(urlError)
        }
    }

    func requestDecodable<T: Decodable>(
        _ endpoint: Endpoint
    ) async throws -> T {
        let data = try await fetchData(endpoint)
        do {
            let decoder = JSONDecoder()
            return try decoder.decode(T.self, from: data)
        } catch {
            throw NetworkError.unableToDecode(error)
        }
    }

    private func requestWith(_ endpoint: Endpoint) throws -> URLRequest {
        guard var urlComponents = URLComponents(
            url: baseURL.appendingPathComponent(endpoint.path),
            resolvingAgainstBaseURL: false) else {
            throw NetworkError.invalidURL
        }

        if let querys = endpoint.queryItems, !querys.isEmpty {
            urlComponents.queryItems = endpoint.queryItems
        }

        guard let url = urlComponents.url else {
            throw NetworkError.invalidURL
        }
    
        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        if let body = endpoint.body {
            request.httpBody = body
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        return request
    }
}
