//
//  LoadCurrentNicknameUseCase.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

protocol LoadCurrentNicknameUseCaseProtocol {
    func execute() async -> String?
}

final class LoadCurrentNicknameUseCase: LoadCurrentNicknameUseCaseProtocol {

    private let repository: PlayerRepository

    init(
        repository: PlayerRepository
    ) {
        self.repository = repository
    }

    func execute() async -> String? {
        await repository.currentNickname()
    }
}
