//
//  RaisedCard.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import SwiftUI

struct RaisedCard<Content: View>: View {
    @ViewBuilder var content: () -> Content

    var body: some View {
        content()
            .background {
                ZStack {
                    RoundedRectangle(
                        cornerRadius: 17,
                        style: .continuous
                    )
                    .fill(Color.black)
                    .offset(y: 4)

                    RoundedRectangle(
                        cornerRadius: 17,
                        style: .continuous
                    )
                    .fill(Color.white)

                    RoundedRectangle(
                        cornerRadius: 17,
                        style: .continuous
                    )
                    .stroke(Color.black, lineWidth: 2)
                }
            }
    }
}

#Preview {
    RaisedCard {
        Text("Kiyo")
            .padding()
    }
}
