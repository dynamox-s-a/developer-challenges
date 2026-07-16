//
//  TestDoubles.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Foundation
@testable import ios_quiz_challenge

enum TestError: Error, Equatable {
    case expected
}

actor PlayerRepositorySpy: PlayerRepository {
    var currentNicknameValue: String?
    var scores: [PlayerScore] = []
    var saveError: Error?

    private var setCurrentNicknameCalls: [String] = []
    private var saveCalls: [(score: Int, nickname: String)] = []

    func setCurrentNickname(_ nickname: String) async {
        setCurrentNicknameCalls.append(nickname)
        currentNicknameValue = nickname
    }

    func currentNickname() async -> String? {
        currentNicknameValue
    }

    func save(
        score: Int,
        for nickname: String
    ) async throws {
        if let saveError {
            throw saveError
        }

        saveCalls.append(
            (score: score, nickname: nickname)
        )
    }

    func ranking() async -> [PlayerScore] {
        scores
    }

    func savedNicknames() -> [String] {
        setCurrentNicknameCalls
    }

    func savedScores() -> [(score: Int, nickname: String)] {
        saveCalls
    }

    func setScores(_ scores: [PlayerScore]) {
        self.scores = scores
    }

    func setSaveError(_ error: Error?) {
        saveError = error
    }
}

final class QuizServiceSpy: QuizServiceProtocol {
    var questionResult: Result<QuizQuestionDTO, Error> = .success(
        QuizQuestionDTO(
            id: "question-id",
            statement: "Question?",
            options: ["A", "B", "C"]
        )
    )
    var answerResult: Result<AnswerQuizQuestionResponseDTO, Error> = .success(
        AnswerQuizQuestionResponseDTO(result: true)
    )

    private(set) var fetchQuestionCallCount = 0
    private(set) var answerCalls: [(questionID: String, answer: String)] = []

    func fetchQuestion() async throws -> QuizQuestionDTO {
        fetchQuestionCallCount += 1
        return try questionResult.get()
    }

    func answerQuestion(
        questionID: String,
        answer: String
    ) async throws -> AnswerQuizQuestionResponseDTO {
        answerCalls.append(
            (questionID: questionID, answer: answer)
        )
        return try answerResult.get()
    }
}

final class FetchQuizQuestionUseCaseSpy: FetchQuizQuestionUseCaseProtocol {
    var result: Result<QuizQuestion, Error>
    private(set) var receivedQuestionNumbers: [Int] = []

    init(result: Result<QuizQuestion, Error>) {
        self.result = result
    }

    func execute(questionNumber: Int) async throws -> QuizQuestion {
        receivedQuestionNumbers.append(questionNumber)
        return try result.get()
    }
}

final class AnswerQuizQuestionUseCaseSpy: AnswerQuizQuestionUseCaseProtocol {
    var result: Result<Bool, Error>
    private(set) var receivedAnswers: [(questionID: String, answer: String)] = []

    init(result: Result<Bool, Error>) {
        self.result = result
    }

    func execute(
        questionID: String,
        answer: String
    ) async throws -> Bool {
        receivedAnswers.append(
            (questionID: questionID, answer: answer)
        )
        return try result.get()
    }
}

@MainActor
final class QuizPresenterSpy: QuizPresenting {
    enum Event: Equatable {
        case loading
        case question(QuizQuestion)
        case score(Int)
        case remainingSeconds(Int)
        case answering(QuizOption.ID)
        case answerResult(Bool)
        case error(String)
        case answerError(String)
    }

    private(set) var events: [Event] = []

    func presentLoading() {
        events.append(.loading)
    }

    func present(question: QuizQuestion) {
        events.append(.question(question))
    }

    func present(score: Int) {
        events.append(.score(score))
    }

    func present(remainingSeconds: Int) {
        events.append(.remainingSeconds(remainingSeconds))
    }

    func presentAnswering(optionID: QuizOption.ID) {
        events.append(.answering(optionID))
    }

    func presentAnswerResult(isCorrect: Bool) {
        events.append(.answerResult(isCorrect))
    }

    func present(error: Error) {
        events.append(.error(error.localizedDescription))
    }

    func presentAnswerError(_ error: Error) {
        events.append(.answerError(error.localizedDescription))
    }
}

@MainActor
final class QuizRouterSpy: QuizRouting {
    private(set) var closeCallCount = 0
    private(set) var finishedScores: [Int] = []

    func close() {
        closeCallCount += 1
    }

    func finishQuiz(score: Int) {
        finishedScores.append(score)
    }
}

final class SaveQuizResultUseCaseSpy: SaveQuizResultUseCaseProtocol {
    var error: Error?
    private(set) var calls: [(nickname: String, score: Int)] = []

    func execute(
        nickname: String,
        score: Int
    ) async throws {
        calls.append(
            (nickname: nickname, score: score)
        )

        if let error {
            throw error
        }
    }
}

@MainActor
final class QuizResultPresenterSpy: QuizResultPresenting {
    enum Event: Equatable {
        case saving
        case saved
        case error(String)
    }

    private(set) var events: [Event] = []

    func presentSavingScore() {
        events.append(.saving)
    }

    func presentSavedScore() {
        events.append(.saved)
    }

    func presentSaveError(_ error: Error) {
        events.append(.error(error.localizedDescription))
    }
}

@MainActor
final class QuizResultRouterSpy: QuizResultRouting {
    private(set) var restartCallCount = 0
    private(set) var openRankingCallCount = 0
    private(set) var closeCallCount = 0

    func restartQuiz() {
        restartCallCount += 1
    }

    func openRanking() {
        openRankingCallCount += 1
    }

    func close() {
        closeCallCount += 1
    }
}

final class LoadRankingUseCaseSpy: LoadRankingUseCaseProtocol {
    var scores: [PlayerScore]
    private(set) var executeCallCount = 0

    init(scores: [PlayerScore]) {
        self.scores = scores
    }

    func execute() async -> [PlayerScore] {
        executeCallCount += 1
        return scores
    }
}

@MainActor
final class RankingPresenterSpy: RankingPresenting {
    enum Event: Equatable {
        case loading
        case scores([PlayerScore])
    }

    private(set) var events: [Event] = []

    func presentLoading() {
        events.append(.loading)
    }

    func present(scores: [PlayerScore]) {
        events.append(.scores(scores))
    }
}

@MainActor
final class RankingRouterSpy: RankingRouting {
    private(set) var closeCallCount = 0

    func close() {
        closeCallCount += 1
    }
}

func makeQuestion(
    id: String = "question-id",
    number: Int = 1,
    options: [QuizOption] = [
        QuizOption(id: UUID(uuidString: "00000000-0000-0000-0000-000000000001")!, title: "A"),
        QuizOption(id: UUID(uuidString: "00000000-0000-0000-0000-000000000002")!, title: "B")
    ]
) -> QuizQuestion {
    QuizQuestion(
        id: id,
        number: number,
        title: "Question?",
        imageName: nil,
        options: options
    )
}
