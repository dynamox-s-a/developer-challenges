//
//  ToastMesageComponent.swift
//  DynamoxQuiz
//
//  Created by Mateus on 08/03/26.
//

import SwiftUI
import UIKit

struct ToastMessageComponent: View {
    let message: String
    
    var body: some View {
        Text(message)
            .foregroundStyle(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color(Colors.primaryGreenBase))
            .cornerRadius(8)
    }
    
    static func show(message: String, in viewController: UIViewController) {
        let toast = UIHostingController(rootView: ToastMessageComponent(message: message))
        toast.view.backgroundColor = .clear
        toast.view.translatesAutoresizingMaskIntoConstraints = false
        
        viewController.addChild(toast)
        viewController.view.addSubview(toast.view)
        toast.didMove(toParent: viewController)
        
        NSLayoutConstraint.activate([
            toast.view.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor),
            toast.view.bottomAnchor.constraint(equalTo: viewController.view.safeAreaLayoutGuide.bottomAnchor, constant: -82)
        ])
        
        toast.view.alpha = 0
        UIView.animate(withDuration: 0.3) { toast.view.alpha = 1 }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            UIView.animate(withDuration: 0.3, animations: {
                toast.view.alpha = 0
            }) { _ in
                toast.view.removeFromSuperview()
                toast.removeFromParent()
            }
        }
    }
}
