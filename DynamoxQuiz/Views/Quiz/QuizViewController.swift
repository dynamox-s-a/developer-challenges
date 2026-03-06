//
//  QuizViewController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

final class QuizViewController: UIViewController {
    
    let viewModel = QuizViewModel()
    let profileViewModel: ProfileViewModel
    
    private var hasSelectorAnswer: Bool = false
    
    init(profileViewModel: ProfileViewModel) {
        self.profileViewModel = profileViewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private var quizView: QuizView {
        view as! QuizView
    }

    private lazy var allCards: [QuestionCardComponent] = {
        [
            quizView.myPrimaryCardForQuestion,
            quizView.mySecondaryCardForQuestion,
            quizView.MyThirdCardForQuestion,
            quizView.MyFourthCardForQuestion,
            quizView.MyFiveCardForQuestion,
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
        quizView.updateQuestionTitle(number: "\(viewModel.currentIndex + 1)")
    }
    
    private func setupBindings(){
        viewModel.onQuestionReceived = { [weak self] question in
            guard let self = self else { return }
            
            self.quizView.updateQuestionTitle(number: "\(self.viewModel.currentIndex + 1)")
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
                Task { [weak self] in
                    await self?.proceedToNextStep()
                    self?.setCards(true)
                }
            }
        }
        viewModel.onError = { message in
            print("Erro ao carregar \(message)")
        }
        viewModel.onStateChange = { [weak self] state in
            DispatchQueue.main.async {
                switch state {
                case .loading:
                    self?.quizView.showLoading()
                case .quiz:
                    self?.quizView.hideLoading()
                default:
                    break
                }
            }
        }
    }
    
    private func proceedToNextStep() async {
        viewModel.nextQuestion()
        updateQuestion()
        
        if viewModel.isQuizFinished {
            finishQuiz()
        } else {
            await viewModel.loadQuestion()
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
        viewModel.resetQuiz()
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
        quizView.updateQuestionTitle(number: "\(viewModel.currentIndex + 1)")
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
        
        let nickUserName = profileViewModel.user
        let correctAnswers = viewModel.correctAnswerCount
        let total = 10
        let porcentam = (Double(correctAnswers) / Double(total)) * 100.0
        
        viewModel.saveResult(name: nickUserName, correct: Int16(correctAnswers), total: Int16(total), rounds: Int32(viewModel.currentIndex))
        
        if correctAnswers < 6 {
            quizView.textLabel.text = "Não foi dessa vez \(nickUserName), mas você está no caminho certo 💪"
        } else if correctAnswers < 8 {
            quizView.textLabel.text = "Mandou bem \(nickUserName)! Dá pra melhorar ainda mais 🚀"
        } else {
            quizView.textLabel.text = "Arrasou \(nickUserName)! Desempenho incrível 🎉"
        }
        quizView.subTextLabel.text = "Vc acertou \(correctAnswers) de \(total)"
        quizView.percentTextLabel.text = "\(Int(porcentam))% de acerto"
        
        
        quizView.showCardResultTotal()
        quizView.showRestartButton()
        print("Quiz finalizado")
    }
}

