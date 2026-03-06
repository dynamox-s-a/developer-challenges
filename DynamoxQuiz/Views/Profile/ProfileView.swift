//
//  ProfileView.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import SwiftUI
import CoreData

struct ProfileView: View {
    @ObservedObject var viewModel: ProfileViewModel
    
    var body: some View {
        ZStack {
            Color(Colors.lightGrayBase)
                .ignoresSafeArea()
            
            ScrollView {
                VStack {
                    Image(systemName: "person.circle.fill")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 120, height: 120)
                        .clipShape(Circle())
                        .foregroundStyle(Color(Colors.primaryGreenBase))
                    
                    Text(viewModel.user)
                        .font(.title)
                        .bold()
                        .foregroundStyle(.black)
                        .padding()
                    
                    HStack(spacing: 16) {
                        CardViewComponent(title: "Jogados", value: "\(viewModel.totalPlay)")
                    }
                    
                    VStack {
                        Text("Histórico de Quizzes")
                            .font(.title3)
                            .bold()
                            .padding()
                        
                        ForEach(viewModel.match, id: \.objectID) { match in
                            let correct = match.value(forKey: "correctAnswers") as? Int16 ?? 0
                            let total = match.value(forKey: "totalQuestions") as? Int16 ?? 0
                            let date = match.value(forKey: "date") as? Date ?? Date()
                            let percent = total > 0 ? Int((Double(correct) / Double(total)) * 100) : 0
                            
                            CardViewHistoryComponent(
                                icon: "trophy",
                                title: "Acertos: \(correct) de \(total) perguntas",
                                date: date.formatted(.dateTime.day().month()),
                                store: "\(percent)%"
                            )
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .top) 
                .padding(.top, 20)
            }
        }
        .onAppear {
            viewModel.loadMatch()
        }
    }
}
