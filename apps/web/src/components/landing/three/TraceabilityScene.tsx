import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import {
  ACESFilmicToneMapping,
  BufferGeometry,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Points,
  QuadraticBezierCurve3,
  Vector2,
  Vector3,
  type Object3D,
} from "three"
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js"
import type { TraceCanvasProps } from "../HeroScene"
import { traceStages, type ActiveTraceStage, type TraceStageIndex } from "../traceability-data"

/* =========================================================================
   1. DIGITAL PRODUCT PASSPORT (DPP) - HOLOGRAPHIC QR & MODULES
   ========================================================================= */
function PassportModules() {
  const instances = useRef<InstancedMesh>(null)
  const scannerRef = useRef<Mesh>(null)
  const frameGeometry = useMemo(() => new RoundedBoxGeometry(0.98, 0.98, 0.012, 3, 0.03), [])

  const cells = useMemo(() => {
    const result: [number, number][] = []
    const finderIsDark = (x: number, y: number, left: number, top: number) => {
      const column = x - left
      const row = y - top
      return (
        column === 0 ||
        column === 6 ||
        row === 0 ||
        row === 6 ||
        (column >= 2 && column <= 4 && row >= 2 && row <= 4)
      )
    }
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const finder = [[0, 0], [8, 0], [0, 8]].find(
          ([left, top]) => x >= left && x < left + 7 && y >= top && y < top + 7
        )
        const dark = finder
          ? finderIsDark(x, y, finder[0], finder[1])
          : x === 7 || y === 7
            ? (x + y) % 2 === 0
            : (x * 7 + y * 11 + x * y * 3) % 9 < 4
        if (dark) result.push([x, y])
      }
    }
    return result
  }, [])

  useLayoutEffect(() => {
    const mesh = instances.current
    if (!mesh) return
    const matrix = new Matrix4()
    cells.forEach(([x, y], index) => {
      mesh.setMatrixAt(
        index,
        matrix.makeTranslation((x - 7) * 0.055, (7 - y) * 0.055 + 0.12, 0.008)
      )
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [cells])

  useEffect(() => () => frameGeometry.dispose(), [frameGeometry])

  useFrame(({ clock }) => {
    if (scannerRef.current) {
      const scanY = 0.12 + Math.sin(clock.elapsedTime * 1.8) * 0.42
      scannerRef.current.position.y = scanY
    }
  })

  return (
    <>
      {/* Nền khung QR viền satin công nghệ */}
      <mesh geometry={frameGeometry} position={[0, 0.12, 0.11]}>
        <meshStandardMaterial
          color="#081E33"
          metalness={0.4}
          roughness={0.35}
          emissive="#00294D"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Ma trận QR Modules phát sáng nhẹ */}
      <instancedMesh
        ref={instances}
        args={[undefined, undefined, cells.length]}
        position={[0, 0, 0.126]}
      >
        <boxGeometry args={[0.041, 0.041, 0.016]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          emissive="#38BDF8"
          emissiveIntensity={0.25}
          metalness={0.2}
          roughness={0.25}
          clearcoat={0.6}
        />
      </instancedMesh>

      {/* Tia laser quét dữ liệu thời gian thực (Scanner beam) */}
      <mesh ref={scannerRef} position={[0, 0.12, 0.138]}>
        <boxGeometry args={[0.88, 0.008, 0.006]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.75} />
      </mesh>
    </>
  )
}

/* =========================================================================
   2. DIGITAL PRODUCT PASSPORT (DPP) - CORE BODY & LAYERED SHELL
   ========================================================================= */
function ProductCore({ animate, stage }: { animate: boolean; stage: ActiveTraceStage }) {
  const core = useRef<Group>(null)
  const innerEnergyCore = useRef<Mesh>(null)

  const coverGeometry = useMemo(() => new RoundedBoxGeometry(1.42, 1.94, 0.15, 5, 0.07), [])
  const pagesGeometry = useMemo(() => new RoundedBoxGeometry(1.36, 1.86, 0.19, 4, 0.05), [])
  const backGeometry = useMemo(() => new RoundedBoxGeometry(1.42, 1.94, 0.1, 5, 0.06), [])
  const rimGeometry = useMemo(() => new RoundedBoxGeometry(1.2, 1.7, 0.018, 4, 0.045), [])
  const insetGeometry = useMemo(() => new RoundedBoxGeometry(1.15, 1.64, 0.014, 4, 0.04), [])

  useEffect(() => () => {
    coverGeometry.dispose()
    pagesGeometry.dispose()
    backGeometry.dispose()
    rimGeometry.dispose()
    insetGeometry.dispose()
  }, [backGeometry, coverGeometry, insetGeometry, pagesGeometry, rimGeometry])

  useFrame(({ clock }, delta) => {
    if (!core.current) return
    const time = clock.elapsedTime
    // Cố định thế đứng thẳng thanh thoát hơn, xoay nhẹ cân đối
    const targetRotation = -0.08 + (animate ? Math.sin(time * 0.35) * 0.05 : 0)
    core.current.rotation.y = animate
      ? MathUtils.damp(core.current.rotation.y, targetRotation, 2.5, delta)
      : targetRotation
    core.current.position.y = animate ? Math.sin(time * 0.6) * 0.03 : 0

    // Xung năng lượng lõi mật mã (Cryptographic Heartbeat)
    if (innerEnergyCore.current) {
      const stageSpeed = stage !== null ? stage * 0.2 : 0
      innerEnergyCore.current.rotation.x += delta * (0.6 + stageSpeed)
      innerEnergyCore.current.rotation.y += delta * (0.9 + stageSpeed * 1.5)
    }
  })

  return (
    <group ref={core} rotation={[0.06, -0.12, -0.04]} scale={0.92}>
      {/* Vỏ sau DPP với chất liệu Dark Navy cao cấp */}
      <mesh geometry={backGeometry} position={[0, 0, -0.26]}>
        <meshPhysicalMaterial
          color="#071829"
          metalness={0.65}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Lõi đa tầng dữ liệu (Data layers block) */}
      <mesh geometry={pagesGeometry} position={[0, 0, -0.15]}>
        <meshPhysicalMaterial
          color="#E2E8F0"
          metalness={0.15}
          roughness={0.45}
          clearcoat={0.3}
        />
      </mesh>

      {/* Vỏ mặt trước DPP: Tone Deep Pro Blue (#005AAB) kim loại sang trọng */}
      <mesh geometry={coverGeometry} position={[0, 0, 0.006]}>
        <meshPhysicalMaterial
          color="#005AAB"
          metalness={0.7}
          roughness={0.22}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Viền bezel vát cạnh phản chiếu ánh sáng */}
      <mesh geometry={rimGeometry} position={[0, 0.01, 0.084]}>
        <meshStandardMaterial
          color="#ADD8FF"
          metalness={0.85}
          roughness={0.18}
          emissive="#005AAB"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Màn hình trung tâm nhận diện */}
      <mesh geometry={insetGeometry} position={[0, 0.01, 0.099]}>
        <meshPhysicalMaterial
          color="#08192A"
          metalness={0.4}
          roughness={0.3}
          clearcoat={0.5}
        />
      </mesh>

      {/* Gáy passport công nghệ với chốt bảo mật kim loại */}
      <mesh position={[-0.625, 0, 0.084]}>
        <boxGeometry args={[0.095, 1.76, 0.02]} />
        <meshStandardMaterial color="#0C263D" metalness={0.8} roughness={0.25} />
      </mesh>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh key={index} position={[-0.625, 0.68 - index * 0.195, 0.098]}>
          <boxGeometry args={[0.028, 0.009, 0.008]} />
          <meshStandardMaterial
            color="#ADD8FF"
            metalness={0.9}
            roughness={0.15}
            emissive="#38BDF8"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Holographic Verification Emblem (Seal bảo chứng chính hãng) */}
      <mesh position={[0, 0.68, 0.114]}>
        <torusGeometry args={[0.065, 0.008, 6, 36]} />
        <meshStandardMaterial
          color="#38BDF8"
          metalness={0.85}
          roughness={0.15}
          emissive="#005AAB"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Lõi tinh thể bảo mật nội tại lơ lửng bên trong Seal */}
      <mesh ref={innerEnergyCore} position={[0, 0.68, 0.114]}>
        <octahedronGeometry args={[0.038, 0]} />
        <meshStandardMaterial
          color="#E0F2FE"
          emissive="#38BDF8"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* Ma trận QR Digital Link */}
      <PassportModules />

      {/* Metadata Bars (Thông số chuỗi cung ứng: Batch ID, Timestamp, Geo-tag) */}
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[-0.05, -0.52 - index * 0.088, 0.114]}>
          <boxGeometry args={[0.62 - index * 0.14, 0.02, 0.009]} />
          <meshStandardMaterial
            color={index === 0 ? "#38BDF8" : "#8EA9C1"}
            metalness={0.6}
            roughness={0.3}
            emissive={index === 0 ? "#005AAB" : "#000000"}
            emissiveIntensity={index === 0 ? 0.4 : 0}
          />
        </mesh>
      ))}

      {/* Dải đèn LED chỉ báo trạng thái xác thực chuỗi (Chain Status Indicators) */}
      {[0, 1, 2, 3, 4].map((index) => {
        const isLit = stage !== null && index <= stage
        return (
          <mesh key={index} position={[0.1, 0.58 - index * 0.038, -0.312]}>
            <boxGeometry args={[0.38 - index * 0.035, 0.008, 0.005]} />
            <meshStandardMaterial
              color={isLit ? "#38BDF8" : "#234562"}
              emissive={isLit ? "#005AAB" : "#000000"}
              emissiveIntensity={isLit ? 0.8 : 0}
              roughness={0.4}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* =========================================================================
   3. TRACEABILITY DATA HUBS (4 NODES: ORIGIN, PROCESSING, LOGISTICS, RETAIL)
   ========================================================================= */
function DataNode({
  index,
  active,
  animate,
  onSelect,
  canSelect,
  onHoverNode,
}: {
  index: TraceStageIndex
  active: boolean
  animate: boolean
  onSelect: TraceCanvasProps["onSelect"]
  canSelect: () => boolean
  onHoverNode: (hovered: boolean) => void
}) {
  const group = useRef<Group>(null)
  const ringRef = useRef<Mesh>(null)
  const ring2Ref = useRef<Mesh>(null)
  const rippleRef = useRef<Mesh>(null)
  const rippleAge = useRef(1)
  const prevActive = useRef(active)
  const age = useRef(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (active && !prevActive.current) {
      rippleAge.current = 0
    }
    prevActive.current = active
  }, [active])

  useFrame((_, delta) => {
    if (!group.current) return
    age.current += delta
    const reveal = animate ? MathUtils.clamp((age.current - index * 0.14) * 2, 0.01, 1) : 1
    const targetScale = (active ? 1.4 : hovered ? 1.18 : 0.94) * reveal
    const pulseScale = active && animate ? targetScale + Math.sin(age.current * 4) * 0.04 : targetScale
    const scale = animate ? MathUtils.damp(group.current.scale.x, pulseScale, 6, delta) : targetScale
    group.current.scale.setScalar(scale)

    if (ringRef.current && animate) {
      ringRef.current.rotation.z += delta * (active ? 2.4 : 0.8)
    }
    if (ring2Ref.current && animate) {
      ring2Ref.current.rotation.y += delta * (active ? -2.0 : -0.7)
    }
    if (rippleRef.current && animate) {
      if (rippleAge.current < 1) {
        rippleAge.current += delta * 1.6
        const s = 1.0 + rippleAge.current * 2.4
        rippleRef.current.scale.set(s, s, s)
        const mat = rippleRef.current.material as MeshBasicMaterial
        mat.opacity = Math.max(0, (1 - rippleAge.current) * 0.85)
      } else {
        const mat = rippleRef.current.material as MeshBasicMaterial
        mat.opacity = 0
      }
    }
  })

  function select(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (canSelect()) onSelect(index)
  }

  // Tinh chỉnh hình thái hình học đặc trưng cho từng chặng
  const renderHubShape = () => {
    switch (index) {
      case 0: // Nguồn gốc (Origin / Farm) - Khối lục giác vững chắc + lõi ngọc
        return (
          <group>
            <mesh rotation={[0.3, 0.4, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.18, 6]} />
              <meshStandardMaterial
                color={active || hovered ? "#E0F2FE" : "#005AAB"}
                metalness={0.75}
                roughness={0.18}
                emissive={active ? "#00F0FF" : "#005AAB"}
                emissiveIntensity={active ? 2.2 : 0.4}
              />
            </mesh>
            <mesh scale={active ? 1.25 : 0.8}>
              <octahedronGeometry args={[0.11, 0]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>
        )
      case 1: // Sản xuất (Manufacturing) - Khối ma trận kỹ thuật
        return (
          <group>
            <mesh rotation={[0.4, 0.2, Math.PI / 4]}>
              <boxGeometry args={[0.36, 0.36, 0.24]} />
              <meshStandardMaterial
                color={active || hovered ? "#E0F2FE" : "#0A5C9E"}
                metalness={0.7}
                roughness={0.2}
                emissive={active ? "#0284C7" : "#005AAB"}
                emissiveIntensity={active ? 2.2 : 0.4}
              />
            </mesh>
            <mesh scale={active ? 1.25 : 0.8}>
              <boxGeometry args={[0.13, 0.13, 0.13]} />
              <meshBasicMaterial color="#7DD3FC" />
            </mesh>
          </group>
        )
      case 2: // Phân phối (Logistics / Distribution) - Khối 12 mặt đa diện năng động
        return (
          <group>
            <mesh rotation={[0.2, 0.5, 0.2]}>
              <dodecahedronGeometry args={[0.25, 0]} />
              <meshStandardMaterial
                color={active || hovered ? "#E0F2FE" : "#1268AB"}
                metalness={0.8}
                roughness={0.16}
                emissive={active ? "#38BDF8" : "#005AAB"}
                emissiveIntensity={active ? 2.2 : 0.4}
              />
            </mesh>
            <mesh scale={active ? 1.25 : 0.8}>
              <octahedronGeometry args={[0.11, 0]} />
              <meshBasicMaterial color="#60A5FA" />
            </mesh>
          </group>
        )
      case 3: // Minh bạch & Tra cứu (Verification / Retail) - Khối tinh thể kim cương phát quang
      default:
        return (
          <group>
            <mesh rotation={[0.1, 0.2, 0.4]}>
              <octahedronGeometry args={[0.28, 0]} />
              <meshStandardMaterial
                color={active || hovered ? "#FFFFFF" : "#005AAB"}
                metalness={0.85}
                roughness={0.12}
                emissive={active ? "#38BDF8" : "#005AAB"}
                emissiveIntensity={active ? 2.5 : 0.4}
              />
            </mesh>
            <mesh scale={active ? 1.25 : 0.8}>
              <sphereGeometry args={[0.095, 8, 8]} />
              <meshBasicMaterial color="#BAE6FD" />
            </mesh>
          </group>
        )
    }
  }

  return (
    <group
      position={traceStages[index].position}
      ref={group}
      onClick={select}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
        onHoverNode(true)
      }}
      onPointerOut={() => {
        setHovered(false)
        onHoverNode(false)
      }}
    >
      {/* Hình thái chính của Node */}
      {renderHubShape()}

      {/* Sóng xung kích phát quang khi chặng được kích hoạt */}
      <mesh ref={rippleRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.42, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Vòng hào quang quỹ đạo 1 */}
      <mesh ref={ringRef} rotation={[0.2, 0.3, 0]}>
        <torusGeometry args={[0.39, 0.016, 6, 36]} />
        <meshStandardMaterial
          color={active ? "#38BDF8" : "#8EA9C1"}
          metalness={0.85}
          roughness={0.18}
          emissive={active ? "#00F0FF" : "#000000"}
          emissiveIntensity={active ? 1.4 : 0}
          transparent
          opacity={active ? 0.95 : 0.45}
        />
      </mesh>

      {/* Vòng hào quang quỹ đạo 2 quay góc nghịch */}
      <mesh ref={ring2Ref} rotation={[-0.4, 0.6, 0]}>
        <torusGeometry args={[0.44, 0.011, 6, 36]} />
        <meshStandardMaterial
          color={active ? "#7DD3FC" : "#64748B"}
          metalness={0.8}
          roughness={0.2}
          emissive={active ? "#0284C7" : "#000000"}
          emissiveIntensity={active ? 1.2 : 0}
          transparent
          opacity={active ? 0.9 : 0.35}
        />
      </mesh>

      {/* Hitbox tương tác pick click cực nhạy, bảo toàn yêu cầu kiểm thử */}
      <mesh>
        <sphereGeometry args={[0.55, 12, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  )
}

/* =========================================================================
   4. DATA HIGHWAYS - BEZIER CONNECTORS & TRAVELLING PHOTONS
   ========================================================================= */
function DataRoute({
  index,
  active,
  compact,
  animate,
}: {
  index: TraceStageIndex
  active: boolean
  compact: boolean
  animate: boolean
}) {
  const route = useRef<BufferGeometry>(null)
  const pulse1 = useRef<Mesh>(null)
  const pulse2 = useRef<Mesh>(null)
  const pulse3 = useRef<Mesh>(null)
  const age = useRef(0)

  const curve = useMemo(() => {
    const position = traceStages[index].position
    const edge = new Vector3(Math.sign(position[0]) * 0.96, position[1] * 0.45, -0.28)
    const control = new Vector3(position[0] * 0.62, position[1] * 0.58, -0.42)
    return new QuadraticBezierCurve3(new Vector3(...position), control, edge)
  }, [index])

  const positions = useMemo(() => {
    const points = curve.getPoints(compact ? 16 : 32)
    return new Float32Array(
      points.slice(1).flatMap((p, i) => [...points[i].toArray(), ...p.toArray()])
    )
  }, [curve, compact])

  const pt1 = useMemo(() => new Vector3(), [])
  const pt2 = useMemo(() => new Vector3(), [])
  const pt3 = useMemo(() => new Vector3(), [])

  useFrame(({ clock }, delta) => {
    age.current += delta
    route.current?.setDrawRange(
      0,
      animate
        ? Math.floor(MathUtils.clamp((age.current - 0.4) * 1.6, 0, 1) * (positions.length / 6)) * 2
        : positions.length / 3
    )
    if (animate) {
      const speed = active ? 0.75 : 0.25
      const base = clock.elapsedTime * speed
      if (pulse1.current) {
        curve.getPoint((base + index * 0.25) % 1, pt1)
        pulse1.current.position.copy(pt1)
      }
      if (pulse2.current && active) {
        curve.getPoint((base + index * 0.25 + 0.33) % 1, pt2)
        pulse2.current.position.copy(pt2)
      }
      if (pulse3.current && active) {
        curve.getPoint((base + index * 0.25 + 0.66) % 1, pt3)
        pulse3.current.position.copy(pt3)
      }
    }
  })

  return (
    <group visible={active}>
      <lineSegments>
        <bufferGeometry ref={route}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </lineSegments>

      {/* Dòng photon xung dữ liệu di chuyển liên tục */}
      <mesh ref={pulse1} scale={1.4}>
        <sphereGeometry args={[0.046, 8, 6]} />
        <meshBasicMaterial
          color="#E0F2FE"
          transparent
          opacity={1}
        />
      </mesh>
      <mesh ref={pulse2} scale={1.2}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} />
      </mesh>
      <mesh ref={pulse3} scale={0.95}>
        <sphereGeometry args={[0.034, 8, 6]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

/* =========================================================================
   5. GYROSCOPIC ORBITAL RINGS
   ========================================================================= */
function Orbits({ animate, compact }: { animate: boolean; compact: boolean }) {
  const rings = useRef<Group>(null)
  const ring1 = useRef<Mesh>(null)
  const ring2 = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (rings.current) {
      rings.current.rotation.y = animate ? Math.sin(clock.elapsedTime * 0.12) * 0.12 : 0
    }
    if (ring1.current && animate) {
      ring1.current.rotation.z = clock.elapsedTime * 0.04
    }
    if (ring2.current && animate) {
      ring2.current.rotation.z = -clock.elapsedTime * 0.03
    }
  })

  return (
    <group ref={rings}>
      {/* Vòng quỹ đạo chính 1 - Khúc xạ ánh sáng satin */}
      <mesh ref={ring1} rotation={[1.15, 0.24, -0.25]}>
        <torusGeometry args={[2.2, 0.01, 5, compact ? 64 : 100]} />
        <meshStandardMaterial
          color="#ADD8FF"
          metalness={0.8}
          roughness={0.2}
          emissive="#005AAB"
          emissiveIntensity={0.25}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Vòng quỹ đạo đối xứng 2 */}
      <mesh ref={ring2} rotation={[0.82, -0.46, 0.52]}>
        <torusGeometry args={[2.62, 0.008, 4, compact ? 64 : 100]} />
        <meshStandardMaterial
          color="#38BDF8"
          metalness={0.75}
          roughness={0.25}
          emissive="#0C263D"
          emissiveIntensity={0.3}
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  )
}

/* =========================================================================
   6. STUDIO ATMOSPHERE, LIGHTING & PARTICLES
   ========================================================================= */
function SceneAtmosphere({ animate, compact }: { animate: boolean; compact: boolean }) {
  const pointsRef = useRef<Points>(null)
  const positions = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: (compact ? 16 : 48) * 3 }, (_, index) => {
          const particle = Math.floor(index / 3)
          return index % 3 === 0
            ? Math.sin(particle * 12.989) * 3.6
            : index % 3 === 1
              ? Math.cos(particle * 7.437) * 2.8
              : -1 - Math.sin(particle * 2.41) * 1.4
        })
      ),
    [compact]
  )

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = animate ? clock.elapsedTime * 0.015 : 0
    }
  })

  return (
    <>
      {/* Bụi ánh sáng không gian dữ liệu (Data Dust) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={compact ? 0.026 : 0.02}
          color="#ADD8FF"
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </points>

      {/* 3-POINT STUDIO PBR LIGHTING */}
      {/* 1. Ambient ánh sáng nền sâu */}
      <ambientLight intensity={1.0} color="#EBF4FF" />

      {/* 2. Key Light: Ánh sáng chính mát sắc nét chiếu từ góc trên bên phải */}
      <directionalLight position={[4, 6, 6]} intensity={3.4} color="#F0F7FF" />

      {/* 3. Fill Light: Ánh sáng bù tương phản từ góc trái */}
      <directionalLight position={[-4, 2, -2]} intensity={2.0} color="#8EA9C1" />

      {/* 4. Rim / Accent Light: Ánh sáng xanh thương hiệu tôn khối silhouette từ phía sau */}
      <directionalLight position={[0, -3, -4]} intensity={2.6} color="#005AAB" />

      {/* 5. Center Glow: Nguồn sáng ấm tỏa ra từ lõi Digital Product Passport */}
      <pointLight position={[0, 0, 2.5]} intensity={8.5} color="#38BDF8" distance={9} decay={2} />
    </>
  )
}

