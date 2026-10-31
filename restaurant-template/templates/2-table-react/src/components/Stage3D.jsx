import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Un plateau 3D, cinq plats modélisés en code (aucun fichier externe), un décor par plat.
// `active` = index du plat à montrer. Le plat sort en rétrécissant, le suivant arrive en grandissant.
// À PERSONNALISER : remplacer un builder par un modèle .glb photographié/scanné du vrai plat.

// Grain procédural (bruit de valeur sur 5 octaves) : sert de relief fin, sans fichier image.
let GRAIN
function grain() {
  if (GRAIN) return GRAIN
  const n = 256, c = document.createElement('canvas')
  c.width = c.height = n
  const ctx = c.getContext('2d'), img = ctx.createImageData(n, n)
  const lat = Array.from({ length: 5 }, (_, o) => { const m = 8 << o; return { m, v: Array.from({ length: m * m }, () => Math.random()) } })
  const at = (L, x, y) => {
    const fx = (x / n) * L.m, fy = (y / n) * L.m, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0
    const g = (i, j) => L.v[(((j % L.m) + L.m) % L.m) * L.m + (((i % L.m) + L.m) % L.m)]
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty)
    return (g(x0, y0) * (1 - sx) + g(x0 + 1, y0) * sx) * (1 - sy) + (g(x0, y0 + 1) * (1 - sx) + g(x0 + 1, y0 + 1) * sx) * sy
  }
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let v = 0, a = 0.5
    for (const L of lat) { v += at(L, x, y) * a; a *= 0.55 }
    const k = Math.max(0, Math.min(255, (v / 0.95) * 255)), i = (y * n + x) * 4
    img.data[i] = img.data[i + 1] = img.data[i + 2] = k
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  GRAIN = new THREE.CanvasTexture(c)
  GRAIN.wrapS = GRAIN.wrapT = THREE.RepeatWrapping
  GRAIN.repeat.set(3, 3)
  return GRAIN
}

// Matériau physique. Mat (rugosité haute) = grain en relief ; brillant (rugosité basse) = vernis, comme une sauce.
const mat = (color, rough = 0.7, metal = 0, extra = {}) => {
  const o = { color, roughness: rough, metalness: metal, ...extra }
  if (!o.bumpMap && rough >= 0.35) { o.bumpMap = grain(); o.bumpScale = rough >= 0.85 ? 2.4 : 1.1 }
  if (rough <= 0.3 && o.clearcoat === undefined) { o.clearcoat = 1; o.clearcoatRoughness = 0.06 }
  return new THREE.MeshPhysicalMaterial(o)
}

// Déformation sans couture : dépend seulement de la position, donc pas de fissure sur les jonctions.
function bump(geo, amount, freq = 3) {
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const n = Math.sin(x * freq + 1.3) * Math.sin(y * freq * 1.3) * Math.sin(z * freq * 0.9 + 0.4)
    const l = Math.hypot(x, y, z) || 1
    const k = 1 + (n * amount) / l
    p.setXYZ(i, x * k, y * k, z * k)
  }
  geo.computeVertexNormals()
  return geo
}

function mesh(geo, material, [x, y, z] = [0, 0, 0], [sx, sy, sz] = [1, 1, 1], rot = [0, 0, 0]) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(x, y, z)
  m.scale.set(sx, sy, sz)
  m.rotation.set(...rot)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function ball(r, material, pos, scale, detail = 48) {
  return mesh(new THREE.SphereGeometry(r, detail, detail * 0.6), material, pos, scale)
}

function plate(color = '#ece7da') {
  const profile = [[0, 0.03], [1.35, 0.03], [1.8, 0.14], [2.05, 0.26], [2.05, 0.3], [1.95, 0.28], [1.4, 0.12], [0, 0.12]]
    .map(([r, h]) => new THREE.Vector2(r, h))
  const m = mesh(new THREE.LatheGeometry(profile, 64), mat(color, 0.25))
  m.material.side = THREE.DoubleSide
  return m
}

// Disque posé sur l'assiette : sauce, crème, sirop.
function pool(r, color, y, rough = 0.15, pos = [0, 0], sc = [1, 1]) {
  const m = mesh(new THREE.CylinderGeometry(r, r, 0.02, 48), mat(color, rough), [pos[0], y, pos[1]], [sc[0], 1, sc[1]])
  m.castShadow = false
  return m
}

