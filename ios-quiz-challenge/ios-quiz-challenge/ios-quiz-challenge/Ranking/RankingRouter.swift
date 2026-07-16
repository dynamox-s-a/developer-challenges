//
//  RankingRouter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

@MainActor
protocol RankingRouting: AnyObject {
    func close()
}

@MainActor
final class RankingRouter: RankingRouting {
    private let onClose: () -> Void

    init(onClose: @escaping () -> Void) {
        self.onClose = onClose
    }

    func close() {
        onClose()
    }
}
