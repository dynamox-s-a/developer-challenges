import SwiftUI
import ComposeApp

@main
struct iOSApp: App {

    init() {
        IosKoinModuleKt.initKoin()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}