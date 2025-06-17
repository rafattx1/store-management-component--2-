"use client"

import type React from "react"
import { useState } from "react"
import { Home, BarChart, ShoppingCart, Settings, Upload } from "lucide-react"

import SupermarketDashboard from "./supermarket-dashboard"
import { SupabaseIntegration } from "./components/supabase-integration"
import { AdvancedCharts } from "./components/advanced-charts"
import { ImportDataViewer } from "./components/import-data-viewer"
import { CampaignProcessor } from "./components/campaign-processor"

interface NavItem {
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  badge?: string
  component: React.ComponentType
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: Home,
    component: SupermarketDashboard,
  },
  {
    name: "Analytics",
    icon: BarChart,
    component: AdvancedCharts,
  },
  {
    name: "Import Dados",
    icon: ShoppingCart,
    component: ImportDataViewer,
  },
  {
    name: "Supabase",
    icon: Settings,
    component: SupabaseIntegration,
  },
  {
    name: "Processador Campanhas",
    icon: Upload,
    badge: "PRÉ/PÓS",
    component: CampaignProcessor,
  },
]

const EnhancedSupermarketDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Dashboard")

  const handleItemClick = (name: string) => {
    setActiveItem(name)
  }

  const renderContent = () => {
    switch (activeItem) {
      case "Dashboard":
        return <SupermarketDashboard />
      case "Analytics":
        return <AdvancedCharts />
      case "Import Dados":
        return <ImportDataViewer />
      case "Supabase":
        return <SupabaseIntegration />
      case "Processador Campanhas":
        return <CampaignProcessor />
      default:
        return <SupermarketDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Painel Supermercado</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {navItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer ${
                  activeItem === item.name ? "bg-gray-700" : ""
                }`}
                onClick={() => handleItemClick(item.name)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 text-center border-t border-gray-700">
          <p className="text-sm">© 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-md p-6">{renderContent()}</div>
      </div>
    </div>
  )
}

export default EnhancedSupermarketDashboard
