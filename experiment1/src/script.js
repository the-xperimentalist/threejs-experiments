import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/*
 ** Completing basic setup including GUI controls, canvas, scene and axes helpers
 */
const gui = new dat.GUI()
const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper()

/*
 ** Textures management
 */
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const texture1 = textureLoader.load(
    "/textures/matcaps/1.png")
const texture2 = textureLoader.load(
    "/textures/matcaps/2.png")
const texture3 = textureLoader.load(
    "/textures/matcaps/3.png")
const texture4 = textureLoader.load(
    "/textures/matcaps/4.png")
const texture5 = textureLoader.load(
    "/textures/matcaps/5.png")
const texture6 = textureLoader.load(
    "/textures/matcaps/6.png")
const texture7 = textureLoader.load(
    "/textures/matcaps/7.png")
const texture8 = textureLoader.load(
    "/textures/matcaps/8.png")
const matcapTextureList = [
    texture1,
    texture2,
    texture3,
    texture4,
    texture5,
    texture6,
    texture7,
    texture8]

/*
 ** Listing all the geometries, we'll utilize in creating the scene
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const coneGeometry = new THREE.ConeGeometry(5, 20, 32)
const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32)
const dodecahedronGeometry = new THREE.DodecahedronGeometry(10, 0) // Validate the params
const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 0) // Validate the params
const octahedronGeometry = new THREE.OctahedronGeometry(10, 0) // Validate the params
const sphereGeometry = new THREE.SphereGeometry( 15, 32, 16 );
const taurusGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const geometryList = [
    boxGeometry,
    coneGeometry,
    cylinderGeometry,
    dodecahedronGeometry,
    icosahedronGeometry,
    octahedronGeometry,
    sphereGeometry,
    taurusGeometry]

/*
 ** Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Solids !!',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            })
        textGeometry.center()
        const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: texture1
        })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        for(let i=0; i<100; i++) {
            let geometry = geometryList[Math.floor( Math.random() * geometryList.length )]
            let material = new THREE.MeshMatcapMaterial({
                matcap: matcapTextureList[Math.floor( Math.random() * matcapTextureList.length )]
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.x = (Math.random() - 0.5) * 10
            mesh.position.y = (Math.random() - 0.5) * 10
            mesh.position.z = (Math.random() - 0.5) * 10
            mesh.rotation.x = Math.random() * Math.PI
            mesh.rotation.y = Math.random() * Math.PI
            const scale = Math.random() * 0.05
            mesh.scale.set(scale, scale, scale)

            scene.add(mesh)
        }
    })

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
