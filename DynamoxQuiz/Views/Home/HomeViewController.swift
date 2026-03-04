//
//  HomeViewController.swift
//  DynamoxQuiz
//
//  Created by Mateus on 02/03/26.
//

import UIKit

class HomeViewController: UIViewController{
    
    let homeView = HomeView()
    let viewModel = HomeViewModel()
    
    public weak var flowDelegate: HomeFlowDelegate?
    
    override func loadView() {
        view = homeView
    }
    
    init(flowDelegate: HomeFlowDelegate){
        self.flowDelegate = flowDelegate
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        homeView.delegate = self
        bindViewModel()
    }
    
    private func bindViewModel(){
        viewModel.succesResult = { [weak self] in
            self?.flowDelegate?.navigateToQuiz()
        }
    }
}
extension HomeViewController: HomeDelegate{
    
    func sendNickNameUser(nickName: String) {
        viewModel.itsOkay(userNick: nickName)
    }
}
