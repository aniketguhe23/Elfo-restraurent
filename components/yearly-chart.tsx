"use client"

import { useEffect, useRef } from "react"

export function YearlyChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    const gridCount = 5
    const gridHeight = canvas.height / gridCount

    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"

    for (let i = 1; i < gridCount; i++) {
      const y = i * gridHeight
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
    }

    ctx.stroke()

    // Draw x-axis labels (months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const labelWidth = canvas.width / months.length

    ctx.fillStyle = "#6b7280"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"

    months.forEach((month, i) => {
      const x = i * labelWidth + labelWidth / 2
      ctx.fillText(month, x, canvas.height - 10)
    })

    // Draw y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i < gridCount; i++) {
      const y = canvas.height - i * gridHeight
      ctx.fillText(`${i * 0.25}`, 30, y - 5)
    }

    // Sample data (replace with actual data)
    const data = [0.1, 0.2, 0.15, 0.3, 0.25, 0.4, 0.35, 0.5, 0.45, 0.6, 0.55, 0.7]

    // Draw line chart
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2

    data.forEach((value, i) => {
      const x = i * labelWidth + labelWidth / 2
      const y = canvas.height - value * canvas.height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    data.forEach((value, i) => {
      const x = i * labelWidth + labelWidth / 2
      const y = canvas.height - value * canvas.height

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
