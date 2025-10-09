package com.dynamox.quiz.api.util

import java.net.SocketException
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import javax.net.ssl.SSLException


actual fun Throwable.isCausedByNetworkError(): Boolean {
    return isCausedBy(
        SocketException::class,
        UnknownHostException::class,
        SocketTimeoutException::class,
        SSLException::class,
    )
}