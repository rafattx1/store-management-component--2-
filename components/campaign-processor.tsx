"use client"

import { FileText, CheckCircle, AlertTriangle, Loader2, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

type ProcessingResult = {
  success: boolean
  message: string
  data?: any
}

export const CampaignProcessor = () => {
  const [campaignText, setCampaignText] = useState("")
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const processCampaign = async () => {
    setIsLoading(true)
    setProcessingResult(null)

    // Simulate processing (replace with actual logic)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Simulate success
      const success = Math.random() > 0.2 // Simulate occasional failures
      if (success) {
        setProcessingResult({
          success: true,
          message: "Campanha processada com sucesso!",
          data: {
            // Example data
            totalStores: 150,
            storesWithIssue: 12,
          },
        })
        toast({
          title: "Sucesso!",
          description: "Campanha processada com sucesso.",
        })
      } else {
        throw new Error("Erro ao processar a campanha.")
      }
    } catch (error: any) {
      setProcessingResult({
        success: false,
        message: error.message || "Erro desconhecido ao processar a campanha.",
      })
      toast({
        variant: "destructive",
        title: "Erro!",
        description: error.message || "Erro desconhecido ao processar a campanha.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openSupabaseLojas = () => {
    const supabaseUrl = "https://uyjxhhxhxdjrojblciru.supabase.co"
    const lojasUrl = `${supabaseUrl}/project/default/editor/lojas`
    window.open(lojasUrl, "_blank")
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Processador de Campanhas</CardTitle>
          <CardDescription>Cole o texto da campanha para processar.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Textarea
            placeholder="Cole o texto da campanha aqui..."
            value={campaignText}
            onChange={(e) => setCampaignText(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={processCampaign} disabled={isLoading}>
            {isLoading ? (
              <>
                Processando... <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Processar Campanha <FileText className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          {processingResult && (
            <div>
              {processingResult.success ? (
                <Badge variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Sucesso
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Falha
                </Badge>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      {processingResult && (
        <div className="mt-6">
          <Separator />
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Resultados do Processamento</CardTitle>
                <CardDescription>{processingResult.message}</CardDescription>
              </CardHeader>
              <CardContent>
                {processingResult.data && (
                  <div>
                    <p>Total de Lojas: {processingResult.data.totalStores}</p>
                    <p>Lojas com Problemas: {processingResult.data.storesWithIssue}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={openSupabaseLojas}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Lojas no Supabase
                  </Button>
                  <Button variant="outline" onClick={() => setProcessingResult(null)}>
                    Nova Campanha
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignProcessor
