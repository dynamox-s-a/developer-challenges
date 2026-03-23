//
//  CoreDataStack.swift
//  DynamoxQuiz
//
//  Created by Mateus on 05/03/26.
//

import CoreData

class CoreDataStack {
    static let shared = CoreDataStack()
    
    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "QuizEntity")
        
        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Erro ao carregar o Core Data: \(error)")
            }
        }
        return container
    }()
    
    var context : NSManagedObjectContext {
        return persistentContainer.viewContext
    }
}
