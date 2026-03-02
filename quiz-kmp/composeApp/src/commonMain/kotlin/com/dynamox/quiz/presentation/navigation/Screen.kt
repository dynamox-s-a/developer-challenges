package com.dynamox.quiz.presentation.navigation

import kotlinx.serialization.Serializable

/**
 * Definição das rotas de navegação usando Type-Safe Navigation do Compose.
 *
 * Em vez de usar strings ("splash", "quiz/abc/1"), usamos classes Kotlin @Serializable como rotas.
 * O Compose Navigation serializa/desserializa automaticamente os parâmetros.
 *
 * Vantagens da navegação type-safe:
 * - Erros de rota detectados em TEMPO DE COMPILAÇÃO (não em runtime)
 * - Passagem de parâmetros tipada (Long, String, Int) sem conversão manual
 * - Refactoring seguro: renomear uma propriedade quebra o código, não silencia
 *
 */

@Serializable
object SplashScreen

@Serializable
object LoginScreen

@Serializable
data class QuizScreen(val playerName: String, val playerId: Long)

@Serializable
data class ResultScreen(val playerName: String, val playerId: Long, val score: Int, val total: Int)

@Serializable
object LeaderboardScreen
