//
//  QuizViewModel.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import Foundation

final class QuizViewModel {
    
    private let service = APIService()
    
    var currentQuestion: Question?
    var correctAnswerCount: Int = 0
    var onStateChange: ((QuizState) -> Void)?

    var onQuestionReceived: ((Question) -> Void)?
    var onError: ((String) -> Void)?
    var onLoadingChange: ((Bool) -> Void)?
    var onAnswerResult: ((Bool) -> Void)?
    
    private(set) var state: QuizState = .quiz {
        didSet {
            onStateChange?(state)
        }
    }
    
    func resetQuiz(){
        state = .quiz
    }
    
    func loadQuestion() async {
        onLoadingChange?(true)
        Task{
            do {
                let question = try await service.fetchRandomQuestion()
                currentQuestion = question
                onQuestionReceived?(question)
            } catch {
                onError?(error.localizedDescription)
            }
            
            onLoadingChange?(false)
        }
    }
    func answerQuestion(option: String, questionId: String){
        Task {
            do {
                let isCorrect = try await service.validateAnswer(questionId: questionId, answer: option)
                
                if isCorrect {
                    self.correctAnswerCount += 1
                }
                
                await MainActor.run{
                    self.onAnswerResult?(isCorrect)
                }
            } catch {
                    self.onError?("Erro ao validar")
            }
        }
    }
}
