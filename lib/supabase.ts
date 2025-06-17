import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://uyjxhhxhxdjrojblciru.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5anhoaHhoeGRqcm9qYmxjaXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDk3ODcsImV4cCI6MjA2NTUyNTc4N30.96DJxl8Y0oPkdIfROKcGmjL7nmGtcaK5lTvvuL_bSoQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco
export interface Database {
  public: {
    Tables: {
      regionais: {
        Row: {
          id: string
          nome: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          ativo?: boolean
          updated_at?: string
        }
      }
      lojas: {
        Row: {
          id: string
          nome: string
          ativo: boolean
          regional_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          ativo?: boolean
          regional_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          ativo?: boolean
          regional_id?: string
          updated_at?: string
        }
      }
      oscs: {
        Row: {
          id: string
          cnpj: string
          nome: string
          ativo: boolean
          status_banimento: "ativo" | "suspenso" | "banido"
          justificativa_suspensao: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cnpj: string
          nome: string
          ativo?: boolean
          status_banimento?: "ativo" | "suspenso" | "banido"
          justificativa_suspensao?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cnpj?: string
          nome?: string
          ativo?: boolean
          status_banimento?: "ativo" | "suspenso" | "banido"
          justificativa_suspensao?: string | null
          updated_at?: string
        }
      }
      campanhas: {
        Row: {
          id: string
          nome: string
          data: string
          status: "planejamento" | "ativa" | "encerrada"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          data: string
          status?: "planejamento" | "ativa" | "encerrada"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          data?: string
          status?: "planejamento" | "ativa" | "encerrada"
          updated_at?: string
        }
      }
      parcerias: {
        Row: {
          id: string
          loja_id: string
          osc_id: string
          favorita: boolean
          ativa: boolean
          status_suspensao: boolean
          justificativa_suspensao: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          loja_id: string
          osc_id: string
          favorita?: boolean
          ativa?: boolean
          status_suspensao?: boolean
          justificativa_suspensao?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          loja_id?: string
          osc_id?: string
          favorita?: boolean
          ativa?: boolean
          status_suspensao?: boolean
          justificativa_suspensao?: string | null
          updated_at?: string
        }
      }
    }
  }
}
