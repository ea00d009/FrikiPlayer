/**
 * Retro IT Playlist Player - Jukebox_IT_v3.0.exe
 * Architecture: Model-View-Controller (MVC)
 */

// ==========================================
// 1. SOUND EFFECTS SYNTHESIZER (RetroSynth)
// ==========================================
class RetroSynth {
  constructor() {
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playClick() {
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  playPowerOn() {
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    
    // Quick chiptune arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.15);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.15);
    });
  }

  playError() {
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }
}

const synth = new RetroSynth();

// ==========================================
// 2. THE MODEL (PlayerModel)
// ==========================================
class PlayerModel {
  constructor() {
    // Default mock playlist
    this.playlist = [
      {
        id: 1,
        title: "Chiptune Dreams (8-Bit)",
        artist: "Retro-IT-Boy",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "06:12"
      },
      {
        id: 2,
        title: "Cyberpunk Alley (DOS Grid)",
        artist: "DOS-Grid",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "07:05"
      },
      {
        id: 3,
        title: "Hot Dog Stand Nostalgia",
        artist: "Windows-3.11",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "05:44"
      }
    ];

    this.filteredPlaylist = [...this.playlist];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.volume = 80;
    this.balance = 0; // -1 (Left) to 1 (Right)
    this.isMuted = false;
    this.isShuffle = false;
    this.isLooping = false;
    this.currentTheme = "Classic";
    this.currentFont = "dos";
    
    this.currentTime = 0;
    this.duration = 0;
    
    // Handlers bound in Controller
    this.onStateChange = () => {};
    this.onTrackChange = () => {};
    this.onPlaybackError = () => {};
  }

  getActiveTrack() {
    if (this.filteredPlaylist.length === 0) return null;
    // Bound check index
    if (this.currentTrackIndex >= this.filteredPlaylist.length) {
      this.currentTrackIndex = 0;
    }
    return this.filteredPlaylist[this.currentTrackIndex];
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(100, vol));
    this.onStateChange();
  }

  setBalance(bal) {
    this.balance = Math.max(-1, Math.min(1, bal));
    this.onStateChange();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.onStateChange();
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.onStateChange();
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    this.onStateChange();
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.onStateChange();
  }

  setFont(font) {
    this.currentFont = font;
    this.onStateChange();
  }

  filterTracks(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredPlaylist = [...this.playlist];
    } else {
      this.filteredPlaylist = this.playlist.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q)
      );
    }
    this.currentTrackIndex = 0;
    this.onTrackChange();
    this.onStateChange();
  }

  addCustomTrack(title, url) {
    if (!title || !url) return false;
    const newId = this.playlist.length > 0 ? Math.max(...this.playlist.map(t => t.id)) + 1 : 1;
    const newTrack = {
      id: newId,
      title: title.trim(),
      artist: "Pista Web",
      url: url.trim(),
      duration: "--:--"
    };
    this.playlist.push(newTrack);
    this.filteredPlaylist = [...this.playlist];
    this.onStateChange();
    return true;
  }
}

