//
//  QuizRouter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

@MainActor
protocol QuizRouting: AnyObject {
    func close()
    func didSelectAnswer(_ option: QuizOption)
}

@MainActor
final class QuizRouter: QuizRouting {

    init() {}

    func close() {
        print("fechar")
    }

    func didSelectAnswer( _ option: QuizOption) {
        print(option)
    }
}
