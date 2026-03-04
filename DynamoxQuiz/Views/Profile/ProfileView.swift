//
//  ProfileView.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import UIKit

class ProfileView: UIView {
    
    let profileImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.translatesAutoresizingMaskIntoConstraints = false
        return imageView
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
        setupConstraints()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupUI(){
        addSubview(profileImageView)
    }
    private func setupConstraints(){
        NSLayoutConstraint.activate([
            
        ])
    }
}
