//
//  QuizViewModelTests.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Testing
@testable import dynamoxQuizChallenge

@MainActor
struct QuizViewModelTests {
    private func sampleQuestion(id: String) -> QuizDTO {
        .init(id: id, statement: "Question \(id)", options: ["1", "2", "3", "4"])
    }
    
    @Test
    func startLoadsFirstQuestion() async throws {
        let mockRepository = MockQuizRepository(
            mode: .successSequence(
                questions: [sampleQuestion(id: "1")],
                results: [true]
            )
        )
        
        let mockStore = MockScoreRepository()
        
        let viewModel = QuizViewModel(
            repository: mockRepository,
            scoreStore: mockStore,
            userName: "Hyago"
        )
        
        viewModel.start()
        
        try await Task.sleep(nanoseconds: 1_500_000_000)
        
        #expect(viewModel.currentQuestion?.id == "1")
        #expect(viewModel.screenState == .showingQuestion)
        #expect(viewModel.selectedIndex == nil)
    }

    @Test
    func submitCorrectAnswerIncrementScoreShowFeedbackThenLoadNext() async throws {
        let mockRepository = MockQuizRepository(
            mode: .successSequence(
                questions: [
                    sampleQuestion(id: "1"),
                    sampleQuestion(id: "2")
                ],
                results: [true]
            )
        )
        let mockScoreStore = MockScoreRepository()
        
        let viewModel = QuizViewModel(
            repository: mockRepository,
            scoreStore: mockScoreStore,
            userName: "Hyago"
        )
        
        viewModel.start()
        try await Task.sleep(nanoseconds: 1_500_000_000)
        
        viewModel.selectOption(index: 2)
        #expect(viewModel.canSubmit == true)
        viewModel.submit()
        try await Task.sleep(nanoseconds: 50_000_00)
        #expect(viewModel.screenState == .submitting)
        
        //  tempo de espera do feedback e próxima pergunta.
        try await Task.sleep(nanoseconds: 3_000_000_000)
        #expect(viewModel.score == 1)
        #expect(viewModel.questionIndex == 1)
        #expect(viewModel.currentQuestion?.id == "2")
        #expect(viewModel.screenState == .showingQuestion)
    }

    @Test
    func finishPersistsResultScoreStore() async throws {
        let mockRepository = MockQuizRepository(
            mode: .successSequence(
                questions: [
                    sampleQuestion(id: "1"),
                ],
                results: [true]
            )
        )

        let mockScoreStore = MockScoreRepository()
        let viewModel = QuizViewModel(
            repository: mockRepository,
            scoreStore: mockScoreStore,
            userName: "Hyago",
            totalQuestions: 0 // isso é um index, logo 0 é 1 questão.
        )

        viewModel.start()
        try await Task.sleep(nanoseconds: 1_500_000_000)
        viewModel.selectOption(index: 1)
        viewModel.submit()
        
        try await Task.sleep(nanoseconds: 3_000_000_000)
        
        #expect(viewModel.screenState == .finished)
        
        #expect(mockScoreStore.records.count == 1)
        #expect(mockScoreStore.records.first?.username == "Hyago")
        #expect(mockScoreStore.records.first?.score == 1)
    }

    @Test
    func fetchErrorShowsAlert() async throws {
        struct AnyError: Error { }
        let mockRepository = MockQuizRepository(mode: .failOnFetch(AnyError()))
        let mockScoreStore = MockScoreRepository()
        let viewModel = QuizViewModel(
            repository: mockRepository,
            scoreStore: mockScoreStore,
            userName: "Hyago"
        )
        
        viewModel.start()
        try await Task.sleep(nanoseconds: 1_500_000_000)
        
        #expect(viewModel.isShowingErrorAlert == true)
        #expect(viewModel.canRetry == true)
        #expect(viewModel.currentQuestion == nil)
    }
}
