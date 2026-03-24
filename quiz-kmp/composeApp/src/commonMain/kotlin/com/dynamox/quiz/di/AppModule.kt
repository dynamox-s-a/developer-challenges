package com.dynamox.quiz.di

import com.dynamox.quiz.data.api.QuizApiService
import com.dynamox.quiz.data.api.createHttpClient
import com.dynamox.quiz.data.local.createDatabase
import com.dynamox.quiz.data.repository.QuizRepositoryImpl
import com.dynamox.quiz.domain.repository.QuizRepository
import com.dynamox.quiz.domain.usecase.GetLeaderboardUseCase
import com.dynamox.quiz.domain.usecase.GetOrCreatePlayerUseCase
import com.dynamox.quiz.domain.usecase.GetQuestionUseCase
import com.dynamox.quiz.domain.usecase.SaveQuizScoreUseCase
import com.dynamox.quiz.domain.usecase.SubmitAnswerUseCase
import com.dynamox.quiz.presentation.screens.leaderboard.LeaderboardViewModel
import com.dynamox.quiz.presentation.screens.login.LoginViewModel
import com.dynamox.quiz.presentation.screens.quiz.QuizViewModel
import com.dynamox.quiz.presentation.screens.result.ResultViewModel
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.bind
import org.koin.dsl.module

/**
 * Módulo Koin para dependências de rede.
 *
 * 'single' = Singleton: cria UMA instância compartilhada em toda a aplicação.
 * O HttpClient e o QuizApiService são "caros" para criar, então é correto
 * tê-los como singletons, isso evita criar múltiplas conexões TCP.
 *
 * Ordem de criação:
 * 1. createHttpClient() > cria o HttpClient configurado
 * 2. QuizApiService(get()) > Koin injeta automaticamente o HttpClient acima
 */
val networkModule = module {
    single { createHttpClient() }
    single { QuizApiService(get()) }
}

/**
 * Módulo Koin para o banco de dados SQLite.
 *
 * Singleton: o banco de dados deve ser uma única instância para
 * evitar conflitos de acesso concorrente e múltiplas conexões ao arquivo .db.
 *
 * 'createDatabase(get())': o Koin injeta automaticamente o DatabaseDriverFactory
 * que é registrado no androidModule.
 */
val databaseModule = module {
    single { createDatabase(get()) }
}

/**
 * Módulo Koin para o repositório.
 *
 * 'singleOf(::QuizRepositoryImpl)' é uma DSL moderna do Koin 4 equivalente a: single { QuizRepositoryImpl(get(), get()) }
 *
 * 'bind QuizRepository::class' instrui o Koin a registrar a implementação
 * sob a interface. Assim, ao injetar QuizRepository em qualquer lugar,
 * o Koin fornece QuizRepositoryImpl — sem que o código cliente saiba disso.
 * Isso é o Princípio da Inversão de Dependência (DIP do SOLID).
 */
val repositoryModule = module {
    singleOf(::QuizRepositoryImpl) bind QuizRepository::class
}

/**
 * Módulo Koin para os Use Cases.
 *
 * Factory: cria uma NOVA instância a cada injeção. Criar um novo a cada uso garante thread-safety.
 *
 * OBS: 'factoryOf(::GetQuestionUseCase)' equivale a: factory { GetQuestionUseCase(get()) }
 * O Koin injeta automaticamente o QuizRepository no construtor.
 */
val useCaseModule = module {
    factoryOf(::GetQuestionUseCase)
    factoryOf(::SubmitAnswerUseCase)
    factoryOf(::GetOrCreatePlayerUseCase)
    factoryOf(::SaveQuizScoreUseCase)
    factoryOf(::GetLeaderboardUseCase)
}

/**
 * Módulo Koin para os ViewModels.
 *
 * Também usa 'factoryOf' pois cada tela cria seu próprio ViewModel gerenciado pelo ciclo de vida do Compose.
 *
 */
val viewModelModule = module {
    factoryOf(::LoginViewModel)
    factoryOf(::QuizViewModel)
    factoryOf(::ResultViewModel)
    factoryOf(::LeaderboardViewModel)
}

/**
 * Lista com todos os módulos comuns
 * Usada na inicialização do Koin em QuizApplication.kt junto com o androidModule
 */
val appModules = listOf(
    networkModule,
    databaseModule,
    repositoryModule,
    useCaseModule,
    viewModelModule
)
