import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/*
 ** Basic scene setup
 */
const gui = new dat.GUI()
const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(32, 1, 32)
gui.add(camera.position, "x").min(-100).max(100).step(0.01)
gui.add(camera.position, "y").min(-100).max(100).step(0.01)
gui.add(camera.position, "z").min(-100).max(100).step(0.01)

scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

/*
 ** Base ball to consider
 */
const material = new THREE.MeshStandardMaterial()
gui.add(material, "roughness").min(0).max(1).step(0.001)
gui.add(material, "metalness").min(0).max(1).step(0.001)
const geometry = new THREE.SphereGeometry(0.02, 16, 16)
const sphere = new THREE.Mesh(geometry, material)

const sphereLight = new THREE.PointLight(0xffff00, 1, 100, 2)
sphereLight.position.set(10, 0, 0)

/*
 ** Animating the scene
 */
const clock = new THREE.Clock()

var waveConstant = new function() {
    this.amplitude = 5
    this.angularVelocity = 2
    this.alphaDistance = 10
}
gui.add(waveConstant, "amplitude").min(0).max(100).step(0.001)
gui.add(waveConstant, "angularVelocity").min(0).max(10).step(0.001)
gui.add(waveConstant, "alphaDistance").min(0).max(10).step(0.001)

let sphereList = []
let sphereLightList = []
for (let i=0; i<6400; i++) {
    const localSphere = new THREE.Mesh(geometry, material)
    localSphere.position.set(2*(i%80), 0, 2*(i/80))
    scene.add(localSphere)
    sphereList.push(localSphere)

    const lightSphere = new THREE.AmbientLight(0xffff00, 0.5)
    lightSphere.position.set(2*(i%80), 0, 2*(i/80))
    scene.add(lightSphere)
    sphereLightList.push(lightSphere)
}

// y = Asin(wt+ax)
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    let calculatedY = Math.abs(waveConstant.amplitude * Math.sin(waveConstant.angularVelocity * elapsedTime))
    let calculatedTheta = waveConstant.angularVelocity * elapsedTime
    // sphere.position.y = calculatedY
    // sphere.scale.set(1+calculatedY, 1+calculatedY, 1+calculatedY)
    for(let i=0; i<sphereList.length; i++) {
        let localSphereYCal = Math.abs(waveConstant.amplitude * Math.sin(calculatedTheta + waveConstant.alphaDistance * Math.sqrt(sphereList[i].position.x*sphereList[i].position.x + sphereList[i].position.z*sphereList[i].position.z)))
        sphereList[i].position.y = localSphereYCal
        sphereList[i].scale.set(1+localSphereYCal, 1+localSphereYCal, 1+localSphereYCal)
        sphereLightList[i].position.y = localSphereYCal

    }

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
