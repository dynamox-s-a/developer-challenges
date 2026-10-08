package br.com.govanidebastiani.dynamoxquiz.di

import br.com.geovanidebastiani.dynamoxquiz.db.DynamoxQuizDatabase
import br.com.geovanidebastiani.dynamoxquiz.db.FetchQuizById
import br.com.govanidebastiani.dynamoxquiz.core.data.DatabaseFactory
import br.com.govanidebastiani.dynamoxquiz.core.data.HttpClientFactory
import br.com.govanidebastiani.dynamoxquiz.player.data.local.PlayerLocalDataSource
import br.com.govanidebastiani.dynamoxquiz.player.data.repository.PlayerRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.player.domain.repository.PlayerRepository
import br.com.govanidebastiani.dynamoxquiz.player.domain.usecase.CreatePlayerUseCase
import br.com.govanidebastiani.dynamoxquiz.player.presentation.PlayerViewModel
import br.com.govanidebastiani.dynamoxquiz.quiz.data.local.QuizLocalDataSource
import br.com.govanidebastiani.dynamoxquiz.quiz.data.remote.QuizRemoteDataSource
import br.com.govanidebastiani.dynamoxquiz.quiz.data.repository.QuizRepositoryImpl
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.repository.QuizRepository
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.FetchAllQuizzesUseCase
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.FetchNewQuestionUseCase
import br.com.govanidebastiani.dynamoxquiz.player.domain.usecase.FetchPlayerByNicknameUseCase
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.FetchQuizByIdUseCase
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.SaveQuizUseCase
import br.com.govanidebastiani.dynamoxquiz.quiz.domain.usecase.SubmitAnswerUseCase
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.QuizViewModel
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.finalscore.FinalScoreViewModel
import br.com.govanidebastiani.dynamoxquiz.quiz.presentation.history.HistoryScreenViewModel
import org.koin.core.module.Module
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module

expect val targetModule: Module

val viewModelModule = module {
    viewModelOf(::PlayerViewModel)
    viewModelOf(::QuizViewModel)
    viewModelOf(::FinalScoreViewModel)
    viewModelOf(::HistoryScreenViewModel)
}

val databaseModule = module {
    single { DatabaseFactory(get()).database }

    single { get<DynamoxQuizDatabase>().playerQueries }
    single { get<DynamoxQuizDatabase>().quizQueries }

    single { PlayerLocalDataSource(get()) }
    single { QuizLocalDataSource(get()) }
}

val repositoryModule = module {
    single<PlayerRepository> { PlayerRepositoryImpl(get()) }
    single<QuizRepository> { QuizRepositoryImpl(get(), get()) }
}

val useCaseModule = module {
    factory { CreatePlayerUseCase(get()) }
    factory { FetchNewQuestionUseCase(get()) }
    factory { SubmitAnswerUseCase(get()) }
    factory { SaveQuizUseCase(get()) }
    factory { FetchQuizByIdUseCase(get()) }
    factory { FetchAllQuizzesUseCase(get()) }
    factory { FetchPlayerByNicknameUseCase(get()) }
}

val networkModule = module {
    single { HttpClientFactory.create(get()) }
    single { QuizRemoteDataSource(get()) }
}