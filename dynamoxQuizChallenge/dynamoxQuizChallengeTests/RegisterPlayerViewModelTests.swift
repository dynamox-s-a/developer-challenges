//
//  PlayerRegisterViewModelTests.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Testing
@testable import dynamoxQuizChallenge

@MainActor
struct PlayerRegisterViewModelTests {
    @Test
    func sanitizeTrimsAndCollapsesSpacesAndClampsLength() {
        let viewModel = PlayerRegisterViewModel()
        
        viewModel.userName = "  Hyago  Henrique  "
        #expect(viewModel.sanitizedUsername == "Hyago Henrique")
        
        viewModel.userName = String(repeating: "a", count: viewModel.maxLength+10)
        #expect(viewModel.sanitizedUsername.count == viewModel.maxLength)
        
    }

    @Test
    func startTappedWhenEmptyShowsAlert() async {
        let viewModel = PlayerRegisterViewModel()
        viewModel.userName = " "
        
        let result = await viewModel.startPressed()
        
        #expect(result == nil)
        #expect(viewModel.isShowingAlert == true)
        #expect((viewModel.errorMessage ?? "").contains("Por favor, insira"))
    }

    @Test
    func startTappedWhenValidReturnsSanitizedName() async {
        let viewModel = PlayerRegisterViewModel()
        viewModel.userName = "  Hyago "
        let result = await viewModel.startPressed()
        
        #expect(result == "Hyago")
        #expect(viewModel.isShowingAlert == false)
        #expect(viewModel.errorMessage == nil)
        #expect(viewModel.isStartPressed == false)
    }

    @Test
    func startTappedWhenInvalidCharactersShowAlert() async {
        let viewModel = PlayerRegisterViewModel()
        viewModel.userName = "Hy@go"
        
        let result = await viewModel.startPressed()
        
        #expect(result == nil)
        #expect(viewModel.isShowingAlert == true)
        #expect((viewModel.errorMessage ?? "").contains("Seu nome deve conter apenas"))
    }
    
    @Test
    func startTappedWhenNameHasLessThanThreeCharacters() async {
        let viewModel = PlayerRegisterViewModel()
        viewModel.userName = "Hy"
        
        let result = await viewModel.startPressed()
        
        #expect(result == nil)
        #expect(viewModel.isShowingAlert == true)
        #expect((viewModel.errorMessage ?? "").contains("O seu nome deve ter pelo menos"))
    }
}
