//
//  CardViewComponent.swift
//  DynamoxQuiz
//
//  Created by Mateus on 05/03/26.
//

import SwiftUI

struct CardViewComponent: View {
    
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            VStack {
                Text(title)
                    .font(.headline)
                    .bold()
                Text(value)
                    .font(.subheadline)
            }
            .frame(width: 100, height: 80)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(Colors.primaryGreenBase), lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
        }
        .padding(.horizontal, 8)
    }
}
