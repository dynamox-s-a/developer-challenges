//
//  NextQuestionTest.swift
//  DynamoxQuizTests
//
//  Created by Mateus on 07/03/26.
//

import XCTest
@testable import DynamoxQuiz

final class NextQuestionTest: XCTestCase {
    
    var sut: QuizViewModel!

    override func setUp(){
        super.setUp()
        sut = QuizViewModel()
    }

    func test_quizViewModel_nextQuestion_sumNumberQuestion(){
        let initialIndex = sut.currentIndex
        
        sut.nextQuestion()
        
        XCTAssertEqual(sut.currentIndex, initialIndex + 1)    }

}
