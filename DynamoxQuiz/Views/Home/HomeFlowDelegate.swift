//
//  HomeViewDelegate.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import Foundation

protocol HomeDelegate: AnyObject {
    func sendNickNameUser(nickName: String)
}

public protocol HomeFlowDelegate: AnyObject {
    func navigateToQuiz()
}
