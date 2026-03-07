//
//  LoadQuestionQuizTest.swift
//  DynamoxQuizTests
//
//  Created by Mateus on 07/03/26.
//

import XCTest
@testable import DynamoxQuiz

@MainActor
final class LoadQuestionQuizTest: XCTestCase {

    func test_quizViewmodel_loadQuestionQuiz_shouldLoadQuestion() async {
        let mock = MockApiService()
        mock.questionMock = Question(id: "1", statement: "Pergunta teste", options: ["A", "B", "C"])
        let sut = QuizViewModel(service: mock)
        
        await sut.loadQuestion()
        
        
        XCTAssertNotNil(sut.currentQuestion)
        XCTAssertEqual(sut.state, .quiz)
    }

}
