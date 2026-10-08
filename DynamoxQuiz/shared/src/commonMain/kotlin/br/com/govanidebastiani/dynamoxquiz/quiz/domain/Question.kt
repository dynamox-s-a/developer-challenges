package br.com.govanidebastiani.dynamoxquiz.quiz.domain

data class Question(
    val id: String,
    val statement: String,
    val options: List<String>
)

val questionMock = Question(
    id = "1",
    statement = "Qual a Sitcom preferida do seu futuro Dev?",
    options = listOf(
        "Friends",
        "How I Met Your Mother",
        "Everybody Hates Chris",
        "The Big Bang Theory",
        "Brooklyn Nine-Nine"
    )
)