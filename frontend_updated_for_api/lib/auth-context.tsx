"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: number
  name: string
  email: string
  // keep your existing type; we'll also mirror backend role if you want
  type: "student" | "parent"
  avatar?: string
  role?: string // optional: "PARENT" | "STUDENT" from backend
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
}

const USER_KEY = "learn2code_user"
const TOKEN_KEY = "learn2code_token"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // hydrate from localStorage
    const storedUser = localStorage.getItem(USER_KEY)
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedUser) setUser(JSON.parse(storedUser))
    if (storedToken) setToken(storedToken)
    setLoading(false)
  }, [])

  const login = (userData: User, tkn: string) => {
    setUser(userData)
    setToken(tkn)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKEN_KEY, tkn)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            isAuthenticated: !!user && !!token,
            loading,
            login,
            logout,
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
