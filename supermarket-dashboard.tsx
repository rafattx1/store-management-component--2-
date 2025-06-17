"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  LayoutDashboard,
  Store,
  Users,
  FileText,
  Settings,
  Plus,
  Upload,
  Search,
  Filter,
  Bell,
  MoreHorizontal,
  Target,
  Calendar,
  Eye,
  Edit,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Database,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Loja {
  id: string
  nome: string
  bandeira: "Pão de Açúcar" | "Extra" | "Mini Extra" | "Extra Hiper" | "Minimercado Extra"
  regional: string
  status: "ativo" | "inativo" | "manutencao"
  arrecadacao_mes_atual: number
  arrecadacao_mes_anterior: number
  oscs_vinculadas: number
  oscs_confirmadas: number
  oscs_nao_participaram: number
  gerente: string
  telefone: string
}

interface OSC {
  id: string
  nome: string
  cnpj: string
  status: "ativa" | "inativa" | "suspensa"
  participou_ultima_campanha: boolean
  total_arrecadado_kg: number
  lojas_vinculadas: string[]
  contato: string
  telefone: string
}

const mockLojas: Loja[] = [
  {
    id: "1",
    nome: "Pão de Açúcar Vila Madalena",
    bandeira: "Pão de Açúcar",
    regional: "Regional Sul",
    status: "ativo",
    arrecadacao_mes_atual: 2450,
    arrecadacao_mes_anterior: 2180,
    oscs_vinculadas: 8,
    oscs_confirmadas: 6,
    oscs_nao_participaram: 2,
    gerente: "Ana Costa",
    telefone: "(11) 3333-2222",
  },
  {
    id: "2",
    nome: "Extra Centro São Paulo",
    bandeira: "Extra",
    regional: "Regional Sul",
    status: "ativo",
    arrecadacao_mes_atual: 0,
    arrecadacao_mes_anterior: 1850,
    oscs_vinculadas: 5,
    oscs_confirmadas: 0,
    oscs_nao_participaram: 5,
    gerente: "Carlos Silva",
    telefone: "(11) 3333-1111",
  },
  {
    id: "3",
    nome: "Extra Hiper Osasco",
    bandeira: "Extra Hiper",
    regional: "Regional Norte",
    status: "manutencao",
    arrecadacao_mes_atual: 0,
    arrecadacao_mes_anterior: 3200,
    oscs_vinculadas: 12,
    oscs_confirmadas: 0,
    oscs_nao_participaram: 12,
    gerente: "Pedro Santos",
    telefone: "(11) 3333-3333",
  },
  {
    id: "4",
    nome: "Minimercado Extra Jardins",
    bandeira: "Minimercado Extra",
    regional: "Regional Sul",
    status: "ativo",
    arrecadacao_mes_atual: 1200,
    arrecadacao_mes_anterior: 980,
    oscs_vinculadas: 4,
    oscs_confirmadas: 3,
    oscs_nao_participaram: 1,
    gerente: "Maria Oliveira",
    telefone: "(11) 3333-4444",
  },
  {
    id: "5",
    nome: "Mini Extra Moema",
    bandeira: "Mini Extra",
    regional: "Regional Sul",
    status: "ativo",
    arrecadacao_mes_atual: 1850,
    arrecadacao_mes_anterior: 1650,
    oscs_vinculadas: 6,
    oscs_confirmadas: 5,
    oscs_nao_participaram: 1,
    gerente: "João Ferreira",
    telefone: "(11) 3333-5555",
  },
]

const mockOSCs: OSC[] = [
  {
    id: "1",
    nome: "Instituto Solidário",
    cnpj: "12.345.678/0001-90",
    status: "ativa",
    participou_ultima_campanha: false,
    total_arrecadado_kg: 0,
    lojas_vinculadas: ["1", "2"],
    contato: "Ana Silva",
    telefone: "(11) 99999-1111",
  },
  {
    id: "2",
    nome: "ONG Esperança",
    cnpj: "98.765.432/0001-10",
    status: "ativa",
    participou_ultima_campanha: false,
    total_arrecadado_kg: 0,
    lojas_vinculadas: ["2", "3"],
    contato: "Pedro Costa",
    telefone: "(11) 99999-2222",
  },
  {
    id: "3",
    nome: "Associação Vida Nova",
    cnpj: "11.222.333/0001-44",
    status: "ativa",
    participou_ultima_campanha: true,
    total_arrecadado_kg: 2450,
    lojas_vinculadas: ["1", "4", "5"],
    contato: "Carla Mendes",
    telefone: "(11) 99999-3333",
  },
  {
    id: "4",
    nome: "Centro Comunitário Unidos",
    cnpj: "55.666.777/0001-88",
    status: "suspensa",
    participou_ultima_campanha: false,
    total_arrecadado_kg: 0,
    lojas_vinculadas: ["3"],
    contato: "Roberto Lima",
    telefone: "(11) 99999-4444",
  },
]

