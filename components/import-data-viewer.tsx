"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImportedStore {
  id: string
  nome_loja: string
  endereco: string
  regional: string
  bandeira: string
  ativo: boolean
  imported_at: string
  import_batch_id: string
  status: "active" | "pending" | "error"
  validation_errors?: string[]
}

interface ImportedOSC {
  id: string
  nome: string
  cnpj: string
  endereco: string
  contato: string
  telefone: string
  imported_at: string
  import_batch_id: string
  status: "active" | "pending" | "error"
  validation_errors?: string[]
}

interface ImportBatch {
  id: string
  filename: string
  type: "stores" | "oscs" | "campaigns"
  total_records: number
  processed_records: number
  error_records: number
  imported_at: string
  status: "completed" | "processing" | "failed"
  user: string
}

// Dados simulados de imports realizados
const mockImportBatches: ImportBatch[] = [
  {
    id: "batch_001",
    filename: "lojas_exemplo.xlsx",
    type: "stores",
    total_records: 10,
    processed_records: 8,
    error_records: 2,
    imported_at: "2024-12-14T10:30:00Z",
    status: "completed",
    user: "admin@gpa.com",
  },
  {
    id: "batch_002",
    filename: "oscs_parceiras.csv",
    type: "oscs",
    total_records: 5,
    processed_records: 5,
    error_records: 0,
    imported_at: "2024-12-14T09:15:00Z",
    status: "completed",
    user: "gestor@gpa.com",
  },
  {
    id: "batch_003",
    filename: "campanhas_dezembro.xlsx",
    type: "campaigns",
    total_records: 3,
    processed_records: 2,
    error_records: 1,
    imported_at: "2024-12-14T08:45:00Z",
    status: "failed",
    user: "admin@gpa.com",
  },
]

const mockImportedStores: ImportedStore[] = [
  {
    id: "store_001",
    nome_loja: "Pão de Açúcar Vila Madalena",
    endereco: "Rua Harmonia, 567 - Vila Madalena, São Paulo - SP",
    regional: "Regional Sul",
    bandeira: "Pão de Açúcar",
    ativo: true,
    imported_at: "2024-12-14T10:30:00Z",
    import_batch_id: "batch_001",
    status: "active",
  },
  {
    id: "store_002",
    nome_loja: "Extra Centro São Paulo",
    endereco: "Rua Augusta, 1234 - Centro, São Paulo - SP",
    regional: "Regional Sul",
    bandeira: "Extra",
    ativo: true,
    imported_at: "2024-12-14T10:30:00Z",
    import_batch_id: "batch_001",
    status: "active",
  },
  {
    id: "store_003",
    nome_loja: "Loja com Erro",
    endereco: "Endereço incompleto",
    regional: "",
    bandeira: "Desconhecida",
    ativo: false,
    imported_at: "2024-12-14T10:30:00Z",
    import_batch_id: "batch_001",
    status: "error",
    validation_errors: ["Regional não informada", "Bandeira não reconhecida"],
  },
]

const mockImportedOSCs: ImportedOSC[] = [
  {
    id: "osc_001",
    nome: "Instituto Solidário",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
    contato: "Ana Silva",
    telefone: "(11) 99999-1111",
    imported_at: "2024-12-14T09:15:00Z",
    import_batch_id: "batch_002",
    status: "active",
  },
  {
    id: "osc_002",
    nome: "ONG Esperança",
    cnpj: "98.765.432/0001-10",
    endereco: "Av. Principal, 456 - Vila Nova, São Paulo - SP",
    contato: "Pedro Costa",
    telefone: "(11) 99999-2222",
    imported_at: "2024-12-14T09:15:00Z",
    import_batch_id: "batch_002",
    status: "active",
  },
]

