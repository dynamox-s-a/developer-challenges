//
//  SplashViewController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

class SplashViewController: UIViewController {
    
    let contentView = SplashView()
    let viewModel = HomeViewModel()
    
    public weak var flowDelegate: SplashFlowDelegate?
    
    init(flowDelegate: SplashFlowDelegate? = nil) {
        self.flowDelegate = flowDelegate
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func loadView() {
        view = contentView
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        contentView.animateLogo()
    }
}
