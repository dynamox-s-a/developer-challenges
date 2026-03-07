//
//  QuizRepository.swift
//  DynamoxQuiz
//
//  Created by Mateus on 05/03/26.
//

import CoreData

class QuizRepository {
    
    private let context = CoreDataStack.shared.context
    
    func create(name: String, correct: Int16, total: Int16, rounds: Int32){
        let match = NSEntityDescription.insertNewObject(
            forEntityName: "HistoryQuiz",
            into: context
        )
        
        match.setValue(correct, forKey: "correctAnswers")
        match.setValue(total, forKey: "totalQuestions")
        match.setValue(rounds, forKey: "totalRounds")
        match.setValue(Date(), forKey: "date")
        
        save()
    }
    
    func search() -> [NSManagedObject] {
        let request = NSFetchRequest<NSManagedObject>(entityName: "HistoryQuiz")
        request.sortDescriptors = [NSSortDescriptor(key: "date", ascending: false)]
        
        do {
            return try context.fetch(request)
        } catch {
            print("Erro ao salvar. \(error)")
            return []
        }
    }
    public func save() {
        guard context.hasChanges else { return }
        do {
            try context.save()
        } catch {
            print("Erro ao salvar: \(error)")
        }
    }
    
}
