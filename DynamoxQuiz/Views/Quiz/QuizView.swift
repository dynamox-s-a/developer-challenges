//
//  QuizView.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

class QuizView: UIView {
    
    weak var delegate: QuizViewDelegate?
    
    private let scrollView: UIScrollView = {
            let scroll = UIScrollView()
            scroll.translatesAutoresizingMaskIntoConstraints = false
            scroll.showsVerticalScrollIndicator = true
            return scroll
        }()
    
    private let contentView: UIView = {
            let view = UIView()
            view.translatesAutoresizingMaskIntoConstraints = false
            return view
        }()
    
    let myButtonResponse = ButtonViewComponent(title: "Responder")
    
    let buttonRestartQuiz: ButtonViewComponent = {
            let btn = ButtonViewComponent(title: "Refazer Quiz")
            btn.isHidden = true
            return btn
        }()

    private let cardsStackView: UIStackView = {
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 20
        stack.distribution = .fill
        stack.translatesAutoresizingMaskIntoConstraints = false
        return stack
    }()
    
    private var cards: [QuestionCardComponent] {
        cardsStackView.arrangedSubviews.compactMap { $0 as? QuestionCardComponent }
    }
    
    private let titleQuestionsLabel: UILabel = {
        let label = UILabel()
        label.font = .systemFont(ofSize: 18, weight: .semibold)
        label.textColor = .gray
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    let questionsLabel: UILabel = {
        
        let label = UILabel()
        label.text = "Carregando Quiz..."
        label.font = .systemFont(ofSize: 22, weight: .bold)
        label.numberOfLines = 0
        label.lineBreakMode = .byWordWrapping
        label.textAlignment = .center
        label.textColor = .black
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    let myPrimaryCardForQuestion = QuestionCardComponent(title: "...")
    let mySecondaryCardForQuestion = QuestionCardComponent(title: "...")
    let MyThirdCardForQuestion = QuestionCardComponent(title: "...")
    let MyFourthCardForQuestion = QuestionCardComponent(title: "...")
    let MyFiveCardForQuestion = QuestionCardComponent(title: "...")
    
    private let loadingView: UIActivityIndicatorView = {
        let indicator = UIActivityIndicatorView(style: .large)
        indicator.color = Colors.primaryGreenBase
        indicator.translatesAutoresizingMaskIntoConstraints = false
        indicator.hidesWhenStopped = true
        return indicator
    }()
    
    private let logoWinnerView: UIImageView = {
        let img = UIImageView()
        img.image = UIImage(systemName: "trophy")
        img.tintColor = Colors.primaryGreenBase
        img.contentMode = .scaleAspectFit
        img.translatesAutoresizingMaskIntoConstraints = false
        img.isHidden = true
        return img
    }()
    
    let myCardResult: UIView = {
        let card = UIView()
        card.backgroundColor = .white
        card.layer.cornerRadius = 12
        
        card.layer.shadowColor = UIColor.black.cgColor
        card.layer.shadowOpacity = 0.15
        card.layer.shadowOffset = CGSize(width: 0, height: 4)
        card.layer.shadowRadius = 6
        
        card.translatesAutoresizingMaskIntoConstraints = false
        card.isHidden = true
        return card
    }()
    
    let textLabel: UILabel = {
        let label = UILabel()
        label.font = .systemFont(ofSize: 22, weight: .bold)
        label.textColor = .black
        
        label.numberOfLines = 0
        label.lineBreakMode = .byWordWrapping
        label.textAlignment = .left
        
        label.translatesAutoresizingMaskIntoConstraints = false
        label.isHidden = true
        return label
    }()
    
    let subTextLabel: UILabel = {
        let label = UILabel()
        label.font = .systemFont(ofSize: 20, weight: .medium)
        label.textColor = .gray
        label.translatesAutoresizingMaskIntoConstraints = false
        label.isHidden = true
        return label
    }()
    
    let percentTextLabel: UILabel = {
        let label = UILabel()
        label.font = .systemFont(ofSize: 32, weight: .semibold)
        label.textColor = Colors.primaryGreenBase
        label.translatesAutoresizingMaskIntoConstraints = false
        label.isHidden = true
        return label
    }()
    
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setupUI()
        setupActions()

    }
    

    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI(){
        backgroundColor = .white
        
        addSubview(scrollView)
        addSubview(myButtonResponse)
        addSubview(buttonRestartQuiz)
                
        scrollView.addSubview(contentView)
                
        contentView.addSubview(titleQuestionsLabel)
        contentView.addSubview(questionsLabel)
        contentView.addSubview(cardsStackView)
        contentView.addSubview(loadingView)
                
        addSubview(logoWinnerView)
        addSubview(myCardResult)
        myCardResult.addSubview(textLabel)
        myCardResult.addSubview(subTextLabel)
        myCardResult.addSubview(percentTextLabel)
        
        cardsStackView.addArrangedSubview(myPrimaryCardForQuestion)
        cardsStackView.addArrangedSubview(mySecondaryCardForQuestion)
        cardsStackView.addArrangedSubview(MyThirdCardForQuestion)
        cardsStackView.addArrangedSubview(MyFourthCardForQuestion)
        cardsStackView.addArrangedSubview(MyFiveCardForQuestion)

        setupConstraints()
        
        }
    
    private func setupActions(){
        myButtonResponse.setAction { [ weak self ] in
            self?.delegate?.didTapAnswerButton()
        }
        buttonRestartQuiz.setAction { [ weak self ] in
            self?.delegate?.didTapRestartButton()
        }
        cards.enumerated().forEach { index, card in
            card.onSelect = { [weak self ] in
                self?.delegate?.didSelectOption(index: index)
            }
        }
    }
    
    private func setupConstraints(){
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: safeAreaLayoutGuide.topAnchor),
                        scrollView.leadingAnchor.constraint(equalTo: leadingAnchor),
                        scrollView.trailingAnchor.constraint(equalTo: trailingAnchor),
                        scrollView.bottomAnchor.constraint(equalTo: myButtonResponse.topAnchor, constant: -10),
                        
            
                        contentView.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor),
                        contentView.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor),
                        contentView.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor),
                        contentView.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor),
            
                        loadingView.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
                        loadingView.topAnchor.constraint(equalTo: questionsLabel.bottomAnchor, constant: 60),
            
                        contentView.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor),
                        
                        titleQuestionsLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
                        titleQuestionsLabel.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
                        
                        questionsLabel.topAnchor.constraint(equalTo: titleQuestionsLabel.bottomAnchor, constant: 20),
                        questionsLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
                        questionsLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
                        
                        cardsStackView.topAnchor.constraint(equalTo: questionsLabel.bottomAnchor, constant: 30),
                        cardsStackView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
                        cardsStackView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
                        cardsStackView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -20),
                        
                        myButtonResponse.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 16),
                        myButtonResponse.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -16),
                        myButtonResponse.bottomAnchor.constraint(equalTo: safeAreaLayoutGuide.bottomAnchor, constant: -20),
                        myButtonResponse.heightAnchor.constraint(equalToConstant: 48),
                        
                        buttonRestartQuiz.centerXAnchor.constraint(equalTo: centerXAnchor),
                        buttonRestartQuiz.bottomAnchor.constraint(equalTo: myButtonResponse.bottomAnchor),
                        buttonRestartQuiz.widthAnchor.constraint(equalToConstant: 300),
                        buttonRestartQuiz.heightAnchor.constraint(equalToConstant: 48),
                        
                        logoWinnerView.bottomAnchor.constraint(equalTo: myCardResult.topAnchor, constant: -20),
                        logoWinnerView.centerXAnchor.constraint(equalTo: centerXAnchor),
                        logoWinnerView.widthAnchor.constraint(equalToConstant: 100),
                        logoWinnerView.heightAnchor.constraint(equalToConstant: 100),
            
                        myCardResult.centerXAnchor.constraint(equalTo: centerXAnchor),
                        myCardResult.centerYAnchor.constraint(equalTo: centerYAnchor),
                        myCardResult.widthAnchor.constraint(equalToConstant: 300),
                        myCardResult.heightAnchor.constraint(equalToConstant: 250),
                        
                        
                        textLabel.topAnchor.constraint(equalTo: myCardResult.topAnchor, constant: 20),
                        textLabel.leadingAnchor.constraint(equalTo: myCardResult.leadingAnchor, constant: 16),
                        textLabel.trailingAnchor.constraint(equalTo: myCardResult.trailingAnchor, constant: -16),

                        subTextLabel.topAnchor.constraint(equalTo: textLabel.bottomAnchor, constant: 35),
                        subTextLabel.centerXAnchor.constraint(equalTo: myCardResult.centerXAnchor),

                        percentTextLabel.topAnchor.constraint(equalTo: subTextLabel.bottomAnchor, constant: 10),
                        percentTextLabel.centerXAnchor.constraint(equalTo: myCardResult.centerXAnchor),
                        
                        percentTextLabel.bottomAnchor.constraint(equalTo: myCardResult.bottomAnchor)
            ])
    }

    func updateQuestionTitle(number: String){
        titleQuestionsLabel.text = "Pergunta \(number) de 10"
    }
    func resetCards() {
        cards.forEach{ $0.setSelection(false)}
    }
    func showRestartButton(){
        myButtonResponse.isHidden = true
        buttonRestartQuiz.isHidden = false
    }
    func resetToQuizMode(){
        myButtonResponse.isHidden = false
        buttonRestartQuiz.isHidden = true
    }
    func showCardResultTotal(){
        scrollView.isHidden = true
        cardsStackView.isHidden = true
        
        titleQuestionsLabel.isHidden = true
        questionsLabel.isHidden = true
        myButtonResponse.isHidden = true
        
        logoWinnerView.isHidden = false
        myCardResult.isHidden = false
        textLabel.isHidden = false
        subTextLabel.isHidden = false
        percentTextLabel.isHidden = false
    }
    func showQuizAgain(){
        scrollView.isHidden = false
        cardsStackView.isHidden = false
        
        cards.forEach { $0.setSelection(false)}
        
        titleQuestionsLabel.isHidden = false
        questionsLabel.isHidden = false
        
        logoWinnerView.isHidden = true
        myCardResult.isHidden = true
        textLabel.isHidden = true
        subTextLabel.isHidden = true
        percentTextLabel.isHidden = true
    }
    func showLoading() {
        cardsStackView.isHidden = true
        questionsLabel.text = ""
        loadingView.startAnimating()
    }

    func hideLoading() {
        cardsStackView.isHidden = false
        loadingView.stopAnimating()
    }
}
