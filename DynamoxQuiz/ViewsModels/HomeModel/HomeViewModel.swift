//
//  HomeViewModel.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import Foundation

class HomeViewModel {
    var succesResult: (() -> Void)?
    
    func itsOkay(userNick: String){
        if userNick.isEmpty {
            print("Informe seu nome ou apelido para prosseguir")
        } else {
            print(userNick)
            succesResult?()
        }
    }
}

