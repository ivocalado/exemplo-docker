'use client'

import Link from 'next/link'
import { useState } from 'react'

interface FormData {
  nome: string
  endereco: string
}

interface Message {
  text: string
  type: 'success' | 'error'
}

export default function CadastroPage() {
  const [formData, setFormData] = useState<FormData>({ nome: '', endereco: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.endereco.trim()) {
      setMessage({ text: 'Nome e endereço são obrigatórios', type: 'error' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ 
          text: `Pessoa "${formData.nome}" cadastrada com sucesso!`, 
          type: 'success' 
        })
        setFormData({ nome: '', endereco: '' })
      } else {
        setMessage({ 
          text: result.error || 'Erro ao cadastrar pessoa', 
          type: 'error' 
        })
      }
    } catch (error) {
      setMessage({ 
        text: 'Erro de conexão com o servidor', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (message) setMessage(null)
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Cadastro de Pessoa</h1>
        <nav className="nav">
          <Link href="/" className="btn btn-outline">
            ← Voltar ao Menu
          </Link>
        </nav>
      </header>

      <main className="main">
        <div className="form-container">
          <div className="form-card">
            <h2>Informações da Pessoa</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite o nome completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <textarea
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  placeholder="Digite o endereço completo"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar Pessoa'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setFormData({ nome: '', endereco: '' })
                    setMessage(null)
                  }}
                >
                  Limpar
                </button>
              </div>
            </form>

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Sistema de Pessoas</p>
      </footer>
    </div>
  )
}
