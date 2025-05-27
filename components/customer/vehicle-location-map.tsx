"use client"

import { useEffect, useRef } from "react"

interface VehicleLocation {
  id: string
  companyName: string
  vehicleName: string
  longitude: number
  latitude: number
  vehicleStatus: string
}

interface VehicleLocationMapProps {
  locations: VehicleLocation[]
}

export function VehicleLocationMap({ locations }: VehicleLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // This is a placeholder for a real map implementation
    // In a real application, you would use a library like Leaflet, Google Maps, or Mapbox
    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a simple map background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#f8fafc")
    gradient.addColorStop(1, "#e2e8f0")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw some roads
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 3

    // Horizontal main road
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    // Vertical main road
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()

    // Some diagonal roads
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(canvas.width, canvas.height)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width, 0)
    ctx.lineTo(0, canvas.height)
    ctx.stroke()

    // Simple conversion from lat/lng to x/y for demonstration
    // In a real app, you would use proper map projections
    const convertToXY = (lat: number, lng: number) => {
      // Center around Riyadh, Saudi Arabia (24.7136, 46.6753)
      const centerLat = 24.7136
      const centerLng = 46.6753
      const scale = 1000

      const x = (lng - centerLng) * scale + canvas.width / 2
      const y = (centerLat - lat) * scale + canvas.height / 2

      return { x, y }
    }

    // Draw vehicle locations
    locations.forEach((location) => {
      const { x, y } = convertToXY(location.latitude, location.longitude)

      // Draw vehicle shadow
      ctx.beginPath()
      ctx.arc(x + 2, y + 2, 8, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.fill()

      // Draw vehicle marker
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)

      // Color based on status
      switch (location.vehicleStatus) {
        case "Moving":
          ctx.fillStyle = "#4CAF50" // Green
          break
        case "Stopped":
          ctx.fillStyle = "#FF2D55" // Wialon Red
          break
        case "Idle":
          ctx.fillStyle = "#FFC107" // Yellow
          break
        default:
          ctx.fillStyle = "#9E9E9E" // Grey
      }

      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()

      // Add vehicle name with background for better readability
      const text = location.vehicleName
      const textWidth = ctx.measureText(text).width

      // Text background
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fillRect(x + 12, y - 8, textWidth + 6, 16)

      // Text
      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.fillText(text, x + 15, y + 4)
    })

    // Add a legend
    const legendY = 30
    const legendX = 20
    const legendSpacing = 25

    // Legend title
    ctx.fillStyle = "#000000"
    ctx.font = "bold 14px Arial"
    ctx.fillText("Vehicle Status", legendX, legendY)

    // Moving status
    ctx.beginPath()
    ctx.arc(legendX + 10, legendY + legendSpacing, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#4CAF50"
    ctx.fill()
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.fillText("Moving", legendX + 25, legendY + legendSpacing + 4)

    // Stopped status
    ctx.beginPath()
    ctx.arc(legendX + 10, legendY + legendSpacing * 2, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#FF2D55"
    ctx.fill()
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.fillText("Stopped", legendX + 25, legendY + legendSpacing * 2 + 4)

    // Idle status
    ctx.beginPath()
    ctx.arc(legendX + 10, legendY + legendSpacing * 3, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "#FFC107"
    ctx.fill()
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.fillText("Idle", legendX + 25, legendY + legendSpacing * 3 + 4)

    // Add a note about this being a placeholder
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.font = "italic 12px Arial"
    ctx.fillText(
      "This is a placeholder map. In a production environment, use a proper mapping library.",
      20,
      canvas.height - 20,
    )
  }, [locations])

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] bg-gray-100 border rounded-md shadow-inner"
      aria-label="Map showing vehicle locations"
    />
  )
}
