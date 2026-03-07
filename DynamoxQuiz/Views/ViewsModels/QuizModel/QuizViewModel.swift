//
//  QuizViewModel.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import Foundation

class QuizViewModel {
    
    private let service: APIServiceDelegate
    private let repository: QuizRepository
    
    private let totalQuestions: Int = 10
    private(set) var currentIndex = 0
    
    var currentQuestion: Question?
    var correctAnswerCount: Int = 0
    var onStateChange: ((QuizState) -> Void)?

    var onQuestionReceived: ((Question) -> Void)?
    var onError: ((String) -> Void)?
    var onLoadingChange: ((Bool) -> Void)?
    var onAnswerResult: ((Bool) -> Void)?
    
    init(
        service: APIServiceDelegate = APIService(),
         repository: QuizRepository = QuizRepository()
    ){
        self.service = service
        self.repository = repository
    }
    
    private(set) var state: QuizState = .quiz {
        didSet {
            onStateChange?(state)
        }
    }
    
    var isQuizFinished: Bool {
        currentIndex >= totalQuestions
    }
    
    func nextQuestion() {
        currentIndex += 1
    }
    
    func resetQuiz(){
        currentIndex = 0
        correctAnswerCount = 0
        currentQuestion = nil
        state = .quiz
    }
    
    func saveResult(name: String, correct: Int16, total: Int16, rounds: Int32){
        repository.create(
            name: name,
            correct: correct,
            total: total,
            rounds: rounds
        )
    }
    
    func loadQuestion() async {
        state = .loading
            do {
                let question = try await service.fetchRandomQuestion()
                currentQuestion = question
                await MainActor.run{
                    onQuestionReceived?(question)
                    state = .quiz
                }
            } catch {
                await MainActor.run{
                    onError?(error.localizedDescription)
                    state = .quiz
                }
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
