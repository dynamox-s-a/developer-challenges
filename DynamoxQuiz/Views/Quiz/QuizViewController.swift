//
//  QuizViewController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

final class QuizViewController: UIViewController {
    
    let viewModel = QuizViewModel()
    
    private var hasSelectorAnswer: Bool = false
    private var currentQuestionNumber: Int = 1
    
    private var quizView: QuizView {
        view as! QuizView
    }

    private lazy var allCards: [QuestionCardComponent] = {
        [
            quizView.myPrimaryCardForQuestion,
            quizView.mySecondaryCardForQuestion,
            quizView.MyThirdCardForQuestion,
            quizView.MyFourthCardForQuestion
        ]
    }()
    
    override func loadView() {
        view = QuizView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationItem.hidesBackButton = true
        
        Task {
           await viewModel.loadQuestion()
        }
        
        setupBindings()
        setupSelectionLogic()
        setupActions()
        quizView.updateQuestionTitle(number: "\(currentQuestionNumber)")
    }
    
    private func setupBindings(){
        viewModel.onQuestionReceived = { [weak self] question in
            guard let self = self else { return }
            
            self.quizView.questionsLabel.text = question.statement
            
            for(index, card) in self.allCards.enumerated() {
                if index < question.options.count {
                    card.configure(with: question.options[index])
                    card.isHidden = false
                    
                    card.layer.borderWidth = 0.0
                    card.layer.borderColor = nil
                    card.backgroundColor = .white
                } else {
                    card.isHidden = true
                }
            }
        }
        viewModel.onAnswerResult = { [weak self] isCorrect in
            guard let self = self else { return }
            
            let selectedCard = self.allCards.first(where: {$0.isSelected})
            
            self.setCards(false)
            
            if isCorrect {
                selectedCard?.backgroundColor = .systemGreen.withAlphaComponent(0.2)
                selectedCard?.layer.borderColor = UIColor.systemGreen.cgColor
                selectedCard?.layer.cornerRadius = 8
                selectedCard?.layer.borderWidth = 2
            } else {
                selectedCard?.backgroundColor = .systemRed.withAlphaComponent(0.2)
                selectedCard?.layer.borderColor = UIColor.systemRed.cgColor
                selectedCard?.layer.cornerRadius = 8
                selectedCard?.layer.borderWidth = 2
            }
            print("Selecione uma resposta antes de continuar")
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                self.proceedToNextStep()
            }
        }
        viewModel.onError = { message in
            print("Erro ao carregar \(message)")
        }
    }
    
    private func proceedToNextStep(){
        self.setCards(true)
        
        if currentQuestionNumber < 10 {
            currentQuestionNumber += 1
            Task {
                await viewModel.loadQuestion()
                updateQuestion()
            }
        } else {
            finishQuiz()
        }
    }

    
    private func setupActions() {
            quizView.myButtonResponse.setAction { [weak self] in
                self?.handleAnswerButtonTap()
            }
        
        quizView.buttonRestartQuiz.setAction { [weak self] in
            self?.restartQuiz()
        }
    }
    private func setupSelectionLogic() {
        allCards.forEach{ card in
            card.onSelect = { [weak self] in
                self?.selectCard(card)
            }
        }
    }
    private func handleAnswerButtonTap() {
        let selectedComponent = allCards.first(where: {$0.isSelected})
        
        guard let selectedCard = selectedComponent, let answer = selectedCard.getAnswerText() else {
            return
        }
        
        guard let questionId = viewModel.currentQuestion?.id else { return }
        
        viewModel.answerQuestion(option: answer, questionId: questionId)
    }
    private func restartQuiz(){
        currentQuestionNumber = 1
        viewModel.correctAnswerCount = 0
        hasSelectorAnswer = false
        quizView.updateQuestionTitle(number: "1")
        quizView.resetCards()
        quizView.resetToQuizMode()
        
        setCards(true)
        quizView.showQuizAgain()
        Task {
            await viewModel.loadQuestion()
        }
    }
    private func updateQuestion(){
        quizView.updateQuestionTitle(number: "\(currentQuestionNumber)")
        quizView.resetCards()
        hasSelectorAnswer = false
    }
    
    private func selectCard(_ selectedCard: QuestionCardComponent){
        allCards.forEach{$0.setSelection(false) }
        selectedCard.setSelection(true)
        hasSelectorAnswer = true
    }

    
    private func setCards(_ enable: Bool){
        allCards.forEach{
            $0.isUserInteractionEnabled = enable
            $0.alpha = enable ? 1.0 : 0.5
        }
        
        quizView.myButtonResponse.isUserInteractionEnabled = enable
        quizView.myButtonResponse.alpha = enable ? 1.0 : 0.5
    }
        private func setupShowTotal(_ hidden: Bool){
            allCards.forEach{
                $0.isUserInteractionEnabled = hidden
                $0.alpha = hidden ? 1.0 : 0.5
            }
        }
    private func finishQuiz() {
        
        let correctAnswers = viewModel.correctAnswerCount
        let total = 10
        let porcentam = (Double(correctAnswers) / Double(total)) * 100.0
        
        if correctAnswers < 6 {
            quizView.textLabel.text = "Não foi dessa vez, mas você está no caminho certo 💪"
        } else if correctAnswers < 8 {
            quizView.textLabel.text = "Mandou bem! Dá pra melhorar ainda mais 🚀"
        } else {
            quizView.textLabel.text = "Arrasou! Desempenho incrível 🎉"
        }
        quizView.subTextLabel.text = "Vc acertou \(correctAnswers) de \(total)"
        quizView.percentTextLabel.text = "\(Int(porcentam))% de acerto"
        
        
        quizView.showCardResultTotal()
        quizView.showRestartButton()
        print("Quiz finalizado")
    }
}
