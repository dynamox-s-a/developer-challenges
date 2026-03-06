//
//  ProfileViewModel.swift
//  DynamoxQuiz
//
//  Created by Mateus on 05/03/26.
//

import SwiftUI
import Combine

final class ProfileViewModel: ObservableObject {
    @Published var user: String = ""
}
