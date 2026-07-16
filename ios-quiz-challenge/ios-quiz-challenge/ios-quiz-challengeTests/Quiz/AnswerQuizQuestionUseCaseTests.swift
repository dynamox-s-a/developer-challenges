//
//  AnswerQuizQuestionUseCaseTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

struct AnswerQuizQuestionUseCaseTests {

    @Test func returnsAnswerResultAndPassesPayloadToService() async throws {
        let service = QuizServiceSpy()
        service.answerResult = .success(
            AnswerQuizQuestionResponseDTO(result: false)
        )
        let sut = await AnswerQuizQuestionUseCase(service: service)

        let isCorrect = try await sut.execute(
            questionID: "question-1",
            answer: "Dynamox"
        )

        #expect(isCorrect == false)
        #expect(service.answerCalls.count == 1)
        #expect(service.answerCalls.first?.questionID == "question-1")
        #expect(service.answerCalls.first?.answer == "Dynamox")
    }

    @Test func propagatesServiceError() async {
        let service = QuizServiceSpy()
        service.answerResult = .failure(TestError.expected)
        let sut = await AnswerQuizQuestionUseCase(service: service)

        do {
            _ = try await sut.execute(
                questionID: "question-1",
                answer: "A"
            )
            #expect(Bool(false))
        } catch TestError.expected {
            #expect(service.answerCalls.count == 1)
        } catch {
            #expect(Bool(false))
        }
    }
}
