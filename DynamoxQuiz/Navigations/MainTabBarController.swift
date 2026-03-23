//
//  MainTabBarController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import UIKit

class MainTabBarController: UITabBarController {
    let flowController: AppCoordinator
    let profileViewModel: ProfileViewModel
    
    init(profileViewModel: ProfileViewModel) {
        self.profileViewModel = profileViewModel
        self.flowController = AppCoordinator(
            profileViewModel: profileViewModel
        )
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    
    override func viewDidLoad() {
    
        super.viewDidLoad()
        setupTabs()
        setupAppearence()
    }
    
    private func setupTabs() {
        
        let quizVC = QuizViewController(profileViewModel: profileViewModel)
        let profileVC = ProfileViewController(profileViewModel: profileViewModel)
        
        quizVC.tabBarItem = UITabBarItem(
            title: "Home",
            image: UIImage(systemName: "house"),
            tag: 0
        )
        
        
        profileVC.tabBarItem = UITabBarItem(
            title: "Perfil",
            image: UIImage(systemName: "person"),
            tag: 1
        )
        viewControllers = [
            UINavigationController(rootViewController: quizVC),
            UINavigationController(rootViewController: profileVC)
        ]
    }
    
    private func setupAppearence(){
        let apperance = UITabBarAppearance()
        apperance.configureWithOpaqueBackground()
        apperance.backgroundColor = .white
        
        apperance.stackedLayoutAppearance.selected.iconColor = Colors.primaryGreenBase
        apperance.stackedLayoutAppearance.selected.titleTextAttributes = [
            .foregroundColor: Colors.primaryGreenBase
        ]
        
        apperance.stackedLayoutAppearance.normal.iconColor = Colors.primaryGreenBase
        apperance.stackedLayoutAppearance.normal.titleTextAttributes = [
            .foregroundColor: Colors.primaryGreenBase
        ]
        tabBar.standardAppearance = apperance
        tabBar.scrollEdgeAppearance = apperance
    }
}
