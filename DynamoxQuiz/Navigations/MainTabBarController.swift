//
//  MainTabBarController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import UIKit

class MainTabBarController: UITabBarController {
    let flowController = DynamoxFlowController()
    
    override func viewDidLoad() {
    
        super.viewDidLoad()
        setupTabs()
        setupAppearence()
    }
    
    private func setupTabs() {
        
        let homeVC = HomeViewController(flowDelegate: flowController)
        let profileVC = ProfileViewController()
        
        homeVC.tabBarItem = UITabBarItem(
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
            UINavigationController(rootViewController: homeVC),
            UINavigationController(rootViewController: profileVC)
        ]
    }
    
    private func setupAppearence(){
        let apperance = UITabBarAppearance()
        apperance.configureWithOpaqueBackground()
        
        tabBar.backgroundColor = .gray
        
        apperance.stackedLayoutAppearance.selected.iconColor = .systemCyan
        apperance.stackedLayoutAppearance.selected.titleTextAttributes = [
            .foregroundColor: UIColor.systemCyan
        ]
        
        apperance.stackedLayoutAppearance.normal.iconColor = .systemCyan
        apperance.stackedLayoutAppearance.normal.titleTextAttributes = [
            .foregroundColor: UIColor.systemGray
        ]
        tabBar.standardAppearance = apperance
        tabBar.scrollEdgeAppearance = apperance
    }
}