/* =========================================================================
   7. SCENE RIG - CAMERA CHOREOGRAPHY, CONTROLS & LIFECYCLE
   ========================================================================= */
function SceneRig(
  props: TraceCanvasProps & {
    onDegrade: () => void
    onWarm: (ready: boolean) => void
    onHoverNode: (hovered: boolean) => void
  }
) {
  const {
    activeStage,
    compact,
    onReady,
    onContextLost,
    onContextRestored,
    onWarm,
    onError,
    onRegisterOrbitReset,
  } = props
  const animate = props.animate && props.running
  const root = useRef<Group>(null)
  const { gl, scene, camera, invalidate } = useThree()
  const initialized = useRef(false)
  const intro = useRef(0)
  const frameCount = useRef(0)
  const qualitySample = useRef({ frames: 0, duration: 0, reduced: false })
  const cameraTarget = useMemo(() => new Vector3(), [])
  const lookTarget = useMemo(() => new Vector3(), [])
  const orbitTarget = useMemo(() => new Vector2(), [])
  const drag = useRef({ pointerId: -1, x: 0, y: 0, moved: false, ignoreClicksUntil: 0 })

  const resetOrbit = useCallback(() => {
    orbitTarget.set(0, 0)
    invalidate()
  }, [invalidate, orbitTarget])

  useEffect(() => {
    onRegisterOrbitReset(resetOrbit)
    return () => onRegisterOrbitReset(null)
  }, [onRegisterOrbitReset, resetOrbit])

  useEffect(() => {
    const canvas = gl.domElement
    let current = true
    let frame = 0

    const lost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      onWarm(false)
      onContextLost()
    }
    const restored = () => warm(true)

    canvas.addEventListener("webglcontextlost", lost)
    canvas.addEventListener("webglcontextrestored", restored)

    if (gl.getContext().isContextLost()) {
      onWarm(false)
      onContextLost()
      return () => {
        canvas.removeEventListener("webglcontextlost", lost)
        canvas.removeEventListener("webglcontextrestored", restored)
      }
    }

    const warm = (restoring: boolean) => {
      cancelAnimationFrame(frame)
      const objects: Object3D[] = []
      scene.traverse((object) => {
        if ("material" in object) objects.push(object)
      })
      const prepare = () => {
        if (!current) return
        if (gl.getContext().isContextLost()) {
          onWarm(false)
          onContextLost()
          return
        }
        try {
          const object = objects.shift()
          if (object) {
            gl.compile(object, camera, scene)
            frame = requestAnimationFrame(prepare)
          } else {
            onWarm(true)
            if (restoring) onContextRestored()
            invalidate()
          }
        } catch (error) {
          if (gl.getContext().isContextLost()) {
            onWarm(false)
            onContextLost()
            return
          }
          console.error("DeepTrace shader preparation failed", error)
          onError()
        }
      }
      frame = requestAnimationFrame(prepare)
    }

    warm(false)
    return () => {
      current = false
      cancelAnimationFrame(frame)
      canvas.removeEventListener("webglcontextlost", lost)
      canvas.removeEventListener("webglcontextrestored", restored)
    }
  }, [gl, scene, camera, invalidate, onContextLost, onContextRestored, onWarm, onError])

  useEffect(() => {
    const canvas = gl.domElement
    const startDrag = (event: PointerEvent) => {
      if (drag.current.pointerId !== -1 || (event.pointerType === "mouse" && event.button !== 0))
        return
      drag.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        moved: false,
        ignoreClicksUntil: drag.current.ignoreClicksUntil,
      }
      canvas.setPointerCapture(event.pointerId)
      canvas.dataset.dragging = "true"
    }
    const moveDrag = (event: PointerEvent) => {
      if (drag.current.pointerId !== event.pointerId) return
      const deltaX = event.clientX - drag.current.x
      const deltaY = event.clientY - drag.current.y
      drag.current.x = event.clientX
      drag.current.y = event.clientY
      if (Math.abs(deltaX) + Math.abs(deltaY) > 2) drag.current.moved = true
      if (!drag.current.moved) return
      event.preventDefault()
      orbitTarget.x = MathUtils.clamp(orbitTarget.x + deltaX * 0.007, -Math.PI, Math.PI)
      orbitTarget.y = MathUtils.clamp(orbitTarget.y + deltaY * 0.0055, -0.9, 0.9)
      invalidate()
    }
    const endDrag = (event: PointerEvent) => {
      if (drag.current.pointerId !== event.pointerId) return
      drag.current.ignoreClicksUntil = drag.current.moved ? performance.now() + 150 : 0
      drag.current.pointerId = -1
      drag.current.moved = false
      delete canvas.dataset.dragging
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    }
    canvas.addEventListener("pointerdown", startDrag)
    canvas.addEventListener("pointermove", moveDrag)
    canvas.addEventListener("pointerup", endDrag)
    canvas.addEventListener("pointercancel", endDrag)
    canvas.addEventListener("lostpointercapture", endDrag)
    return () => {
      canvas.removeEventListener("pointerdown", startDrag)
      canvas.removeEventListener("pointermove", moveDrag)
      canvas.removeEventListener("pointerup", endDrag)
      canvas.removeEventListener("pointercancel", endDrag)
      canvas.removeEventListener("lostpointercapture", endDrag)
      if (drag.current.pointerId !== -1 && canvas.hasPointerCapture(drag.current.pointerId)) {
        canvas.releasePointerCapture(drag.current.pointerId)
      }
      canvas.style.cursor = ""
      delete canvas.dataset.dragging
    }
  }, [gl, invalidate, orbitTarget])

  useEffect(() => {
    gl.domElement.setAttribute("data-animated", String(animate))
    invalidate()
  }, [activeStage, animate, gl, invalidate])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.06)
    intro.current += delta
    frameCount.current++
    if (!initialized.current) {
      initialized.current = true
      onReady()
    }
    // Cố định camera quan sát toàn cảnh trung tâm vững chãi, không bị nhảy góc giật cục khi cuộn chặng
    cameraTarget.set(
      animate ? state.pointer.x * 0.08 : 0,
      0.46 + (animate ? state.pointer.y * 0.04 : 0),
      compact ? 9.5 : 8.35
    )
    lookTarget.set(0, 0, 0)
    if (animate) camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 2.8))
    else camera.position.copy(cameraTarget)
    camera.lookAt(lookTarget)
    if (root.current) {
      // Giữ góc nhìn chuẩn công nghệ cân bằng, phản hồi micro-parallax cực êm
      const desiredX = orbitTarget.y * 0.3 + (animate ? state.pointer.y * 0.015 : 0)
      const desiredY = orbitTarget.x * 0.3 + (animate ? state.pointer.x * 0.025 : 0)
      root.current.rotation.x = animate
        ? MathUtils.damp(root.current.rotation.x, desiredX, 3, delta)
        : desiredX
      root.current.rotation.y = animate
        ? MathUtils.damp(root.current.rotation.y, desiredY, 3, delta)
        : desiredY
      // Tỷ lệ khối tổng thể cân đối vừa vặn, không đè lấn lên các chặng node
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0
      const scrollScaleFactor = animate ? MathUtils.clamp(1.08 - (scrollY / 450) * 0.08, 1.0, 1.08) : 1.0
      const baseScale = animate ? MathUtils.lerp(0.86, 1, MathUtils.clamp(intro.current / 1.2, 0, 1)) : 1
      root.current.scale.setScalar(baseScale * scrollScaleFactor)
      // Dịch chuyển nhẹ nhàng tạo thế cân đối
      root.current.position.set(-0.15, -0.26, 0)
    }
    if (frameCount.current % 30 === 0 || !animate) {
      gl.domElement.setAttribute("data-rendered-frames", String(frameCount.current))
      gl.domElement.setAttribute("data-draw-calls", String(gl.info.render.calls))
      gl.domElement.setAttribute("data-triangles", String(gl.info.render.triangles))
      gl.domElement.setAttribute(
        "data-camera-position",
        camera.position
          .toArray()
          .map((value) => value.toFixed(3))
          .join(",")
      )
    }
    if (animate && intro.current > 2 && rawDelta < 0.15 && !qualitySample.current.reduced) {
      qualitySample.current.frames++
      qualitySample.current.duration += rawDelta
      if (qualitySample.current.frames >= 60) {
        if (qualitySample.current.duration / qualitySample.current.frames > 1 / 30) {
          props.onDegrade()
          qualitySample.current.reduced = true
        }
        qualitySample.current.frames = 0
        qualitySample.current.duration = 0
      }
    }
  })

  return (
    <>
      <SceneAtmosphere animate={animate} compact={compact} />
      <group ref={root}>
        <ProductCore animate={animate} stage={activeStage} />
        <Orbits animate={animate} compact={compact} />
        {traceStages.map((stage, index) => (
          <group key={stage.id}>
            <DataNode
              index={index as TraceStageIndex}
              active={index === activeStage}
              animate={animate}
              onSelect={props.onSelect}
              canSelect={() => performance.now() >= drag.current.ignoreClicksUntil}
              onHoverNode={props.onHoverNode}
            />
            <DataRoute
              index={index as TraceStageIndex}
              active={index === activeStage}
              compact={compact}
              animate={animate}
            />
          </group>
        ))}
      </group>
    </>
  )
}

