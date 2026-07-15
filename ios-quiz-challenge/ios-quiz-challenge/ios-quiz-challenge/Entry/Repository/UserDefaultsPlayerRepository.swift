//
//  UserDefaultsPlayerRepository.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

actor UserDefaultsPlayerRepository: PlayerRepository {

    private enum Keys {
        static let currentNickname = "quiz.currentNickname"
        static let scores = "quiz.playerScores"
    }

    private let userDefaults: UserDefaults
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    init(
        userDefaults: UserDefaults = .standard
    ) {
        self.userDefaults = userDefaults
    }

    func setCurrentNickname(
        _ nickname: String
    ) async {
        userDefaults.set(
            nickname,
            forKey: Keys.currentNickname
        )
    }

    func currentNickname() async -> String? {
        userDefaults.string(
            forKey: Keys.currentNickname
        )
    }

    func save(
        score: Int,
        for nickname: String
    ) async throws {
        let normalizedNickname = nickname.trimmingCharacters(
            in: .whitespacesAndNewlines
        )

        var scores = storedScores()

        if let index = scores.firstIndex(
            where: {
                $0.nickname.compare(
                    normalizedNickname,
                    options: .caseInsensitive
                ) == .orderedSame
            }
        ) {
            let currentScore = scores[index].score

            scores[index] = PlayerScore(
                nickname: normalizedNickname,
                score: max(currentScore, score)
            )
        } else {
            scores.append(
                PlayerScore(
                    nickname: normalizedNickname,
                    score: score
                )
            )
        }

        let data = try encoder.encode(scores)

        userDefaults.set(
            data,
            forKey: Keys.scores
        )
    }

    func ranking() async -> [PlayerScore] {
        storedScores()
            .sorted {
                if $0.score == $1.score {
                    return $0.nickname.localizedCaseInsensitiveCompare(
                        $1.nickname
                    ) == .orderedAscending
                }

                return $0.score > $1.score
            }
    }
}

private extension UserDefaultsPlayerRepository {

    func storedScores() -> [PlayerScore] {
        guard
            let data = userDefaults.data(
                forKey: Keys.scores
            ),
            let scores = try? decoder.decode(
                [PlayerScore].self,
                from: data
            )
        else {
            return []
        }

        return scores
    }
}
