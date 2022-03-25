import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

const colors = {
    doorLight_color: 0xffff1f,
    houseLight_color: 0xffff1f,
    reactLight_color: 0x00aaff,
    fog: '#212331'
    //fog: '#262837'
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/*const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );*/

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// House

const house = new THREE.Group()
scene.add(house)

gltfLoader.load
(
    '/models/house_light.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.castShadow = true
            }
        })
        house.add(gltf.scene)
    }
)

gltfLoader.load
(
    '/models/haunted_house.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.castShadow = true
            }
        })

        house.add(gltf.scene)
    }
)

house.position.y = -0.3
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */

// House
/*gui.add(house.position, 'x').min(- 5).max(5).step(0.001)
gui.add(house.position, 'y').min(- 5).max(5).step(0.001)
gui.add(house.position, 'z').min(- 5).max(5).step(0.001)*/

// Floor
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
        //color: '#a9c388' 
    })
)
//floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

// Graveyard
const graves = new THREE.Group()
scene.add(graves)

for(let i = 0; i < 50; i++)
{
    const angle = Math.random() * -Math.PI * 1.75  // Random angle
    const radius = 11 + Math.random() * 6      // Random radius
    const x = Math.cos(angle) * radius   // Get the x position using cosinus
    const z = Math.sin(angle) * radius   // Get the z position using sinus

    const choice = Math.random()

    const grave = new THREE.Object3D()

    if(choice > 0.5)
    {
        gltfLoader.load
        (
            '/models/tomb_01.glb',
            (gltf) =>
            {
                    gltf.scene.traverse((child) =>
                    {
                        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                        {
                            child.castShadow = true
                        }
                    })
                grave.add(gltf.scene)
            }
        )
    }
    else
    {
        gltfLoader.load
        (
            '/models/tomb_02.glb',
            (gltf) =>
            {
                gltf.scene.traverse((child) =>
                {
                    if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                    {
                        child.castShadow = true
                        //child.receiveShadow = true
                    }
                })
                grave.add(gltf.scene)
            }
        )
    }

    

    // Position
    grave.position.set(x, 0, z)                            

    // Rotation
    grave.rotation.x = (Math.random() - 0.5) * 0.8
    grave.rotation.y = (Math.random() - 0.5) * 0.8

    // Shadow
    grave.castShadow = true

    // Add to the graves container
    graves.add(grave)
}

graves.rotation.y = - 1.145

//gui.add(graves.rotation, 'y').min(- 5).max(5).step(0.001)

/**
 * Lights
 */
// Ambient light
/*
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
gui.add(ambientLight.position, 'x').min(- 20).max(20).step(0.001)
gui.add(ambientLight.position, 'y').min(- 20).max(20).step(0.001)
gui.add(ambientLight.position, 'z').min(- 20).max(20).step(0.001)
scene.add(ambientLight)*/

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.4)
moonLight.position.set(14.8, 6, 11)

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

/*gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 20).max(20).step(0.001)
gui.add(moonLight.position, 'y').min(- 20).max(20).step(0.001)
gui.add(moonLight.position, 'z').min(- 20).max(20).step(0.001)*/
scene.add(moonLight)

// Help
/*const moonLightHelper = new THREE.DirectionalLightHelper(moonLight, 0.2)
scene.add(moonLightHelper)*/

// House light
const doorLight = new THREE.PointLight(colors.doorLight_color, 10, 7)
doorLight.position.set(0, 3, 5.82)
house.add(doorLight)

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

const houseLight = new THREE.PointLight(colors.houseLight_color, 10, 9.532)
houseLight.position.set(0, 6, -1.739)
house.add(houseLight)

const houseLight_2 = new THREE.PointLight(colors.houseLight_color, 10, 6.991)
houseLight_2.position.set(0, 6, 5.884)
house.add(houseLight_2)

// Help
/*
const doorLightHelper = new THREE.PointLightHelper(doorLight, 0.2)
scene.add(doorLightHelper)

const houseLightHelper = new THREE.PointLightHelper(houseLight, 0.2)
scene.add(houseLightHelper)

const houseLightHelper_2 = new THREE.PointLightHelper(houseLight_2, 0.2)
scene.add(houseLightHelper_2)*/

