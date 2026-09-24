// Preset Target Photos and Video mappings
// Uses local precompiled .mind file and local assets for instant loading & offline speed

export const PRECOMPILED_MIND_PATH = 'assets/targets.mind';

export const PRESET_TARGETS = [
  {
    id: 'mindar-card',
    title: 'Sample Photo Card Target',
    description: 'MindAR sample photo marker. Aim camera at this image to play the animated video overlay in 3D AR!',
    image: 'assets/targets/card.png',
    videoUrl: 'assets/videos/cyberpunk.mp4',
    aspectRatio: 16 / 9,
    category: 'Featured'
  }
];
