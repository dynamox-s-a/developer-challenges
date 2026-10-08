package br.com.govanidebastiani.dynamoxquiz.player.domain.exception

class PlayerAlreadyExistsException(
    nickname: String
) : IllegalArgumentException("Player with nickname '$nickname' already exists.")