function sprig(g, x, z, ang, color = '#4f7a35') {
  const stem = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.7, 6), mat('#5d6b3a', 0.9), [x, 0.2, z], [1, 1, 1], [Math.PI / 2.4, ang, 0])
  g.add(stem)
  for (let i = 0; i < 6; i++) {
    const leaf = ball(0.05, mat(color, 0.8), [x + Math.cos(ang) * (i * 0.07 - 0.18), 0.24 + i * 0.012, z + Math.sin(ang) * (i * 0.07 - 0.18)], [1, 0.4, 1.6], 8)
    g.add(leaf)
  }
}

// 1 · Huître, pomme verte, raifort — sur glace pilée
function oyster() {
  const g = new THREE.Group()
  g.add(plate('#d9dde0'))
  const ice = mat('#eaf4f8', 0.12, 0, { transmission: 0.85, thickness: 0.5, ior: 1.31, clearcoat: 1 })
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2
    const d = Math.sqrt(Math.random()) * 1.5
    const s = 0.08 + Math.random() * 0.14
    const c = mesh(new THREE.IcosahedronGeometry(s, 0), ice, [Math.cos(a) * d, 0.16 + Math.random() * 0.12, Math.sin(a) * d], [1, 1, 1], [Math.random() * 3, Math.random() * 3, Math.random() * 3])
    g.add(c)
  }
  const shell = ball(0.85, mat('#8d887a', 1), [0, 0.52, 0], [1, 0.24, 0.72])
  bump(shell.geometry, 0.12, 5)
  shell.rotation.y = 0.4
  g.add(shell)
  const meat = ball(0.6, mat('#b9b5a3', 0.1, 0, { sheen: 1, sheenColor: new THREE.Color('#e9e6d8'), clearcoat: 1 }), [0.02, 0.66, 0], [1, 0.22, 0.62])
  meat.rotation.y = 0.4
  g.add(meat)
  const lid = ball(0.8, mat('#767164', 1), [-0.55, 0.42, 0.95], [1, 0.2, 0.7], 20)
  bump(lid.geometry, 0.12, 5)
  lid.rotation.set(0.1, -0.6, 0.15)
  g.add(lid)
  for (let i = 0; i < 6; i++) {
    g.add(mesh(new THREE.BoxGeometry(0.34, 0.03, 0.05), mat('#a9c64c', 0.5), [0.9 + (i % 3) * 0.08, 0.36 + i * 0.03, -0.55 + i * 0.1], [1, 1, 1], [0, i * 0.5, 0.1]))
  }
  g.add(ball(0.07, mat('#f4f1e6', 0.6), [0.35, 0.74, 0.1], [1.4, 0.6, 1], 10))
  return g
}

// 2 · Betterave cuite en croûte de sel — sur planche de bois
function beet() {
  const g = new THREE.Group()
  g.add(plate('#b9b1a1'))
  const crust = ball(0.95, mat('#efe9dc', 1), [-0.35, 0.5, -0.1], [1, 0.8, 1], 36)
  bump(crust.geometry, 0.1, 4)
  g.add(crust)
  const cream = pool(1.0, '#f1ead4', 0.13, 0.3, [0.7, 0.55], [1.1, 0.8])
  g.add(cream)
  for (let i = 0; i < 4; i++) {
    const s = mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.07, 40), mat('#6e0f2b', 0.35), [0.55 + i * 0.12, 0.2 + i * 0.08, 0.5 - i * 0.05])
    g.add(s)
    g.add(mesh(new THREE.TorusGeometry(0.22, 0.012, 6, 32), mat('#d8a5b3', 0.4), [0.55 + i * 0.12, 0.245 + i * 0.08, 0.5 - i * 0.05], [1, 1, 1], [Math.PI / 2, 0, 0]))
  }
  for (let i = 0; i < 9; i++) {
    const a = i * 0.9
    g.add(ball(0.07, mat('#8b5a2b', 0.5), [0.9 + Math.cos(a) * 0.7, 0.18, 0.7 + Math.sin(a) * 0.55], [1, 0.9, 1], 10))
  }
  sprig(g, 1.2, -0.7, 0.6)
  return g
}

