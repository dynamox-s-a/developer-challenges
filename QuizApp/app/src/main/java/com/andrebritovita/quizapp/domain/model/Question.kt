package com.andrebritovita.quizapp.domain.model

/**
 * Modelo de Domínio: Representa uma pergunta limpa para ser usada na UI.
 */
data class Question(
    val id: String,
    val statement: String,
    val options: List<String>
)
