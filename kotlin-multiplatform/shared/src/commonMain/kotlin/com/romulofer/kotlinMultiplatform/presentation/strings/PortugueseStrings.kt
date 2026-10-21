package com.romulofer.kotlinMultiplatform.presentation.strings

import com.romulofer.kotlinMultiplatform.domain.model.AppError
import com.romulofer.kotlinMultiplatform.domain.model.AppError.NoConnection
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Server
import com.romulofer.kotlinMultiplatform.domain.model.AppError.Unknown
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.Blank
import com.romulofer.kotlinMultiplatform.domain.model.InvalidNameReason.TooLong

object PortugueseStrings : AppStrings {
    override val appName = "Quiz"
    override val back = "Voltar"
    override val retry = "Tentar novamente"

    override val welcomeTitle = "Bem-vindo"
    override val welcomeSubtitle = "Digite seu nome ou apelido para começar o quiz."
    override val nameLabel = "Nome ou apelido"
    override val startQuiz = "Começar quiz"
    override val scoreboardAction = "Placar"
    override val settingsAction = "Configurações"
    override val storageError = "Não foi possível salvar seus dados neste aparelho. Tente novamente."
    override fun nameError(reason: InvalidNameReason, maxLength: Int) = when (reason) {
        Blank -> "Digite um nome para continuar."
        TooLong -> "Use no máximo $maxLength caracteres."
    }

    override val loadingQuestion = "Carregando pergunta"
    override val submitAnswer = "Enviar resposta"
    override val correctFeedback = "Correto!"
    override val incorrectFeedback = "Não foi dessa vez."
    override val nextQuestion = "Próxima pergunta"
    override val seeResult = "Ver resultado"
    override fun questionProgress(current: Int, total: Int) = "Pergunta $current de $total"
    override fun liveScore(correct: Int) = "Pontos: $correct"

    override val finishedTitle = "Quiz concluído"
    override fun finalScore(correct: Int, total: Int) = "Você acertou $correct de $total"
    override val playAgain = "Jogar novamente"
    override val changePlayer = "Trocar jogador"
    override val scoreNotSaved = "Não foi possível salvar sua pontuação neste aparelho."

    override val scoreboardTitle = "Placar"
    override val scoreboardEmpty = "Ainda não há pontuações. Termine um quiz para aparecer aqui."
    override fun scoreValue(correct: Int, total: Int) = "$correct/$total"

    override val settingsTitle = "Configurações"
    override val languageLabel = "Idioma"
    override val languageEnglish = "English"
    override val languagePortuguese = "Português"

    override fun errorMessage(error: AppError) = when (error) {
        NoConnection -> "Sem conexão com a internet. Verifique sua rede e tente novamente."
        is Server -> "O servidor teve um problema (código ${error.code}). Tente novamente."
        Unknown -> "Algo deu errado. Tente novamente."
    }
}
