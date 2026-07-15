//
//  NetworkClient.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

public protocol NetworkClient {
    func send<Response: Decodable>(
        _ request: NetworkRequest,
        as responseType: Response.Type
    ) async throws -> Response

    func send(
        _ request: NetworkRequest
    ) async throws
}
