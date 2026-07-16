//
//  SaveCurrentNicknameUseCase.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

enum NicknameValidationError: LocalizedError {
    case empty

    var errorDescription: String? {
        switch self {
        case .empty:
            return "Digite um nick para continuar."
        }
    }
}

protocol SaveCurrentNicknameUseCaseProtocol {
    func execute(
        nickname: String
    ) async throws -> String
}

final class SaveCurrentNicknameUseCase: SaveCurrentNicknameUseCaseProtocol {

    private let repository: PlayerRepository

    init(
        repository: PlayerRepository
    ) {
        self.repository = repository
    }

    func execute(
        nickname: String
    ) async throws -> String {
        let normalizedNickname = nickname.trimmingCharacters(
            in: .whitespacesAndNewlines
        )

        guard !normalizedNickname.isEmpty else {
            throw NicknameValidationError.empty
        }

        await repository.setCurrentNickname(
            normalizedNickname
        )

        return normalizedNickname
    }
}
