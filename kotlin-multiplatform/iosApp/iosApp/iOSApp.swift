import SwiftUI
import Shared

@main
struct iOSApp: App {
    init() {
        IosKoinKt.setUpIosKoin()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