// ==========================================
// 3. THE VIEW (PlayerView)
// ==========================================
class PlayerView {
  constructor() {
    // DOM Elements
    this.container = document.getElementById("player-container");
    this.ticker = document.getElementById("track-ticker");
    this.timerDisplay = document.getElementById("timer-display");
    this.canvas = document.getElementById("visualizer-canvas");
    this.canvasCtx = this.canvas.getContext("2d");
    this.fallbackVisualizerLabel = document.getElementById("visualizer-fallback");

    // LEDs
    this.ledPlay = document.getElementById("led-play");
    this.ledPause = document.getElementById("led-pause");
    this.ledStop = document.getElementById("led-stop");

    // Indicators
    this.indRepeat = document.getElementById("indicator-repeat");
    this.indShuffle = document.getElementById("indicator-shuffle");
    this.indMute = document.getElementById("indicator-mute");

    // Sliders
    this.progressSlider = document.getElementById("progress-slider");
    this.progressPercent = document.getElementById("progress-percent");
    this.volumeSlider = document.getElementById("volume-slider");
    this.btnMuteToggle = document.getElementById("btn-mute-toggle");

    // Config Dropdowns
    this.skinSelect = document.getElementById("skin-select");
    this.fontSelect = document.getElementById("font-select");

    // Playlist
    this.playlistContainer = document.getElementById("playlist-container");
    this.playlistSearch = document.getElementById("playlist-search");
    
    // Add Track Form
    this.customTitleInput = document.getElementById("custom-track-title");
    this.customUrlInput = document.getElementById("custom-track-url");
    this.btnAddTrack = document.getElementById("btn-add-track");

    // Visualizer loop parameters
    this.animationId = null;
    this.visualizerDataArray = null;
    this.visualizerAnalyser = null;
    this.simulatedTime = 0;

    // Resizing canvas to match screen size
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  update(model) {
    // Update container theme & fonts
    this.container.setAttribute("data-theme", model.currentTheme);
    
    if (model.currentFont === "8bit") {
      this.container.classList.remove("font-dos");
      this.container.classList.add("font-8bit");
    } else {
      this.container.classList.remove("font-8bit");
      this.container.classList.add("font-dos");
    }

    // Synchronize selector dropdown inputs
    this.skinSelect.value = model.currentTheme;
    this.fontSelect.value = model.currentFont;

    // Track Display Info
    const activeTrack = model.getActiveTrack();
    if (activeTrack) {
      const statusText = model.isPlaying ? "REPRODUCIENDO" : "PAUSADO";
      const tickerText = `[${statusText}] ${activeTrack.title} - ${activeTrack.artist}`;
      if (this.ticker.innerText !== tickerText) {
        this.ticker.innerText = tickerText;
      }
    } else {
      this.ticker.innerText = "SIN CANCIONES EN LA LISTA";
    }

    // LEDs
    this.ledPlay.classList.toggle("active", model.isPlaying);
    this.ledPause.classList.toggle("active", !model.isPlaying && model.currentTime > 0 && model.duration > 0);
    this.ledStop.classList.toggle("active", !model.isPlaying && (model.currentTime === 0 || model.duration === 0));

    // Panel Indicators
    this.indRepeat.style.opacity = model.isLooping ? "1" : "0.2";
    this.indShuffle.style.opacity = model.isShuffle ? "1" : "0.2";
    this.indMute.style.opacity = model.isMuted ? "1" : "0.2";

    // Mute button icon
    this.btnMuteToggle.innerText = model.isMuted ? "🔇" : "🔊";

    // Progress percentage
    const progressVal = model.duration > 0 ? (model.currentTime / model.duration) * 100 : 0;
    this.progressSlider.value = progressVal;
    this.progressPercent.innerText = `${Math.round(progressVal)}%`;

    // Volume Slider
    this.volumeSlider.value = model.isMuted ? 0 : model.volume;

    // Render Timer Display
    const currentStr = this.formatTime(model.currentTime);
    const totalStr = model.duration > 0 ? this.formatTime(model.duration) : "00:00";
    this.timerDisplay.innerText = `${currentStr} / ${totalStr}`;

    // Render Playlist Panel
    this.renderPlaylist(model);
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  renderPlaylist(model) {
    this.playlistContainer.innerHTML = "";
    
    if (model.filteredPlaylist.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "p-2 text-center text-[var(--text-muted)]";
      emptyDiv.innerText = "No se encontraron pistas";
      this.playlistContainer.appendChild(emptyDiv);
      return;
    }

    model.filteredPlaylist.forEach((track, index) => {
      const isActive = index === model.currentTrackIndex;
      const trackDiv = document.createElement("div");
      trackDiv.className = `playlist-item flex items-center justify-between p-2 cursor-pointer transition-colors duration-100 border-b border-gray-950/20 hover:bg-[var(--accent)]/15 ${isActive ? 'active' : ''}`;
      trackDiv.setAttribute("data-index", index);

      // Track description structure
      const titleSpan = document.createElement("span");
      titleSpan.className = "truncate pr-2";
      titleSpan.innerText = `${index + 1}. ${track.title} - ${track.artist}`;

      const durSpan = document.createElement("span");
      durSpan.className = "font-mono opacity-80 shrink-0";
      durSpan.innerText = track.duration;

      trackDiv.appendChild(titleSpan);
      trackDiv.appendChild(durSpan);
      this.playlistContainer.appendChild(trackDiv);
    });
  }

  // Audio Visualizer Canvas Renderer
  setupVisualizer(analyserNode) {
    this.visualizerAnalyser = analyserNode;
    if (analyserNode) {
      analyserNode.fftSize = 64;
      const bufferLength = analyserNode.frequencyBinCount;
      this.visualizerDataArray = new Uint8Array(bufferLength);
      this.fallbackVisualizerLabel.style.display = "none";
    } else {
      this.visualizerDataArray = null;
      this.fallbackVisualizerLabel.style.display = "none"; // We will draw the simulated fallback wave
    }
  }

  startVisualizerAnimation(isPlaying) {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    const draw = () => {
      this.animationId = requestAnimationFrame(draw);
      
      const width = this.canvas.width;
      const height = this.canvas.height;
      const ctx = this.canvasCtx;

      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Extract colors from CSS variables
      const screenColor = getComputedStyle(this.container).getPropertyValue('--screen-text').trim() || '#39ff14';

      if (this.visualizerAnalyser && this.visualizerDataArray) {
        // Real frequency data visualizer
        this.visualizerAnalyser.getByteFrequencyData(this.visualizerDataArray);
        
        const barWidth = (width / this.visualizerDataArray.length) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.visualizerDataArray.length; i++) {
          barHeight = (this.visualizerDataArray[i] / 255) * height * 0.9;
          
          ctx.fillStyle = screenColor;
          // Apply a glowing pixel look
          ctx.shadowBlur = 6;
          ctx.shadowColor = screenColor;
          ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
          
          x += barWidth;
        }
      } else {
        // Simulated premium Retro oscilloscope wave (active when playing, flat when paused)
        ctx.shadowBlur = 4;
        ctx.shadowColor = screenColor;
        ctx.strokeStyle = screenColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const sliceWidth = width / 60;
        let x = 0;

        if (isPlaying) {
          this.simulatedTime += 0.15;
        }

        for (let i = 0; i <= 60; i++) {
          let y;
          if (isPlaying) {
            // Draw a compound retro sine wave representing active synthesized frequencies
            y = (height / 2) + 
                Math.sin(i * 0.25 + this.simulatedTime) * 12 + 
                Math.cos(i * 0.5 - this.simulatedTime * 0.7) * 8 + 
                (Math.sin(i * 1.2 + this.simulatedTime * 2) * 3);
          } else {
            // Flatlined but with subtle digital static fuzz
            y = (height / 2) + (Math.random() - 0.5) * 1.2;
          }

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      }
      
      // Reset shadow mapping to avoid slowing down frame iterations
      ctx.shadowBlur = 0;
    };

    draw();
  }
}

// ==========================================
// 4. THE CONTROLLER (PlayerController)
// ==========================================
class PlayerController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    
    // Native HTML Audio Element connection
    this.audio = document.getElementById("audio-engine");
    this.audioCtx = null;
    this.audioSrc = null;
    this.analyser = null;
    this.panner = null;

    this.bindEvents();
    this.initAudioEngine();

    // Initial view update
    this.view.update(this.model);
    this.view.startVisualizerAnimation(false);
  }

