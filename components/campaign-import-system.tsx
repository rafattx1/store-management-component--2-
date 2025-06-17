"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

interface CampaignStore {
  id: string
  nome_loja: string
  endereco: string
  regional: string
  bandeira: string
  codigo_loja: string
  status_pre: "ativa" | "inativa" | "verificar" | "nova"
  status_pos: "ativa" | "inativa" | "verificar" | "nova" | null
  participou_campanha: boolean
  motivo_inativacao?: string
  data_verificacao?: string
  verificado_por?: string
  observacoes?: string
}

interface CampaignImport {
  id: string
  tipo: "pre-campanha" | "pos-campanha"
  nome_campanha: string
  arquivo: string
  data_import: string
  total_lojas_csv: number
  lojas_ativadas: number
  lojas_desativadas: number
  lojas_para_verificar: number
  status: "concluido" | "processando" | "erro"
  usuario: string
}

const mockCampaignStores: CampaignStore[] = [
  {
    id: "1",
    nome_loja: "Pão de Açúcar Vila Madalena",
    endereco: "Rua Harmonia, 567 - Vila Madalena, SP",
    regional: "Regional Sul",
    bandeira: "Pão de Açúcar",
    codigo_loja: "001",
    status_pre: "ativa",
    status_pos: "ativa",
    participou_campanha: true,
  },
  {
    id: "2",
    nome_loja: "Extra Centro",
    endereco: "Rua Augusta, 1234 - Centro, SP",
    regional: "Regional Sul",
    bandeira: "Extra",
    codigo_loja: "002",
    status_pre: "ativa",
    status_pos: "inativa",
    participou_campanha: false,
    motivo_inativacao: "Não atingiu meta de arrecadação",
  },
  {
    id: "3",
    nome_loja: "Mercado Extra Osasco",
    endereco: "Av. dos Autonomistas, 456 - Osasco, SP",
    regional: "Regional Oeste",
    bandeira: "Mercado Extra",
    codigo_loja: "003",
    status_pre: "verificar",
    status_pos: null,
    participou_campanha: false,
    motivo_inativacao: "Loja não estava no CSV pré-campanha",
  },
  {
    id: "4",
    nome_loja: "Extra Hiper ABC",
    endereco: "Rua Industrial, 789 - Santo André, SP",
    regional: "Regional ABC",
    bandeira: "Extra Hiper",
    codigo_loja: "004",
    status_pre: "ativa",
    status_pos: "verificar",
    participou_campanha: true,
    motivo_inativacao: "Problemas operacionais reportados",
  },
]

const mockCampaignImports: CampaignImport[] = [
  {
    id: "import_001",
    tipo: "pre-campanha",
    nome_campanha: "Campanha Natal 2024",
    arquivo: "lojas_pre_natal_2024.xlsx",
    data_import: "2024-12-01T09:00:00Z",
    total_lojas_csv: 25,
    lojas_ativadas: 25,
    lojas_desativadas: 8,
    lojas_para_verificar: 3,
    status: "concluido",
    usuario: "admin@gpa.com",
  },
  {
    id: "import_002",
    tipo: "pos-campanha",
    nome_campanha: "Campanha Natal 2024",
    arquivo: "lojas_pos_natal_2024.xlsx",
    data_import: "2024-12-15T14:30:00Z",
    total_lojas_csv: 22,
    lojas_ativadas: 22,
    lojas_desativadas: 3,
    lojas_para_verificar: 5,
    status: "concluido",
    usuario: "gestor@gpa.com",
  },
]