// 3 · Lieu jaune, chou-fleur, beurre noisette — sur nappe blanche
function fish() {
  const g = new THREE.Group()
  g.add(plate('#f1eee6'))
  g.add(pool(1.25, '#b5731f', 0.13, 0.1, [-0.15, 0.05]))
  const body = ball(0.9, mat('#f2e6c7', 0.42, 0, { sheen: 0.6, sheenColor: new THREE.Color('#fff3d6') }), [-0.2, 0.42, 0.05], [1.25, 0.34, 0.62], 32)
  body.rotation.y = -0.25
  g.add(body)
  const sear = ball(0.9, mat('#c58f45', 0.4, 0, { clearcoat: 0.5, clearcoatRoughness: 0.3 }), [-0.2, 0.52, 0.05], [1.2, 0.2, 0.58], 32)
  sear.rotation.y = -0.25
  g.add(sear)
  const cf = mat('#f4efdf', 0.9)
  const spots = [[0.95, 0.45, 0.2], [1.25, 0.3, 0.55], [1.15, 0.28, -0.1], [0.75, 0.3, 0.7], [1.45, 0.28, 0.2]]
  spots.forEach(([x, y, z], i) => {
    for (let k = 0; k < 7; k++) {
      const a = k * 2.4 + i, d = k === 0 ? 0 : 0.12 + (k % 2) * 0.03
      const b = ball(0.1 - k * 0.004, cf, [x + Math.cos(a) * d, y + (k === 0 ? 0.06 : 0.01), z + Math.sin(a) * d], [1, 0.9, 1], 20)
      bump(b.geometry, 0.12, 16)
      g.add(b)
    }
  })
  for (let i = 0; i < 10; i++) g.add(ball(0.045, mat('#6f8a3a', 0.6), [-0.9 + (i % 5) * 0.28, 0.14, 0.9 - Math.floor(i / 5) * 0.2 - (i % 3) * 0.05], [1, 1, 1], 8))
  g.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 28), mat('#3b2a17', 0.95), [-1.2, 0.2, -0.65]))
  return g
}

// 4 · Pigeon, céleri, jus — sur bois sombre
function pigeon() {
  const g = new THREE.Group()
  g.add(plate('#2d2b29'))
  g.add(pool(1.4, '#3a1c0c', 0.13, 0.08, [0, 0.05]))
  const skin = mat('#7a3f1f', 0.4, 0, { clearcoat: 0.4, clearcoatRoughness: 0.35 })
  const a = ball(0.7, skin, [-0.4, 0.45, 0.05], [1.1, 0.5, 0.75], 28)
  a.rotation.y = 0.35
  g.add(a)
  const b = ball(0.62, skin, [0.35, 0.42, 0.25], [1.05, 0.46, 0.7], 28)
  b.rotation.y = -0.2
  g.add(b)
  for (let i = 0; i < 3; i++) g.add(mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 32), mat('#b85a5f', 0.4), [0.1 + i * 0.1, 0.18 + i * 0.1, -0.7], [1.1, 1, 0.9], [0, 0, 0.12]))
  const q = ball(0.45, mat('#dfe5bd', 0.55), [1.0, 0.35, -0.45], [1.3, 0.75, 0.8], 24)
  q.rotation.y = 0.5
  g.add(q)
  for (let i = 0; i < 5; i++) g.add(ball(0.05, mat('#2b2f4e', 0.4), [-1.1 + i * 0.12, 0.17, 0.95 - i * 0.07], [1, 1, 1], 8))
  sprig(g, -1.0, -0.8, 2.4, '#657d44')
  return g
}

// 5 · Poire, sarrasin, lait ribot — sur marbre clair
function pear() {
  const g = new THREE.Group()
  g.add(plate('#ece6d9'))
  g.add(pool(1.3, '#c9822f', 0.13, 0.08, [0, 0.05]))
  const prof = [[0, 0], [0.38, 0.03], [0.58, 0.28], [0.52, 0.62], [0.36, 0.9], [0.27, 1.18], [0.2, 1.38], [0, 1.42]].map(([r, h]) => new THREE.Vector2(r, h))
  const geo = new THREE.LatheGeometry(prof, 72, 0, Math.PI * 2)
  bump(geo, 0.04, 7)
  const pos = geo.attributes.position, col = new Float32Array(pos.count * 3), c1 = new THREE.Color('#c8c25a'), c2 = new THREE.Color('#e0b94a'), blush = new THREE.Color('#c4683a'), t = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), x = pos.getX(i)
    t.copy(c1).lerp(c2, Math.min(1, y / 1.3)).lerp(blush, Math.max(0, x * 0.9 + Math.sin(y * 4) * 0.12) * 0.55)
    col.set([t.r, t.g, t.b], i * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const body = mesh(geo, mat('#ffffff', 0.38, 0, { vertexColors: true, clearcoat: 0.35, clearcoatRoughness: 0.4 }), [-0.45, 0.14, -0.05], [0.85, 0.85, 0.85], [0, 0, 0.22])
  g.add(body)
  g.add(mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.28, 8), mat('#4d3a24', 0.9), [-0.1, 1.3, -0.05], [1, 1, 1], [0, 0, -0.35]))
  for (let i = 0; i < 6; i++) {
    g.add(mesh(new THREE.BoxGeometry(0.5, 0.025, 0.18), mat('#4a3426', 0.85), [0.75 + (i % 3) * 0.2, 0.2 + i * 0.05, 0.5 - i * 0.2], [1, 1, 1], [0.1 * i, i * 0.9, 0.2]))
  }
  g.add(ball(0.38, mat('#f5eddb', 0.35), [0.85, 0.42, -0.5], [1.15, 0.85, 0.85], 24))
  sprig(g, 1.3, 0.6, 3.6, '#7c8f46')
  return g
}

