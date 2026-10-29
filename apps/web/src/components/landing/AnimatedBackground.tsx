import { useEffect, useRef } from "react"

interface FloatingDot {
  x: number
  y: number
  radius: number
  depth: number
  baseAlpha: number
  twinkleSpeed: number
  twinkleOffset: number
  vx: number
  vy: number
}

function getThemeColors(isDark: boolean) {
  if (isDark) {
    return {
      glowCenter: "rgba(0, 90, 171, 0.22)",
      glowSecondary: "rgba(56, 189, 248, 0.08)",
      dotPrimary: "#add8ff",
      dotSecondary: "#38bdf8",
      dotAccent: "#7dd3fc",
      dotAlphaMult: 0.85,
    }
  }
  return {
    glowCenter: "rgba(0, 90, 171, 0.06)",
    glowSecondary: "rgba(37, 99, 235, 0.03)",
    dotPrimary: "#005aab",
    dotSecondary: "#0284c7",
    dotAccent: "#2563eb",
    dotAlphaMult: 0.55,
  }
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let isDark = document.documentElement.classList.contains("dark")
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let isReducedMotion = motionQuery.matches
    let isVisible = !document.hidden

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Floating Data Dots (Các dấu chấm dữ liệu bay lơ lửng xung quanh)
    const dotCount = width < 768 ? 65 : width < 1200 ? 110 : 150
    const dots: FloatingDot[] = []
    for (let i = 0; i < dotCount; i++) {
      const depth = Math.random() * 0.8 + 0.2 // 0.2 (xa) đến 1.0 (gần)
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: depth * 1.5 + 0.8, // 0.9px đến 2.3px
        depth,
        baseAlpha: Math.random() * 0.45 + 0.35,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.35 * depth,
        vy: (Math.random() - 0.5) * 0.35 * depth,
      })
    }

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX - width / 2) * 0.04
      mouse.targetY = (e.clientY - height / 2) * 0.03
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark")
      if (isReducedMotion) {
        renderFrame(0)
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches
      if (isReducedMotion) {
        cancelAnimationFrame(animationFrameId)
        renderFrame(0)
      } else {
        animationFrameId = requestAnimationFrame(loop)
      }
    }
    motionQuery.addEventListener("change", handleMotionChange)

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && !isReducedMotion) {
        animationFrameId = requestAnimationFrame(loop)
      } else {
        cancelAnimationFrame(animationFrameId)
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    window.addEventListener("resize", resize)

    const renderFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const colors = getThemeColors(isDark)

      // Easing chuyển động parallax theo chuột
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // =========================================================================
      // 1. SOFT AMBIENT GLOW (Quầng sáng chuyển màu không gian công nghệ mờ ảo)
      // =========================================================================
      const glowX = width * 0.65 + mouse.x
      const glowY = height * 0.35 + mouse.y
      const glowRadius = Math.max(width, height) * 0.55

      const radialGrad = ctx.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        glowRadius
      )
      radialGrad.addColorStop(0, colors.glowCenter)
      radialGrad.addColorStop(0.5, colors.glowSecondary)
      radialGrad.addColorStop(1, "transparent")

      ctx.fillStyle = radialGrad
      ctx.fillRect(0, 0, width, height)

      // =========================================================================
      // 2. CÁC DẤU CHẤM BAY LƠ LỬNG XUNG QUANH (Floating Data Dots)
      // =========================================================================
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        if (!isReducedMotion) {
          dot.x += dot.vx
          dot.y += dot.vy

          // Vòng lặp mượt mà khi trôi ra khỏi biên màn hình
          if (dot.x < -20) dot.x = width + 20
          else if (dot.x > width + 20) dot.x = -20
          if (dot.y < -20) dot.y = height + 20
          else if (dot.y > height + 20) dot.y = -20
        }

        // Tọa độ tính kèm chiều sâu parallax
        const drawX = dot.x + mouse.x * dot.depth
        const drawY = dot.y + mouse.y * dot.depth

        // Hiệu ứng nhấp nháy phát sáng nhẹ nhàng
        const twinkle = isReducedMotion
          ? 1
          : 0.75 + 0.25 * Math.sin(time * dot.twinkleSpeed + dot.twinkleOffset)
        const alpha = dot.baseAlpha * twinkle * colors.dotAlphaMult

        ctx.beginPath()
        ctx.arc(drawX, drawY, dot.radius, 0, Math.PI * 2)

        // Phân phối màu sắc công nghệ hài hòa
        ctx.fillStyle =
          i % 6 === 0
            ? colors.dotAccent
            : i % 3 === 0
              ? colors.dotSecondary
              : colors.dotPrimary

        ctx.globalAlpha = Math.min(Math.max(alpha, 0.08), 0.95)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (currentTime: number) => {
      renderFrame(currentTime)
      if (isVisible && !isReducedMotion) {
        animationFrameId = requestAnimationFrame(loop)
      }
    }

    if (isReducedMotion) {
      renderFrame(0)
    } else {
      animationFrameId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      motionQuery.removeEventListener("change", handleMotionChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="animated-background-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="animated-background-canvas" />
    </div>
  )
}
