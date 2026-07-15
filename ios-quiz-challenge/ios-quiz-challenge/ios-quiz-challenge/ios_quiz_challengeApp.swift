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
    }
    
    var body: some Scene {
        WindowGroup {
            QuizConfigurator.make(
                questionNumber: 1,
                totalQuestions: 10,
                score: 120,
                remainingSeconds: 5
            )
        }
    }
}