  initAudioEngine() {
    // Audio engine state updates
    this.audio.addEventListener("timeupdate", () => {
      this.model.currentTime = this.audio.currentTime;
      this.view.update(this.model);
    });

    this.audio.addEventListener("durationchange", () => {
      this.model.duration = this.audio.duration;
      this.view.update(this.model);
    });

    this.audio.addEventListener("loadedmetadata", () => {
      this.model.duration = this.audio.duration;
      this.view.update(this.model);
    });

    this.audio.addEventListener("ended", () => {
      synth.playClick();
      if (this.model.isLooping) {
        this.audio.currentTime = 0;
        this.audio.play().catch(e => console.warn("Loop play error:", e));
      } else {
        this.nextTrack(true); // autoNext
      }
    });

    // Error recovery: Auto-pause correction when previewing empty/fake URLs
    this.audio.addEventListener("error", (e) => {
      console.warn("Audio resource load error. Restoring state:", e);
      synth.playError();
      
      // Show warning in ticker
      const activeTrack = this.model.getActiveTrack();
      const filename = activeTrack ? activeTrack.title : "Pista";
      
      const viewTicker = document.getElementById("track-ticker");
      viewTicker.innerText = `⚠️ ERROR AL CARGAR: ${filename.toUpperCase()}`;
      
      // Prevent player freeze, set playing state to false but allow user to skip
      this.model.isPlaying = false;
      this.view.update(this.model);
      this.view.startVisualizerAnimation(false);
    });
  }

