//
//  ViewSnapshotTesting.swift
//  ios-quiz-challengeTests
//
//  Created by João Marcus Dionisio Araujo on 16/07/26.
//

import SwiftUI
import UIKit
import XCTest

struct ViewSnapshotConfiguration {
    let name: String
    let size: CGSize

    static let iPhone15 = ViewSnapshotConfiguration(
        name: "iPhone15",
        size: CGSize(width: 393, height: 852)
    )
}

class ViewSnapshotTestCase: XCTestCase {

    override func setUpWithError() throws {
        try super.setUpWithError()
        continueAfterFailure = false
    }

    @MainActor
    func assertSnapshot<Content: View>(
        matching view: Content,
        named name: String,
        record: Bool = false,
        configuration: ViewSnapshotConfiguration = .iPhone15,
        filePath: StaticString = #filePath,
        line: UInt = #line
    ) throws {
        let data = renderPNGData(
            from: view,
            size: configuration.size
        )
        let snapshotURL = snapshotFileURL(
            named: name,
            configuration: configuration,
            filePath: filePath
        )

        if record {
            try write(data, to: snapshotURL)
            attachImage(
                data,
                named: "Recorded \(name)"
            )
            XCTFail(
                "Recorded snapshot at \(snapshotURL.path). Disable record mode before committing or running CI.",
                file: filePath,
                line: line
            )
            return
        }

        guard FileManager.default.fileExists(
            atPath: snapshotURL.path
        ) else {
            attachImage(
                data,
                named: "Missing \(name)"
            )
            XCTFail(
                "Missing snapshot at \(snapshotURL.path). Set record: true to record it.",
                file: filePath,
                line: line
            )
            return
        }

        let referenceData = try Data(contentsOf: snapshotURL)

        guard data == referenceData else {
            let diffData = makeDiffPNGData(
                referenceData: referenceData,
                receivedData: data
            )

            if let comparisonData = makeComparisonPNGData(
                referenceData: referenceData,
                receivedData: data,
                diffData: diffData
            ) {
                attachImage(
                    comparisonData,
                    named: "Snapshot Failure \(name)"
                )
            } else {
                attachImage(
                    data,
                    named: "Snapshot Failure \(name)"
                )
            }

            XCTFail(
                "Snapshot mismatch for \(snapshotURL.lastPathComponent). See Snapshot Failure attachment.",
                file: filePath,
                line: line
            )
            return
        }
    }
}

private extension ViewSnapshotTestCase {

    @MainActor
    func renderPNGData<Content: View>(
        from view: Content,
        size: CGSize
    ) -> Data {
        let hostingController = UIHostingController(
            rootView: view
                .environment(\.colorScheme, .light)
        )
        let window = UIWindow(
            frame: CGRect(origin: .zero, size: size)
        )
        window.rootViewController = hostingController
        window.makeKeyAndVisible()

        hostingController.view.frame = window.bounds
        hostingController.view.backgroundColor = .clear
        hostingController.view.setNeedsLayout()
        hostingController.view.layoutIfNeeded()

        let image = UIGraphicsImageRenderer(
            size: size
        ).image { _ in
            hostingController.view.drawHierarchy(
                in: hostingController.view.bounds,
                afterScreenUpdates: true
            )
        }

        return image.pngData() ?? Data()
    }

    func snapshotFileURL(
        named name: String,
        configuration: ViewSnapshotConfiguration,
        filePath: StaticString
    ) -> URL {
        let testFileURL = URL(
            fileURLWithPath: String(describing: filePath)
        )
        let testFileName = testFileURL
            .deletingPathExtension()
            .lastPathComponent
        let snapshotDirectory = testFileURL
            .deletingLastPathComponent()
            .appendingPathComponent("__Snapshots__")
            .appendingPathComponent(testFileName)

        return snapshotDirectory
            .appendingPathComponent("\(sanitized(name))-\(configuration.name).png")
    }

    func sanitized(_ name: String) -> String {
        name
            .replacingOccurrences(of: "(", with: "")
            .replacingOccurrences(of: ")", with: "")
            .replacingOccurrences(of: " ", with: "-")
            .replacingOccurrences(of: "/", with: "-")
    }

    func write(
        _ data: Data,
        to url: URL
    ) throws {
        try FileManager.default.createDirectory(
            at: url.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )

        try data.write(to: url)
    }

