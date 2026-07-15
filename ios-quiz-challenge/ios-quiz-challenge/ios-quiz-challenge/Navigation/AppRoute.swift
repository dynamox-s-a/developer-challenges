//
//  AppRoute.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

enum AppRoute: Hashable {
    case quiz(nickname: String)
    case ranking(nickname: String)
}
