//
//  DynaPanel.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 14/07/26.
//

import SwiftUI

public enum DynaPanelLayout {
    case vertical
    case horizontal

    var scrollAxis: Axis.Set {
        switch self {
        case .vertical:
            return .vertical

        case .horizontal:
            return .horizontal
        }
    }
}

@MainActor
public struct DynaPanelStyle {
    public var backgroundColor: Color
    public var shadowColor: Color
    public var borderColor: Color

    public var borderWidth: CGFloat
    public var cornerRadius: CGFloat

    public var shadowOffset: CGSize

    public var contentInsets: EdgeInsets
    public var itemSpacing: CGFloat
    public var headerContentSpacing: CGFloat

    public init(
        backgroundColor: Color,
        shadowColor: Color,
        borderColor: Color = .black,
        borderWidth: CGFloat = 2,
        cornerRadius: CGFloat = 21,
        shadowOffset: CGSize = .init(width: 8, height: 8),
        contentInsets: EdgeInsets = .init(
            top: 16,
            leading: 8,
            bottom: 16,
            trailing: 8
        ),
        itemSpacing: CGFloat = 8,
        headerContentSpacing: CGFloat = 12
    ) {
        self.backgroundColor = backgroundColor
        self.shadowColor = shadowColor
        self.borderColor = borderColor
        self.borderWidth = borderWidth
        self.cornerRadius = cornerRadius
        self.shadowOffset = shadowOffset
        self.contentInsets = contentInsets
        self.itemSpacing = itemSpacing
        self.headerContentSpacing = headerContentSpacing
    }

    public static let `default` = DynaPanelStyle(
        backgroundColor: Color(
            red: 0.42,
            green: 0.20,
            blue: 1
        ),
        shadowColor: Color(
            red: 1,
            green: 0.23,
            blue: 0.52
        )
    )
}

public struct DynaPanelMotion {
    public var panelInitialEdge: Edge
    public var shadowInitialEdge: Edge
    public var distance: CGFloat

    public init(
        panelInitialEdge: Edge = .leading,
        shadowInitialEdge: Edge = .trailing,
        distance: CGFloat = 500
    ) {
        self.panelInitialEdge = panelInitialEdge
        self.shadowInitialEdge = shadowInitialEdge
        self.distance = distance
    }

    public static func opposingHorizontal(
        distance: CGFloat = 500
    ) -> DynaPanelMotion {
        DynaPanelMotion(
            panelInitialEdge: .leading,
            shadowInitialEdge: .trailing,
            distance: distance
        )
    }
}

public struct DynaPanel<Header: View, Content: View>: View {
    private let layout: DynaPanelLayout
    private let scrollsContent: Bool

    private let style: DynaPanelStyle
    private let motion: DynaPanelMotion

    private let isPanelVisible: Bool
    private let isShadowVisible: Bool
    private let hasHeader: Bool

    private let header: Header
    private let content: Content

    public init(
        layout: DynaPanelLayout = .vertical,
        scrollsContent: Bool = false,
        style: DynaPanelStyle = .default,
        motion: DynaPanelMotion = .opposingHorizontal(),
        isPanelVisible: Bool = true,
        isShadowVisible: Bool = true,
        @ViewBuilder header: () -> Header,
        @ViewBuilder content: () -> Content
    ) {
        self.layout = layout
        self.scrollsContent = scrollsContent
        self.style = style
        self.motion = motion
        self.isPanelVisible = isPanelVisible
        self.isShadowVisible = isShadowVisible
        self.hasHeader = true
        self.header = header()
        self.content = content()
    }

    private init(
        layout: DynaPanelLayout,
        scrollsContent: Bool,
        style: DynaPanelStyle,
        motion: DynaPanelMotion,
        isPanelVisible: Bool,
        isShadowVisible: Bool,
        hasHeader: Bool,
        header: Header,
        content: Content
    ) {
        self.layout = layout
        self.scrollsContent = scrollsContent
        self.style = style
        self.motion = motion
        self.isPanelVisible = isPanelVisible
        self.isShadowVisible = isShadowVisible
        self.hasHeader = hasHeader
        self.header = header
        self.content = content
    }

