// Memorie AR Application Logic

document.addEventListener('DOMContentLoaded', () => {
  const sceneEl = document.querySelector('#ar-scene');
  const targetEntity = document.querySelector('#target-0');
  const videoCard = document.querySelector('#card-video');
  
  // UI Elements
  const statusPill = document.getElementById('status-pill');
  const statusText = document.getElementById('status-text');
  const scannerCenter = document.querySelector('.scanner-center');
  const activeTargetCard = document.getElementById('active-target-card');
  const audioPromptOverlay = document.getElementById('audio-prompt-overlay');
  const startArBtn = document.getElementById('start-ar-btn');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  const targetsModalBtn = document.getElementById('targets-modal-btn');
  const createModalBtn = document.getElementById('create-modal-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  // Modals
  const targetsModal = document.getElementById('targets-modal');
  const createModal = document.getElementById('create-modal');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');

  let isMuted = false;

  // 1. Target Tracking Events
  if (targetEntity) {
    targetEntity.addEventListener('targetFound', () => {
      console.log('Target Locked!');
      scannerCenter.classList.add('locked');
      statusPill.classList.add('locked');
      statusText.textContent = 'Photo Detected: Sample Card';
      activeTargetCard.classList.add('show');
      
      // Play overlay video
      if (videoCard) {
        videoCard.play().catch((e) => console.log('Autoplay policy caught:', e));
      }
    });

    targetEntity.addEventListener('targetLost', () => {
      console.log('Target Lost!');
      scannerCenter.classList.remove('locked');
      statusPill.classList.remove('locked');
      statusText.textContent = 'Scanning for photo target...';
      activeTargetCard.classList.remove('show');
      
      if (videoCard) {
        videoCard.pause();
      }
    });
  }

  // 2. User Gesture: Enable Audio & Video Autoplay
  startArBtn.addEventListener('click', () => {
    audioPromptOverlay.classList.add('hidden');
    
    // Unlock video element for mobile browser autoplay policy
    if (videoCard) {
      videoCard.muted = isMuted;
      videoCard.play().then(() => {
        videoCard.pause();
      }).catch(() => {});
    }

    statusText.textContent = 'Aim camera at photo';
  });

  // 3. Audio Mute / Unmute
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (videoCard) {
      videoCard.muted = isMuted;
    }
    updateMuteIcon(isMuted);
  });

  function updateMuteIcon(muted) {
    if (muted) {
      muteIcon.innerHTML = `
        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
    } else {
      muteIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    }
  }

  // 4. Modal Triggers
  targetsModalBtn.addEventListener('click', () => targetsModal.classList.add('open'));
  createModalBtn.addEventListener('click', () => createModal.classList.add('open'));

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('open');
    });
  });

  [targetsModal, createModal, lightboxModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  // Lightbox trigger for sample targets
  document.querySelectorAll('[data-test-src]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-test-src');
      lightboxImg.src = src;
      lightboxModal.classList.add('open');
    });
  });

  document.querySelectorAll('[data-lightbox-src]').forEach((wrap) => {
    wrap.addEventListener('click', () => {
      const src = wrap.getAttribute('data-lightbox-src');
      lightboxImg.src = src;
      lightboxModal.classList.add('open');
    });
  });

  // Fullscreen
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
});
