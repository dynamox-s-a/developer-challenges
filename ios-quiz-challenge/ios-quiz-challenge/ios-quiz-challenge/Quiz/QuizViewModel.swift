//
//  QuizViewModel.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation
import Combine

final class QuizViewModel: ObservableObject {

    enum State: Equatable {
        case idle
        case loading
        case loaded(QuizQuestionDTO)
        case error(String)
    }

    @Published private(set) var state: State = .idle

    private let service: QuizServiceProtocol

    init(
        service: QuizServiceProtocol
    ) {
        self.service = service
    }

    func load() async {
        guard state != .loading else {
            return
        }

        state = .loading

        do {
            let dto = try await service.fetchQuestion()
            state = .loaded(dto)
        } catch {
            state = .error(error.localizedDescription)
        }
    }

    func retry() async {
        state = .idle
        await load()
    }
}
