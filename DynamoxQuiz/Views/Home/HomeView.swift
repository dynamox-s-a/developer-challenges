//
//  HomeView.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

class HomeView: UIView {
    
    public weak var delegate: HomeDelegate?
    
    let myButtonResponse = ButtonViewComponent(title: "Iniciar Quiz")

    
    private let titleLabel: UILabel = {
        let label = UILabel()
        label.text = "Quiz"
        label.font = .systemFont(ofSize: 22, weight: .bold)
        label.textColor = .black
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    private let subLabel: UILabel = {
        let label = UILabel()
        label.text = "Teste seus conhecimentos com 10 perguntas"
        label.font = .systemFont(ofSize: 16, weight: .medium)
        label.textColor = .gray
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let inputName: UITextField = {
        let name = UITextField()
        name.placeholder = "Informe seu nome: "
        name.layer.cornerRadius = 6
        name.layer.borderWidth = 0.5
        name.translatesAutoresizingMaskIntoConstraints = false
        name.returnKeyType = .done
        
        name.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 12, height: 0))
        name.leftViewMode = .always
        
        return name
    }()

    override init(frame: CGRect) {
        super.init(frame: frame)
        
        myButtonResponse.setAction{ [weak self] in
            self?.homeButtonDidTaped()
        }
        
        backgroundColor = .white
        
        setupUI()
        setupConstraints()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI(){
        addSubview(titleLabel)
        addSubview(subLabel)
        addSubview(inputName)
        addSubview(myButtonResponse)
        
    }
    private func setupConstraints(){
        NSLayoutConstraint.activate([
            titleLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -20),
            
            subLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 12),
            subLabel.centerXAnchor.constraint(equalTo: titleLabel.centerXAnchor),
            
            inputName.topAnchor.constraint(equalTo: subLabel.bottomAnchor, constant: 12),
            inputName.centerXAnchor.constraint(equalTo: subLabel.centerXAnchor),
            inputName.widthAnchor.constraint(equalToConstant: 300),
            inputName.heightAnchor.constraint(equalToConstant: 40),
            
            myButtonResponse.topAnchor.constraint(equalTo: inputName.bottomAnchor, constant: 12),
            myButtonResponse.centerXAnchor.constraint(equalTo: inputName.centerXAnchor),
            myButtonResponse.widthAnchor.constraint(equalToConstant: 300),
            myButtonResponse.heightAnchor.constraint(equalToConstant: 40),
        ])
    }
    @objc
    private func homeButtonDidTaped(){
        let userNickName = inputName.text ?? ""
        delegate?.sendNickNameUser(nickName: userNickName)
    }
}
