//
//  HomeViewModel.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import Foundation

class HomeViewModel {
    var succesResult: (() -> Void)?
    var showToast: ((String) -> Void)?
    
    func itsOkay(userNick: String){
        if userNick.isEmpty {
            showToast?("Selecione uma resposta antes de continuar!")
        } else {
            print(userNick)
            succesResult?()
        }
    }
}

