//
//  QuizOptionsPanel.swift
//  ios-quiz-challenge
//
//  Created by João Marcus Dionisio Araujo on 13/07/26.
//

import SwiftUI
import DynaUI

struct QuizOptionsPanel: View {
    private enum Constants {
        static let optionInitialScale: CGFloat = 0.62
    }
    
    let options: [QuizOption]
    
    @Binding var selectedOptionID: QuizOption.ID?
    let answerResult: Bool?
    let isAnswering: Bool
    
    let showPinkShadow: Bool
    let showPurpleCard: Bool
    let visibleOptionCount: Int
    
    let onAnswer: (QuizOption) -> Void
    
    var body: some View {
        DynaPanel(
            layout: .vertical,
            style: .default,
            motion: .opposingHorizontal(
                distance: 500
            ),
            isPanelVisible: showPurpleCard,
            isShadowVisible: showPinkShadow,
        ) {
            ForEach(
                Array(options.enumerated()),
                id: \.element.id
            ) { index, option in
                optionButton(
                    option,
                    at: index
                )
            }
        }
    }
    
    private func optionButton(
        _ option: QuizOption,
        at index: Int
    ) -> some View {
        let isVisible = index < visibleOptionCount
        
        return DynaOptionButton(
            option.title,
            state: buttonState(for: option),
            isEnabled: isVisible
            && !isAnswering
            && answerResult == nil
        ) {
            onAnswer(option)
        }
        .opacity(isVisible ? 1 : .zero)
        .scaleEffect(isVisible ? 1 : 0.62)
    }
    
    private func buttonState(for option: QuizOption) -> DynaOptionButton.State {
        guard selectedOptionID == option.id else {
            return .idle
        }
        
        guard let answerResult else {
            return .selected
        }
        
        return answerResult
        ? .correct
        : .incorrect
    }
    
    private func select(
        _ option: QuizOption
    ) {
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

private extension DynaPanelStyle {
    static let quizOptions = DynaPanelStyle(
        backgroundColor: QuizPalette.purple,
        shadowColor: QuizPalette.pink,
        borderColor: .black,
        borderWidth: 2,
        cornerRadius: 21,
        shadowOffset: CGSize(
            width: 8,
            height: 8
        ),
        contentInsets: EdgeInsets(
            top: 16,
            leading: 8,
            bottom: 16,
            trailing: 8
        ),
        itemSpacing: 6
    )
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
            answerResult: true,
            isAnswering: false,
            showPinkShadow: true,
            showPurpleCard: true,
            visibleOptionCount: 4
        ) { option in
            
        }
    }
    .frame(height: .zero)
}
