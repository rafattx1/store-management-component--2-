import * as XLSX from "xlsx"
import { sampleStoresData, sampleOSCsData, sampleCampaignsData } from "../data/sample-stores"

export const generateSampleExcelFiles = () => {
  // Gerar arquivo de lojas
  const storesWS = XLSX.utils.json_to_sheet(sampleStoresData)
  const storesWB = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(storesWB, storesWS, "Lojas")

  // Gerar arquivo de OSCs
  const oscsWS = XLSX.utils.json_to_sheet(sampleOSCsData)
  const oscsWB = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(oscsWB, oscsWS, "OSCs")

  // Gerar arquivo de campanhas
  const campaignsWS = XLSX.utils.json_to_sheet(sampleCampaignsData)
  const campaignsWB = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(campaignsWB, campaignsWS, "Campanhas")

  return {
    downloadStores: () => XLSX.writeFile(storesWB, "dados_lojas_exemplo.xlsx"),
    downloadOSCs: () => XLSX.writeFile(oscsWB, "dados_oscs_exemplo.xlsx"),
    downloadCampaigns: () => XLSX.writeFile(campaignsWB, "dados_campanhas_exemplo.xlsx"),
  }
}
