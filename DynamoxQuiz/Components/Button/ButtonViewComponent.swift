//
//  ButtonViewComponent.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

class ButtonViewComponent: UIButton {
    
    private var action: (() -> Void)?
    
    init(title: String){
        super.init(frame: .zero)
        
        setTitle(title, for: .normal)
        setTitleColor(.white, for: .normal)
        titleLabel?.font = .systemFont(ofSize: 16, weight: .bold)
        backgroundColor = Colors.primaryGreenBase
        layer.cornerRadius = 6
        translatesAutoresizingMaskIntoConstraints = false
        
        addTarget(self, action: #selector(buttonTapped), for: .touchUpInside)
    }
    
    func setAction(_ action: @escaping () -> Void){
        self.action = action
    }
    
    
    @objc private func buttonTapped() {
        action?()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
