import React from 'react';
import * as THREE from 'three';
import video from '@/assets/dcd.mp4';

class VideoTexture extends React.Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    this.position = {x: 0, y: 0};

    this.videoTextureRef = React.createRef();
    this._init();
  }
  componentDidMount() {
    const {scene, renderer, videoTextureRef} = this;
    renderer.setClearColor(0xEEEEEE);
    renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const axis = new THREE.AxisHelper(40, 40);
    axis.name = 'axis';
    scene.add(axis);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-80, 80, 80);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const video = document.querySelector('video');
    this.videoTexture = new THREE.VideoTexture(video);
    const videoGeometry = new THREE.BoxBufferGeometry(10, 10, 10);
    const videoMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture
    });
    this.videoTexture.wrapS = this.videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.videoTexture.minFilter = THREE.LinearFilter;
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.translateY(5);
    videoMesh.name = 'video';
    scene.add(videoMesh);

    videoTextureRef.current.appendChild(renderer.domElement);
    this.renderScene();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousedown', () => {
      video.play();
      window.addEventListener('mousemove', this.handleMouseMove);
    });
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', this.handleMouseMove);
    });

    window.addEventListener('touchstart', () => {
      video.play();
      window.addEventListener('touchmove', this.handleMouseMove);
    });
    window.addEventListener('touchend', () => {
      window.removeEventListener('mousemove', this.handleMouseMove);
    });

  }
  handleMouseMove(e) {
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
    if (x > 0) {
      obj.rotation.y += 0.03;
    } else if (x < 0) {
      obj.rotation.y -= 0.03;
    }
    if (y > 0 && obj.rotation.x <= Math.PI / 2) {
      obj.rotation.x += 0.03;
    } else if (y < 0 && obj.rotation.x >= -Math.PI / 2) {
      obj.rotation.x -= 0.03;
    }
    prevPos.x = pos.x;
    prevPos.y = pos.y;
    renderer.render(scene, camera);
  }
  _init() {
    const {camera} = this;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 30;
    camera.lookAt(camera.position);

    this.resize = this.resize.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  renderScene = () => {
    const {scene, camera, renderer} = this;
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
    const {videoTextureRef} = this;
    return (
      <div id="vide-texture" ref={videoTextureRef}>
        <video hidden style={{position: 'absolute'}} src={video} controls></video>
      </div>
    );
  }
}

export default VideoTexture;