    public var body: some View {
        panelSurface
            .offset(panelOffset)
            .opacity(isPanelVisible ? 1 : 0)
            .background {
                panelShadow
            }
            .padding(
                .leading,
                max(0, -style.shadowOffset.width)
            )
            .padding(
                .trailing,
                max(0, style.shadowOffset.width)
            )
            .padding(
                .top,
                max(0, -style.shadowOffset.height)
            )
            .padding(
                .bottom,
                max(0, style.shadowOffset.height)
            )
    }

    private var panelSurface: some View {
        VStack(
            alignment: .leading,
            spacing: style.headerContentSpacing
        ) {
            if hasHeader {
                header
                    .frame(
                        maxWidth: .infinity,
                        alignment: .leading
                    )
            }

            arrangedContent
        }
        .padding(style.contentInsets)
        .background {
            panelShape
                .fill(style.backgroundColor)
        }
        .overlay {
            panelShape
                .stroke(
                    style.borderColor,
                    lineWidth: style.borderWidth
                )
        }
    }

    @ViewBuilder
    private var arrangedContent: some View {
        if scrollsContent {
            ScrollView(
                layout.scrollAxis,
                showsIndicators: false
            ) {
                stackContent
            }
        } else {
            stackContent
        }
    }

    @ViewBuilder
    private var stackContent: some View {
        switch layout {
        case .vertical:
            VStack(spacing: style.itemSpacing) {
                content
            }
            .frame(maxWidth: .infinity)

        case .horizontal:
            HStack(spacing: style.itemSpacing) {
                content
            }
        }
    }

    private var panelShadow: some View {
        panelShape
            .fill(style.shadowColor)
            .overlay {
                panelShape
                    .stroke(
                        style.borderColor,
                        lineWidth: style.borderWidth
                    )
            }
            .offset(shadowOffset)
            .opacity(isShadowVisible ? 1 : 0)
    }

    private var panelShape: RoundedRectangle {
        RoundedRectangle(
            cornerRadius: style.cornerRadius,
            style: .continuous
        )
    }

    private var panelOffset: CGSize {
        guard !isPanelVisible else {
            return .zero
        }

        return hiddenOffset(
            for: motion.panelInitialEdge
        )
    }

    private var shadowOffset: CGSize {
        let entranceOffset: CGSize

        if isShadowVisible {
            entranceOffset = .zero
        } else {
            entranceOffset = hiddenOffset(
                for: motion.shadowInitialEdge
            )
        }

        return CGSize(
            width: style.shadowOffset.width
                + entranceOffset.width,
            height: style.shadowOffset.height
                + entranceOffset.height
        )
    }

    private func hiddenOffset(
        for edge: Edge
    ) -> CGSize {
        switch edge {
        case .top:
            return CGSize(
                width: 0,
                height: -motion.distance
            )

        case .leading:
            return CGSize(
                width: -motion.distance,
                height: 0
            )

        case .bottom:
            return CGSize(
                width: 0,
                height: motion.distance
            )

        case .trailing:
            return CGSize(
                width: motion.distance,
                height: 0
            )
        }
    }
}

// MARK: - Sem header

public extension DynaPanel where Header == EmptyView {
    init(
        layout: DynaPanelLayout = .vertical,
        scrollsContent: Bool = false,
        style: DynaPanelStyle = .default,
        motion: DynaPanelMotion = .opposingHorizontal(),
        isPanelVisible: Bool = true,
        isShadowVisible: Bool = true,
        @ViewBuilder content: () -> Content
    ) {
        self.init(
            layout: layout,
            scrollsContent: scrollsContent,
            style: style,
            motion: motion,
            isPanelVisible: isPanelVisible,
            isShadowVisible: isShadowVisible,
            hasHeader: false,
            header: EmptyView(),
            content: content()
        )
    }
}

