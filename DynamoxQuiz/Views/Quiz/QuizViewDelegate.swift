//
//  QuizFlowDelegate.swift
//  DynamoxQuiz
//
//  Created by Mateus on 04/03/26.
//

protocol QuizViewDelegate: AnyObject {
    func didTapAnswerButton()
    func didTapRestartButton()
    func didSelectOption(index: Int)
}
