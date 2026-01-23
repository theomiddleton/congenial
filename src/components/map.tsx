'use client'

import { useEffect, useState } from 'react'

export function Map() {
  const [svgContent, setSvgContent] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const response = await fetch('/map.svg')
        const svgText = await response.text()
        setSvgContent(svgText)
      } catch (error) {
        console.error('Failed to load SVG:', error)
      }
    }

    if (mounted) {
      loadSVG()
    }
  }, [mounted])

  useEffect(() => {
    if (svgContent) {
      const timer = setTimeout(() => {
        const rects = document.querySelectorAll('#map-svg rect')
        console.log(`[v0] Found ${rects.length} rect elements`)

        rects.forEach((rect, index) => {
          const duration = Math.random() * 1.5 + 0.5 // 0.5-2 seconds (faster)
          const delay = Math.random() * 1 // 0-1 seconds

          rect.setAttribute(
            'style',
            `
            animation: glimmer ${duration}s ease-in-out ${delay}s infinite alternate;
          `,
          )
        })

        const style = document.createElement('style')
        style.textContent = `
          @keyframes glimmer {
            0% { opacity: 1; }
            100% { opacity: 0.1; }
          }
        `
        document.head.appendChild(style)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [svgContent])

  if (!mounted) {
    return (
      <div className="w-full overflow-x-hidden flex items-center justify-center p-4 bg-card">
        <div className="flex justify-center items-center w-full">
          <div
            className="bg-gray-200 animate-pulse rounded-lg"
            style={{
              width: '100%',
              height: '400px',
              maxWidth: '600px',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden flex items-center justify-center p-4 bg-card relative">
      <div className="flex justify-center items-center w-full">
        {svgContent ? (
          <div
            id="map-svg"
            className="overflow-hidden flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              width: '100%',
              height: '400px',
              maxWidth: '600px',
            }}
          />
        ) : (
          <div
            className="bg-gray-200 animate-pulse rounded-lg"
            style={{
              width: '100%',
              height: '400px',
              maxWidth: '600px',
            }}
          />
        )}
      </div>
    </div>
  )
}