    func attachImage(
        _ data: Data,
        named name: String
    ) {
        guard let image = UIImage(data: data) else {
            return
        }

        let attachment = XCTAttachment(image: image)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    func makeComparisonPNGData(
        referenceData: Data,
        receivedData: Data,
        diffData: Data?
    ) -> Data? {
        guard
            let referenceImage = UIImage(data: referenceData),
            let receivedImage = UIImage(data: receivedData)
        else {
            return nil
        }

        let diffImage = diffData.flatMap(UIImage.init(data:))
        let images = [referenceImage, receivedImage] + [diffImage].compactMap { $0 }
        let labelHeight: CGFloat = 36
        let spacing: CGFloat = 8
        let maxHeight = images.map(\.size.height).max() ?? 0
        let totalWidth = images.map(\.size.width).reduce(0, +)
            + spacing * CGFloat(images.count - 1)
        let size = CGSize(
            width: totalWidth,
            height: maxHeight + labelHeight
        )

        let renderer = UIGraphicsImageRenderer(size: size)
        let image = renderer.image { context in
            UIColor.white.setFill()
            context.cgContext.fill(
                CGRect(origin: .zero, size: size)
            )

            var x: CGFloat = 0
            let labels = diffImage == nil
                ? ["Reference", "Received"]
                : ["Reference", "Received", "Diff"]

            for (index, image) in images.enumerated() {
                labels[index].draw(
                    at: CGPoint(x: x + 8, y: 8),
                    withAttributes: [
                        .font: UIFont.boldSystemFont(ofSize: 18),
                        .foregroundColor: UIColor.black
                    ]
                )

                image.draw(at: CGPoint(x: x, y: labelHeight))
                x += image.size.width + spacing
            }
        }

        return image.pngData()
    }

    func makeDiffPNGData(
        referenceData: Data,
        receivedData: Data
    ) -> Data? {
        guard
            let referenceImage = UIImage(data: referenceData)?.cgImage,
            let receivedImage = UIImage(data: receivedData)?.cgImage
        else {
            return nil
        }

        let width = max(referenceImage.width, receivedImage.width)
        let height = max(referenceImage.height, receivedImage.height)

        guard
            let referencePixels = pixels(from: referenceImage, width: width, height: height),
            let receivedPixels = pixels(from: receivedImage, width: width, height: height)
        else {
            return nil
        }

        var diffPixels = [UInt8](
            repeating: 255,
            count: width * height * 4
        )

        for offset in stride(from: 0, to: diffPixels.count, by: 4) {
            let matches = referencePixels[offset] == receivedPixels[offset]
                && referencePixels[offset + 1] == receivedPixels[offset + 1]
                && referencePixels[offset + 2] == receivedPixels[offset + 2]
                && referencePixels[offset + 3] == receivedPixels[offset + 3]

            if matches {
                diffPixels[offset] = 245
                diffPixels[offset + 1] = 245
                diffPixels[offset + 2] = 245
                diffPixels[offset + 3] = 255
            } else {
                diffPixels[offset] = 255
                diffPixels[offset + 1] = 0
                diffPixels[offset + 2] = 255
                diffPixels[offset + 3] = 255
            }
        }

        return pngData(from: diffPixels, width: width, height: height)
    }

    func pixels(
        from image: CGImage,
        width: Int,
        height: Int
    ) -> [UInt8]? {
        var pixels = [UInt8](repeating: 0, count: width * height * 4)
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue

        let didDraw = pixels.withUnsafeMutableBytes { buffer in
            guard let context = CGContext(
                data: buffer.baseAddress,
                width: width,
                height: height,
                bitsPerComponent: 8,
                bytesPerRow: width * 4,
                space: colorSpace,
                bitmapInfo: bitmapInfo
            ) else {
                return false
            }

            context.draw(
                image,
                in: CGRect(x: 0, y: 0, width: image.width, height: image.height)
            )
            return true
        }

        return didDraw ? pixels : nil
    }

    func pngData(
        from pixels: [UInt8],
        width: Int,
        height: Int
    ) -> Data? {
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue
        let data = Data(pixels)

        guard
            let provider = CGDataProvider(data: data as CFData),
            let image = CGImage(
                width: width,
                height: height,
                bitsPerComponent: 8,
                bitsPerPixel: 32,
                bytesPerRow: width * 4,
                space: colorSpace,
                bitmapInfo: CGBitmapInfo(rawValue: bitmapInfo),
                provider: provider,
                decode: nil,
                shouldInterpolate: false,
                intent: .defaultIntent
            )
        else {
            return nil
        }

        return UIImage(cgImage: image).pngData()
    }
}
