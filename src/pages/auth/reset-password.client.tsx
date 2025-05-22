import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ResetPassword() {
  const [clientReady, setClientReady] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [hashError, setHashError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const tokenMatch = hash.match(/access_token=([^&]+)/)
      const errorMatch = hash.match(/error_description=([^&]+)/)
      setAccessToken(tokenMatch ? tokenMatch[1] : null)
      setHashError(errorMatch ? decodeURIComponent(errorMatch[1].replace(/\+/g, ' ')) : null)
      setClientReady(true)
    }
  }, [])

  if (!clientReady) return null

  if (hashError) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h2>Erro ao redefinir senha</h2>
        <p>{hashError}</p>
        <Link href="/auth/forgot-password">Tentar novamente</Link>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h2>Token de redefinição não encontrado</h2>
        <Link href="/auth/forgot-password">Solicitar novo link</Link>
      </div>
    )
  }

  // Só renderiza o Chakra UI se o token existir e não houver erro
  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Redefinir Senha</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          setFormError(null)
          setFormSuccess(null)
          if (password !== confirmPassword) {
            setFormError('As senhas não coincidem')
            setLoading(false)
            return
          }
          try {
            await supabase.auth.setSession({ access_token: accessToken, refresh_token: accessToken })
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw new Error(error.message)
            setFormSuccess('Senha atualizada com sucesso!')
            setTimeout(() => router.push('/auth/login'), 2000)
          } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : 'Erro ao atualizar senha')
          } finally {
            setLoading(false)
          }
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Nova Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
            required
          />
        </div>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {formSuccess && <div style={{ color: 'green', marginBottom: 12 }}>{formSuccess}</div>}
        <button
          type="submit"
          style={{ width: '100%', padding: 10, background: '#3182ce', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}
          disabled={loading}
        >
          {loading ? 'Atualizando...' : 'Atualizar Senha'}
        </button>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/auth/login">Voltar para o login</Link>
        </div>
      </form>
    </div>
  )
} 