export default function SupermarketDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [lojas, setLojas] = useState<Loja[]>(mockLojas)
  const [oscs, setOSCs] = useState<OSC[]>(mockOSCs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "lojas", label: "Lojas", icon: Store },
    { id: "oscs", label: "OSCs", icon: Users },
    { id: "relatorios", label: "Relatórios", icon: FileText },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ]

  // Cálculos das métricas
  const totalLojas = lojas.length
  const lojasAtivas = lojas.filter((l) => l.status === "ativo").length
  const lojasComZeroArrecadacao = lojas.filter((l) => l.arrecadacao_mes_atual === 0).length
  const oscsNaoParticiparam = oscs.filter((o) => !o.participou_ultima_campanha).length

  const arrecadacaoAtual = lojas.reduce((sum, l) => sum + l.arrecadacao_mes_atual, 0)
  const arrecadacaoAnterior = lojas.reduce((sum, l) => sum + l.arrecadacao_mes_anterior, 0)
  const taxaConclusao = arrecadacaoAnterior > 0 ? (arrecadacaoAtual / arrecadacaoAnterior) * 100 : 0
  const crescimento = arrecadacaoAtual - arrecadacaoAnterior

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      // Simular processamento do arquivo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Upload Concluído",
        description: "Dados importados com sucesso para o Supabase",
      })
    } catch (error) {
      toast({
        title: "Erro no Upload",
        description: "Falha ao processar o arquivo",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { color: "bg-green-50 text-green-700 border-green-200", label: "Ativo" },
      inativo: { color: "bg-red-50 text-red-700 border-red-200", label: "Inativo" },
      manutencao: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Manutenção" },
      ativa: { color: "bg-green-50 text-green-700 border-green-200", label: "Ativa" },
      suspensa: { color: "bg-red-50 text-red-700 border-red-200", label: "Suspensa" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: status,
    }

    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>
  }

  const getBandeiraColor = (bandeira: string) => {
    const colors = {
      "Pão de Açúcar": "bg-red-100 text-red-800",
      Extra: "bg-blue-100 text-blue-800",
      "Extra Hiper": "bg-purple-100 text-purple-800",
      "Mini Extra": "bg-green-100 text-green-800",
      "Minimercado Extra": "bg-orange-100 text-orange-800",
    }
    return colors[bandeira as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Alertas Críticos */}
      {(lojasComZeroArrecadacao > 0 || oscsNaoParticiparam > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lojasComZeroArrecadacao > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="font-medium text-red-800 mb-1">
                  {lojasComZeroArrecadacao} loja(s) com arrecadação ZERO
                </div>
                <div className="text-sm text-red-700">Lojas precisam de atenção imediata para retomar as doações</div>
              </AlertDescription>
            </Alert>
          )}

          {oscsNaoParticiparam > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <Users className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                <div className="font-medium text-orange-800 mb-1">
                  {oscsNaoParticiparam} OSC(s) não participaram da última campanha
                </div>
                <div className="text-sm text-orange-700">Verificar motivos e reengajar organizações</div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total de Lojas</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{totalLojas}</p>
                <p className="text-xs text-blue-600 mt-1">{lojasAtivas} ativas</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Arrecadação Atual</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{arrecadacaoAtual.toLocaleString()} kg</p>
                <div className="flex items-center mt-1">
                  {crescimento >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <p className={`text-xs ${crescimento >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {crescimento >= 0 ? "+" : ""}
                    {crescimento} kg vs mês anterior
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{taxaConclusao.toFixed(1)}%</p>
                <p className="text-xs text-purple-600 mt-1">vs mês anterior</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Lojas Zero Arrecadação</p>
                <p className="text-3xl font-bold text-red-900 mt-2">{lojasComZeroArrecadacao}</p>
                <p className="text-xs text-red-600 mt-1">Requer atenção</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Bandeira */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Performance por Bandeira</CardTitle>
          <CardDescription>Arrecadação por rede de supermercados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Pão de Açúcar", "Extra", "Extra Hiper", "Mini Extra", "Minimercado Extra"].map((bandeira) => {
              const lojasB = lojas.filter((l) => l.bandeira === bandeira)
              const arrecadacao = lojasB.reduce((sum, l) => sum + l.arrecadacao_mes_atual, 0)
              const percentual = arrecadacaoAtual > 0 ? (arrecadacao / arrecadacaoAtual) * 100 : 0

              return (
                <div key={bandeira} className="flex items-center space-x-4">
                  <div className="w-32">
                    <Badge className={getBandeiraColor(bandeira)}>{bandeira}</Badge>
                  </div>
                  <div className="flex-1">
                    <Progress value={percentual} className="h-3" />
                  </div>
                  <div className="w-24 text-sm font-medium text-gray-900">{arrecadacao.toLocaleString()} kg</div>
                  <div className="w-16 text-sm text-gray-600">{percentual.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* OSCs que não participaram */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">OSCs que Não Participaram</CardTitle>
          <CardDescription>Organizações que não confirmaram presença na última campanha</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {oscs
              .filter((o) => !o.participou_ultima_campanha)
              .map((osc) => (
                <div
                  key={osc.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100"
                >
                  <div>
                    <div className="font-medium text-red-900">{osc.nome}</div>
                    <div className="text-sm text-red-700">CNPJ: {osc.cnpj}</div>
                    <div className="text-sm text-red-600">
                      Contato: {osc.contato} - {osc.telefone}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(osc.status)}
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Reengajar
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLojas = () => (
    <div className="space-y-6">
      {/* Header com Upload */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Gestão de Lojas</h2>
          <p className="text-sm text-gray-600 mt-1">Gerencie todas as lojas da rede</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Enviando..." : "Import CSV"}
            </Button>
            <Button variant="outline" size="sm">
              <Database className="w-4 h-4 mr-2" />
              Sync Supabase
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Loja
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar lojas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-gray-200">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="manutencao">Manutenção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Lojas */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loja
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bandeira
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrecadação Atual
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mês Anterior
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OSCs
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gerente
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lojas
                  .filter(
                    (loja) =>
                      (statusFilter === "todos" || loja.status === statusFilter) &&
                      (searchTerm === "" || loja.nome.toLowerCase().includes(searchTerm.toLowerCase())),
                  )
                  .map((loja) => (
                    <tr
                      key={loja.id}
                      className={`hover:bg-gray-50 transition-colors ${loja.arrecadacao_mes_atual === 0 ? "bg-red-25" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{loja.nome}</div>
                          <div className="text-xs text-gray-500">{loja.regional}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getBandeiraColor(loja.bandeira)}>{loja.bandeira}</Badge>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(loja.status)}</td>
                      <td className="px-6 py-4">
                        <div
                          className={`font-medium ${loja.arrecadacao_mes_atual === 0 ? "text-red-600" : "text-gray-900"}`}
                        >
                          {loja.arrecadacao_mes_atual.toLocaleString()} kg
                        </div>
                        {loja.arrecadacao_mes_atual === 0 && (
                          <div className="text-xs text-red-500 flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Zero arrecadação
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {loja.arrecadacao_mes_anterior.toLocaleString()} kg
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {loja.oscs_confirmadas}/{loja.oscs_vinculadas} confirmadas
                        </div>
                        {loja.oscs_nao_participaram > 0 && (
                          <div className="text-xs text-orange-600">{loja.oscs_nao_participaram} não participaram</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{loja.gerente}</div>
                        <div className="text-xs text-gray-500">{loja.telefone}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            {loja.arrecadacao_mes_atual === 0 && (
                              <DropdownMenuItem className="text-orange-600">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Investigar Zero
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOSCs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Gestão de OSCs</h2>
          <p className="text-sm text-gray-600 mt-1">Organizações da Sociedade Civil parceiras</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova OSC
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OSC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participação
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Arrecadado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lojas Vinculadas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {oscs.map((osc) => (
                  <tr
                    key={osc.id}
                    className={`hover:bg-gray-50 transition-colors ${!osc.participou_ultima_campanha ? "bg-orange-25" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{osc.nome}</div>
                        <div className="text-sm text-gray-600">CNPJ: {osc.cnpj}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(osc.status)}</td>
                    <td className="px-6 py-4">
                      {osc.participou_ultima_campanha ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">Participou</Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 border-red-200">Não Participou</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{osc.total_arrecadado_kg.toLocaleString()} kg</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{osc.lojas_vinculadas.length} loja(s)</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{osc.contato}</div>
                      <div className="text-xs text-gray-500">{osc.telefone}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {!osc.participou_ultima_campanha && (
                            <DropdownMenuItem className="text-orange-600">
                              <Users className="mr-2 h-4 w-4" />
                              Reengajar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
      case "lojas":
        return renderLojas()
      case "oscs":
        return renderOSCs()
      case "relatorios":
        return (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios</h3>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      case "configuracoes":
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações</h3>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">GPA Doações</h1>
              <p className="text-xs text-gray-500">Gestão de Supermercados</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">GPA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Gestor GPA</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {sidebarItems.find((item) => item.id === activeSection)?.label || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {(lojasComZeroArrecadacao > 0 || oscsNaoParticiparam > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {lojasComZeroArrecadacao + oscsNaoParticiparam}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Dezembro 2024
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
