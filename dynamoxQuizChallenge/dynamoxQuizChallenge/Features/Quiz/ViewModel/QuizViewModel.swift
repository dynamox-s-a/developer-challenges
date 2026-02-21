//
//  QuizViewModel.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Observation
import SwiftUI

@Observable
@MainActor
final class QuizViewModel {
    enum ScreenState: Equatable {
        case idle
        case loading
        case showingQuestion
        case submitting
        case showingFeedBack(isCorrect: Bool)
        case finished
    }
    
    private var repository: QuizRepositoryProtocol
    private var scoreStore: ScoreStoreProtocol
    private(set) var totalQuestions: Int = 10
    private var lastSubmit: (questionId: String, answer: String)? = nil
    private var didPersistScore: Bool = false
    
    var screenState: ScreenState = .idle
    var currentQuestion: QuizDTO? = nil
    var selectedIndex: Int? = nil
    var questionIndex: Int = 1
    var score: Int = 0
    var isShowingErrorAlert: Bool = false
    var errorMessage: String = ""
    var canRetry: Bool = false
    
    let userName: String
    
    init(
        repository: QuizRepositoryProtocol,
        scoreStore: ScoreStoreProtocol,
        userName: String,
        totalQuestions: Int = 10) {
        self.repository = repository
        self.userName = userName
        self.scoreStore = scoreStore
        self.totalQuestions = totalQuestions
    }
    
    var progressFraction: Double {
        return Double(questionIndex) / Double(totalQuestions)
    }
    
    var progressPercentText: String {
        let prct = Int(progressFraction * 100)
        return "\(prct)%"
    }
    
    var questionHeaderText: String {
        "Pergunta \(questionIndex) de \(totalQuestions)"
    }
    
    var canSubmit: Bool {
        selectedIndex != nil && currentQuestion != nil && screenState == .showingQuestion
    }
    
    func start() {
        Task {
            await loadQuestions()
        }
    }
    
    func selectOption(index: Int) {
        guard screenState == .showingQuestion else { return }
        selectedIndex = index
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }
    
    func submit() {
        guard
            canSubmit,
            let question = currentQuestion,
            let index = selectedIndex,
            index >= 0,
            index < question.options.count
        else { return }
        
        let answer = question.options[index]
        lastSubmit = (question.id, answer)
        
        Task {
            screenState = .submitting
            await submitAnswer(question.id, answer: answer)
        }
    }
    
    func retry() {
        canRetry = false
        isShowingErrorAlert = false
        
        if currentQuestion == nil {
            Task {
                await loadQuestions()
            }
            return
        }

        if let lastSubmit {
            Task {
                await submitAnswer(lastSubmit.questionId, answer: lastSubmit.answer)
                return
            }
        }
        
    }
    
    private func loadQuestions() async {
        screenState = .loading
        selectedIndex = nil
        do {
            let question = try await repository.fetchQuiz()
            currentQuestion = question
            screenState = .showingQuestion
        } catch let error as NetworkError {
            showError(error)
        } catch {
            showError(.transportError(error))
        }
    }

    private func submitAnswer(_ questionId: String, answer: String) async {
        screenState = .submitting
        do {
            let response = try await repository.submitAnswer(questionId, answer: answer)
            
            if response.result {
                score += 1
            }
            
            lastSubmit = nil

            screenState = .showingFeedBack(isCorrect: response.result)
            try? await Task.sleep(nanoseconds: 300_000_000)
            
            if questionIndex >= totalQuestions {
                saveScoreLocal()
                screenState = .finished
                currentQuestion = nil
                questionIndex = 0
                score = 0
                didPersistScore = false
                selectedIndex = nil
            } else {
                questionIndex += 1
                await loadQuestions()
            }
        } catch let error as NetworkError {
            showError(error)
        } catch {
            showError(.transportError(error))
        }
    }

    private func showError(_ error: NetworkError) {
        errorMessage = error.debugDescription
        isShowingErrorAlert = true

        canRetry = (currentQuestion == nil) || (lastSubmit != nil)
        
        if currentQuestion == nil {
            screenState = .idle
        } else {
            screenState = .showingQuestion
        }
    }

    private func saveScoreLocal() {
        guard !didPersistScore else { return }
        didPersistScore = true
        
        do {
            let finalScore = score
            try scoreStore.recordGame(username: userName, score: finalScore)
        } catch {
            #if DEBUG
            print("ERROR: Failed to save score: \(error)")
            #endif
        }
    }
}
