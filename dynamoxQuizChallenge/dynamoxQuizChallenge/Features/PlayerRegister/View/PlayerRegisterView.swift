//
//  PlayerRegisterView.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 20/02/26.
//

import SwiftUI

struct PlayerRegisterView: View {
    @State private var viewModel = PlayerRegisterViewModel()
    let onStart: (String) -> Void
    let onOpenResults: () -> Void
    var body: some View {
        ZStack {
            LinearGradient(
                stops: viewModel.backgroundGradientStops,
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 0) {
                header
                Spacer().frame(height: 36)
                logo
                    .padding(.bottom, 28)
                
                titleBlock
                    .padding(.horizontal, 28)
                Spacer().frame(height: 26)
                form
                    .padding(.horizontal, 22)
                Spacer().frame(height: 18)
                startButton
                    .padding(.horizontal, 22)
                Spacer()
            }
        }
        .alert("Invalid Name", isPresented: $viewModel.isShowingAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
    }

    var header: some View {
        HStack {
            // Placeholder para ficar com o titulo alinhado.
            Image(systemName: "")
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(Color.clear) // invisível
                .padding(10)
                .frame(width: 44, height: 44)
            Spacer()
            Text(viewModel.headerTitle)
                .font(.system(size: 16, weight: .semibold, design: .rounded))
                .foregroundStyle(.white.opacity(0.92))
            Spacer()
            Button {
                onOpenResults()
            } label : {
                Image(systemName: "trophy.fill")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(viewModel.accentColor)
                    .padding(10)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 22)
        .padding(.top, 14)
    }
    var logo: some View {
        ZStack {
            Circle()
                .fill(viewModel.accentColor.opacity(0.28))
                .frame(width: 128, height: 128)
                .blur(radius: 18)
            Circle()
                .fill(.white)
                .frame(width: 118, height: 118)
                .overlay(
                    Circle()
                        .stroke(Color.black.opacity(0.35), lineWidth: 2)
                )
            
            Image(systemName: "questionmark.message")
                .font(.system(size: 34, weight: .bold))
                .foregroundStyle(viewModel.accentColor)
        }
    }

    var titleBlock: some View {
        VStack(spacing: 10) {
            Text(viewModel.title)
                .font(.system(size: 25, weight: .heavy, design: .rounded))
                .foregroundStyle(viewModel.accentColor)
                .multilineTextAlignment(.center)
            Text(viewModel.subtitle)
                .font(.system(size: 15, weight: .medium, design: .rounded))
                .foregroundStyle(.white.opacity(0.55))
                .multilineTextAlignment(.center)
        }
    }

    var form: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(viewModel.nameLabel)
                .font(.system(size: 13, weight: .semibold, design: .rounded))
                .foregroundStyle(.white.opacity(0.70))
            HStack(spacing: 10) {
                Image(systemName: "person.fill")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(viewModel.accentColor.opacity(0.75))
                TextField(viewModel.namePlaceholder, text: $viewModel.userName)
                    .textInputAutocapitalization(.words)
                    .autocorrectionDisabled(true)
                    .foregroundColor(.white.opacity(0.90))
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 14)
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(Color.white.opacity(0.06))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .stroke(viewModel.errorMessage == nil ? Color.white.opacity(0.06) : viewModel.accentColor.opacity(0.9), lineWidth: 1)
            )
            
            HStack {
                           Spacer()
                Text("\(viewModel.userName.count)/\(viewModel.maxLength)")
                               .font(.system(size: 12, weight: .semibold, design: .rounded))
                               .foregroundStyle(.white.opacity(0.35))
                       }
                       .padding(.horizontal, 4)
        }
    }

    var startButton: some View {
        Button {
            Task {
                if let userName = await viewModel.startPressed() {
                    onStart(userName)
                }
            }
        } label: {
            HStack(spacing: 10) {
                Text(viewModel.startButtonTitle)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 18, weight: .bold))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(viewModel.accentColor)
                    .shadow(
                        color: viewModel.accentColor.opacity(0.35),
                        radius: 17,
                        x: 0,
                        y: 10
                    )
            )
            .scaleEffect(viewModel.isStartPressed ? 0.97 : 1.0)
            .opacity(viewModel.canStart ? 1.0 : 0.45)
        }
        .buttonStyle(.plain)
        .disabled(!viewModel.canStart)
    }
}

#Preview {
    PlayerRegisterView { string in
        
    } onOpenResults: {
    
    }

}
