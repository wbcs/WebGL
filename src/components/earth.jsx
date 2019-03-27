import React from 'react';
import * as THREE from 'three';
import earth from  '../assets/earth.png';
import earthBlack from '../assets/earth-black.jpg';
import earthBump from '../assets/earth-bump.jpg';
import earthNormal from '../assets/earth-normal.png';
import bg from '../assets/bg.jpg';

class Earch extends React.Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.step = 0;
    this.position = {x: 0, y: 0};
    this.ref = React.createRef();
    this._init();
  }
  componentDidMount() {
    const {scene, renderer, ref} = this;
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearAlpha(1);

    const axis = new THREE.AxisHelper(4000, 4000);
    axis.name = 'axis';
    scene.add(axis);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-2000, 500, 2500);
    spotLight.castShadow = true;
    scene.add(spotLight);

    this.addSphere(earth, 'earth');

    ref.current.appendChild(renderer.domElement);
    this.renderScene();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousedown', () => {
      window.addEventListener('mousemove', this.handleMouseMove);
    });
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', this.handleMouseMove);
    });

    window.addEventListener('touchstart', () => {
      window.addEventListener('touchmove', this.handleMouseMove);
    });
    window.addEventListener('touchend', () => {
      window.removeEventListener('mousemove', this.handleMouseMove);
    });

  }
  addSphere(earth, name) {
    const {scene, camera, renderer} = this;
    const texture = new THREE.TextureLoader();
    const sphereGeometry = new THREE.SphereGeometry(100, 50, 50);
    const sphereMaterial = new THREE.MeshPhongMaterial();
    sphereMaterial.map = texture.load(earth);
    sphereMaterial.normalMap = texture.load(earthNormal);
    sphereMaterial.specularMap = texture.load(earthBlack);
    
    sphereMaterial.specular = new THREE.Color(0x3366ff);
    sphereMaterial.shininess = 5;

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.name = name;
    sphere.rotation.x = 0.4;
    scene.add(sphere);
    renderer.render(scene, camera);
  }
  handleMouseMove(e) {
    // const sphere = this.scene.children.filter(e => e.name.includes('earth'));
    const touche = e.touches && e.touches[0];
    const position = {
      x: (touche || e).pageX,
      y: (touche || e).pageY,
    };
    this.rotate(this.scene, position, this.position);
  }
  rotate(obj, pos, prevPos) {
    const {scene, camera, renderer} = this;
    const x = pos.x - prevPos.x;
    const y = pos.y - prevPos.y;
    let rad = 0.01;
    if (x > 0) {
      obj.rotation.y += rad
      // objs.forEach(obj => obj.rotation.y += rad);
    } else if (x < 0) {
      obj.rotation.y -= rad
      // objs.forEach(obj => obj.rotation.y -= rad);
    }
    if (y > 0 && obj.rotation.x <= Math.PI / 2) {
      obj.rotation.x += rad
      // objs.forEach(obj => obj.rotation.x += rad);
    } else if (y < 0 && obj.rotation.x >= -Math.PI / 2) {
      obj.rotation.x -= rad
      // objs.forEach(obj => obj.rotation.x -= rad);
    }
    prevPos.x = pos.x;
    prevPos.y = pos.y;
    renderer.render(scene, camera);
  }
  _init() {
    const {camera} = this;
    camera.position.x = -10;
    camera.position.y = 10;
    camera.position.z = 300;
    camera.lookAt(camera.position);

    this.resize = this.resize.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  renderScene = () => {
    const {scene, camera, renderer} = this;
    scene.children.forEach((earth) => {
      if (earth.name.includes('earth')) {
        earth.rotation.y += 0.001;
      }
    });
    renderer.render(scene, camera);
    requestAnimationFrame(this.renderScene)
  }
  resize() {
    const {camera, renderer} = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    const {ref} = this;
    return (
      <div id="earth" ref={ref} />
    );
  }
}

export default Earch;