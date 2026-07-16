//
//  URLSessionNetworkClient.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

public final class URLSessionNetworkClient: NetworkClient {
    public typealias DecoderFactory = () -> JSONDecoder

    private let configuration: NetworkConfiguration
    private let session: URLSession
    private let decoderFactory: DecoderFactory

    public init(
        configuration: NetworkConfiguration,
        session: URLSession = .shared,
        decoderFactory: @escaping DecoderFactory = {
            JSONDecoder()
        }
    ) {
        self.configuration = configuration
        self.session = session
        self.decoderFactory = decoderFactory
    }

    public func send<Response: Decodable>(
        _ request: NetworkRequest,
        as responseType: Response.Type
    ) async throws -> Response {
        let data = try await execute(request)

        do {
            let decoder = decoderFactory()

            return try decoder.decode(
                responseType,
                from: data
            )
        } catch {
            throw NetworkError.decodingFailure(
                underlyingError: error,
                data: data
            )
        }
    }

    public func send(
        _ request: NetworkRequest
    ) async throws {
        _ = try await execute(request)
    }
}

private extension URLSessionNetworkClient {
    func execute(
        _ request: NetworkRequest
    ) async throws -> Data {
        let urlRequest = try makeURLRequest(
            from: request
        )

        let data: Data
        let response: URLResponse

        do {
            (data, response) = try await session.data(
                for: urlRequest
            )
        } catch {
            throw NetworkError.transportFailure(
                underlyingError: error
            )
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }

        guard configuration.validStatusCodes.contains(
            httpResponse.statusCode
        ) else {
            throw NetworkError.unacceptableStatusCode(
                statusCode: httpResponse.statusCode,
                data: data
            )
        }

        return data
    }

    func makeURLRequest(
        from request: NetworkRequest
    ) throws -> URLRequest {
        let url = try makeURL(
            path: request.path,
            queryItems: request.queryItems
        )

        var urlRequest = URLRequest(
            url: url,
            timeoutInterval: request.timeoutInterval
                ?? configuration.timeoutInterval
        )

        urlRequest.httpMethod = request.method.rawValue
        urlRequest.httpBody = request.body

        applyHeaders(
            configuration.defaultHeaders,
            to: &urlRequest
        )

        applyHeaders(
            request.headers,
            to: &urlRequest
        )

        return urlRequest
    }

    func makeURL(
        path: String,
        queryItems: [URLQueryItem]
    ) throws -> URL {
        let normalizedPath = path.trimmingCharacters(
            in: CharacterSet(charactersIn: "/")
        )

        let requestURL: URL

        if normalizedPath.isEmpty {
            requestURL = configuration.baseURL
        } else {
            requestURL = configuration.baseURL
                .appendingPathComponent(normalizedPath)
        }

        guard var components = URLComponents(
            url: requestURL,
            resolvingAgainstBaseURL: false
        ) else {
            throw NetworkError.invalidURL
        }

        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }

        guard let finalURL = components.url else {
            throw NetworkError.invalidURL
        }

        return finalURL
    }

    func applyHeaders(
        _ headers: [String: String],
        to request: inout URLRequest
    ) {
        headers.forEach { key, value in
            request.setValue(
                value,
                forHTTPHeaderField: key
            )
        }
    }
}
