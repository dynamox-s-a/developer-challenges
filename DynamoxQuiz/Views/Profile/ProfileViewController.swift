//
//  ProfileViewController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import UIKit
import SwiftUI

class ProfileViewController: UIViewController {
    
    let profileView: ProfileViewModel
    
    init(profileViewModel: ProfileViewModel) {
        self.profileView = profileViewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let profileView = ProfileView(viewModel: profileView)
        let hostingController = UIHostingController(rootView: profileView)

        addChild(hostingController)
        view.addSubview(hostingController.view)

        hostingController.view.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
            hostingController.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            hostingController.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            hostingController.view.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])

        hostingController.didMove(toParent: self)
    }
    private func goToQuiz() {
        let quizVC = QuizViewController(profileViewModel: profileView)
        navigationController?.pushViewController(quizVC, animated: false)
    }
}
