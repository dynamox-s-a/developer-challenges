package br.com.govanidebastiani.dynamoxquiz.core.domain

import dynamoxquiz.shared.generated.resources.Res
import dynamoxquiz.shared.generated.resources.error_bad_request
import dynamoxquiz.shared.generated.resources.error_no_internet
import dynamoxquiz.shared.generated.resources.error_not_found
import dynamoxquiz.shared.generated.resources.error_serialization
import dynamoxquiz.shared.generated.resources.error_server
import dynamoxquiz.shared.generated.resources.error_unknown
import org.jetbrains.compose.resources.StringResource

fun DataError.toStringResource(): StringResource {
    val stringRes = when(this) {
        DataError.Remote.BAD_REQUEST -> Res.string.error_bad_request
        DataError.Remote.NOT_FOUND -> Res.string.error_not_found
        DataError.Remote.NO_INTERNET -> Res.string.error_no_internet
        DataError.Remote.SERVER -> Res.string.error_server
        DataError.Remote.SERIALIZATION -> Res.string.error_serialization
        DataError.Remote.UNKNOWN, DataError.Local.UNKNOWN -> Res.string.error_unknown
    }

    return stringRes
}