export function ImportDataViewer() {
  const [activeTab, setActiveTab] = useState("batches")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Concluído</Badge>
      case "processing":
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Processando</Badge>
      case "failed":
      case "error":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Erro</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stores":
        return "🏪"
      case "oscs":
        return "🤝"
      case "campaigns":
        return "📢"
      default:
        return "📄"
    }
  }

  const handleReprocessBatch = async (batchId: string) => {
    toast({
      title: "Reprocessando Lote",
      description: "Iniciando reprocessamento dos dados...",
    })

    // Simular reprocessamento
    setTimeout(() => {
      toast({
        title: "Reprocessamento Concluído",
        description: "Lote reprocessado com sucesso",
      })
    }, 2000)
  }

  const handleDeleteBatch = async (batchId: string) => {
    toast({
      title: "Lote Removido",
      description: "Lote e dados associados foram removidos",
      variant: "destructive",
    })
  }

  const exportBatchData = (batchId: string) => {
    toast({
      title: "Exportando Dados",
      description: "Download do arquivo será iniciado em breve",
    })
  }

  const openSupabaseTable = (tableName: string) => {
    const supabaseUrl = "https://uyjxhhxhxdjrojblciru.supabase.co"
    window.open(`${supabaseUrl}/project/default/editor/${tableName}`, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dados Importados</h2>
          <p className="text-gray-600">Visualize e gerencie todos os dados importados via planilhas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Tudo
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total de Lotes</p>
                <p className="text-2xl font-bold text-blue-900">{mockImportBatches.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Registros Processados</p>
                <p className="text-2xl font-bold text-green-900">
                  {mockImportBatches.reduce((sum, batch) => sum + batch.processed_records, 0)}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Registros com Erro</p>
                <p className="text-2xl font-bold text-red-900">
                  {mockImportBatches.reduce((sum, batch) => sum + batch.error_records, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Último Import</p>
                <p className="text-lg font-bold text-purple-900">
                  {new Date(mockImportBatches[0]?.imported_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="batches">Lotes de Import</TabsTrigger>
          <TabsTrigger value="stores">Lojas Importadas</TabsTrigger>
          <TabsTrigger value="oscs">OSCs Importadas</TabsTrigger>
          <TabsTrigger value="errors">Erros e Validações</TabsTrigger>
        </TabsList>

        {/* Lotes de Import */}
        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Importações</CardTitle>
              <CardDescription>Todos os lotes de dados importados via planilhas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockImportBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getTypeIcon(batch.type)}</div>
                      <div>
                        <div className="font-medium text-gray-900">{batch.filename}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(batch.imported_at).toLocaleString("pt-BR")} • Por {batch.user}
                        </div>
                        <div className="text-sm text-gray-500">
                          {batch.processed_records}/{batch.total_records} processados
                          {batch.error_records > 0 && (
                            <span className="text-red-600"> • {batch.error_records} erros</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(batch.status)}
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedBatch(batch.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => exportBatchData(batch.id)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        {batch.status === "failed" && (
                          <Button size="sm" variant="ghost" onClick={() => handleReprocessBatch(batch.id)}>
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteBatch(batch.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lojas Importadas */}
        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lojas Importadas ({mockImportedStores.length})</CardTitle>
                  <CardDescription>Todas as lojas adicionadas via importação de planilhas</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openSupabaseTable("lojas")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver no Supabase
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar lojas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="error">Com Erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loja</TableHead>
                      <TableHead>Bandeira</TableHead>
                      <TableHead>Regional</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Importado em</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockImportedStores
                      .filter(
                        (store) =>
                          (statusFilter === "all" || store.status === statusFilter) &&
                          (searchTerm === "" || store.nome_loja.toLowerCase().includes(searchTerm.toLowerCase())),
                      )
                      .map((store) => (
                        <TableRow key={store.id} className={store.status === "error" ? "bg-red-25" : ""}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{store.nome_loja}</div>
                              <div className="text-sm text-gray-600">{store.endereco}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{store.bandeira}</Badge>
                          </TableCell>
                          <TableCell>{store.regional || "Não informado"}</TableCell>
                          <TableCell>{getStatusBadge(store.status)}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(store.imported_at).toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {store.import_batch_id}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OSCs Importadas */}
        <TabsContent value="oscs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OSCs Importadas ({mockImportedOSCs.length})</CardTitle>
              <CardDescription>Organizações da Sociedade Civil adicionadas via importação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OSC</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Importado em</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockImportedOSCs.map((osc) => (
                      <TableRow key={osc.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{osc.nome}</div>
                            <div className="text-sm text-gray-600">{osc.endereco}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{osc.cnpj}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{osc.contato}</div>
                            <div className="text-xs text-gray-600">{osc.telefone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(osc.status)}</TableCell>
                        <TableCell className="text-sm">{new Date(osc.imported_at).toLocaleString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {osc.import_batch_id}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Erros e Validações */}
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros com Problemas</CardTitle>
              <CardDescription>Dados que precisam de correção ou validação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockImportedStores
                  .filter((store) => store.status === "error")
                  .map((store) => (
                    <Alert key={store.id} className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-red-800 mb-1">
                              {store.nome_loja} - Lote: {store.import_batch_id}
                            </div>
                            <div className="text-sm text-red-700 mb-2">
                              Importado em: {new Date(store.imported_at).toLocaleString("pt-BR")}
                            </div>
                            {store.validation_errors && (
                              <ul className="list-disc list-inside text-sm text-red-700">
                                {store.validation_errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Corrigir
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detalhes do Lote Selecionado */}
      {selectedBatch && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalhes do Lote: {selectedBatch}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedBatch(null)}>
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Detalhes do Lote</h3>
              <p className="text-gray-600">Visualização detalhada dos dados do lote selecionado</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
