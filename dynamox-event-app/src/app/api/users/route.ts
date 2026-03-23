import { NextResponse } from 'next/server'
import db from '../../../../db.json'

export async function GET() {
  return NextResponse.json(db.users)
}