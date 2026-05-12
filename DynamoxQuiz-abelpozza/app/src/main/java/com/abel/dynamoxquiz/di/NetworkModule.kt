package com.abel.dynamoxquiz.di

import com.abel.dynamoxquiz.data.remote.QuizApiService
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object NetworkModule {

    private const val BASE_URL =
        "https://quiz-api-bwi5hjqyaq-uc.a.run.app/"

    private val loggingInterceptor =
        HttpLoggingInterceptor().apply {

            level = HttpLoggingInterceptor.Level.BODY
        }

    private val okHttpClient =
        OkHttpClient.Builder()

            .addInterceptor(loggingInterceptor)

            .connectTimeout(
                30,
                TimeUnit.SECONDS
            )

            .readTimeout(
                30,
                TimeUnit.SECONDS
            )

            .writeTimeout(
                30,
                TimeUnit.SECONDS
            )

            .build()

    private val retrofit =
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(
                GsonConverterFactory.create()
            )
            .build()

    val quizApiService: QuizApiService =
        retrofit.create(QuizApiService::class.java)
}