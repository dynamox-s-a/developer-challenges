package com.andrebritovita.quizapp.di

import com.andrebritovita.quizapp.data.remote.QuizApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton


/**
 * Módulo Hilt responsável por fornecer instâncias relacionadas à camada de Rede.
 *
 * - Configura o Retrofit com Gson converter.
 * - Cria um OkHttpClient padrão.
 * - Expõe o serviço QuizApi como singleton para toda a aplicação.
 *
 */
private const val BASE_URL = "https://quiz-api-bwi5hjqyaq-uc.a.run.app/"
@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideRetrofit (): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(OkHttpClient.Builder().build())
            .build()
    }

    @Provides
    @Singleton
    fun provideQuizApi(retrofit: Retrofit): QuizApi {
        return retrofit.create(QuizApi::class.java)
    }
}