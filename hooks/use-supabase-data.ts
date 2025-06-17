"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type Regional = Database["public"]["Tables"]["regionais"]["Row"]
type Loja = Database["public"]["Tables"]["lojas"]["Row"]
type OSC = Database["public"]["Tables"]["oscs"]["Row"]
type Campanha = Database["public"]["Tables"]["campanhas"]["Row"]
type Parceria = Database["public"]["Tables"]["parcerias"]["Row"]

export function useSupabaseData() {
  const [regionais, setRegionais] = useState<Regional[]>([])
  const [lojas, setLojas] = useState<Loja[]>([])
  const [oscs, setOSCs] = useState<OSC[]>([])
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [parcerias, setParcerias] = useState<Parceria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar regionais
  const fetchRegionais = async () => {
    const { data, error } = await supabase.from("regionais").select("*").order("nome")

    if (error) {
      console.error("Erro ao buscar regionais:", error)
      setError(error.message)
    } else {
      setRegionais(data || [])
    }
  }

  // Buscar lojas
  const fetchLojas = async () => {
    const { data, error } = await supabase
      .from("lojas")
      .select(`
        *,
        regionais (
          id,
          nome
        )
      `)
      .order("nome")

    if (error) {
      console.error("Erro ao buscar lojas:", error)
      setError(error.message)
    } else {
      setLojas(data || [])
    }
  }

  // Buscar OSCs
  const fetchOSCs = async () => {
    const { data, error } = await supabase.from("oscs").select("*").order("nome")

    if (error) {
      console.error("Erro ao buscar OSCs:", error)
      setError(error.message)
    } else {
      setOSCs(data || [])
    }
  }

  // Buscar campanhas
  const fetchCampanhas = async () => {
    const { data, error } = await supabase.from("campanhas").select("*").order("data", { ascending: false })

    if (error) {
      console.error("Erro ao buscar campanhas:", error)
      setError(error.message)
    } else {
      setCampanhas(data || [])
    }
  }

  // Buscar parcerias
  const fetchParcerias = async () => {
    const { data, error } = await supabase
      .from("parcerias")
      .select(`
        *,
        lojas (
          id,
          nome
        ),
        oscs (
          id,
          nome,
          cnpj
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar parcerias:", error)
      setError(error.message)
    } else {
      setParcerias(data || [])
    }
  }

  // Carregar todos os dados
  const loadAllData = async () => {
    setLoading(true)
    setError(null)

    try {
      await Promise.all([fetchRegionais(), fetchLojas(), fetchOSCs(), fetchCampanhas(), fetchParcerias()])
    } catch (err) {
      setError("Erro ao carregar dados")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Funções para adicionar dados
  const addRegional = async (nome: string) => {
    const { data, error } = await supabase.from("regionais").insert([{ nome }]).select()

    if (error) {
      throw error
    }

    await fetchRegionais()
    return data[0]
  }

  const addLoja = async (nome: string, regional_id: string) => {
    const { data, error } = await supabase.from("lojas").insert([{ nome, regional_id }]).select()

    if (error) {
      throw error
    }

    await fetchLojas()
    return data[0]
  }

  const addOSC = async (nome: string, cnpj: string) => {
    const { data, error } = await supabase.from("oscs").insert([{ nome, cnpj }]).select()

    if (error) {
      throw error
    }

    await fetchOSCs()
    return data[0]
  }

  const addCampanha = async (nome: string, data: string) => {
    const { data: result, error } = await supabase.from("campanhas").insert([{ nome, data }]).select()

    if (error) {
      throw error
    }

    await fetchCampanhas()
    return result[0]
  }

  const addParceria = async (loja_id: string, osc_id: string, favorita = false) => {
    const { data, error } = await supabase.from("parcerias").insert([{ loja_id, osc_id, favorita }]).select()

    if (error) {
      throw error
    }

    await fetchParcerias()
    return data[0]
  }

  useEffect(() => {
    loadAllData()
  }, [])

  return {
    // Dados
    regionais,
    lojas,
    oscs,
    campanhas,
    parcerias,

    // Estados
    loading,
    error,

    // Funções
    refresh: loadAllData,
    addRegional,
    addLoja,
    addOSC,
    addCampanha,
    addParceria,
  }
}
