"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Wifi,
  WifiOff,
  Clock,
  Activity,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SyncStatus {
  isConnected: boolean
  lastSync: string
  pendingChanges: number
  syncInProgress: boolean
  errors: string[]
}

interface TableStatus {
  name: string
  records: number
  lastUpdated: string
  status: "synced" | "pending" | "error"
  changes: number
}

export function SupabaseIntegration() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: true,
    lastSync: "2024-12-14T10:30:00Z",
    pendingChanges: 3,
    syncInProgress: false,
    errors: [],
  })

  const [tables, setTables] = useState<TableStatus[]>([
    { name: "lojas", records: 156, lastUpdated: "2024-12-14T10:30:00Z", status: "synced", changes: 0 },
    { name: "oscs", records: 89, lastUpdated: "2024-12-14T10:25:00Z", status: "synced", changes: 0 },
    { name: "campanhas", records: 24, lastUpdated: "2024-12-14T09:15:00Z", status: "pending", changes: 3 },
    { name: "doacoes", records: 1247, lastUpdated: "2024-12-14T10:30:00Z", status: "synced", changes: 0 },
    { name: "usuarios", records: 45, lastUpdated: "2024-12-14T08:00:00Z", status: "error", changes: 1 },
  ])

  const { toast } = useToast()

  const handleFullSync = async () => {
    setSyncStatus((prev) => ({ ...prev, syncInProgress: true }))

    try {
      // Simular sincronização
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setTables((prev) =>
        prev.map((table) => ({
          ...table,
          status: "synced" as const,
          changes: 0,
          lastUpdated: new Date().toISOString(),
        })),
      )

      setSyncStatus((prev) => ({
        ...prev,
        syncInProgress: false,
        lastSync: new Date().toISOString(),
        pendingChanges: 0,
        errors: [],
      }))

      toast({
        title: "Sincronização Concluída",
        description: "Todos os dados foram sincronizados com sucesso",
      })
    } catch (error) {
      setSyncStatus((prev) => ({
        ...prev,
        syncInProgress: false,
        errors: ["Erro na sincronização com Supabase"],
      }))

      toast({
        title: "Erro na Sincronização",
        description: "Falha ao sincronizar com o Supabase",
        variant: "destructive",
      })
    }
  }

  const handleTableSync = async (tableName: string) => {
    setTables((prev) =>
      prev.map((table) => (table.name === tableName ? { ...table, status: "pending" as const } : table)),
    )

    // Simular sincronização da tabela
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setTables((prev) =>
      prev.map((table) =>
        table.name === tableName
          ? {
              ...table,
              status: "synced" as const,
              changes: 0,
              lastUpdated: new Date().toISOString(),
            }
          : table,
      ),
    )

    toast({
      title: "Tabela Sincronizada",
      description: `Tabela ${tableName} sincronizada com sucesso`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Sincronizado</Badge>
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>
      case "error":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Erro</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const handleOpenSupabaseTable = (tableName: string) => {
    const supabaseUrl = "https://uyjxhhxhxdjrojblciru.supabase.co"
    const tableUrl = `${supabaseUrl}/project/default/editor/${tableName}`
    window.open(tableUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Status de Conexão */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  syncStatus.isConnected ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {syncStatus.isConnected ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Status da Conexão Supabase</CardTitle>
                <CardDescription>{syncStatus.isConnected ? "Conectado e funcionando" : "Desconectado"}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleFullSync}
                disabled={syncStatus.syncInProgress}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {syncStatus.syncInProgress ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {syncStatus.syncInProgress ? "Sincronizando..." : "Sincronizar Tudo"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {new Date(syncStatus.lastSync).toLocaleTimeString("pt-BR")}
              </div>
              <div className="text-sm text-blue-600">Última Sincronização</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{syncStatus.pendingChanges}</div>
              <div className="text-sm text-yellow-600">Alterações Pendentes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{tables.length}</div>
              <div className="text-sm text-green-600">Tabelas Monitoradas</div>
            </div>
          </div>

          {syncStatus.errors.length > 0 && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="font-medium text-red-800 mb-1">Erros de Sincronização:</div>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {syncStatus.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabelas e Status */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Status das Tabelas</CardTitle>
          <CardDescription>Monitoramento em tempo real das tabelas do Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tables.map((table) => (
              <div
                key={table.name}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(table.status)}
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{table.name}</div>
                    <div className="text-sm text-gray-600">
                      {table.records.toLocaleString()} registros • Atualizado:{" "}
                      {new Date(table.lastUpdated).toLocaleTimeString("pt-BR")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {table.changes > 0 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {table.changes} alteração{table.changes !== 1 ? "ões" : ""}
                    </Badge>
                  )}
                  {getStatusBadge(table.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTableSync(table.name)}
                    disabled={table.status === "pending"}
                  >
                    {table.status === "pending" ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenSupabaseTable(table.name)}
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ver no Supabase
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações Avançadas */}
      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configurações</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Sincronização</CardTitle>
              <CardDescription>Configure como os dados são sincronizados com o Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">Sincronização Automática</div>
                  <div className="text-sm text-gray-600">Sincronizar dados automaticamente a cada 5 minutos</div>
                </div>
                <Button variant="outline" size="sm">
                  Ativado
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">Backup Diário</div>
                  <div className="text-sm text-gray-600">Criar backup automático todos os dias às 02:00</div>
                </div>
                <Button variant="outline" size="sm">
                  Ativado
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">Logs Detalhados</div>
                  <div className="text-sm text-gray-600">Manter logs detalhados de todas as operações</div>
                </div>
                <Button variant="outline" size="sm">
                  Ativado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Backup</CardTitle>
              <CardDescription>Gerencie backups e restaurações dos dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Último Backup</div>
                  <div className="text-sm text-gray-600">14/12/2024 às 02:00</div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Criar Backup
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Backups Disponíveis</div>
                {["13/12/2024", "12/12/2024", "11/12/2024"].map((date) => (
                  <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">{date} - 02:00</div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Restaurar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>Histórico de operações e sincronizações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[
                  { time: "10:30:15", type: "sync", message: "Sincronização completa realizada com sucesso" },
                  { time: "10:25:42", type: "update", message: "Tabela 'campanhas' atualizada - 3 registros" },
                  { time: "10:20:18", type: "error", message: "Falha na sincronização da tabela 'usuarios'" },
                  { time: "10:15:33", type: "sync", message: "Sincronização automática iniciada" },
                  { time: "10:10:07", type: "backup", message: "Backup diário criado com sucesso" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 w-16">{log.time}</div>
                    <Badge
                      variant="outline"
                      className={
                        log.type === "error"
                          ? "text-red-600 border-red-200"
                          : log.type === "sync"
                            ? "text-blue-600 border-blue-200"
                            : "text-green-600 border-green-200"
                      }
                    >
                      {log.type}
                    </Badge>
                    <div className="text-sm text-gray-700 flex-1">{log.message}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
