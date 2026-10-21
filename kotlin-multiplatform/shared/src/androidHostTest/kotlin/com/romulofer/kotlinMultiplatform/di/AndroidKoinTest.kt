package com.romulofer.kotlinMultiplatform.di

import assertk.assertThat
import assertk.assertions.hasSize
import assertk.assertions.isEqualTo
import assertk.assertions.isInstanceOf
import assertk.assertions.isNotNull
import com.romulofer.kotlinMultiplatform.domain.model.Language.Portuguese
import com.romulofer.kotlinMultiplatform.domain.repository.PlayerRepository
import com.romulofer.kotlinMultiplatform.domain.repository.ScoreRepository
import com.romulofer.kotlinMultiplatform.domain.repository.SettingsRepository
import com.romulofer.kotlinMultiplatform.presentation.navigation.Navigator
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.engine.okhttp.OkHttpEngine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.koin.android.ext.koin.androidContext
import org.koin.core.Koin
import org.koin.core.context.stopKoin
import org.koin.mp.KoinPlatform
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [35])
class AndroidKoinTest {

    private lateinit var koin: Koin

    @Before
    fun setUp() {
        initKoin { androidContext(RuntimeEnvironment.getApplication()) }
        koin = KoinPlatform.getKoin()
    }

    @After
    fun tearDown() = stopKoin()

    @Test
    fun usesOkHttpOnAndroid() {
        assertThat(koin.get<HttpClientEngine>()).isInstanceOf<OkHttpEngine>()
    }

    @Test
    fun savesAScoreInTheDeviceDatabase() = runBlocking {
        val player = koin.get<PlayerRepository>().getOrCreate("Ana")
        val scores = koin.get<ScoreRepository>()

        scores.save(player.id, correct = 6, total = 10)

        val scoreboard = scores.observeScoreboard().first()
        assertThat(scoreboard).hasSize(1)
        assertThat(scoreboard.single().playerName).isEqualTo("Ana")
        assertThat(scoreboard.single().correctAnswers).isEqualTo(6)
    }

    @Test
    fun keepsTheLanguageInTheDeviceDatabase() = runBlocking {
        val settings = koin.get<SettingsRepository>()

        settings.setLanguage(Portuguese)

        assertThat(settings.observeLanguage().first()).isEqualTo(Portuguese)
    }

    @Test
    fun startsWithoutExtraConfiguration() {
        stopKoin()

        initKoin()

        assertThat(KoinPlatform.getKoin().getOrNull<Navigator>()).isNotNull()
    }
}
