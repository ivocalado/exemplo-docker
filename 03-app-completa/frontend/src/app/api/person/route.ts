import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:5000'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/person`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching persons:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pessoas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.nome || !body.endereco) {
      return NextResponse.json(
        { error: 'Nome e endereço são obrigatórios' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/api/person`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating person:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao criar pessoa' },
      { status: 500 }
    )
  }
}
