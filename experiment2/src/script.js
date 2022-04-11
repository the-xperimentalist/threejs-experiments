import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

// We can use wave equation for fun experimental waves: y=A*sin(wt+ya)

/*
 * Completing basic setup including GUI controls, canvas, scene and axes helpers
 */
const gui = new dat.GUI()
const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper()
