"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  FileSpreadsheet,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"
import { generateSampleExcelFiles } from "../utils/excel-generator"

interface SpreadsheetData {
  [key: string]: any
}

interface ColumnMapping {
  [key: string]: string
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

interface ETLResult {
  total_records: number
  valid_records: number
  invalid_records: number
  warnings: string[]
  errors: string[]
  data: SpreadsheetData[]
}

const REQUIRED_COLUMNS = {
  nome_loja: ["nome", "loja", "store", "nome_loja", "store_name"],
  endereco: ["endereco", "endereço", "address", "endereco_principal"],
  regional: ["regional", "region", "area", "zona"],
  bandeira: ["bandeira", "banner", "categoria", "tipo"],
  ativo: ["ativo", "active", "status", "situacao"],
}

export function ETLUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [rawData, setRawData] = useState<SpreadsheetData[]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [etlResult, setEtlResult] = useState<ETLResult | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { downloadStores, downloadOSCs, downloadCampaigns } = generateSampleExcelFiles()

  const detectColumnMapping = (columns: string[]): ColumnMapping => {
    const mapping: ColumnMapping = {}

    Object.entries(REQUIRED_COLUMNS).forEach(([required, variations]) => {
      const found = columns.find((col) =>
        variations.some((variation) => col.toLowerCase().includes(variation.toLowerCase())),
      )
      if (found) {
        mapping[required] = found
      }
    })

    return mapping
  }

  const validateData = (data: SpreadsheetData[], mapping: ColumnMapping): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Verificar se todas as colunas obrigatórias estão mapeadas
    const requiredMapped = Object.keys(REQUIRED_COLUMNS).filter((key) => mapping[key])
    if (requiredMapped.length < 2) {
      errors.push("Pelo menos 2 colunas obrigatórias devem estar mapeadas (nome_loja e uma adicional)")
    }

    // Validar dados linha por linha
    data.forEach((row, index) => {
      if (mapping.nome_loja && !row[mapping.nome_loja]) {
        errors.push(`Linha ${index + 2}: Nome da loja é obrigatório`)
      }

      if (mapping.ativo && row[mapping.ativo]) {
        const status = String(row[mapping.ativo]).toLowerCase()
        if (!["true", "false", "ativo", "inativo", "1", "0", "sim", "não"].includes(status)) {
          warnings.push(`Linha ${index + 2}: Status "${row[mapping.ativo]}" pode não ser reconhecido`)
        }
      }
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  const processSpreadsheetFile = async (file: File): Promise<SpreadsheetData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })

