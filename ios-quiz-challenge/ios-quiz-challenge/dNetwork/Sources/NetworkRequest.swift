//
//  NetworkRequest.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

public struct NetworkRequest: Sendable {
    public let path: String
    public let method: HTTPMethod
    public let queryItems: [URLQueryItem]
    public let headers: [String: String]
    public let body: Data?
    public let timeoutInterval: TimeInterval?

    public init(
        path: String,
        method: HTTPMethod = .get,
        queryItems: [URLQueryItem] = [],
        headers: [String: String] = [:],
        body: Data? = nil,
        timeoutInterval: TimeInterval? = nil
    ) {
        self.path = path
        self.method = method
        self.queryItems = queryItems
        self.headers = headers
        self.body = body
        self.timeoutInterval = timeoutInterval
    }
}
