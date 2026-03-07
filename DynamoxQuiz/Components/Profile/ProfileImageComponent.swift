//
//  ProfileImageComponent.swift
//  DynamoxQuiz
//
//  Created by Mateus on 07/03/26.
//

import SwiftUI

struct ProfileImageView: View {
    let image: UIImage?
    
    var body: some View {
        if let image {
            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .frame(width: 120, height: 120)
                .clipShape(Circle())
        } else {
            Image(systemName: "person.circle.fill")
                .resizable()
                .scaledToFill()
                .frame(width: 120, height: 120)
                .clipShape(Circle())
                .foregroundStyle(Color(Colors.primaryGreenBase))
        }
    }
}
