//
//  ContentView.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 12/07/26.
//

import SwiftUI
import DynaUI

struct ContentView: View {
    var body: some View {
        VStack {
            DynaOptionButton("Continuar") {
                print("DynaButton pressionado")
            }
        }
        .padding(24)
    }
}

#Preview {
    ContentView()
}
