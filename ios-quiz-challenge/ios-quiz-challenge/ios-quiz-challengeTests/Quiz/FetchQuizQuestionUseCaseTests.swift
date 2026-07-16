//
//  FetchQuizQuestionUseCaseTests.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import Testing
@testable import ios_quiz_challenge

struct FetchQuizQuestionUseCaseTests {

    @Test func mapsQuestionDTOToDomainModel() async throws {
        let service = QuizServiceSpy()
        service.questionResult = .success(
            QuizQuestionDTO(
                id: "42",
                statement: "What is the answer?",
                options: ["One", "Two"]
            )
        )
        let sut = await FetchQuizQuestionUseCase(service: service)

        let question = try await sut.execute(questionNumber: 3)

        #expect(question.id == "42")
        #expect(question.number == 3)
        #expect(question.title == "What is the answer?")
        #expect(question.imageName == nil)
        #expect(question.options.map(\.title) == ["One", "Two"])
        #expect(service.fetchQuestionCallCount == 1)
    }

    @Test func propagatesServiceError() async {
        let service = QuizServiceSpy()
        service.questionResult = .failure(TestError.expected)
        let sut = await FetchQuizQuestionUseCase(service: service)

        do {
            _ = try await sut.execute(questionNumber: 1)
            #expect(Bool(false))
        } catch TestError.expected {
            #expect(service.fetchQuestionCallCount == 1)
        } catch {
            #expect(Bool(false))
        }
    }
}
