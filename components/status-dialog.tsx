"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface StatusDialogProps {
  response: string
  duplicate?: boolean
  vehicleData?: any
  token?: string // <-- Add token prop
}

export function StatusDialog({ response, duplicate, vehicleData, token }: StatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [statusData, setStatusData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch vehicle status when opened
  const fetchStatus = async (id: string | number) => {
    setLoading(true)
    setError(null)
    try {
      console.log("🔁 Fetching vehicle status for ID:", id)
      const res = await fetch(`https://wasl-api.tracking.me/api/genesis/wasl/vehicle-status/${id}`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : `Token`, // Use Bearer if token provided
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) {
        const errorText = await res.text()
        let errorBody
        try {
          errorBody = JSON.parse(errorText)
        } catch {
          errorBody = errorText
        }
        console.error("⚠️ Fetch failed with status:", res.status, errorBody)
        throw new Error(`Server returned ${res.status}${errorBody ? ": " + JSON.stringify(errorBody) : ""}`)
      }
      const data = await res.json()
      setStatusData(data)
    } catch (err: any) {
      console.error("❌ Error fetching vehicle status:", err)
      setError(err.message || "Error fetching vehicle status")
      setStatusData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && vehicleData?.id) {
      fetchStatus(vehicleData.id)
    }
  }

  // Helper: initial response parsing UI
  const renderVehicleInfo = () => {
    let parsedResponse = undefined
    try {
      const base = vehicleData.response
      const tryParse = JSON.parse(base)
      parsedResponse = typeof tryParse.message === "string"
        ? JSON.parse(tryParse.message)
        : tryParse
    } catch {
      // fallback to raw
    }

    const info = parsedResponse?.vehicleLocationInformation
      ? parsedResponse
      : vehicleData

    const plate = info.plate
    const loc = info.vehicleLocationInformation
    const name = plate
      ? `${plate.number} ${plate.leftLetter}${plate.middleLetter}${plate.rightLetter}`
      : vehicleData.vehicle_name

    return (
      <div className="mb-4 text-xs space-y-1">
        <div><b>Vehicle Name:</b> {name}</div>
        <div><b>WASL Key:</b> {info.referenceKey ?? vehicleData.wasl_asset_key}</div>
        {loc && <div><b>Status:</b> {loc.vehicleStatus === "PARKED_ENGINE_ON" ? "Registered" : loc.vehicleStatus}</div>}
        {parsedResponse?.operatingCompanies?.[0]?.name && (
          <div><b>Company:</b> {parsedResponse.operatingCompanies[0].name}</div>
        )}
        {!parsedResponse && vehicleData.response && (
          <div><b>Response:</b> <pre className="whitespace-pre-wrap">{vehicleData.response}</pre></div>
        )}
      </div>
    )
  }

  const renderStatusInfo = () => {
    if (!statusData?.success) return null

    let parsed: any = null
    try {
      parsed = typeof statusData.message === "string"
        ? JSON.parse(statusData.message)
        : statusData.message
    } catch {}

    if (!parsed) return null

    const { plate, vehicleLocationInformation: loc, referenceKey, vehicleIMEI } = parsed
    const name = plate
      ? `${plate.number} ${plate.leftLetter}${plate.middleLetter}${plate.rightLetter}`
      : "-"

    return (
      <div className="mb-4 text-xs space-y-1">
        <div><b>Vehicle Name:</b> {name}</div>
        <div><b>WASL Key:</b> {referenceKey}</div>
        <div><b>Status:</b> {loc.vehicleStatus === "PARKED_ENGINE_ON" ? "Registered" : loc.vehicleStatus}</div>
        {parsed.operatingCompanies?.[0]?.name && (
          <div><b>Company:</b> {parsed.operatingCompanies[0].name}</div>
        )}
        <div><b>IMEI:</b> {vehicleIMEI}</div>
        <div><b>Location:</b> {loc.latitude}, {loc.longitude}</div>
        <div><b>Actual Time:</b> {loc.actualTime}</div>
        <div><b>Received Time:</b> {loc.receivedTime}</div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Check Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>WASL API Response</DialogTitle>
          <DialogDescription>
            {duplicate
              ? <span className="text-red-500 font-semibold">Duplicate</span>
              : "The detailed response from the WASL API."}
          </DialogDescription>
        </DialogHeader>

        {loading && <div>Loading status…</div>}

        {error && (
          <div className="mb-4 text-xs text-red-500">
            <div className="font-bold text-base">Live status not available (Error)</div>
            <div>{error}</div>
            <div className="mt-2">Last registration data:</div>
            {renderVehicleInfo()}
            <Button variant="outline" size="sm" className="mt-2" onClick={() => vehicleData?.id && fetchStatus(vehicleData.id)}>
              Retry
            </Button>
          </div>
        )}

        {!error && (renderStatusInfo() ?? renderVehicleInfo())}
<div className="max-h-[300px] overflow-y-scroll rounded p-4 flex items-center justify-center">
  <pre className="text-xs whitespace-pre-wrap break-words text-center">
    {statusData?.success ? statusData.message : response}
  </pre>
</div>


      </DialogContent>
    </Dialog>
  )
}
