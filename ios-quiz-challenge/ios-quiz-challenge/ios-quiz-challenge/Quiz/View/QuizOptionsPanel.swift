//
//  QuizOptionsPanel.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 13/07/26.
//

import SwiftUI
import DynaUI

struct QuizOptionsPanel: View {
    
    enum Constants {
        static let rootTrailingPadding: CGFloat = 8
        static let rootBottomPadding: CGFloat = 8
        
        static let optionsCardShadowViewCornerRadius: CGFloat = 21
        static let optionsCardShadowViewBorderSize: CGFloat = 2
        static let optionsCardShadowViewInitialOffset: CGFloat = 500
        static let optionsCardShadowViewFinalOffset: CGFloat = 8
        static let optionsCardShadowViewVerticalOffset: CGFloat = 8
        
        static let optionsSpacing: CGFloat = 6
        static let purpleOptionsCardVerticalPadding: CGFloat = 16
        static let purpleOptionsCardHorizontalPadding: CGFloat = 8
        static let purpleOptionsCardCornerRadius: CGFloat = 21
        static let purpleOptionsCardInitialOffset: CGFloat = -500
    }
    
    let options: [QuizOption]

    @Binding var selectedOptionID: QuizOption.ID?

    let showPinkShadow: Bool
    let showPurpleCard: Bool
    let visibleOptionCount: Int
    let onAnswer: (QuizOption) -> Void

    var body: some View {
        ZStack {
            optionsCardShadowView
            purpleOptionsCard
        }
        .padding(.trailing, Constants.rootTrailingPadding)
        .padding(.bottom, Constants.rootBottomPadding)
    }

    private var optionsCardShadowView: some View {
        RoundedRectangle(
            cornerRadius: Constants.optionsCardShadowViewCornerRadius,
            style: .continuous
        )
        .fill(QuizPalette.pink)
        .overlay {
            RoundedRectangle(
                cornerRadius: Constants.optionsCardShadowViewCornerRadius,
                style: .continuous
            )
            .stroke(Color.black, lineWidth: Constants.optionsCardShadowViewBorderSize)
        }
        .offset(
            x: showPinkShadow
                ? Constants.optionsCardShadowViewFinalOffset
                : Constants.optionsCardShadowViewInitialOffset,
            y: Constants.optionsCardShadowViewVerticalOffset
        )
        .opacity(showPinkShadow ? 1 : .zero)
    }

    private var purpleOptionsCard: some View {
        VStack(spacing: Constants.optionsSpacing) {
            ForEach(
                Array(options.enumerated()),
                id: \.element.id
            ) { index, option in
                let isVisible = index < visibleOptionCount

                DynaOptionButton(
                    option.title,
                    state: buttonState(for: option),
                    isEnabled: isVisible
                ) {
                    select(option)
                }
                .opacity(isVisible ? 1 : .zero)
                .scaleEffect(isVisible ? 1 : 0.62)
            }
        }
        .padding(.vertical, Constants.purpleOptionsCardVerticalPadding)
        .padding(.horizontal, Constants.purpleOptionsCardHorizontalPadding)
        .background {
            RoundedRectangle(
                cornerRadius: Constants.purpleOptionsCardCornerRadius,
                style: .continuous
            )
            .fill(QuizPalette.purple)
        }
        .overlay {
            RoundedRectangle(
                cornerRadius: Constants.purpleOptionsCardCornerRadius,
                style: .continuous
            )
            .stroke(Color.black, lineWidth: 2)
        }
        .offset(x: showPurpleCard
                ? .zero
                : Constants.purpleOptionsCardInitialOffset)
        .opacity(showPurpleCard ? 1 : .zero)
    }

    private func buttonState(
        for option: QuizOption
    ) -> DynaOptionButton.State {
        selectedOptionID == option.id
            ? .selected
            : .idle
    }

    private func select(_ option: QuizOption) {
        withAnimation(
            .spring(
                response: 0.3,
                dampingFraction: 0.7,
                blendDuration: 0
            )
        ) {
            selectedOptionID = option.id
        }

        onAnswer(option)
    }
}


#Preview {
    @Previewable @State var selectedOptionID: QuizOption.ID?
    VStack {
        QuizOptionsPanel(
            options: [
                .init(title: "Option 1"),
                .init(title: "Option 2"),
                .init(title: "Option 3"),
                .init(title: "Option 4")
            ],
            selectedOptionID: $selectedOptionID,
            showPinkShadow: true,
            showPurpleCard: true,
            visibleOptionCount: 4
        ) { option in
            
        }
    }
}
