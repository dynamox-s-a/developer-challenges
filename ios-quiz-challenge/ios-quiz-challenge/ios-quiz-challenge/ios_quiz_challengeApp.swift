//
//  ios_quiz_challengeApp.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 12/07/26.
//

import SwiftUI
import SwiftData

@main
struct ios_quiz_challengeApp: App {
    
    init() {
        AppDependenciesConfigurator.configure()
        AppLaunchConfiguration.configureForUITestsIfNeeded()
    }

    var body: some Scene {
        WindowGroup {
            AppFlowView()
        }
    }
}
