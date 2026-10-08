package br.com.govanidebastiani.dynamoxquiz.core.data

import br.com.govanidebastiani.dynamoxquiz.core.domain.DataError
import br.com.govanidebastiani.dynamoxquiz.core.domain.Result
import io.ktor.client.call.NoTransformationFoundException
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.util.network.UnresolvedAddressException
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.ensureActive
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json

suspend inline fun <reified T> safeCall(
    execute: () -> HttpResponse
): Result<T, DataError.Remote> {
    val response = try {
        execute()
    } catch (e: UnresolvedAddressException) {
        return Result.Error(DataError.Remote.NO_INTERNET)
    } catch (e: Exception) {
        return Result.Error(DataError.Remote.UNKNOWN)
    }

    return responseToResult(response)
}

suspend inline fun <reified T> responseToResult(
    response: HttpResponse
): Result<T, DataError.Remote> {
    return when(response.status.value) {
        in 200 .. 299 -> {
            try {
                val json = response.bodyAsText()

                Result.Success(Json.decodeFromString<T>(json))
            } catch (e: NoTransformationFoundException) {
                e.printStackTrace()
                Result.Error(DataError.Remote.SERIALIZATION)
            } catch (e: SerializationException) {
                e.printStackTrace()
                Result.Error(DataError.Remote.SERIALIZATION)
            } catch (e: Exception) {
                currentCoroutineContext().ensureActive()
                Result.Error(DataError.Remote.UNKNOWN)
            }
        }
        400 -> {
            Result.Error(DataError.Remote.BAD_REQUEST)
        }
        404 -> {
            Result.Error(DataError.Remote.NOT_FOUND)
        }
        in 500 .. 599 -> {
            Result.Error(DataError.Remote.SERVER)
        }
        else ->  Result.Error(DataError.Remote.UNKNOWN)
    }
}