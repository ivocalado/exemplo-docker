'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Pessoa {
  id: number
  nome: string
  endereco: string
  data_criacao: string
}

interface ApiResponse {
  pessoas?: Pessoa[]
  error?: string
}

export default function ListagemPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPessoas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/person')
      const result: ApiResponse = await response.json()

      if (response.ok) {
        setPessoas(result.pessoas || [])
      } else {
        setError(result.error || 'Erro ao carregar pessoas')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPessoas()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Data inválida'
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Lista de Pessoas</h1>
        <nav className="nav">
          <Link href="/" className="btn btn-outline">
            ← Voltar ao Menu
          </Link>
          <Link href="/cadastro" className="btn btn-primary">
            + Nova Pessoa
          </Link>
        </nav>
      </header>

      <main className="main">
        <div className="list-container">
          <div className="list-header">
            <h2>Pessoas Cadastradas</h2>
            <button 
              className="btn btn-secondary" 
              onClick={loadPessoas}
              disabled={loading}
            >
              {loading ? '⏳ Carregando...' : '🔄 Atualizar'}
            </button>
          </div>

          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Carregando pessoas...</p>
            </div>
          )}

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          {!loading && !error && pessoas.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>Nenhuma pessoa cadastrada</h3>
              <p>Comece cadastrando a primeira pessoa!</p>
              <Link href="/cadastro" className="btn btn-primary">
                Cadastrar Primeira Pessoa
              </Link>
            </div>
          )}

          {!loading && !error && pessoas.length > 0 && (
            <>
              <div className="list-stats">
                <p>
                  <strong>{pessoas.length}</strong> pessoa{pessoas.length !== 1 ? 's' : ''} cadastrada{pessoas.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="pessoas-grid">
                {pessoas.map((pessoa) => (
                  <div key={pessoa.id} className="pessoa-card">
                    <div className="pessoa-info">
                      <h3>{pessoa.nome}</h3>
                      <p className="endereco">📍 {pessoa.endereco}</p>
                      <p className="data">📅 {formatDate(pessoa.data_criacao)}</p>
                    </div>
                    <div className="pessoa-id">
                      ID: {pessoa.id}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Sistema de Pessoas</p>
      </footer>
    </div>
  )
}