/* =========================================================================
   8. MAIN EXPORT - TRACEABILITY SCENE CANVAS WRAPPER
   ========================================================================= */
export default function TraceabilityScene(props: TraceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lowQuality, setLowQuality] = useState(false)
  const [warm, setWarm] = useState(false)
  const degradeQuality = useCallback(() => setLowQuality(true), [])
  const handleHoverNode = useCallback((hovered: boolean) => {
    if (!containerRef.current) return
    if (hovered) {
      containerRef.current.dataset.hovering = "true"
    } else {
      delete containerRef.current.dataset.hovering
    }
  }, [])

  const { onContextLost, onContextRestored } = props
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    let detach: (() => void) | undefined
    const attach = (c: HTMLCanvasElement) => {
      const lost = (e: Event) => {
        e.preventDefault()
        onContextLost()
      }
      const restored = () => onContextRestored()
      c.addEventListener("webglcontextlost", lost)
      c.addEventListener("webglcontextrestored", restored)
      return () => {
        c.removeEventListener("webglcontextlost", lost)
        c.removeEventListener("webglcontextrestored", restored)
      }
    }
    const canvas = container.querySelector("canvas")
    if (canvas) detach = attach(canvas)
    const observer = new MutationObserver(() => {
      const c = container.querySelector("canvas")
      if (c && !detach) detach = attach(c)
    })
    observer.observe(container, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      detach?.()
    }
  }, [onContextLost, onContextRestored])

  return (
    <div
      ref={containerRef}
      className="trace-canvas-container"
      style={{ width: "100%", height: "100%" }}
    >
      <Canvas
        aria-hidden="true"
        tabIndex={-1}
        frameloop={!warm ? "never" : props.running && props.animate ? "always" : "demand"}
        dpr={props.compact || lowQuality ? 1 : [1, 1.5]}
        camera={{ position: [0.35, 0.8, 10], fov: 36, near: 0.1, far: 40 }}
        style={{ touchAction: "pan-y" }}
        gl={{
          alpha: true,
          antialias: !props.compact,
          powerPreference: props.compact ? "low-power" : "high-performance",
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <SceneRig
          {...props}
          onHoverNode={handleHoverNode}
          onDegrade={degradeQuality}
          onWarm={setWarm}
        />
      </Canvas>
    </div>
  )
}
