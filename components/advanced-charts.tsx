"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react"

// Dados simulados para os gráficos
const monthlyData = [
  { month: "Jan", arrecadacao: 4200, meta: 5000, lojas_ativas: 45 },
  { month: "Fev", arrecadacao: 3800, meta: 5000, lojas_ativas: 47 },
  { month: "Mar", arrecadacao: 5200, meta: 5000, lojas_ativas: 48 },
  { month: "Abr", arrecadacao: 4800, meta: 5000, lojas_ativas: 50 },
  { month: "Mai", arrecadacao: 6100, meta: 5000, lojas_ativas: 52 },
  { month: "Jun", arrecadacao: 5900, meta: 5000, lojas_ativas: 54 },
  { month: "Jul", arrecadacao: 6800, meta: 5000, lojas_ativas: 55 },
  { month: "Ago", arrecadacao: 7200, meta: 5000, lojas_ativas: 57 },
  { month: "Set", arrecadacao: 6500, meta: 5000, lojas_ativas: 58 },
  { month: "Out", arrecadacao: 7800, meta: 5000, lojas_ativas: 60 },
  { month: "Nov", arrecadacao: 8200, meta: 5000, lojas_ativas: 61 },
  { month: "Dez", arrecadacao: 9500, meta: 5000, lojas_ativas: 61 },
]

const bandeiraData = [
  { name: "Pão de Açúcar", value: 35, color: "#ef4444" },
  { name: "Extra", value: 28, color: "#3b82f6" },
  { name: "Extra Hiper", value: 20, color: "#8b5cf6" },
  { name: "Mini Extra", value: 12, color: "#10b981" },
  { name: "Minimercado Extra", value: 5, color: "#f59e0b" },
]

const dailyTrend = [
  { day: "Seg", doacoes: 120, oscs: 8 },
  { day: "Ter", doacoes: 98, oscs: 6 },
  { day: "Qua", doacoes: 145, oscs: 9 },
  { day: "Qui", doacoes: 167, oscs: 11 },
  { day: "Sex", doacoes: 189, oscs: 12 },
  { day: "Sab", doacoes: 234, oscs: 15 },
  { day: "Dom", doacoes: 201, oscs: 13 },
]

const regionalData = [
  { regional: "Sul", lojas: 25, arrecadacao: 3200, crescimento: 12 },
  { regional: "Norte", lojas: 18, arrecadacao: 2100, crescimento: -5 },
  { regional: "Oeste", lojas: 12, arrecadacao: 1800, crescimento: 8 },
  { regional: "ABC", lojas: 6, arrecadacao: 900, crescimento: 15 },
]

export function AdvancedCharts() {
  const [selectedPeriod, setSelectedPeriod] = useState("12m")
  const [selectedMetric, setSelectedMetric] = useState("arrecadacao")

  const COLORS = ["#ef4444", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics Avançados</h2>
          <p className="text-gray-600">Análise detalhada de performance e tendências</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="3m">3 meses</SelectItem>
              <SelectItem value="12m">12 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crescimento Mensal</p>
                <p className="text-2xl font-bold text-green-600">+15.8%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  vs mês anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eficiência OSCs</p>
                <p className="text-2xl font-bold text-blue-600">87.3%</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.1% esta semana
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-purple-600">156kg</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -3.2% vs meta
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfação</p>
                <p className="text-2xl font-bold text-orange-600">4.8/5</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Excelente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="bandeiras">Bandeiras</TabsTrigger>
          <TabsTrigger value="daily">Diário</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        {/* Gráfico Mensal */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Arrecadação Mensal vs Meta</CardTitle>
              <CardDescription>Comparativo de performance ao longo do ano</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [`${value} kg`, name === "arrecadacao" ? "Arrecadação" : "Meta"]}
                  />
                  <Legend />
                  <Bar dataKey="arrecadacao" fill="#3b82f6" name="Arrecadação" />
                  <Bar dataKey="meta" fill="#e5e7eb" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendência de Lojas Ativas</CardTitle>
              <CardDescription>Evolução do número de lojas participantes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} lojas`, "Lojas Ativas"]} />
                  <Area type="monotone" dataKey="lojas_ativas" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfico de Bandeiras */}
        <TabsContent value="bandeiras" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Bandeira</CardTitle>
                <CardDescription>Participação de cada bandeira no total</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bandeiraData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bandeiraData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Bandeira</CardTitle>
                <CardDescription>Métricas detalhadas de cada rede</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bandeiraData.map((bandeira, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: bandeira.color }} />
                        <div>
                          <div className="font-medium">{bandeira.name}</div>
                          <div className="text-sm text-gray-600">{bandeira.value}% do total</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{(bandeira.value * 150).toLocaleString()} kg</div>
                        <div className="text-sm text-green-600">+{Math.floor(Math.random() * 20)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gráfico Diário */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendência Semanal</CardTitle>
              <CardDescription>Doações e OSCs ativas por dia da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="doacoes"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Doações (kg)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="oscs"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="OSCs Ativas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfico Regional */}
        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Regional</CardTitle>
              <CardDescription>Comparativo de arrecadação e crescimento por região</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="regional" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "arrecadacao" ? `${value} kg` : `${value} lojas`,
                      name === "arrecadacao" ? "Arrecadação" : "Lojas",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="arrecadacao" fill="#3b82f6" name="Arrecadação" />
                  <Bar dataKey="lojas" fill="#10b981" name="Lojas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalData.map((regional, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900">{regional.regional}</h3>
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-blue-600">{regional.arrecadacao.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">kg arrecadados</div>
                    </div>
                    <div className="mt-2 flex items-center justify-center">
                      <Badge
                        variant={regional.crescimento > 0 ? "default" : "destructive"}
                        className={regional.crescimento > 0 ? "bg-green-100 text-green-800" : ""}
                      >
                        {regional.crescimento > 0 ? "+" : ""}
                        {regional.crescimento}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
