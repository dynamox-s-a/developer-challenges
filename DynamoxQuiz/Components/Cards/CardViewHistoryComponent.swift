//
//  CardViewHistoryComponent.swift
//  DynamoxQuiz
//
//  Created by Mateus on 05/03/26.
//

import SwiftUI

struct CardViewHistoryComponent: View {
    
    let icon: String
    let title: String
    let date: String
    let store: String
    
    var body: some View {
        
        HStack(spacing: 12) {
            
            Image(systemName: icon)
                .resizable()
                .scaledToFit()
                .frame(width: 34, height: 34)
                .padding(12)
                .foregroundStyle(Color.white)
                .background(Color(Colors.primaryGreenBase))
                .cornerRadius(.infinity)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .bold()
                Text(date)
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
                        
            Spacer()
                                
            VStack(spacing: 2) {
                
                Text(store)
                    .font(.title3)
                    .bold()
                    .foregroundStyle(Color(Colors.primaryGreenBase))
                
                Text("acerto")
                    .font(.caption2)
                    .foregroundStyle(.gray)
            }
    
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color(Colors.primaryGreenBase).opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 8))
            
        }
        .padding()
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(Colors.primaryGreenBase).opacity(0.5), lineWidth: 1)
        )
        .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
        .padding(.horizontal)
        
    }
}
