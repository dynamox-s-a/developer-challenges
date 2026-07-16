//
//  NetworkConfiguration.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

public struct NetworkConfiguration: Sendable {
    public let baseURL: URL
    public let defaultHeaders: [String: String]
    public let timeoutInterval: TimeInterval
    public let validStatusCodes: Range<Int>

    public init(
        baseURL: URL,
        defaultHeaders: [String: String] = [
            "Accept": "application/json"
        ],
        timeoutInterval: TimeInterval = 60,
        validStatusCodes: Range<Int> = 200..<300
    ) {
        self.baseURL = baseURL
        self.defaultHeaders = defaultHeaders
        self.timeoutInterval = timeoutInterval
        self.validStatusCodes = validStatusCodes
    }
}
