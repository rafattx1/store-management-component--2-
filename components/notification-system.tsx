"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bell,
  BellRing,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
  category: "loja" | "osc" | "sistema" | "campanha"
  actions?: Array<{ label: string; action: string }>
}

interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  sound: boolean
  frequency: "immediate" | "hourly" | "daily"
  categories: {
    loja: boolean
    osc: boolean
    sistema: boolean
    campanha: boolean
  }
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "critical",
      title: "Loja com Zero Arrecadação",
      message: "Extra Centro São Paulo está há 3 dias sem arrecadação",
      timestamp: "2024-12-14T10:30:00Z",
      read: false,
      category: "loja",
      actions: [
        { label: "Investigar", action: "investigate" },
        { label: "Contatar Gerente", action: "contact" },
      ],
    },
    {
      id: "2",
      type: "warning",
      title: "OSC Não Participou",
      message: "Instituto Solidário não confirmou presença na campanha atual",
      timestamp: "2024-12-14T09:15:00Z",
      read: false,
      category: "osc",
      actions: [{ label: "Reengajar", action: "reengage" }],
    },
    {
      id: "3",
      type: "info",
      title: "Sincronização Concluída",
      message: "Dados sincronizados com Supabase com sucesso",
      timestamp: "2024-12-14T08:45:00Z",
      read: true,
      category: "sistema",
    },
    {
      id: "4",
      type: "success",
      title: "Meta Atingida",
      message: "Pão de Açúcar Vila Madalena atingiu 120% da meta mensal",
      timestamp: "2024-12-14T08:00:00Z",
      read: true,
      category: "loja",
    },
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    sound: true,
    frequency: "immediate",
    categories: {
      loja: true,
      osc: true,
      sistema: false,
      campanha: true,
    },
  })

  const [showSettings, setShowSettings] = useState(false)
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Crítico</Badge>
      case "warning":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Aviso</Badge>
      case "info":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>
      case "success":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Sucesso</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      loja: "bg-purple-100 text-purple-800",
      osc: "bg-orange-100 text-orange-800",
      sistema: "bg-gray-100 text-gray-800",
      campanha: "bg-blue-100 text-blue-800",
    }
    return <Badge className={colors[category as keyof typeof colors]}>{category.toUpperCase()}</Badge>
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleAction = (notificationId: string, action: string) => {
    toast({
      title: "Ação Executada",
      description: `Ação "${action}" executada para a notificação`,
    })
    markAsRead(notificationId)
  }

  const updateSettings = (key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Configurações Atualizadas",
      description: "Suas preferências de notificação foram salvas",
    })
  }

  const updateCategorySettings = (category: keyof NotificationSettings["categories"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      categories: { ...prev.categories, [category]: value },
    }))
  }

  // Simular novas notificações
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% de chance a cada 10 segundos
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["critical", "warning", "info", "success"][Math.floor(Math.random() * 4)] as any,
          title: "Nova Notificação",
          message: "Esta é uma notificação de exemplo em tempo real",
          timestamp: new Date().toISOString(),
          read: false,
          category: ["loja", "osc", "sistema", "campanha"][Math.floor(Math.random() * 4)] as any,
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Configurações de Notificação</h2>
            <p className="text-sm text-gray-600 mt-1">Configure como e quando receber notificações</p>
          </div>
          <Button variant="outline" onClick={() => setShowSettings(false)}>
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Canais de Notificação</CardTitle>
            <CardDescription>Escolha como deseja receber as notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-600">Receber notificações por email</div>
                </div>
              </div>
              <Switch checked={settings.email} onCheckedChange={(value) => updateSettings("email", value)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">SMS</div>
                  <div className="text-sm text-gray-600">Receber notificações por SMS</div>
                </div>
              </div>
              <Switch checked={settings.sms} onCheckedChange={(value) => updateSettings("sms", value)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BellRing className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium">Push</div>
                  <div className="text-sm text-gray-600">Notificações push no navegador</div>
                </div>
              </div>
              <Switch checked={settings.push} onCheckedChange={(value) => updateSettings("push", value)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.sound ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <div className="font-medium">Som</div>
                  <div className="text-sm text-gray-600">Reproduzir som nas notificações</div>
                </div>
              </div>
              <Switch checked={settings.sound} onCheckedChange={(value) => updateSettings("sound", value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequência</CardTitle>
            <CardDescription>Com que frequência deseja receber notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={settings.frequency} onValueChange={(value: any) => updateSettings("frequency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Imediato</SelectItem>
                <SelectItem value="hourly">A cada hora</SelectItem>
                <SelectItem value="daily">Diário</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>Escolha quais tipos de notificação deseja receber</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.categories).map(([category, enabled]) => (
              <div key={category} className="flex items-center justify-between">
                <div>
                  <div className="font-medium capitalize">{category}</div>
                  <div className="text-sm text-gray-600">
                    Notificações relacionadas a {category === "loja" ? "lojas" : category}
                  </div>
                </div>
                <Switch checked={enabled} onCheckedChange={(value) => updateCategorySettings(category as any, value)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Notificações</h2>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} não lida{unreadCount !== 1 ? "s" : ""} de {notifications.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Marcar Todas como Lidas
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Notificações Críticas em Destaque */}
      {notifications.filter((n) => n.type === "critical" && !n.read).length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="font-medium text-red-800 mb-1">
              {notifications.filter((n) => n.type === "critical" && !n.read).length} notificação(ões) crítica(s)
              requer(em) atenção imediata
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de Notificações */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`border-0 shadow-sm transition-all duration-200 ${
              !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-white"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      {getNotificationBadge(notification.type)}
                      {getCategoryBadge(notification.category)}
                      {!notification.read && <Badge variant="outline">Nova</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString("pt-BR")}
                      </span>
                      {notification.actions && (
                        <div className="flex space-x-2">
                          {notification.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(notification.id, action.action)}
                              className="text-xs"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação</h3>
            <p className="text-gray-600">Você está em dia com todas as notificações!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
