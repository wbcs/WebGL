import React from 'react';
import THREE from '../three';

class WebGL extends React.Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    this.step = 0;
    this.things = {};

    this.webgl = React.createRef();
    
    this.resize = this.resize.bind(this);
    this.renderSence = this.renderSence.bind(this);
  }
  componentDidMount() {
    const {scene, camera, renderer, webgl} = this;
    // 设置背景颜色
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const spotLight = new THREE.SpotLight(0xffffff);

    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    this.addPlane();
    this.addCube();
    this.addSphere();

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    webgl.current.appendChild(renderer.domElement);

    this.renderSence();
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  resize() {
    const {camera, renderer} = this;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  // 添加平面
  addPlane() {
    const {scene, things} = this;
    const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = - Math.PI / 2;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);
    things.plane = plane;
  }
  // 添加立方体
  addCube() {
    const {scene, things} = this;
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);
    things.cube = cube;
  }
  // 添加球
  addSphere() {
    const {scene, things} = this;
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    things.sphere = sphere;
  }
  renderSence() {
    const {
      renderer, scene, camera,
      things: { sphere, cube }
    } = this;
    const {controls} = this.props;
    this.step += controls.bouncingSpeed;
    sphere.position.x = 20 + 5 * Math.cos(this.step);
    sphere.position.y = 4 + (5 * Math.abs(Math.sin(this.step)));
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;
    renderer.render(scene, camera);
    this.props.updateStats();
    requestAnimationFrame(this.renderSence);
  }
  render() {
    const {webgl} = this;
    return (
      <div id="webgl-output" ref={webgl} />
    );
  }
};

export default WebGL;
