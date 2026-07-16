//
//  AppDependenciesConfigurator.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import dDependencies
import dNetwork
import Foundation

enum AppDependenciesConfigurator {

    static func configure() {
        registerNetworkClient()
        registerPlayerRepository()
    }

    private static func registerNetworkClient() {
        guard let baseURL = URL(
            string: "https://quiz-api-bwi5hjqyaq-uc.a.run.app/"
        ) else {
            preconditionFailure("Invalid quiz API base URL.")
        }

        let configuration = NetworkConfiguration(
            baseURL: baseURL,
            defaultHeaders: [
                "Accept": "application/json",
                "Content-Type": "application/json"
            ],
            timeoutInterval: 30
        )

        let networkClient: NetworkClient = URLSessionNetworkClient(configuration: configuration) {
            let decoder = JSONDecoder()
            decoder.keyDecodingStrategy = .convertFromSnakeCase
            return decoder
        }

        Dependencies.register(
            networkClient,
            as: NetworkClient.self
        )
    }
    
    private static func registerPlayerRepository() {
        let repository: PlayerRepository = UserDefaultsPlayerRepository()

        Dependencies.register(
            repository,
            as: PlayerRepository.self
        )
    }
}
