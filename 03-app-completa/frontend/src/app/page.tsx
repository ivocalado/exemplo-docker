import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>Sistema de Cadastro de Pessoas</h1>
        <p>Gerencie pessoas de forma simples e eficiente</p>
      </header>

      <main className="main">
        <div className="menu-container">
          <div className="menu-card">
            <div className="menu-option">
              <div className="icon">👤</div>
              <h2>Cadastrar Pessoa</h2>
              <p>Adicione uma nova pessoa ao sistema</p>
              <Link href="/cadastro" className="btn btn-primary">
                Cadastrar
              </Link>
            </div>
          </div>

          <div className="menu-card">
            <div className="menu-option">
              <div className="icon">📋</div>
              <h2>Listar Pessoas</h2>
              <p>Visualize todas as pessoas cadastradas</p>
              <Link href="/listagem" className="btn btn-secondary">
                Listar
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Sistema de Pessoas - Next.js + Docker</p>
      </footer>
    </div>
  )
}
