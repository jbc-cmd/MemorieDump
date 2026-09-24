// AR Tracking & Video Overlay Engine using MindAR + Three.js

export class ARTracker {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = options;
    this.mindarThree = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.videoElements = [];
    this.videoTextures = [];
    this.anchors = [];
    this.activeTargetIndex = -1;
    this.isMuted = true;
    this.isRunning = false;
    this.callbacks = {
      onTargetFound: options.onTargetFound || (() => {}),
      onTargetLost: options.onTargetLost || (() => {}),
      onReady: options.onReady || (() => {}),
      onError: options.onError || (() => {})
    };
  }

  /**
   * Initialize and start the AR tracking session
   * @param {string} mindTargetSrc - File path or Blob URL of the compiled .mind target
   * @param {Array<Object>} targetItems - Array of target configurations with videoUrl, aspectRatio
   */
  async start(mindTargetSrc, targetItems) {
    if (this.isRunning) {
      await this.stop();
    }

    if (!window.MINDAR || !window.MINDAR.IMAGE || !window.MINDAR.IMAGE.MindARThree) {
      throw new Error('MindAR library not loaded. Please check your internet connection.');
    }
    if (!window.THREE) {
      throw new Error('Three.js library not loaded.');
    }

    try {
      this.mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: this.container,
        imageTargetSrc: mindTargetSrc,
        filterMinCF: 0.0001,
        filterBeta: 0.001,
        warmupTolerance: 5,
        missTolerance: 5,
        uiLoading: 'no',
        uiScanning: 'no'
      });

      const { renderer, scene, camera } = this.mindarThree;
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;

      // AR lighting
      const ambientLight = new window.THREE.AmbientLight(0xffffff, 1.2);
      this.scene.add(ambientLight);

      this.videoElements = [];
      this.videoTextures = [];
      this.anchors = [];

      // Setup video plane for each target item
      targetItems.forEach((target, index) => {
        const anchor = this.mindarThree.addAnchor(index);

        const video = document.createElement('video');
        video.src = target.videoUrl;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = this.isMuted;
        video.preload = 'auto';

        const videoTexture = new window.THREE.VideoTexture(video);
        videoTexture.minFilter = window.THREE.LinearFilter;
        videoTexture.magFilter = window.THREE.LinearFilter;
        videoTexture.format = window.THREE.RGBAFormat;

        const aspect = target.aspectRatio || (16 / 9);
        const planeWidth = 1.0;
        const planeHeight = planeWidth / aspect;

        const geometry = new window.THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new window.THREE.MeshBasicMaterial({
          map: videoTexture,
          side: window.THREE.DoubleSide,
          transparent: true
        });

        const planeMesh = new window.THREE.Mesh(geometry, material);
        planeMesh.position.set(0, 0, 0.01);

        // Glowing cyan border
        const borderGeo = new window.THREE.PlaneGeometry(planeWidth + 0.04, planeHeight + 0.04);
        const borderMat = new window.THREE.MeshBasicMaterial({
          color: 0x00f2fe,
          side: window.THREE.BackSide,
          transparent: true,
          opacity: 0.8
        });
        const borderMesh = new window.THREE.Mesh(borderGeo, borderMat);
        anchor.group.add(borderMesh);
        anchor.group.add(planeMesh);

        anchor.onTargetFound = () => {
          this.activeTargetIndex = index;
          video.play().catch(() => {});
          this.callbacks.onTargetFound(index, target);
        };

        anchor.onTargetLost = () => {
          if (this.activeTargetIndex === index) {
            this.activeTargetIndex = -1;
          }
          video.pause();
          this.callbacks.onTargetLost(index, target);
        };

        this.videoElements.push(video);
        this.videoTextures.push(videoTexture);
        this.anchors.push(anchor);
      });

      // Start MindAR camera feed & loop
      await this.mindarThree.start();
      this.isRunning = true;

      this.renderer.setAnimationLoop(() => {
        if (!this.isRunning) return;
        this.renderer.render(this.scene, this.camera);
      });

      this.callbacks.onReady();
    } catch (err) {
      console.error('AR Tracker Start Error:', err);
      this.callbacks.onError(err);
      throw err;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.videoElements.forEach((video) => {
      video.muted = this.isMuted;
    });
    return this.isMuted;
  }

  unmute() {
    this.isMuted = false;
    this.videoElements.forEach((video) => {
      video.muted = false;
    });
  }

  async stop() {
    if (!this.isRunning && !this.mindarThree) return;

    this.videoElements.forEach((v) => {
      v.pause();
      v.src = '';
      v.load();
    });

    if (this.mindarThree) {
      try {
        this.mindarThree.stop();
      } catch (e) {}
      this.mindarThree = null;
    }

    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.renderer.dispose();
      this.renderer = null;
    }

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.isRunning = false;
    this.activeTargetIndex = -1;
  }
}
