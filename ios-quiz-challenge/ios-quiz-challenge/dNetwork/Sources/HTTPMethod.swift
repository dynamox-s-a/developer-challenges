//
//  HTTPMethod.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

public enum HTTPMethod: String, Sendable {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
    case head = "HEAD"
}
