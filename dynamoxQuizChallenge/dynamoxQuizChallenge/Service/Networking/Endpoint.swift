//
//  Endpoint.swift
//  dynamoxQuizzChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import Foundation

struct Endpoint {
    var path: String
    var method: HTTPMethod
    var queryItems: [URLQueryItem]?
    var headers: [String: String] = [:]
    var body: Data? = nil
    
    init(
        path: String,
        method: HTTPMethod,
        queryItems: [URLQueryItem]? = nil,
        headers: [String : String],
        body: Data? = nil
    ) {
        self.path = path
        self.method = method
        self.queryItems = queryItems
        self.headers = headers
        self.body = body
    }
}
