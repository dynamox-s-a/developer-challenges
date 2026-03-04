//
//  QuestionCardComponent.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

class QuestionCardComponent: UIView {
    
    var onSelect: (() -> Void)?
    
    var isSelected: Bool = false
    
    
    private lazy var btnResult: UIButton = {
        let btnRes = UIButton(type: .system)
            btnRes.backgroundColor = .white
            btnRes.layer.cornerRadius = 12
            btnRes.translatesAutoresizingMaskIntoConstraints = false
            
            btnRes.layer.shadowColor = UIColor.black.cgColor
            btnRes.layer.shadowOpacity = 0.15
            btnRes.layer.shadowOffset = CGSize(width: 0, height: 4)
            btnRes.layer.shadowRadius = 6
        
            btnRes.addTarget(self, action: #selector(handleBtnClick), for: .touchUpInside)
        return btnRes
    }()
    
    private let textLabel: UILabel = {
        let label = UILabel()
        
        label.font = .systemFont(ofSize: 18, weight: .semibold)
        label.textColor = .black
        
        
        label.numberOfLines = 0
        label.lineBreakMode = .byWordWrapping
        label.textAlignment = .left
        
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    init(title: String){
        super.init(frame: .zero)
    
        
        textLabel.text = title
            
        setupUI()
        setupConstraints()
        
        translatesAutoresizingMaskIntoConstraints = false
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupSelfClass(){
        layer.cornerRadius = 10
        translatesAutoresizingMaskIntoConstraints = false
    }
    
    private func setupUI(){
        backgroundColor = .white
        
        addSubview(btnResult)
        btnResult.addSubview(textLabel)
        
    }
    
    private func setupConstraints(){
        NSLayoutConstraint.activate([
            btnResult.topAnchor.constraint(equalTo: topAnchor),
            btnResult.leadingAnchor.constraint(equalTo: leadingAnchor),
            btnResult.trailingAnchor.constraint(equalTo: trailingAnchor),
            btnResult.bottomAnchor.constraint(equalTo: bottomAnchor),
            
            textLabel.topAnchor.constraint(equalTo: btnResult.topAnchor, constant: 15),
            textLabel.leadingAnchor.constraint(equalTo: btnResult.leadingAnchor, constant: 20),
            textLabel.trailingAnchor.constraint(equalTo: btnResult.trailingAnchor, constant: -20),
            textLabel.bottomAnchor.constraint(equalTo: btnResult.bottomAnchor, constant: -15)
        ])
    }
    @objc private func handleBtnClick() {
            onSelect?()
        print("cliquei -> isChecked is true")
    }

    func setSelection(_ isSelected: Bool) {
        self.isSelected = isSelected
        
        btnResult.layer.borderWidth = isSelected ? 1.0 : 0
        btnResult.layer.borderColor = isSelected ? UIColor.systemCyan.cgColor : nil
    }
    func configure(with text: String){
        textLabel.text = text
    }
    func getAnswerText() -> String? {
        return self.textLabel.text
    }
}