// MARK: - Com título simples

public extension DynaPanel where Header == DynaPanelTitle {
    init(
        title: String,
        layout: DynaPanelLayout = .vertical,
        scrollsContent: Bool = false,
        style: DynaPanelStyle = .default,
        motion: DynaPanelMotion = .opposingHorizontal(),
        isPanelVisible: Bool = true,
        isShadowVisible: Bool = true,
        titleFont: Font = .headline,
        titleColor: Color = .primary,
        @ViewBuilder content: () -> Content
    ) {
        self.init(
            layout: layout,
            scrollsContent: scrollsContent,
            style: style,
            motion: motion,
            isPanelVisible: isPanelVisible,
            isShadowVisible: isShadowVisible,
            hasHeader: true,
            header: DynaPanelTitle(
                title,
                font: titleFont,
                color: titleColor
            ),
            content: content()
        )
    }
}

public struct DynaPanelTitle: View {
    private let title: String
    private let font: Font
    private let color: Color

    public init(
        _ title: String,
        font: Font = .headline,
        color: Color = .primary
    ) {
        self.title = title
        self.font = font
        self.color = color
    }

    public var body: some View {
        Text(title)
            .font(font)
            .foregroundStyle(color)
            .frame(
                maxWidth: .infinity,
                alignment: .leading
            )
    }
}

public struct DynaPanelHeader<Leading: View, Trailing: View>: View {
    private let title: String
    private let titleFont: Font
    private let titleColor: Color
    private let spacing: CGFloat

    private let leading: Leading
    private let trailing: Trailing

    public init(
        title: String,
        titleFont: Font = .headline,
        titleColor: Color = .primary,
        spacing: CGFloat = 8,
        @ViewBuilder leading: () -> Leading,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.titleFont = titleFont
        self.titleColor = titleColor
        self.spacing = spacing
        self.leading = leading()
        self.trailing = trailing()
    }

    public var body: some View {
        HStack(spacing: spacing) {
            leading

            Text(title)
                .font(titleFont)
                .foregroundStyle(titleColor)

            Spacer(minLength: spacing)

            trailing
        }
        .frame(maxWidth: .infinity)
    }
}


#Preview {
    @Previewable var options: [String] = ["Poodle", "Husky", "Golden Retriever"]
    DynaPanel(
        title: "Choose a category",
        layout: .horizontal,
        scrollsContent: true,
        titleColor: .white
    ) {
        ForEach(
            options.enumerated(),
            id: \.element.self
        ) { index, option in
            DynaOptionButton(option) {}
        }
    }
    
    VStack{
        DynaPanel(
            layout: .horizontal,
            scrollsContent: false
        ) {
            DynaPanelHeader(
                title: "Power-ups",
                titleColor: .white
            ) {
                
                Circle()
                    .foregroundStyle(.black)
                    .frame(width: 26, height: 26)
                    .overlay {
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 14))
                            .foregroundStyle(.black)
                            .background {
                                Circle()
                                    .frame(width: 22, height: 22)
                                    .foregroundStyle(.white)
                            }
                            .offset(CGSize(width: -1, height: -1))
                    }
                
            } trailing: {
                Button("See all") {
                    print("See all")
                }
                .foregroundStyle(.white)
            }
            .padding(.horizontal, 4)
            
            Text("Kiyo")
                .foregroundStyle(.white)
                .font(Font.system(size: 48, weight: .bold))
                .frame(maxWidth: .infinity)
        } content: {
            HStack {
                ForEach(
                    options.enumerated(),
                    id: \.element.self
                ) { index, option in
                    DynaOptionButton(option) {}
                }
            }
            .padding(.horizontal, 4)
        }
        
        DynaPanel(
            title: "Select an answer",
            layout: .vertical,
            titleFont: .system(
                size: 18,
                weight: .bold
            ),
            titleColor: .white
        ) {
            ForEach(
                options.enumerated(),
                id: \.element.self
            ) { index, option in
                DynaOptionButton(option) {}
            }
        }
    }
}