const DISHES = [oyster, beet, fish, pigeon, pear]

// Décors : surface + fond + lumière chaude, un par plat. Teintes dans la gamme de Sillage.
const SETS = [
  { table: '#2a3236', wall: '#161c1e', rim: '#8fb4c0' }, // ardoise froide, mer
  { table: '#3a2a1e', wall: '#1d1510', rim: '#d4a26b' }, // bois, croûte de sel
  { table: '#cfc8b8', wall: '#241f19', rim: '#e8c57a' }, // nappe de lin
  { table: '#1e1713', wall: '#0f0b09', rim: '#d4472b' }, // bois noir, vermillon
  { table: '#9d9a93', wall: '#1b1a18', rim: '#e9e3d6' }, // marbre
]

export default function Stage3D({ active, label }) {
  const host = useRef(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const el = host.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    } catch {
      el.dataset.fail = 'true'
      return
    }
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(SETS[0].wall)
    scene.fog = new THREE.Fog(SETS[0].wall, 9, 17)
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 4.6, 6.6)
    camera.lookAt(0, 0.35, 0)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex
    scene.environmentIntensity = 0.5
    scene.add(new THREE.HemisphereLight('#f3ead8', '#1a1612', 0.35))
    const key = new THREE.DirectionalLight('#fff1d6', 2.6)
    key.position.set(-3.5, 6, 3)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.left = -3.5
    key.shadow.camera.right = 3.5
    key.shadow.camera.top = 3.5
    key.shadow.camera.bottom = -3.5
    key.shadow.radius = 6
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.02
    scene.add(key)
    const rim = new THREE.PointLight(SETS[0].rim, 18, 12)
    rim.position.set(3.2, 2.2, -3)
    scene.add(rim)

    const table = mesh(new THREE.CylinderGeometry(7, 7, 0.2, 64), mat(SETS[0].table, 0.8), [0, -0.1, 0])
    table.castShadow = false
    scene.add(table)

    const groups = DISHES.map(build => {
      const g = build()
      g.scale.setScalar(0.0001)
      g.visible = false
      scene.add(g)
      return g
    })

    const target = { table: new THREE.Color(SETS[0].table), wall: new THREE.Color(SETS[0].wall), rim: new THREE.Color(SETS[0].rim) }
    const pointer = { x: 0, y: 0 }
    const onMove = e => {
      const r = el.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    el.addEventListener('pointermove', onMove)

    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.position.z = Math.max(6.6, 6.6 * 0.95 / (width / height))
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)

    let raf, last = performance.now(), spin = 0.4
    const frame = now => {
      raf = requestAnimationFrame(frame)
      if (!visible) { last = now; return }
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const i = activeRef.current
      const k = 1 - Math.exp(-dt * 6)
      groups.forEach((g, n) => {
        const goal = n === i ? 1 : 0.0001
        const s = g.scale.x + (goal - g.scale.x) * k
        g.scale.setScalar(s)
        g.visible = s > 0.01
        g.position.y = n === i ? 0 : -0.3
        if (g.visible) g.rotation.y = spin
      })
      const set = SETS[i]
      target.table.set(set.table); target.wall.set(set.wall); target.rim.set(set.rim)
      table.material.color.lerp(target.table, k)
      scene.background.lerp(target.wall, k)
      scene.fog.color.copy(scene.background)
      rim.color.lerp(target.rim, k)
      if (!still) spin += dt * 0.28
      const px = still ? 0 : pointer.x, py = still ? 0 : pointer.y
      camera.position.x += (px * 0.9 - camera.position.x) * k * 0.5
      camera.position.y += (4.6 - py * 0.6 - camera.position.y) * k * 0.5
      camera.lookAt(0, 0.35, 0)
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener('pointermove', onMove)
      scene.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose() } })
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div className="stage" ref={host} role="img" aria-label={label} />
}
