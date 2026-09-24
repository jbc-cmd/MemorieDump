// Image Target Compiler for MindAR
// Compiles target photos into .mind feature point tracking buffers in the browser

export class TargetCompiler {
  constructor() {
    this.cachedMindUrls = new Map();
  }

  /**
   * Loads an image URL or Blob into an HTMLImageElement
   * @param {string} src 
   * @returns {Promise<HTMLImageElement>}
   */
  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error(`Failed to load target image: ${src}`));
      img.src = src;
    });
  }

  /**
   * Compiles one or more target images into a .mind binary file blob URL
   * @param {Array<string|HTMLImageElement>} images - Array of image sources or elements
   * @param {Function} onProgress - Progress callback (percentage 0-100)
   * @returns {Promise<{mindUrl: string, buffer: ArrayBuffer}>}
   */
  async compileTargets(images, onProgress = () => {}) {
    if (!window.MINDAR || !window.MINDAR.IMAGE || !window.MINDAR.IMAGE.Compiler) {
      throw new Error('MindAR Image Compiler library not loaded yet');
    }

    const loadedImages = [];
    for (const item of images) {
      if (item instanceof HTMLImageElement) {
        loadedImages.push(item);
      } else if (typeof item === 'string') {
        const img = await this.loadImage(item);
        loadedImages.push(img);
      }
    }

    if (loadedImages.length === 0) {
      throw new Error('No valid images to compile');
    }

    const compiler = new window.MINDAR.IMAGE.Compiler();
    
    // Compile images into feature descriptors
    await compiler.compileImageTargets(loadedImages, (progress) => {
      const pct = Math.min(100, Math.round(progress));
      onProgress(pct);
    });

    const exportedBuffer = await compiler.exportData();
    const blob = new Blob([exportedBuffer], { type: 'application/octet-stream' });
    const mindUrl = URL.createObjectURL(blob);

    return { mindUrl, buffer: exportedBuffer, blob };
  }
}
