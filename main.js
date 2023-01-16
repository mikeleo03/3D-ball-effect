import * as THREE from "three";
import './style.css'
import gsap from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

// scene
const scene = new THREE.Scene();

// create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: "#005cb2",
  roughness: 0.5,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// sizes of viewport
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 10, 10)
light.intensity = 1.25
scene.add(light)

// camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(5)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 10

// Resizing
window.addEventListener('resize', () => {
  // update the sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

// Rerender the canvas by loop
const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

// Beautiful timeline effect :D
const tl = gsap.timeline({ defaults : { duration: 1} })
tl.fromTo(mesh.scale, {z : 0, y : 0, x : 0}, {z : 1, y : 1, x : 1})
tl.fromTo("nav", {y : "-100%"}, {y : "0%"})
tl.fromTo(".title", {opacity : 0}, {opacity : 1})

// Mouse animation color
let mousedown = false
let rgb = []
window.addEventListener("mousedown", () => (mousedown = true))
window.addEventListener("mouseup", () => (mousedown = false))

window.addEventListener("mousemove", (e) => {
  if (mousedown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]

    // Animation process
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })
  }
})