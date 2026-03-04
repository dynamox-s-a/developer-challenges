//
//  DynamoxFlowController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import Foundation
import UIKit

class DynamoxFlowController {
    private var navigationController: UINavigationController?
    
    public init(){
        
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func start() -> UINavigationController?{
        let startHomeViewController = HomeViewController(flowDelegate: self)
        self.navigationController = UINavigationController(rootViewController: startHomeViewController)
        return navigationController
    }
}

// MARK: - Splash

extension DynamoxFlowController: SplashFlowDelegate {
    func navigateToHome() {
        let homeVC = HomeViewController(flowDelegate: self) 
        navigationController?.setViewControllers([homeVC], animated: true)
    }
}


// MARK: Home

extension DynamoxFlowController: HomeFlowDelegate {
    func navigateToQuiz() {
        
        let quizVC = QuizViewController()
        quizVC.view.backgroundColor = .white
        let quizNav = UINavigationController(rootViewController: quizVC)
        quizNav.tabBarItem = UITabBarItem(title: "Home", image: UIImage(systemName: "house"), tag: 0)
        
        let profileVC = ProfileViewController()
        let profileNav = UINavigationController(rootViewController: profileVC)
        profileNav.tabBarItem = UITabBarItem(title: "Perfil", image: UIImage(systemName: "person"), tag: 1)
        
        let tabBar = UITabBarController()
        tabBar.viewControllers = [quizNav, profileNav]
        
        if let window = UIApplication.shared.connectedScenes
            .compactMap({ $0 as? UIWindowScene })
            .first?.windows.first {
            window.rootViewController = tabBar
            window.makeKeyAndVisible()
        }
    }
}