  // Web Audio Context setup for real frequency bars (lazy loaded on play click)
  lazySetupAudioContext() {
    if (this.audioCtx) return;

    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      
      // Stereo Panner Node for L/R Balance (if supported)
      if (this.audioCtx.createStereoPanner) {
        this.panner = this.audioCtx.createStereoPanner();
        this.panner.pan.value = this.model.balance;
      }
      
      // Connect audio tag to our analyser
      this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);
      
      // Chain: Source -> Analyser -> Panner -> Destination
      this.audioSrc.connect(this.analyser);
      
      if (this.panner) {
        this.analyser.connect(this.panner);
        this.panner.connect(this.audioCtx.destination);
      } else {
        this.analyser.connect(this.audioCtx.destination);
      }
      
      this.view.setupVisualizer(this.analyser);
    } catch (err) {
      console.warn("Could not create Web Audio analysis context. Falling back to simulated oscillograph.", err);
      this.view.setupVisualizer(null);
    }
  }

  bindEvents() {
    // Model change listeners
    this.model.onStateChange = () => this.view.update(this.model);
    this.model.onTrackChange = () => this.loadActiveTrack();

    // Click synthesizer trigger wrapper
    const clickSynth = (callback) => {
      return (e) => {
        synth.playClick();
        callback(e);
      };
    };

    // Control buttons bindings
    document.getElementById("btn-play").addEventListener("click", clickSynth(() => this.play()));
    document.getElementById("btn-pause").addEventListener("click", clickSynth(() => this.pause()));
    document.getElementById("btn-stop").addEventListener("click", clickSynth(() => this.stop()));
    document.getElementById("btn-prev").addEventListener("click", clickSynth(() => this.prevTrack()));
    document.getElementById("btn-next").addEventListener("click", clickSynth(() => this.nextTrack()));

    // Repeat / Shuffle bindings
    document.getElementById("btn-shuffle").addEventListener("click", clickSynth(() => {
      this.model.toggleShuffle();
      const btn = document.getElementById("btn-shuffle");
      btn.classList.toggle("active", this.model.isShuffle);
    }));
    document.getElementById("btn-repeat").addEventListener("click", clickSynth(() => {
      this.model.toggleLoop();
      const btn = document.getElementById("btn-repeat");
      btn.classList.toggle("active", this.model.isLooping);
    }));

    // Volume Slider binding
    const volSlider = document.getElementById("volume-slider");
    if (volSlider) {
      volSlider.addEventListener("input", (e) => {
        const vol = parseInt(e.target.value);
        this.model.setVolume(vol);
        this.syncVolume();
      });
    }

    // Balance Slider binding
    const balSlider = document.getElementById("balance-slider");
    if (balSlider) {
      balSlider.addEventListener("input", (e) => {
        const bal = parseFloat(e.target.value);
        this.model.setBalance(bal);
        if (this.panner) {
          this.panner.pan.value = bal;
        }
      });
    }

    // Mute button binding
    this.view.btnMuteToggle.addEventListener("click", clickSynth(() => {
      this.model.toggleMute();
      this.syncVolume();
    }));

    // Progress Bar (seeking) binding
    this.view.progressSlider.addEventListener("input", (e) => {
      if (this.model.duration > 0) {
        const targetSec = (parseFloat(e.target.value) / 100) * this.model.duration;
        this.audio.currentTime = targetSec;
        this.model.currentTime = targetSec;
      }
    });

    // Selection controls (Skins / Fonts)
    this.view.skinSelect.addEventListener("change", (e) => {
      synth.playClick();
      this.model.setTheme(e.target.value);
    });

    this.view.fontSelect.addEventListener("change", (e) => {
      synth.playClick();
      this.model.setFont(e.target.value);
    });

    // Search bar filtering
    this.view.playlistSearch.addEventListener("input", (e) => {
      this.model.filterTracks(e.target.value);
    });

    // Click track list selection
    this.view.playlistContainer.addEventListener("click", clickSynth((e) => {
      const item = e.target.closest(".playlist-item");
      if (item) {
        const index = parseInt(item.getAttribute("data-index"));
        this.selectTrack(index);
      }
    }));

    // Add Custom track binding
    this.view.btnAddTrack.addEventListener("click", clickSynth(() => {
      const title = this.view.customTitleInput.value.trim();
      const url = this.view.customUrlInput.value.trim();
      
      if (!title || !url) {
        synth.playError();
        alert("Introduce un título y una URL válidos.");
        return;
      }

      const success = this.model.addCustomTrack(title, url);
      if (success) {
        this.view.customTitleInput.value = "";
        this.view.customUrlInput.value = "";
        // Select newly added track
        this.selectTrack(this.model.playlist.length - 1);
      } else {
        synth.playError();
      }
    }));
  }

  // Load the track URL into the Audio context
  loadActiveTrack() {
    const active = this.model.getActiveTrack();
    if (!active) {
      this.audio.src = "";
      this.model.currentTime = 0;
      this.model.duration = 0;
      this.view.update(this.model);
      return;
    }

    // Set engine source link
    this.audio.src = active.url;
    this.audio.load();
    this.model.currentTime = 0;

    // If it was playing, trigger play command
    if (this.model.isPlaying) {
      this.audio.play().catch(e => {
        console.warn("Playback error on load transition:", e);
        this.model.isPlaying = false;
        this.view.update(this.model);
      });
    }

    this.view.update(this.model);
  }

  // Action: Play
  play() {
    // Resume context if browser was blocking it
    this.lazySetupAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const active = this.model.getActiveTrack();
    if (!active) {
      // Lazy load first song
      if (this.model.filteredPlaylist.length > 0) {
        this.selectTrack(0);
      } else {
        synth.playError();
        return;
      }
    }

    if (!this.audio.src) {
      this.loadActiveTrack();
    }

    this.model.isPlaying = true;
    this.audio.play()
      .then(() => {
        this.view.startVisualizerAnimation(true);
        this.view.update(this.model);
      })
      .catch(err => {
        console.warn("Could not autoplay track:", err);
        synth.playError();
        this.model.isPlaying = false;
        this.view.update(this.model);
        this.view.startVisualizerAnimation(false);
      });
  }

  // Action: Pause
  pause() {
    this.model.isPlaying = false;
    this.audio.pause();
    this.view.update(this.model);
    this.view.startVisualizerAnimation(false);
  }

  // Action: Stop
  stop() {
    this.model.isPlaying = false;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.model.currentTime = 0;
    this.view.update(this.model);
    this.view.startVisualizerAnimation(false);
  }

  // Action: Select track from index
  selectTrack(index) {
    if (index >= 0 && index < this.model.filteredPlaylist.length) {
      this.model.currentTrackIndex = index;
      this.loadActiveTrack();
      
      // Auto play selected track
      this.play();
    }
  }

  // Action: Next track (handles shuffle / loop)
  nextTrack(autoNext = false) {
    if (this.model.filteredPlaylist.length <= 1) {
      if (this.model.filteredPlaylist.length === 1) {
        this.audio.currentTime = 0;
        if (this.model.isPlaying) this.audio.play();
      }
      return;
    }

    if (this.model.isShuffle && autoNext) {
      // Pick random index excluding current if possible
      let nextIndex = this.model.currentTrackIndex;
      while (nextIndex === this.model.currentTrackIndex) {
        nextIndex = Math.floor(Math.random() * this.model.filteredPlaylist.length);
      }
      this.model.currentTrackIndex = nextIndex;
    } else {
      this.model.currentTrackIndex = (this.model.currentTrackIndex + 1) % this.model.filteredPlaylist.length;
    }

    this.loadActiveTrack();
    if (this.model.isPlaying) {
      this.play();
    }
  }

  // Action: Prev track
  prevTrack() {
    if (this.model.filteredPlaylist.length <= 1) {
      this.audio.currentTime = 0;
      return;
    }

    if (this.model.currentTrackIndex === 0) {
      this.model.currentTrackIndex = this.model.filteredPlaylist.length - 1;
    } else {
      this.model.currentTrackIndex--;
    }

    this.loadActiveTrack();
    if (this.model.isPlaying) {
      this.play();
    }
  }

  // Synchronize player volume to HTML audio engine
  syncVolume() {
    if (this.model.isMuted) {
      this.audio.volume = 0;
    } else {
      this.audio.volume = this.model.volume / 100;
    }
  }
}

// ==========================================
// 5. APPLICATION INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Direct initialization (avoids loader blocking inside dynamic frames)
  const model = new PlayerModel();
  const view = new PlayerView();
  const controller = new PlayerController(model, view);

  // Play power on synth chime
  window.addEventListener("click", () => {
    synth.playPowerOn();
  }, { once: true });
});


