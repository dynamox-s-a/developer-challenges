//
//  DynaOptionButton.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 12/07/26.
//

import SwiftUI

public struct DynaOptionButton: View {

    public enum State: Equatable {
        case idle
        case selected
        case correct
        case incorrect
    }

    private let title: String
    private let state: State
    private let isEnabled: Bool
    private let action: () -> Void

    public init(
        _ title: String,
        state: State = .idle,
        isEnabled: Bool = true,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.state = state
        self.isEnabled = isEnabled
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .multilineTextAlignment(.center)
                .foregroundColor(foregroundColor)
                .padding(.horizontal, 16)
                .frame(maxWidth: .infinity)
                .frame(minHeight: 44)
        }
        .buttonStyle(
            DynaOptionButtonStyle(
                backgroundColor: backgroundColor,
                borderColor: borderColor
            )
        )
        .disabled(!isEnabled)
        .accessibilityLabel(title)
        .accessibilityAddTraits(
            state == .selected ? .isSelected : []
        )
    }
}

private extension DynaOptionButton {

    var backgroundColor: Color {
        switch state {
        case .idle:
            return .white

        case .selected:
            return Color(
                red: 0.42,
                green: 0.21,
                blue: 1
            )

        case .correct:
            return Color(
                red: 0.16,
                green: 0.68,
                blue: 0.35
            )

        case .incorrect:
            return Color(
                red: 0.91,
                green: 0.22,
                blue: 0.27
            )
        }
    }

    var foregroundColor: Color {
        switch state {
        case .idle:
            return .black

        case .selected, .correct, .incorrect:
            return .white
        }
    }

    var borderColor: Color {
        .black
    }
}

private struct DynaOptionButtonStyle: ButtonStyle {

    let backgroundColor: Color
    let borderColor: Color

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background {
                ZStack {
                    RoundedRectangle(
                        cornerRadius: 17,
                        style: .continuous
                    )
                    .fill(Color.black)
                    .offset(
                        y: configuration.isPressed ? 1 : 4
                    )

                    RoundedRectangle(
                        cornerRadius: 17,
                        style: .continuous
                    )
                    .fill(backgroundColor)

                    RoundedRectangle(
                        cornerRadius: 17,
                        style: .continuous
                    )
                    .stroke(
                        borderColor,
                        lineWidth: 2
                    )
                }
            }
            .contentShape(
                RoundedRectangle(
                    cornerRadius: 17,
                    style: .continuous
                )
            )
            .offset(
                y: configuration.isPressed ? 3 : 0
            )
            .scaleEffect(
                configuration.isPressed ? 0.99 : 1
            )
            .padding(.bottom, 4)
            .animation(
                .easeOut(duration: 0.08),
                value: configuration.isPressed
            )
    }
}

struct DynaOptionButton_Previews: PreviewProvider {

    static var previews: some View {
        VStack(spacing: 16) {
            DynaOptionButton("Husky") {}

            DynaOptionButton(
                "Pitbull",
                state: .selected
            ) {}

            DynaOptionButton(
                "Shiba Inu",
                state: .correct
            ) {}

            DynaOptionButton(
                "Golden Retriever",
                state: .incorrect
            ) {}
        }
        .padding(24)
        .background(Color.gray.opacity(0.15))
        .previewLayout(.sizeThatFits)
    }
}