          // Pegar a primeira planilha
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]

          // Converter para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
            blankrows: false,
          }) as any[][]

          if (jsonData.length < 2) {
            reject(new Error("Planilha deve ter pelo menos 2 linhas (cabeçalho + dados)"))
            return
          }

          // Primeira linha como cabeçalhos
          const headers = jsonData[0].map((h) => String(h).trim())

          // Converter dados para objetos
          const processedData = jsonData
            .slice(1)
            .map((row) => {
              const obj: SpreadsheetData = {}
              headers.forEach((header, index) => {
                obj[header] = row[index] || ""
              })
              return obj
            })
            .filter((row) => Object.values(row).some((val) => val !== ""))

          resolve(processedData)
        } catch (error) {
          reject(new Error("Erro ao processar planilha: " + (error as Error).message))
        }
      }

      reader.onerror = () => reject(new Error("Erro ao ler arquivo"))
      reader.readAsArrayBuffer(file)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validExtensions = [".csv", ".xlsx", ".xls"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV ou Excel (.xlsx, .xls)",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setFileName(file.name)

    try {
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressInterval)
            return 80
          }
          return prev + 20
        })
      }, 300)

      let data: SpreadsheetData[]

      if (fileExtension === ".csv") {
        const text = await file.text()
        const lines = text.trim().split("\n")
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        data = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
            const obj: SpreadsheetData = {}
            headers.forEach((header, index) => {
              obj[header] = values[index] || ""
            })
            return obj
          })
          .filter((row) => Object.values(row).some((val) => val !== ""))
      } else {
        data = await processSpreadsheetFile(file)
      }

      setUploadProgress(90)

      const columns = Object.keys(data[0] || {})
      setAvailableColumns(columns)
      setRawData(data)

      // Auto-detectar mapeamento de colunas
      const autoMapping = detectColumnMapping(columns)
      setColumnMapping(autoMapping)

      setUploadProgress(100)
      setShowPreview(true)

      toast({
        title: "Arquivo Carregado",
        description: `${data.length} registros encontrados. ${Object.keys(autoMapping).length} colunas mapeadas automaticamente.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const processData = async () => {
    if (rawData.length === 0) return

    setUploading(true)

    try {
      // Validar dados
      const validation = validateData(rawData, columnMapping)

      if (!validation.valid) {
        toast({
          title: "Erro de Validação",
          description: validation.errors[0],
          variant: "destructive",
        })
        setUploading(false)
        return
      }

      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Processar dados com mapeamento
      const processedData = rawData.map((row) => {
        const processed: any = {}
        Object.entries(columnMapping).forEach(([key, column]) => {
          if (column && row[column] !== undefined) {
            processed[key] = row[column]
          }
        })
        return processed
      })

      const result: ETLResult = {
        total_records: rawData.length,
        valid_records: processedData.length,
        invalid_records: rawData.length - processedData.length,
        warnings: validation.warnings,
        errors: validation.errors,
        data: processedData,
      }

      setEtlResult(result)
      setShowPreview(false)

      toast({
        title: "Processamento Concluído",
        description: `${result.valid_records} registros processados com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro no Processamento",
        description: "Falha ao processar os dados",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const templateData = [
      ["nome_loja", "endereco_principal", "regional", "bandeira", "ativo"],
      ["Loja Centro", "Rua das Flores, 123", "Regional Sul", "Pão de Açúcar", "true"],
      ["Loja Norte Shopping", "Av. Principal, 456", "Regional Norte", "Extra Hiper", "true"],
      ["Loja Oeste", "Rua Comercial, 789", "Regional Oeste", "Mercado Extra", "false"],
    ]

    const ws = XLSX.utils.aoa_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template Lojas")
    XLSX.writeFile(wb, "template_lojas.xlsx")

    toast({
      title: "Template Baixado",
      description: "Arquivo template_lojas.xlsx foi baixado",
    })
  }

  const openSupabaseAfterImport = () => {
    const supabaseUrl = "https://uyjxhhxhxdjrojblciru.supabase.co"
    window.open(`${supabaseUrl}/project/default/editor/lojas`, "_blank")

    toast({
      title: "Redirecionando para Supabase",
      description: "Abrindo tabela de lojas para verificar dados importados",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Import de Planilhas - Sistema Avançado</h2>
        <p className="text-gray-600">Importe dados de lojas via Excel ou CSV com mapeamento automático de colunas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload de Planilha
            </CardTitle>
            <CardDescription>Suporte para Excel (.xlsx, .xls) e CSV. Mapeamento automático de colunas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="spreadsheet-file">Arquivo de Planilha</Label>
              <Input
                id="spreadsheet-file"
                type="file"
                accept=".csv,.xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {fileName && <p className="text-sm text-muted-foreground">Arquivo selecionado: {fileName}</p>}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processando planilha...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Processando..." : "Selecionar Planilha"}
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Template Vazio
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="secondary" size="sm" onClick={downloadStores}>
                  <FileSpreadsheet className="w-3 h-3 mr-1" />
                  Lojas Exemplo
                </Button>
                <Button variant="secondary" size="sm" onClick={downloadOSCs}>
                  <FileSpreadsheet className="w-3 h-3 mr-1" />
                  OSCs Exemplo
                </Button>
                <Button variant="secondary" size="sm" onClick={downloadCampaigns}>
                  <FileSpreadsheet className="w-3 h-3 mr-1" />
                  Campanhas Exemplo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formatos Suportados</CardTitle>
            <CardDescription>Tipos de arquivo e estrutura esperada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <FileSpreadsheet className="w-4 h-4 mt-0.5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Excel (.xlsx, .xls)</p>
                  <p className="text-xs text-gray-600">Primeira planilha será processada automaticamente</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">CSV (.csv)</p>
                  <p className="text-xs text-gray-600">Separado por vírgulas, primeira linha como cabeçalho</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Mapeamento Automático</p>
                  <p className="text-xs text-gray-600">Detecta automaticamente colunas como nome, endereço, regional</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Eye className="w-4 h-4 mt-0.5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Preview dos Dados</p>
                  <p className="text-xs text-gray-600">Visualize e ajuste antes de importar</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showPreview && rawData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Preview dos Dados ({rawData.length} registros)</span>
              <Button onClick={processData} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Processar Dados
              </Button>
            </CardTitle>
            <CardDescription>
              Configure o mapeamento das colunas e visualize os dados antes da importação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(REQUIRED_COLUMNS).map((requiredCol) => (
                  <div key={requiredCol} className="space-y-2">
                    <Label htmlFor={requiredCol}>
                      {requiredCol.replace("_", " ").toUpperCase()}
                      {["nome_loja"].includes(requiredCol) && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={columnMapping[requiredCol] || "default"}
                      onValueChange={(value) => setColumnMapping((prev) => ({ ...prev, [requiredCol]: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar coluna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Não mapear</SelectItem>
                        {availableColumns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {availableColumns.slice(0, 6).map((col) => (
                        <TableHead key={col} className="font-medium">
                          {col}
                          {Object.values(columnMapping).includes(col) && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Mapeado
                            </Badge>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawData.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        {availableColumns.slice(0, 6).map((col) => (
                          <TableCell key={col} className="max-w-[150px] truncate">
                            {String(row[col] || "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {rawData.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">Mostrando 5 de {rawData.length} registros</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {etlResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Importação</CardTitle>
            <CardDescription>Resumo do processamento da planilha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{etlResult.total_records}</div>
                <div className="text-sm text-blue-600">Total de Registros</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{etlResult.valid_records}</div>
                <div className="text-sm text-green-600">Registros Processados</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{etlResult.invalid_records}</div>
                <div className="text-sm text-red-600">Registros com Problema</div>
              </div>
            </div>

            {etlResult.warnings.length > 0 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Avisos ({etlResult.warnings.length}):</div>
                  <ul className="list-disc list-inside space-y-1">
                    {etlResult.warnings.slice(0, 5).map((warning, index) => (
                      <li key={index} className="text-sm">
                        {warning}
                      </li>
                    ))}
                  </ul>
                  {etlResult.warnings.length > 5 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      E mais {etlResult.warnings.length - 5} avisos...
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {etlResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Erros ({etlResult.errors.length}):</div>
                  <ul className="list-disc list-inside space-y-1">
                    {etlResult.errors.slice(0, 3).map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                  {etlResult.errors.length > 3 && (
                    <p className="text-sm text-muted-foreground mt-2">E mais {etlResult.errors.length - 3} erros...</p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {etlResult.data.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Dados Processados (primeiros 3 registros):</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(columnMapping)
                          .filter((key) => columnMapping[key])
                          .map((key) => (
                            <TableHead key={key}>{key.replace("_", " ").toUpperCase()}</TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {etlResult.data.slice(0, 3).map((row, index) => (
                        <TableRow key={index}>
                          {Object.keys(columnMapping)
                            .filter((key) => columnMapping[key])
                            .map((key) => (
                              <TableCell key={key} className="max-w-[200px] truncate">
                                {String(row[key] || "")}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            <div className="flex space-x-2 mt-4">
              <Button onClick={openSupabaseAfterImport} className="bg-green-600 hover:bg-green-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Dados no Supabase
              </Button>
              <Button variant="outline" onClick={() => setEtlResult(null)}>
                Nova Importação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
