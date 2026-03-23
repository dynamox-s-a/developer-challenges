//
//  QuizViewModelTests.swift
//  DynamoxQuiz
//
//  Created by Mateus on 06/03/26.
//

import XCTest
@testable import DynamoxQuiz

final class ResetQuizTest: XCTestCase {
    
    var sut: QuizViewModel!

    override func setUp(){
        super.setUp()
        sut = QuizViewModel()
    }

    override func tearDown() {
        sut = nil
        super.tearDown()
    }
    
    func test_quizViewModel_resetQuiz_resetCurrentIndex(){
        sut.resetQuiz()
        
        XCTAssertEqual(sut.currentIndex, 0)
    }
    
    func test_quizViewModel_resetQuiz_resetCorrectAnswerCount(){
        sut.resetQuiz()
        
        XCTAssertEqual(sut.correctAnswerCount, 0)
    }
    
    func test_quizViewModel_resetQuiz_resetCurrentQuestion(){
        sut.resetQuiz()
        
        XCTAssertNil(sut.currentQuestion)
    }
    @MainActor
    func test_quizViewModel_resetQuiz_resetStateEqualQuiz(){
        sut.resetQuiz()
        
        XCTAssertEqual(sut.state, .quiz)
    }
}
