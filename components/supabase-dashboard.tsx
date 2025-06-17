"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSupabaseData } from "@/hooks/use-supabase-data"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Database,
  Building2,
  Users,
  Calendar,
  Handshake,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"

export function SupabaseDashboard() {
  const {
    regionais,
    lojas,
    oscs,
    campanhas,
    parcerias,
    loading,
    error,
    refresh,
    addRegional,
    addLoja,
    addOSC,
    addCampanha,
    addParceria,
  } = useSupabaseData()

  const [newRegional, setNewRegional] = useState("")
  const [newLoja, setNewLoja] = useState({ nome: "", regional_id: "" })
  const [newOSC, setNewOSC] = useState({ nome: "", cnpj: "" })
  const [newCampanha, setNewCampanha] = useState({ nome: "", data: "" })
  const [adding, setAdding] = useState(false)

  const { toast } = useToast()

  const handleAddRegional = async () => {
    if (!newRegional.trim()) return

    setAdding(true)
    try {
      await addRegional(newRegional)
      setNewRegional("")
      toast({
        title: "Regional Adicionada",
        description: `${newRegional} foi adicionada com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar regional",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  const handleAddLoja = async () => {
    if (!newLoja.nome.trim() || !newLoja.regional_id) return

    setAdding(true)
    try {
      await addLoja(newLoja.nome, newLoja.regional_id)
      setNewLoja({ nome: "", regional_id: "" })
      toast({
        title: "Loja Adicionada",
        description: `${newLoja.nome} foi adicionada com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar loja",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  const handleAddOSC = async () => {
    if (!newOSC.nome.trim() || !newOSC.cnpj.trim()) return

    setAdding(true)
    try {
      await addOSC(newOSC.nome, newOSC.cnpj)
      setNewOSC({ nome: "", cnpj: "" })
      toast({
        title: "OSC Adicionada",
        description: `${newOSC.nome} foi adicionada com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar OSC",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando dados do Supabase...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Erro ao conectar com Supabase: {error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Supabase</h2>
          <p className="text-gray-600">Dados em tempo real do banco de dados</p>
        </div>
        <Button onClick={refresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Regionais</p>
                <p className="text-2xl font-bold text-blue-900">{regionais.length}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Lojas</p>
                <p className="text-2xl font-bold text-green-900">{lojas.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">OSCs</p>
                <p className="text-2xl font-bold text-purple-900">{oscs.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Campanhas</p>
                <p className="text-2xl font-bold text-orange-900">{campanhas.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">Parcerias</p>
                <p className="text-2xl font-bold text-pink-900">{parcerias.length}</p>
              </div>
              <Handshake className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com dados */}
      <Tabs defaultValue="regionais" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="regionais">Regionais</TabsTrigger>
          <TabsTrigger value="lojas">Lojas</TabsTrigger>
          <TabsTrigger value="oscs">OSCs</TabsTrigger>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="parcerias">Parcerias</TabsTrigger>
        </TabsList>

        {/* Regionais */}
        <TabsContent value="regionais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Regional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Nome da regional"
                  value={newRegional}
                  onChange={(e) => setNewRegional(e.target.value)}
                />
                <Button onClick={handleAddRegional} disabled={adding}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regionais Cadastradas ({regionais.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionais.map((regional) => (
                    <TableRow key={regional.id}>
                      <TableCell className="font-medium">{regional.nome}</TableCell>
                      <TableCell>
                        {regional.ativo ? (
                          <Badge className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-700 border-red-200">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(regional.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lojas */}
        <TabsContent value="lojas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Loja</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Nome da loja"
                  value={newLoja.nome}
                  onChange={(e) => setNewLoja({ ...newLoja, nome: e.target.value })}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newLoja.regional_id}
                  onChange={(e) => setNewLoja({ ...newLoja, regional_id: e.target.value })}
                >
                  <option value="">Selecionar Regional</option>
                  {regionais.map((regional) => (
                    <option key={regional.id} value={regional.id}>
                      {regional.nome}
                    </option>
                  ))}
                </select>
                <Button onClick={handleAddLoja} disabled={adding}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lojas Cadastradas ({lojas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Regional</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lojas.map((loja) => (
                    <TableRow key={loja.id}>
                      <TableCell className="font-medium">{loja.nome}</TableCell>
                      <TableCell>{regionais.find((r) => r.id === loja.regional_id)?.nome || "N/A"}</TableCell>
                      <TableCell>
                        {loja.ativo ? (
                          <Badge className="bg-green-50 text-green-700 border-green-200">Ativo</Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-700 border-red-200">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(loja.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OSCs */}
        <TabsContent value="oscs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar OSC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Nome da OSC"
                  value={newOSC.nome}
                  onChange={(e) => setNewOSC({ ...newOSC, nome: e.target.value })}
                />
                <Input
                  placeholder="CNPJ"
                  value={newOSC.cnpj}
                  onChange={(e) => setNewOSC({ ...newOSC, cnpj: e.target.value })}
                />
                <Button onClick={handleAddOSC} disabled={adding}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OSCs Cadastradas ({oscs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oscs.map((osc) => (
                    <TableRow key={osc.id}>
                      <TableCell className="font-medium">{osc.nome}</TableCell>
                      <TableCell>{osc.cnpj}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            osc.status_banimento === "ativo"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : osc.status_banimento === "suspenso"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {osc.status_banimento}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(osc.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campanhas */}
        <TabsContent value="campanhas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas ({campanhas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {campanhas.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma campanha cadastrada</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campanhas.map((campanha) => (
                      <TableRow key={campanha.id}>
                        <TableCell className="font-medium">{campanha.nome}</TableCell>
                        <TableCell>{new Date(campanha.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              campanha.status === "ativa"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : campanha.status === "planejamento"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {campanha.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(campanha.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parcerias */}
        <TabsContent value="parcerias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parcerias ({parcerias.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {parcerias.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma parceria cadastrada</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loja</TableHead>
                      <TableHead>OSC</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Favorita</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parcerias.map((parceria) => (
                      <TableRow key={parceria.id}>
                        <TableCell className="font-medium">{(parceria as any).lojas?.nome || "N/A"}</TableCell>
                        <TableCell>{(parceria as any).oscs?.nome || "N/A"}</TableCell>
                        <TableCell>
                          {parceria.ativa ? (
                            <Badge className="bg-green-50 text-green-700 border-green-200">Ativa</Badge>
                          ) : (
                            <Badge className="bg-red-50 text-red-700 border-red-200">Inativa</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {parceria.favorita ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(parceria.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
