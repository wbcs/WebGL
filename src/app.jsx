import React from 'react';
import Stats from 'stats.js';
import dat from 'dat.gui';
import './app.css';

// import WebGL from './components/webgl';
// import Scene from './components/scene';
// import VideoTexture from './components/video-texture';
import Earth from './components/earth';

class App extends React.Component {
  constructor() {
    super();

    this.stats = new Stats();
    this.statsRef = React.createRef();
    this.controls = {
      GUI: new dat.gui.GUI(),
      rotationSpeed: 0.01,
      bouncingSpeed: 0.04
    };
    this.controls.GUI.add(this.controls, 'rotationSpeed', 0, 0.5);
    this.controls.GUI.add(this.controls, 'bouncingSpeed', 0, 0.5);
  }
  componentDidMount() {
    const {stats, statsRef} = this;
    /**
     * 1是画面渲染时间
     * 0是每秒传输帧数
     */
    stats.setMode(1);
    statsRef.current.appendChild(stats.domElement);
  }
  render() {
    const {statsRef, stats, controls} = this;
    return <div id="app">
      <div
        ref={statsRef}
        id="stats-ouput"
        style={{position: 'absolute', left: 0, top: 0}}
      />
      {/* <WebGL controls={controls} updateStats={stats.update.bind(stats)} /> */}
      {/* <Scene controls={controls} /> */}
      {/* <VideoTexture /> */}
      <Earth />
    </div>
  }
};

export default App;
