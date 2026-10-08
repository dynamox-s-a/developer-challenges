package br.com.govanidebastiani.dynamoxquiz

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform