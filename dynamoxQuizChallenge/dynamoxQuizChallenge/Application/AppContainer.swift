//
//  AppContainer.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 21/02/26.
//

import Foundation
import SwiftData

struct AppContainer {
    let apiClient: NetworkClientProtocol
    let quizRepository: QuizRepositoryProtocol
    let scoreStore: ScoreStoreProtocol
    
    init(modelContext: ModelContext) {
        let baseURL = URL(string: "https://quiz-api-bwi5hjqyaq-uc.a.run.app")!
        let client = URLURLSessionNetworkClient(baseURL: baseURL)
        self.apiClient = client
        
        self.quizRepository = QuizRepository(apiClient: client)
        self.scoreStore = ScoreStore(context: modelContext)
        
    }

    func makeQuizViewModel(userName: String) -> QuizViewModel {
        QuizViewModel(
            repository: quizRepository,
            scoreStore: scoreStore,
            userName: userName
        )
    }

    func makeMatchResultViewModel() -> MatchResultViewModel {
        MatchResultViewModel(scoreStore: scoreStore)
    }
}