// ReactLight
const rectAreaLight = new THREE.RectAreaLight(colors.reactLight_color, 0.5, 20, 20)
rectAreaLight.position.set(4.01, 14.173, 0.198)
rectAreaLight.rotation.set(-1.445, 0.588, 3.128)
scene.add(rectAreaLight)
/*
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

gui
    .addColor(colors, 'reactLight_color')
    .onChange(() =>
    {
        rectAreaLight.color.set(colors.reactLight_color)
    })

gui.add(rectAreaLight, 'intensity').min(0).max(4).step(0.001)
gui.add(rectAreaLight.position, 'x').min(- 50).max(50).step(0.001)
gui.add(rectAreaLight.position, 'y').min(- 50).max(50).step(0.001)
gui.add(rectAreaLight.position, 'z').min(- 50).max(50).step(0.001)
gui.add(rectAreaLight.rotation, 'x').min(- 20).max(20).step(0.001)
gui.add(rectAreaLight.rotation, 'y').min(- 20).max(20).step(0.001)
gui.add(rectAreaLight.rotation, 'z').min(- 20).max(20).step(0.001)
scene.add(rectAreaLight)*/

/*gui
    .addColor(colors, 'doorLight_color')
    .onChange(() =>
    {
        doorLight.color.set(colors.doorLight_color)
    })
gui.add(doorLight.position, 'x').min(- 10).max(10).step(0.001)
gui.add(doorLight.position, 'y').min(- 10).max(10).step(0.001)
gui.add(doorLight.position, 'z').min(- 10).max(10).step(0.001)
gui.add(doorLight, 'distance').min(0).max(10).step(0.001)
gui.add(doorLight, 'decay').min(1).max(2).step(0.001)
gui.add(doorLight, 'intensity').min(0).max(100).step(0.001)

gui
    .addColor(colors, 'houseLight_color')
    .onChange(() =>
    {
        houseLight_2.color.set(colors.houseLight_2_color)
    })
gui.add(houseLight_2.position, 'x').min(- 10).max(10).step(0.001)
gui.add(houseLight_2.position, 'y').min(- 10).max(10).step(0.001)
gui.add(houseLight_2.position, 'z').min(- 10).max(10).step(0.001)
gui.add(houseLight_2, 'distance').min(0).max(20).step(0.001)
gui.add(houseLight_2, 'decay').min(1).max(2).step(0.001)
gui.add(houseLight_2, 'intensity').min(0).max(1).step(0.001)*/

/**
 * Fog
 */
const fog = new THREE.Fog(colors.fog, 1, 20)
scene.fog = fog

/*gui
    .addColor(colors, 'fog')
    .onChange(() =>
    {
        fog.color.set(colors.fog)
    })
gui.add(fog, 'near').min(- 10).max(10).step(0.001)
gui.add(fog, 'far').min(- 20).max(40).step(0.001)*/

/**
 * Ghosts
 */
const ghost1 = new THREE.Group()
const ghost1Light = new THREE.PointLight('#ff00ff', 5, 3)
ghost1.add(ghost1Light)
gltfLoader.load
(
    '/models/ghost.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.castShadow = true
            }
        })
        ghost1.add(gltf.scene)
    }
)
scene.add(ghost1)

const ghost2 = new THREE.Group()
const ghost2Light = new THREE.PointLight('00ffff', 5, 3)
ghost2.add(ghost2Light)
gltfLoader.load
(
    '/models/ghost.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.castShadow = true
            }
        })
        ghost2.add(gltf.scene)
    }
)
scene.add(ghost2)

const ghost3 = new THREE.Group()
const ghost3Light = new THREE.PointLight('#1d34ea', 5, 3)
ghost3.add(ghost3Light)
gltfLoader.load
(
    '/models/ghost.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
            {
                child.castShadow = true
                    }
                })
        ghost3.add(gltf.scene)
    }
)
scene.add(ghost3)

/*const ghost1Helper = new THREE.PointLightHelper(ghost1Light, 0.2)
scene.add(ghost1Helper)

const ghost2Helper = new THREE.PointLightHelper(ghost2Light, 0.2)
scene.add(ghost2Helper)

const ghost3Helper = new THREE.PointLightHelper(ghost3Light, 0.2)
scene.add(ghost3Helper)*/

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.position.set(9, 4, 14)
scene.add(camera)
/*gui.add(camera.position, 'x').min(- 10).max(20).step(0.001)
gui.add(camera.position, 'y').min(- 10).max(20).step(0.001)
gui.add(camera.position, 'z').min(- 10).max(20).step(0.001)*/


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

renderer.setClearColor(colors.fog)

/**
 * Shadows
 */

renderer.shadowMap.enabled = true

moonLight.castShadow = true
doorLight.castShadow = true
houseLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
house.castShadow = true;

floor.receiveShadow = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3) + 8
    ghost1.rotation.y = Math.cos(ghost1Angle)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 10
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2.5) + 4
    ghost2.rotation.y = Math.sin(ghost1Angle)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5) + 2
    ghost3.rotation.y = Math.cos(ghost1Angle) * 2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()