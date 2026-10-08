package br.com.govanidebastiani.dynamoxquiz.core.domain

sealed interface DataError: Error {
    enum class Remote: DataError {
        BAD_REQUEST,
        NOT_FOUND,
        NO_INTERNET,
        SERVER,
        SERIALIZATION,
        UNKNOWN
    }

    enum class Local: DataError {
        UNKNOWN
    }
}