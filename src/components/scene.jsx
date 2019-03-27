import React from 'react';
import THREE from '../three';

class Scene extends React.Component {
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
    scene.fog = new THREE.FogExp2(0xffffff, 0.01);
    scene.overrideMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    // 设置背景颜色
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);

    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    this.addPlane();

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    webgl.current.appendChild(renderer.domElement);
    this.createFace();
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
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
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
  addCube() {
    const cubeSize = Math.ceil(Math.random() * 3);
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.name = 'cube_' + this.scene.children.length;
    cube.position.x = Math.random() * 30;
    cube.position.y = Math.random() * 30;
    cube.position.z = Math.random() * 30;
    this.scene.add(cube);
  }
  removeCube() {
    const {scene} = this;
    const last = scene.children[scene.children.lenght - 1];
    if (last instanceof THREE.Mesh) {
      scene.remove(last);
    }
  }
  createFace() {
    const vertices = [
      new THREE.Vector3(1, 3, 1),
      new THREE.Vector3(1, 3, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(1, -1, -1),

      new THREE.Vector3(-1, 3, -1),
      new THREE.Vector3(-1, 3, 1),
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1),
    ];

    const faces = [
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(2, 3, 1),
      new THREE.Face3(4, 6, 5),
      new THREE.Face3(6, 7, 5),
      new THREE.Face3(4, 5, 1),
      new THREE.Face3(5, 0, 1),
      new THREE.Face3(7, 6, 2),
      new THREE.Face3(6, 3, 2),
      new THREE.Face3(5, 7, 0),
      new THREE.Face3(7, 2, 0),
      new THREE.Face3(1, 3, 4),
      new THREE.Face3(3, 6, 4),
    ];
    const geometry = new THREE.Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;
    geometry.computeFaceNormals();
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 'red'
    });
    const newFace = new THREE.Mesh(geometry, material);
    newFace.position.y = 5;
    this.scene.add(newFace);
  }
  renderSence() {
    const {
      renderer, scene, camera, things: {plane}
    } = this;
    const {controls} = this.props;
    scene.traverse(obj => {
      if (!(obj instanceof THREE.Mesh) || obj === plane) return;
      obj.rotation.x += controls.rotationSpeed;
      obj.rotation.y += controls.rotationSpeed;
      obj.rotation.z += controls.rotationSpeed;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(this.renderSence);
  }
  render() {
    const {webgl} = this;
    return (
      <div id="scene" ref={webgl} />
    );
  }
};

export default Scene;
