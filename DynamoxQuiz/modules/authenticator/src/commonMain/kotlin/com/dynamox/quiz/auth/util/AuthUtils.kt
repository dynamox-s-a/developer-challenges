package com.dynamox.quiz.auth.util

/** Compares two byte arrays in constant time to prevent timing attacks.
 *
 * @param a The first byte array.
 * @param b The second byte array.
 * @return `true` if the arrays are equal, `false` otherwise.
 */
fun constantTimeEquals(a: ByteArray, b: ByteArray): Boolean {
    if (a.size != b.size) return false
    var diff = 0
    for (i in a.indices) {
        diff = diff or (a[i].toInt() xor b[i].toInt())
    }
    return diff == 0
}

/** Wipes the contents of the given character array by setting all characters to the null character.
 *
 * @param chars The character array to be wiped.
 */
fun wipe(chars: CharArray) {  chars.fill('\u0000') }