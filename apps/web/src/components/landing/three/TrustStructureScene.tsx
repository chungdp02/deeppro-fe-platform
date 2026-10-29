import { useEffect, useRef } from "react"
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three"

export function TrustStructureScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Scene, Camera, Renderer
    const scene = new Scene()
    const width = container.clientWidth || 360
    const height = container.clientHeight || 320

    const camera = new PerspectiveCamera(42, width / height, 0.1, 50)
    camera.position.set(0, 0, 6.4)

    let renderer: WebGLRenderer | null = null
    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height)
      renderer.toneMapping = ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.15
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // 2. Main 3D Group
    const rootGroup = new Group()
    scene.add(rootGroup)

    // 3. Central Genesis Core (Faceted Trust Crystal)
    // Inner solid core
    const innerGeom = new OctahedronGeometry(0.85, 0)
    const innerMat = new MeshPhysicalMaterial({
      color: new Color(0x0a3d62),
      emissive: new Color(0x00284d),
      metalness: 0.75,
      roughness: 0.2,
      transmission: 0.45,
      transparent: true,
      opacity: 0.88,
    })
    const innerMesh = new Mesh(innerGeom, innerMat)
    rootGroup.add(innerMesh)

    // Outer Geodesic Icosahedron Wireframe
    const outerGeom = new IcosahedronGeometry(1.22, 0)
    const edgesGeom = new EdgesGeometry(outerGeom)
    const lineMat = new LineBasicMaterial({
      color: new Color(0x38bdf8),
      transparent: true,
      opacity: 0.85,
    })
    const outerEdges = new LineSegments(edgesGeom, lineMat)
    rootGroup.add(outerEdges)

    // Center Glowing Pulse Sphere
    const pulseGeom = new SphereGeometry(0.32, 16, 16)
    const pulseMat = new MeshStandardMaterial({
      color: new Color(0x38bdf8),
      emissive: new Color(0x00d2ff),
      emissiveIntensity: 1.4,
      roughness: 0.3,
    })
    const pulseMesh = new Mesh(pulseGeom, pulseMat)
    rootGroup.add(pulseMesh)

    // 4. Orbiting Boundary Rings
    const ringGeom = new TorusGeometry(1.95, 0.012, 12, 80)
    const ringEdgesGeom = new EdgesGeometry(ringGeom)
    const ringMat = new LineBasicMaterial({
      color: new Color(0x38bdf8),
      transparent: true,
      opacity: 0.35,
    })
    const orbitRing1 = new LineSegments(ringEdgesGeom, ringMat)
    orbitRing1.rotation.x = Math.PI / 3.2
    orbitRing1.rotation.y = Math.PI / 6
    rootGroup.add(orbitRing1)

    const ringGeom2 = new TorusGeometry(1.75, 0.008, 12, 64)
    const ringEdgesGeom2 = new EdgesGeometry(ringGeom2)
    const orbitRing2 = new LineSegments(ringEdgesGeom2, ringMat)
    orbitRing2.rotation.x = -Math.PI / 4
    orbitRing2.rotation.z = Math.PI / 5
    rootGroup.add(orbitRing2)

    // 5. Distributed Supply Chain Nodes (4 Orbiting Nodes)
    const nodeCount = 4
    const nodeOrbitRadius = 1.88
    const nodeGroup = new Group()
    rootGroup.add(nodeGroup)

    interface NodeData {
      mesh: Mesh
      edges: LineSegments
      lineGeom: BufferGeometry
      line: LineSegments
      angle: number
      speed: number
      inclination: number
    }

    const nodes: NodeData[] = []
    const nodeGeom = new OctahedronGeometry(0.24, 0)
    const nodeEdgesGeom = new EdgesGeometry(nodeGeom)

    for (let i = 0; i < nodeCount; i++) {
      const nMat = new MeshStandardMaterial({
        color: new Color(0x071e33),
        emissive: new Color(0x0284c7),
        emissiveIntensity: 0.9,
        metalness: 0.8,
        roughness: 0.2,
      })
      const nMesh = new Mesh(nodeGeom, nMat)

      const nEdgeMat = new LineBasicMaterial({
        color: new Color(0x7dd3fc),
        transparent: true,
        opacity: 0.9,
      })
      const nEdges = new LineSegments(nodeEdgesGeom, nEdgeMat)
      nMesh.add(nEdges)

      // Connection line from center to node
      const linkGeom = new BufferGeometry()
      const linkPositions = new Float32Array(6) // 2 vertices: (0,0,0) to node pos
      linkGeom.setAttribute("position", new BufferAttribute(linkPositions, 3))
      const linkMat = new LineBasicMaterial({
        color: new Color(0x0284c7),
        transparent: true,
        opacity: 0.5,
      })
      const linkLine = new LineSegments(linkGeom, linkMat)
      rootGroup.add(linkLine)

      const angle = (i * Math.PI * 2) / nodeCount
      const inclination = (i % 2 === 0 ? 1 : -1) * 0.35
      const speed = 0.55 + (i % 2) * 0.15

      nodeGroup.add(nMesh)
      nodes.push({
        mesh: nMesh,
        edges: nEdges,
        lineGeom: linkGeom,
        line: linkLine,
        angle,
        speed,
        inclination,
      })
    }

    // 6. Floating Cryptographic Particles
    const particleCount = 48
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.3 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI * 0.8
      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi)
      particlePositions[i * 3 + 1] = radius * Math.sin(phi)
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi)
    }
    const particleGeom = new BufferGeometry()
    particleGeom.setAttribute("position", new BufferAttribute(particlePositions, 3))
    const particleMat = new PointsMaterial({
      color: new Color(0x38bdf8),
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    })
    const particles = new Points(particleGeom, particleMat)
    rootGroup.add(particles)

    // 7. Lighting
    const ambLight = new AmbientLight(0x0c263d, 2.2)
    scene.add(ambLight)

    const coreLight = new PointLight(0x38bdf8, 3.5, 8)
    coreLight.position.set(0, 0, 0)
    scene.add(coreLight)

    const topLight = new DirectionalLight(0xffffff, 2.0)
    topLight.position.set(3, 4, 3)
    scene.add(topLight)

    const rimLight = new DirectionalLight(0x0284c7, 2.0)
    rimLight.position.set(-3, -3, -2)
    scene.add(rimLight)

    // 8. Fixed Orientation & Autonomous Rotation State
    // Khối cố định tâm và góc nghiêng chuẩn (không di chuyển theo chuột), quay tự thân 360 độ quanh trục Y
    rootGroup.position.set(0, 0, 0)
    rootGroup.rotation.x = 0.22
    rootGroup.rotation.z = 0

    let currentRotationY = 0
    const autoRotationSpeed = 0.007
    let clockTime = 0
    let isVisible = !("IntersectionObserver" in window)
    let isContextLost = false
    let isDisposed = false
    let animationFrameId: number | undefined
    let renderedFrames = 0
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let prefersReducedMotion = motionPreference.matches
    const device = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }
    const isConstrainedDevice = Boolean(
      device.connection?.saveData ||
      (device.deviceMemory !== undefined && device.deviceMemory <= 4) ||
      (device.hardwareConcurrency !== undefined && device.hardwareConcurrency <= 4)
    )
    const canAnimate = () => !prefersReducedMotion && !isConstrainedDevice

    const updateScene = (advance: boolean) => {
      if (advance) {
        clockTime += 0.016
        currentRotationY += autoRotationSpeed
      }

      rootGroup.rotation.x = 0.22
      rootGroup.rotation.y = currentRotationY
      rootGroup.rotation.z = 0

      // Inner Core Counter-Rotation & Pulse
      innerMesh.rotation.x = -clockTime * 0.4
      innerMesh.rotation.y = clockTime * 0.6
      outerEdges.rotation.x = clockTime * 0.3
      outerEdges.rotation.z = -clockTime * 0.25

      const pulseScale = 1.0 + Math.sin(clockTime * 2.5) * 0.12
      pulseMesh.scale.set(pulseScale, pulseScale, pulseScale)

      // Orbiting Nodes & Dynamic Link Geometry
      nodes.forEach((node, index) => {
        const currentAngle = node.angle + clockTime * node.speed
        const x = Math.cos(currentAngle) * nodeOrbitRadius
        const z = Math.sin(currentAngle) * nodeOrbitRadius
        const y = Math.sin(currentAngle * 2 + node.inclination) * 0.45

        node.mesh.position.set(x, y, z)
        if (advance) {
          node.mesh.rotation.x += 0.02
          node.mesh.rotation.y += 0.03
        }

        // Update connection line
        const posAttr = node.lineGeom.attributes.position as BufferAttribute
        const array = posAttr.array as Float32Array
        // Vertex 0: Center (0, 0, 0)
        array[0] = 0
        array[1] = 0
        array[2] = 0
        // Vertex 1: Node Position (x, y, z)
        array[3] = x
        array[4] = y
        array[5] = z
        posAttr.needsUpdate = true

        // Pulsing line opacity
        const mat = node.line.material as LineBasicMaterial
        mat.opacity = 0.35 + Math.sin(clockTime * 3 + index) * 0.25
      })

      // Orbit Rings rotation
      orbitRing1.rotation.z = clockTime * 0.2
      orbitRing2.rotation.z = -clockTime * 0.25

      // Particle Field rotation
      particles.rotation.y = -clockTime * 0.1
    }

    const drawScene = () => {
      if (!renderer || isContextLost || isDisposed || !isVisible || document.hidden) return
      renderer.render(scene, camera)
      renderedFrames += 1
      renderer.domElement.dataset.renderedFrames = String(renderedFrames)
    }

    const stopAnimation = () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = undefined
      }
      if (renderer) renderer.domElement.dataset.animated = "false"
    }

    const animate = () => {
      animationFrameId = undefined
      if (
        !renderer ||
        isContextLost ||
        isDisposed ||
        !isVisible ||
        document.hidden ||
        !canAnimate()
      ) {
        return
      }

      updateScene(true)
      drawScene()
      animationFrameId = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (!renderer || isContextLost || isDisposed || !isVisible || document.hidden) return

      updateScene(false)
      drawScene()

      if (!canAnimate()) {
        stopAnimation()
        return
      }

      renderer.domElement.dataset.animated = "true"
      if (animationFrameId === undefined) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    const resizeRenderer = () => {
      if (!renderer) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      if (newWidth <= 0 || newHeight <= 0) return
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
      drawScene()
    }

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      isContextLost = true
      stopAnimation()
    }

    const handleContextRestored = () => {
      isContextLost = false
      resizeRenderer()
      startAnimation()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation()
      } else {
        startAnimation()
      }
    }

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches
      if (prefersReducedMotion) {
        stopAnimation()
        drawScene()
      } else {
        startAnimation()
      }
    }

    renderer.domElement.dataset.animated = "false"
    renderer.domElement.dataset.visible = String(isVisible)
    renderer.domElement.dataset.renderedFrames = "0"
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost)
    renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    motionPreference.addEventListener("change", handleMotionPreferenceChange)

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          isVisible = entry?.isIntersecting ?? false
          if (renderer) renderer.domElement.dataset.visible = String(isVisible)
          if (isVisible) {
            startAnimation()
          } else {
            stopAnimation()
          }
        }, { threshold: 0.05 })
      : null
    observer?.observe(container)
    if (isVisible) startAnimation()

    // 10. ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !renderer) return
      const { width: newWidth, height: newHeight } = entries[0].contentRect
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
        drawScene()
      }
    })
    resizeObserver.observe(container)

    // 11. Cleanup
    return () => {
      isDisposed = true
      stopAnimation()
      observer?.disconnect()
      resizeObserver.disconnect()
      renderer?.domElement.removeEventListener("webglcontextlost", handleContextLost)
      renderer?.domElement.removeEventListener("webglcontextrestored", handleContextRestored)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      motionPreference.removeEventListener("change", handleMotionPreferenceChange)

      innerGeom.dispose()
      innerMat.dispose()
      outerGeom.dispose()
      edgesGeom.dispose()
      lineMat.dispose()
      pulseGeom.dispose()
      pulseMat.dispose()
      ringGeom.dispose()
      ringEdgesGeom.dispose()
      ringGeom2.dispose()
      ringEdgesGeom2.dispose()
      ringMat.dispose()
      nodeGeom.dispose()
      nodeEdgesGeom.dispose()
      particleGeom.dispose()
      particleMat.dispose()

      nodes.forEach((node) => {
        node.lineGeom.dispose()
        ;(node.line.material as LineBasicMaterial).dispose()
        ;(node.mesh.material as MeshStandardMaterial).dispose()
        ;(node.edges.material as LineBasicMaterial).dispose()
      })

      renderer?.dispose()
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="why-deeptrace__3d-canvas"
      aria-hidden="true"
      title="Cấu trúc khối chuỗi mã hóa phi tập trung DeepTrace"
    />
  )
}