export function CampaignImportSystem() {
  const [activeTab, setActiveTab] = useState("import")
  const [importType, setImportType] = useState<"pre-campanha" | "pos-campanha">("pre-campanha")
  const [campaignName, setCampaignName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [stores, setStores] = useState<CampaignStore[]>(mockCampaignStores)
  const [imports, setImports] = useState<CampaignImport[]>(mockCampaignImports)
  const [selectedStore, setSelectedStore] = useState<CampaignStore | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const processCSVForCampaign = async (file: File, type: "pre-campanha" | "pos-campanha") => {
    setUploading(true)
    setUploadProgress(0)

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval)
            return 80
          }
          return prev + 20
        })
      }, 300)

      // Processar arquivo
      const text = await file.text()
      const lines = text.trim().split("\n")
      const csvStoreNames = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
          return values[0]?.toLowerCase() // Assumindo que nome da loja é primeira coluna
        })
        .filter(Boolean)

      setUploadProgress(90)

      // Aplicar lógica de ativação/desativação
      const updatedStores = stores.map((store) => {
        const isInCSV = csvStoreNames.includes(store.nome_loja.toLowerCase())

        if (type === "pre-campanha") {
          return {
            ...store,
            status_pre: isInCSV ? ("ativa" as const) : ("verificar" as const),
            motivo_inativacao: !isInCSV ? "Loja não estava no CSV pré-campanha" : undefined,
          }
        } else {
          // Pós-campanha
          return {
            ...store,
            status_pos: isInCSV ? ("ativa" as const) : ("verificar" as const),
            participou_campanha: isInCSV,
            motivo_inativacao: !isInCSV ? "Loja não participou da campanha" : store.motivo_inativacao,
          }
        }
      })

      setStores(updatedStores)
      setUploadProgress(100)

      // Calcular métricas
      const ativadas = updatedStores.filter((s) =>
        type === "pre-campanha" ? s.status_pre === "ativa" : s.status_pos === "ativa",
      ).length
      const paraVerificar = updatedStores.filter((s) =>
        type === "pre-campanha" ? s.status_pre === "verificar" : s.status_pos === "verificar",
      ).length

      // Criar registro de import
      const newImport: CampaignImport = {
        id: `import_${Date.now()}`,
        tipo: type,
        nome_campanha: campaignName,
        arquivo: file.name,
        data_import: new Date().toISOString(),
        total_lojas_csv: csvStoreNames.length,
        lojas_ativadas: ativadas,
        lojas_desativadas: stores.length - ativadas - paraVerificar,
        lojas_para_verificar: paraVerificar,
        status: "concluido",
        usuario: "admin@gpa.com",
      }

      setImports([newImport, ...imports])

      toast({
        title: `Import ${type} Concluído`,
        description: `${ativadas} lojas ativadas, ${paraVerificar} para verificação`,
      })
    } catch (error) {
      toast({
        title: "Erro no Import",
        description: "Falha ao processar arquivo da campanha",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!campaignName.trim()) {
      toast({
        title: "Nome da Campanha Obrigatório",
        description: "Por favor, informe o nome da campanha",
        variant: "destructive",
      })
      return
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({
        title: "Formato Inválido",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive",
      })
      return
    }

    await processCSVForCampaign(file, importType)
  }

  const updateStoreStatus = (storeId: string, newStatus: "ativa" | "inativa" | "verificar", observacoes?: string) => {
    setStores(
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              status_pre: importType === "pre-campanha" ? newStatus : store.status_pre,
              status_pos: importType === "pos-campanha" ? newStatus : store.status_pos,
              observacoes,
              data_verificacao: new Date().toISOString(),
              verificado_por: "admin@gpa.com",
            }
          : store,
      ),
    )

    toast({
      title: "Status Atualizado",
      description: `Loja marcada como ${newStatus}`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Ativa</Badge>
      case "inativa":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Inativa</Badge>
      case "verificar":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Verificar</Badge>
      case "nova":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Nova</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  const generateSampleCSV = (type: "pre-campanha" | "pos-campanha") => {
    const sampleData = [
      ["nome_loja", "codigo_loja", "regional", "bandeira"],
      ["Pão de Açúcar Vila Madalena", "001", "Regional Sul", "Pão de Açúcar"],
      ["Extra Centro", "002", "Regional Sul", "Extra"],
      ["Extra Hiper ABC", "004", "Regional ABC", "Extra Hiper"],
    ]

    if (type === "pos-campanha") {
      // Remover uma loja para simular que não participou
      sampleData.splice(2, 1)
    }

    const ws = XLSX.utils.aoa_to_sheet(sampleData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `Lojas ${type}`)
    XLSX.writeFile(wb, `exemplo_${type.replace("-", "_")}.csv`)

    toast({
      title: "Exemplo Baixado",
      description: `Arquivo exemplo_${type.replace("-", "_")}.csv foi baixado`,
    })
  }

  const activeStores = stores.filter((s) => s.status_pre === "ativa").length
  const verificationStores = stores.filter((s) => s.status_pre === "verificar").length
  const participatedStores = stores.filter((s) => s.participou_campanha).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Sistema de Import de Campanhas</h2>
        <p className="text-gray-600">Gerencie lojas participantes PRÉ e PÓS campanha com controle de status</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Lojas Ativas</p>
                <p className="text-2xl font-bold text-green-900">{activeStores}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Para Verificar</p>
                <p className="text-2xl font-bold text-yellow-900">{verificationStores}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Participaram</p>
                <p className="text-2xl font-bold text-blue-900">{participatedStores}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Taxa Participação</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.round((participatedStores / stores.length) * 100)}%
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">Import Campanha</TabsTrigger>
          <TabsTrigger value="stores">Lojas da Campanha</TabsTrigger>
          <TabsTrigger value="verification">Para Verificar</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Import de Campanha */}
        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Import de Campanha
                </CardTitle>
                <CardDescription>
                  Importe lojas PRÉ ou PÓS campanha. Lojas no CSV serão ATIVADAS, lojas fora do CSV serão marcadas para
                  VERIFICAR.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Nome da Campanha</Label>
                    <Input
                      id="campaign-name"
                      placeholder="Ex: Campanha Natal 2024"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="import-type">Tipo de Import</Label>
                    <Select value={importType} onValueChange={(value: any) => setImportType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-campanha">PRÉ-Campanha</SelectItem>
                        <SelectItem value="pos-campanha">PÓS-Campanha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-file">Arquivo CSV</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processando {importType}...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex-1">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {uploading ? "Processando..." : "Selecionar CSV"}
                  </Button>
                  <Button variant="outline" onClick={() => generateSampleCSV(importType)}>
                    <Download className="w-4 h-4 mr-2" />
                    Exemplo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Como Funciona</CardTitle>
                <CardDescription>Lógica de ativação/desativação das lojas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Lojas no CSV:</strong> Serão marcadas como ATIVAS e participarão da campanha
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Lojas fora do CSV:</strong> Serão marcadas para VERIFICAR e precisarão de análise manual
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Diferenças PRÉ vs PÓS:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>
                        • <strong>PRÉ:</strong> Define quais lojas participarão
                      </li>
                      <li>
                        • <strong>PÓS:</strong> Confirma quais lojas participaram
                      </li>
                      <li>
                        • <strong>Comparação:</strong> Identifica lojas que saíram/entraram
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Lojas da Campanha */}
        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Lojas da Campanha</CardTitle>
              <CardDescription>Status PRÉ e PÓS campanha de todas as lojas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loja</TableHead>
                      <TableHead>Bandeira</TableHead>
                      <TableHead>Regional</TableHead>
                      <TableHead>Status PRÉ</TableHead>
                      <TableHead>Status PÓS</TableHead>
                      <TableHead>Participou</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{store.nome_loja}</div>
                            <div className="text-sm text-gray-600">{store.codigo_loja}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{store.bandeira}</Badge>
                        </TableCell>
                        <TableCell>{store.regional}</TableCell>
                        <TableCell>{getStatusBadge(store.status_pre)}</TableCell>
                        <TableCell>{store.status_pos ? getStatusBadge(store.status_pos) : "-"}</TableCell>
                        <TableCell>
                          {store.participou_campanha ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedStore(store)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Para Verificar */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Lojas Para Verificar ({verificationStores})
              </CardTitle>
              <CardDescription>
                Lojas que não estavam no CSV e precisam de análise manual para decidir participação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stores
                  .filter((store) => store.status_pre === "verificar" || store.status_pos === "verificar")
                  .map((store) => (
                    <Alert key={store.id} className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-yellow-800 mb-1">
                              {store.nome_loja} - {store.bandeira}
                            </div>
                            <div className="text-sm text-yellow-700 mb-2">{store.endereco}</div>
                            {store.motivo_inativacao && (
                              <div className="text-sm text-yellow-700">
                                <strong>Motivo:</strong> {store.motivo_inativacao}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStoreStatus(store.id, "ativa", "Aprovada manualmente")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Ativar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStoreStatus(store.id, "inativa", "Rejeitada manualmente")}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Desativar
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

        {/* Histórico */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Imports</CardTitle>
              <CardDescription>Todos os imports PRÉ e PÓS campanha realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imports.map((importRecord) => (
                  <div
                    key={importRecord.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{importRecord.tipo === "pre-campanha" ? "📅" : "📊"}</div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {importRecord.nome_campanha} - {importRecord.tipo.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(importRecord.data_import).toLocaleString("pt-BR")} • {importRecord.arquivo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {importRecord.lojas_ativadas} ativadas • {importRecord.lojas_para_verificar} para verificar
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(importRecord.status)}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes da Loja */}
      {selectedStore && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalhes: {selectedStore.nome_loja}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedStore(null)}>
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Informações Básicas</Label>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Código:</strong> {selectedStore.codigo_loja}
                  </p>
                  <p>
                    <strong>Bandeira:</strong> {selectedStore.bandeira}
                  </p>
                  <p>
                    <strong>Regional:</strong> {selectedStore.regional}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {selectedStore.endereco}
                  </p>
                </div>
              </div>
              <div>
                <Label>Status da Campanha</Label>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Status PRÉ:</strong> {getStatusBadge(selectedStore.status_pre)}
                  </p>
                  <p>
                    <strong>Status PÓS:</strong>{" "}
                    {selectedStore.status_pos ? getStatusBadge(selectedStore.status_pos) : "Não processado"}
                  </p>
                  <p>
                    <strong>Participou:</strong> {selectedStore.participou_campanha ? "Sim" : "Não"}
                  </p>
                  {selectedStore.motivo_inativacao && (
                    <p>
                      <strong>Motivo:</strong> {selectedStore.motivo_inativacao}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
