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

    
    var mock: MockApiService!
    var sut: QuizViewModel!
    
    override func setUp() {
        super.setUp()
        mock = MockApiService()
        sut = QuizViewModel(service: mock)
    }
    
    override func tearDown() {
        sut = nil
        mock = nil
        super.tearDown()
    }
    
    func test_quizViewmodel_loadQuestionQuiz_shouldLoadQuestion() async {
        mock.questionMock = Question(id: "1", statement: "Pergunta teste", options: ["A", "B", "C"])
        
        await sut.loadQuestion()
        
        
        XCTAssertNotNil(sut.currentQuestion)
        XCTAssertEqual(sut.state, .quiz)
    }
    
    func test_quizViewModel_loadQuestionQuiz_MustMaintainStateQuiz() async {

        mock.shouldThrowError = true
        
        await sut.loadQuestion()
        
        XCTAssertEqual(sut.state, .quiz)
        XCTAssertNil(sut.currentQuestion)

        
        
    }

}
