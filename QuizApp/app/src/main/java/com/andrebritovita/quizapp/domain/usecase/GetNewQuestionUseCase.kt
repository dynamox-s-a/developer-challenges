package com.andrebritovita.quizapp.domain.usecase

import com.andrebritovita.quizapp.domain.model.Question
import com.andrebritovita.quizapp.domain.repository.QuizRepository
import javax.inject.Inject


/**
 * Caso de Uso responsável por obter uma nova pergunta garantindo que ela não seja repetida.
 *
 * Utiliza uma estratégia de "tentativas" limitadas:
 * Tenta buscar uma pergunta no repositório até [MAX_ATTEMPTS] vezes.
 * Se a pergunta já tiver sido visualizada na sessão atual (seenIds), ela é descartada e uma nova tentativa é feita.
 */
class GetNewQuestionUseCase @Inject constructor (
    private val repository: QuizRepository
){
    private val seenIds = mutableSetOf<String>() // Localiza mais rápido com ".contains()" (Complexidade O(1)) e é anti-duplicidade
    private val MAX_ATTEMPTS = 5

    suspend operator fun invoke(): Result<Question> {
        repeat(MAX_ATTEMPTS) {
            val res = repository.getQuestion()
            if (res.isSuccess){
                val question = res.getOrNull()!!
                if (!seenIds.contains(question.id)){
                    seenIds.add(question.id)
                    return Result.success(question)
                }
            } else  {
                return res
            }
        }
        return Result.failure(Exception("Could not find a new unique question after $MAX_ATTEMPTS attempts."))
    }
    /**
     * Limpa a memória de perguntas vistas.
     * Usado quando o jogador clica em "Jogar Novamente".
     */
    fun reset(){
        seenIds.clear()
    }
}