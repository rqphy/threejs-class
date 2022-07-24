import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


// Objects

// BaseObject
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true
})

const baseObject = new THREE.Mesh(geometry, material)
baseObject.position.x = -1
baseObject.position.y = 1

// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.6, 16, 8)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = 1
sphere.position.y = 1

// Torus
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 50, 4)

const torus = new THREE.Mesh(torusGeometry, material)
torus.position.x = 1
torus.position.y = -1

let mixer = null

gltfLoader.load(
    '/model/Fox/glTF/Fox.gltf',
    (gltf) =>
    {
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        
        action.play()

        gltf.scene.scale.set(0.015, 0.015, 0.015)
        gltf.scene.rotateY(-0.3)
        gltf.scene.position.set(-1, -1, 0.025)
        scene.add(gltf.scene)
    }
)


scene.add(baseObject, sphere, torus)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animation

    baseObject.rotation.y = 0.2 * elapsedTime
    baseObject.rotation.z = 0.2 * elapsedTime

    sphere.rotation.y = 0.2 * elapsedTime
    sphere.rotation.z = -0.2 * elapsedTime

    torus.rotation.z = -0.2 * elapsedTime

    // Update mixer
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()