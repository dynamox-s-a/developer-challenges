//
//  HomeViewDelegate.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import Foundation

protocol HomeViewDelegate: AnyObject {
    func didTapStart()
}

public protocol HomeFlowDelegate: AnyObject {
    func navigateToQuiz()
}
