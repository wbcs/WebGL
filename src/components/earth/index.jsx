import React from 'react';
import * as THREE from 'three';

import earth from  '@/assets/earth.jpg';
import earthBlack from '@/assets/earth-black.jpg';
import earthBump from '@/assets/earth-bump.jpg';
import earthNormal from '@/assets/earth-normal.png';
import earthCloud from '@/assets/earth-cloud.png';

import './index.css';

class Earch extends React.Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.step = 0;
    this.position = {x: 0, y: 0};
    this.ref = React.createRef();
    this._init();
  }
  componentDidMount() {
    const {scene, renderer, ref} = this;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0x393939);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-1000, 100, 1000);
    directionalLight.intensity = 1;

    directionalLight.name = 'directional';
    scene.add(directionalLight); 

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-1000, 100, 1000);
    spotLight.castShadow = true;
    scene.add(spotLight);

    this.addSphere(earth, 'earth');
    this.addSphere(earthBump, 'earthBump', { opacity: 0.55 });
    this.addSphere(earthCloud, 'earthCloud', { opacity: 0.5, radius: 102 });

    ref.current.appendChild(renderer.domElement);
    this.renderScene();

    window.addEventListener('resize', this.resize);
    window.addEventListener('mousedown', (e) => {
      this.position.x = e.pageX;
      this.position.y = e.pageY;
      window.addEventListener('mousemove', this.handleMouseMove);
    });
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', this.handleMouseMove);
    });

    window.addEventListener('touchstart', (e) => {
      this.position.x = e.touches[0].pageX;
      this.position.y = e.touches[0].pageY;
      window.addEventListener('touchmove', this.handleMouseMove);
    });
    window.addEventListener('touchend', () => {
      window.removeEventListener('touchmove', this.handleMouseMove);
    });
  }
  addSphere = (earth, name, config = {}) => {
    const {scene, camera, renderer} = this;
    const texture = new THREE.TextureLoader();
    const sphereGeometry = new THREE.SphereGeometry(config.radius || 100, 50, 50);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      opacity: config.opacity || 1,
      transparent: true
    });
    sphereMaterial.map = texture.load(earth);
    sphereMaterial.normalMap = texture.load(earthNormal);
    sphereMaterial.specularMap = texture.load(earthBlack);
    
    sphereMaterial.specular = new THREE.Color(0x3366ff);
    sphereMaterial.shininess = 6;

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.name = name;
    sphere.rotation.x = 0.4;
    scene.add(sphere);
    renderer.render(scene, camera);
  }
  handleMouseMove = (e) => {
    const touche = e.touches && e.touches[0];
    const position = {
      x: (touche || e).pageX,
      y: (touche || e).pageY,
    };
    this.rotate(this.scene, position, this.position);
  }
  rotate = ({rotation}, pos, prevPos) => {
    let rad = 0.005;
    const x = pos.x - prevPos.x;
    const y = pos.y - prevPos.y;
    const {scene, camera, renderer} = this;
    rotation.y += rad * x;
    if ((y > 0 && rotation.x <= Math.PI / 2) || (y < 0 && rotation.x >= -Math.PI / 2)) {
      rotation.x += rad * y;
    }
    rotation.x += rad * y;
    prevPos.x = pos.x;
    prevPos.y = pos.y;
    renderer.render(scene, camera);
  }
  _init = () => {
    const {camera, renderer} = this;
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 450;
    camera.lookAt(camera.position);
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = true;
  }
  renderScene = () => {
    const {scene, camera, renderer} = this;
    scene.children.forEach((earth) => {
      if (!earth.name.includes('earth')) return;
      if (earth.name !== 'earthCloud') {
        earth.rotation.y += 0.001;
      } else {
        earth.rotation.y += 0.0008;
      }
    });
    renderer.render(scene, camera);
    requestAnimationFrame(this.renderScene)
  }
  resize = () => {
    const {camera, renderer} = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    const {ref} = this;
    return (<div id="earth" ref={ref} />);
  }
}

export default Earch;
