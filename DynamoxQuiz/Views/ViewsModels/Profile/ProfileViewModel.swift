//
//  ProfileViewModel.swift
//  DynamoxQuiz
//
//  Created by Mateus on 05/03/26.
//

import SwiftUI
import Combine
import CoreData

final class ProfileViewModel: ObservableObject {
    private let userDefaultsKey = "savedUserName"
    
    @Published var user: String {
        didSet {
            UserDefaults.standard.set(user, forKey: userDefaultsKey)
        }
    }

    @Published var match: [NSManagedObject] = []
    
    private let repository: QuizRepository
    
    init(repository: QuizRepository = QuizRepository()) {
        self.user = UserDefaults.standard.string(forKey: userDefaultsKey) ?? ""
        self.repository = repository
    }
    
    var hasUser: Bool {
        !user.trimmingCharacters(in: .whitespaces).isEmpty
    }
    
    var totalPlay: Int {
        match.count
    }
    
    var correctPlay: String {
        guard !match.isEmpty else { return "0%" }
        
        let totalCorrect = match.compactMap{ $0.value(forKey: "correctAnswer") as? Int16 }
        let totalQuestions = match.compactMap{ $0.value(forKey: "totalQuestions") as? Int16 }
        
        let sumCorrect = totalCorrect.reduce(0, +)
        let sumTotal = totalQuestions.reduce(0, +)
        
        guard sumTotal > 0 else { return "0%" }
        
        let media = (Double(sumCorrect) / Double(sumTotal)) * 100.0
        return "\(Int(media))%"
    }
    func loadMatch() {
        match = repository.search()
    }
    
    func saveProfileImage(_ image: UIImage){
        guard let data = image.jpegData(compressionQuality: 0.8) else { return }
        
        let url = getImageUrl()
        try? data.write(to: url)
    }
    
    func loadProfileImage() -> UIImage? {
        let url = getImageUrl()
        
        guard let data = try? Data(contentsOf: url) else { return nil }
        
        return UIImage(data: data)
    }
    
    private func getImageUrl() -> URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("profileImage.jpg")
    }
}
