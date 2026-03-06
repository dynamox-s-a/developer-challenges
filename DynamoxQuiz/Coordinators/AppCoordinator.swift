//
//  DynamoxFlowController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import Foundation
import UIKit

class AppCoordinator {
    private let profileViewModel: ProfileViewModel
    private var navigationController: UINavigationController?
    
    public init(profileViewModel: ProfileViewModel){
        self.profileViewModel = profileViewModel
    }
    
    func start() -> UIViewController?{
        if profileViewModel.hasUser {
            return MainTabBarController(profileViewModel: profileViewModel)
        } else {
            let nav = UINavigationController(rootViewController:
                HomeViewController(flowDelegate: self, profileViewModel: profileViewModel))
            return nav
        }
    }
}

// MARK: - Splash

extension AppCoordinator: SplashFlowDelegate {
    func navigateToHome() {
        let homeVC = HomeViewController(flowDelegate: self, profileViewModel: profileViewModel) 
        navigationController?.setViewControllers([homeVC], animated: true)
    }
}


// MARK: Home

extension AppCoordinator: HomeFlowDelegate {
    func navigateToQuiz() {
        
        let quizVC = QuizViewController(profileViewModel: profileViewModel)
        quizVC.view.backgroundColor = .white
        let quizNav = UINavigationController(rootViewController: quizVC)
        quizNav.tabBarItem = UITabBarItem(title: "Home", image: UIImage(systemName: "house"), tag: 0)
        
        let profileVC = ProfileViewController(profileViewModel: profileViewModel)
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
