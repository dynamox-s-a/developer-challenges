//
//  ProfileView.swift
//  DynamoxQuiz
//
//  Created by Mateus on 03/03/26.
//

import SwiftUI
import CoreData

import PhotosUI

struct ProfileView: View {
    @ObservedObject var viewModel: ProfileViewModel
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var profileImage: UIImage?
    
    
    
    var body: some View {
        ZStack {
            Color(Colors.lightGrayBase)
                .ignoresSafeArea()
            
            ScrollView {
                VStack {
                    
                    PhotosPicker(selection: $selectedPhoto, matching: .images) { [profileImage] in
                        ProfileImageView(image: profileImage)
                    }
                    
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
                            matchCard(match: match)
                        }
                        
                    }
                }
                .frame(maxWidth: .infinity, alignment: .top)
                .padding(.top, 20)
            }
        }
        .onAppear {
            viewModel.loadMatch()
            profileImage = viewModel.loadProfileImage()
        }
        .onChange(of: selectedPhoto) { _ in
            Task {
                guard let item = selectedPhoto else { return }

                if let data = try? await item.loadTransferable(type: Data.self),
                   let image = UIImage(data: data) {
                    profileImage = image
                    viewModel.saveProfileImage(image)
                }
            }
        }
    }
            @ViewBuilder
            private func matchCard(match: NSManagedObject) -> some View {
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
