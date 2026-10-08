package br.com.govanidebastiani.dynamoxquiz

import androidx.compose.ui.window.ComposeUIViewController
import br.com.govanidebastiani.dynamoxquiz.app.App
import br.com.govanidebastiani.dynamoxquiz.di.initKoin

fun MainViewController() = ComposeUIViewController(
    configure = {
        initKoin()
    }
) {
    App()
}