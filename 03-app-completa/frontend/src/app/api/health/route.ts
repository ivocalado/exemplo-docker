import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:5000'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({
      status: 'OK',
      message: 'Frontend funcionando!',
      backend: data
    })
  } catch (error) {
    console.error('Error checking backend health:', error)
    return NextResponse.json(
      { 
        status: 'ERROR',
        message: 'Erro de conexão com o backend',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
