package com.dynamox.quizchallenge.di

import com.dynamox.quizchallenge.BuildConfig
import com.dynamox.quizchallenge.data.remote.QuizApi
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import java.io.IOException
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

private const val BASE_URL = "https://quiz-api-bwi5hjqyaq-uc.a.run.app/"
private const val TIMEOUT_SECONDS = 15L

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideJson(): Json = Json { ignoreUnknownKeys = true }

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }
        return OkHttpClient.Builder()
            .connectTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .readTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .addInterceptor(RetryInterceptor())
            .addInterceptor(logging)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, json: Json): Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
        .build()

    @Provides
    @Singleton
    fun provideQuizApi(retrofit: Retrofit): QuizApi = retrofit.create(QuizApi::class.java)
}

private class RetryInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val maxRetries = 2
        var attempt = 0
        while (true) {
            try {
                return chain.proceed(chain.request())
            } catch (e: IOException) {
                if (attempt >= maxRetries) {
                    throw e
                }
                attempt++
                try {
                    // Backoff: 500ms, 1000ms...
                    Thread.sleep(500L * attempt)
                } catch (_: InterruptedException) {
                    Thread.currentThread().interrupt()
                    throw e
                }
            }
        }
    }
}
