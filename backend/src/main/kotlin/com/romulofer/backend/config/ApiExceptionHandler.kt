package com.romulofer.backend.config

import org.slf4j.LoggerFactory.getLogger
import org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class ApiExceptionHandler: ResponseEntityExceptionHandler() {
    private val log = getLogger(javaClass)

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(exception: Exception): ProblemDetail {
        log.error("Unhandled exception", exception)
        return ProblemDetail.forStatusAndDetail(
            INTERNAL_SERVER_ERROR,
            "Unexpected error.",
        )
    }
}
