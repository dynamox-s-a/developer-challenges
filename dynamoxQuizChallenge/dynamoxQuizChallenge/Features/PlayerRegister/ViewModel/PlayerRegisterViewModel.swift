//
//  PlayerRegisterViewModel.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import SwiftUI
import Observation
import Foundation
import FirebaseCrashlytics


@Observable
@MainActor
final class PlayerRegisterViewModel {
    var userName: String = "" {
        didSet {
            sanitize()
            errorMessage = nil
        }
    }
    var isStartPressed: Bool = false
    var errorMessage: String? = nil
    var isShowingAlert: Bool = false
    
    let title: String = "Dinamox Quiz Challenge"
    let headerTitle: String = "Bem-vindo!"
    let subtitle: String = "Teste seus conhecimentos!"
    let nameLabel: String = "Seu nome"
    let namePlaceholder: String = "Digite seu nome"
    let startButtonTitle: String = "Start Quiz!"
    let maxLength: Int  = 18

    let accentColor: Color = Color(hex: 0xD60C77)
    
    var sanitizedUsername: String {
        sanitizer(userName)
    }

    var canStart: Bool {
        errorMessage == nil && !sanitizedUsername.isEmpty
    }
    
    
    func startPressed() async -> String? {
        let name = sanitizedUsername
        
        guard validate(name) else {
            if let errorMessage {
                showAlert(message: errorMessage)
                return nil
            }
            showAlert(message: "Nome incorreto")
            return nil
        }
        
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        
        withAnimation(.spring(response: 0.22, dampingFraction: 0.65)) {
            isStartPressed = true
        }
        
        try? await Task.sleep(nanoseconds: 120_000_000)
        
        withAnimation(.spring(response: 0.30, dampingFraction: 0.75)) {
            isStartPressed = false
        }
        AnalyticsTacker.log(.quizStarted(name))
        return name
    }

    private func sanitize() {
        let newValue = sanitizer(userName)
        if userName != newValue {
            userName = newValue
        }
    }

    private func sanitizer(_ string: String) -> String {
        let trimmed = string.trimmingCharacters(in: .whitespacesAndNewlines)
        let collapsed = trimmed.split(whereSeparator: { $0.isWhitespace })
            .joined(separator: " ")
        
        if collapsed.count > maxLength {
            return String(collapsed.prefix(maxLength))
        }
        
        return collapsed
    }

    private func isAllowedCharacter(_ string: String) -> Bool {
        let allowed = CharacterSet.alphanumerics.union(.whitespaces)
        return string.unicodeScalars.allSatisfy { allowed.contains($0) }
    }

    private func validate(_ value: String) -> Bool {
        if value.isEmpty {
            errorMessage = "Por favor, insira seu nome."
            return false
        }

        if value.count < 3 {
            errorMessage = "O seu nome deve ter pelo menos 3 caracteres."
            return false
        }
    
        if !isAllowedCharacter(value) {
            errorMessage = "Seu nome deve conter apenas letras e espaços."
            return false
        }
        
        errorMessage = nil
        return true
    }

    private func showAlert(message: String) {
        errorMessage = message
        isShowingAlert = true
    }
}
