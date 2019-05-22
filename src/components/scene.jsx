import React from 'react';
import THREE from '../three';

class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000, -1);
    this.renderer = new THREE.WebGLRenderer();

    this.step = 0;
    this.position = { x: 0, y: 0 };
    this.cameraParams = { counter0: 0, counter1: 1};

    this.webgl = React.createRef();
    
    this.resize = this.resize.bind(this);
    this.renderSence = this.renderSence.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  componentDidMount() {
    const {scene, camera, renderer, webgl} = this;
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    // const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    // scene.add(ambientLight);

    // const spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(-40, 60, -10);
    // spotLight.castShadow = true;
    // scene.add(spotLight);

    const axis = new THREE.AxisHelper(20);
    axis.name = 'axis';
    scene.add(axis);

    // this.addPlane();
    // this.addCube();
    // this.addSphere();

    camera.position.x = 10;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    webgl.current.appendChild(renderer.domElement);
    this.renderSence();

    // window.addEventListener('resize', this.resize);
    // const cb = (e) => {
    //   requestAnimationFrame(() => {
    //     this.handleMouseMove(e);
    //   });
    // };
    // window.addEventListener('mousedown', (e) => {
    //   this.position.x = e.pageX;
    //   this.position.Y = e.pageY;
    //   window.addEventListener('mousemove', cb);
    // });
    // window.addEventListener('mouseup', () => window.removeEventListener('mousemove', cb));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  resize() {
    const {camera, renderer} = this;
    // 横纵比例
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  // 添加平面
  addPlane() {
    const {scene} = this;
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = 'plane';
    plane.rotation.x = - Math.PI / 2;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);
  }
  addCube() {
    const {scene} = this;
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    const helper = new THREE.WireframeHelper(cube, 0xffffff);

    cube.castShadow = true;
    cube.name = 'cube';
    cube.position.x = 0;
    cube.position.y = 4;
    cube.position.z = 2;
    scene.add(cube);
    scene.add(helper)
  }
  addSphere() {

    const {scene} = this;
    const sphereGeometry = new THREE.SphereGeometry(1, 10, 10);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.name = 'sphere';
    sphere.castShadow = true;
    scene.add(sphere);
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
    // geometry.verticesNeedUpdate = true;  如果需要在点变化的时候重新计算面，设置为true
    geometry.faces = faces;
    geometry.computeFaceNormals();
    const material = new THREE.MeshLambertMaterial({
      wireframe: true,
      color: 'red'
    });
    const newFace = new THREE.Mesh(geometry, material);
    newFace.position.y = 5;
    this.scene.add(newFace);
  }
  renderSence() {
    const { renderer, scene, camera } = this;
    scene.getObjectByName('cube').rotation.y += 0.005;
    renderer.render(scene, camera);
    requestAnimationFrame(this.renderSence);
  }
  handleMouseMove(e) {
    // const cube = this.scene.getObjectByName('cube');
    // console.log(e.pageX, e.pageY, this.position)
      this.changeCamera(this.camera, {
        x: e.pageX,
        y: e.pageY
      }, this.position);
  }
  clone(obj) {
    const {scene} = this;
    const newGeometry = obj.geometry.clone();
    const material = [
      new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
      }),
      new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
        wireframe: true,
      })
    ];
    const mesh = THREE.SceneUtils.createMultiMaterialObject(newGeometry, material);
    scene.add(mesh);
  }
  changeCamera(obj, pos, prevPos) {
    let {cameraParams} = this;
    const {scene, camera, renderer} = this;
    const x = pos.x - prevPos.x;
    const y = pos.y - prevPos.y;
    if (x > 0) {
      cameraParams.counter0 += .3;
    } else if (x < 0) {
      cameraParams.counter0 -= .3;
    }
    if (y > 0) {
      cameraParams.counter1 -= .3;
    } else if (y < 0) {
      cameraParams.counter1 += .3;
    }
    obj.lookAt(new THREE.Vector3(cameraParams.counter0, cameraParams.counter1, 0))
    prevPos.x = pos.x;
    prevPos.y = pos.y;
    renderer.render(scene, camera);
  }
  rotate(obj, pos, prevPos) {
    const {scene, camera, renderer} = this;
    const x = pos.x - prevPos.x;
    const y = pos.y - prevPos.y;
    if (x > 0) {
      obj.rotation.y += 0.01;
    } else if (x < 0) {
      obj.rotation.y -= 0.01;
    }
    if (y > 0 && obj.rotation.x <= Math.PI / 2) {
      obj.rotation.x += 0.01;
    } else if (y < 0 && obj.rotation.x >= -Math.PI / 2) {
      obj.rotation.x -= 0.01;
    }
    prevPos.x = pos.x;
    prevPos.y = pos.y;
    renderer.render(scene, camera);
  }
  render() {
    const {webgl} = this;
    return (
      <div id="scene" ref={webgl} />
    );
  }
};

export default Scene;
