package com.romulofer.kotlinMultiplatform.domain.model

enum class Language(val code: String) {
    English("en"),
    Portuguese("pt");

    companion object {
        fun fromCode(code: String?): Language = entries.firstOrNull { it.code == code } ?: English
    }
}
