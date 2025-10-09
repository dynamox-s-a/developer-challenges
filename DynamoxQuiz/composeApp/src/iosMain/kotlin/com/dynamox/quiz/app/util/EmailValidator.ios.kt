package com.dynamox.quiz.app.util

import platform.Foundation.NSASCIIStringEncoding
import platform.Foundation.NSString
import platform.Foundation.create
import platform.Foundation.dataUsingEncoding

actual fun toAsciiPlatform(domain: String): String? {
    val data = (domain as NSString).dataUsingEncoding(NSASCIIStringEncoding, allowLossyConversion = true)
    return if (data != null) {
        NSString.create(data = data, encoding = NSASCIIStringEncoding).toString()
    } else {
        null
    }
}