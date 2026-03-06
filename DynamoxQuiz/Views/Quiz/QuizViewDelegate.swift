//
//  QuizFlowDelegate.swift
//  DynamoxQuiz
//
//  Created by Mateus on 04/03/26.
//

protocol QuizFlowDelegate: AnyObject {
    func didTapAnswer()
    func didTapRestart()
    func didSelectOption(index: Int)
}
