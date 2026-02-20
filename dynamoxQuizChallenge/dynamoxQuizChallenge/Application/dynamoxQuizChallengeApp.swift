//
//  dynamoxQuizChallengeApp.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import SwiftUI
import SwiftData

@main
struct dynamoxQuizChallengeApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
          
        }
        .modelContainer(sharedModelContainer)
    }
}
