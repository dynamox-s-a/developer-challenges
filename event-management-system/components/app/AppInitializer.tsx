'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { loadFromStorage } from '@/store/auth/authSlice'

export function AppInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadFromStorage())
  }, [dispatch])

  return null
}