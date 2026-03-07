//
//  UserRepository.swift
//  DynamoxQuiz
//
//  Created by Mateus on 07/03/26.
//
import CoreData

class UserRepository {
    private let context = CoreDataStack.shared.context
    
    func saveUser(name: String, imageData: Data?) {
        let user = fetchUser() ?? NSEntityDescription.insertNewObject(
            forEntityName: "User",
            into: context
        )
        user.setValue(name, forKey: "name")
        user.setValue(imageData, forKey: "profileImage")
        save()
    }
    func fetchUser() -> NSManagedObject? {
        let request = NSFetchRequest<NSManagedObject>(entityName: "User")
        return try? context.fetch(request).first
    }
    
    private func save() {
        guard context.hasChanges else { return }
        try? context.save()
    }
}
