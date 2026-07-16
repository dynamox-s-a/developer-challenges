//
//  RankingPresenter.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation

@MainActor
protocol RankingPresenting: AnyObject {
    func presentLoading()
    func present(scores: [PlayerScore])
}

@MainActor
final class RankingPresenter: RankingPresenting {
    private weak var view: RankingDisplaying?

    init(view: RankingDisplaying) {
        self.view = view
    }

    func presentLoading() {
        view?.displayLoading()
    }

    func present(scores: [PlayerScore]) {
        view?.display(scores: scores)
    }
}
