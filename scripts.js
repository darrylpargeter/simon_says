class Sequence {
  constructor(locked) {
    this.locked = locked;
    this.sequenceList = [];
  } 

  get length() {
    return this.sequenceList.length;
  }

  get sequence() {
    return this.sequenceList;
  }

  set sequence(item) {
    this.sequenceList.push(parseInt(item, 10));
  }

  randomValue() {
    return Math.floor(Math.random() * 4) + 0
  }

  addRandomValue() {
    this.sequence = this.randomValue();
  }
  
  clear() {
    this.sequenceList = [];
  }
}

class Sounds {
  constructor(fileList) {
    this.fileList = fileList;
    this.sounds = null;
    this.init();
  }

  init() {
    this.sounds = this.fileList.map(soundFile => new Sound(soundFile));
  }

  get sound() {
    return this.sounds;
  }
}

class Sound {
  constructor(file) {
    this.fileName = file;
    this.init();
  }

  init() {
    this.sound = new Audio(this.fileName);
    this.load();
  }

  load() {
    this.sound.load();
  }

  play() {
    this.sound.currentTime = 0;
    this.sound.play();
  }
}

class Game {
  constructor() {
    this.segments = document.querySelectorAll('.quarter');
    this.startBtn = document.querySelector('.start');
    this.restartBtn = document.querySelector('.restart');
    this.muteBtn = document.querySelector('.volume');
    this.count = document.querySelector('.count');
    this.sequence = new Sequence(true);
    this.userSequence = new Sequence();
    this.started = false;
    this.muted = false;
    this.soundList = [
      'sounds/a_sharp.wav',
      'sounds/c_sharp.wav',
      'sounds/d_sharp.wav',
      'sounds/f_sharp.wav',
    ];
    this.addEvents();
    this.loadedSounds = new Sounds(this.soundList);
  }

  oneTimeEvents(item, event, fn) {
    item.addEventListener(event, fn, { once: true });
  }

  addEvents() {
    this.oneTimeEvents(this.startBtn, 'click', this.start.bind(this));
    this.muteBtn.addEventListener('click', this.mute.bind(this));
    this.segments.forEach(segment => segment.addEventListener('click', this.segmentClicked.bind(this)));
  }

  mute() {
    this.muteBtn.classList.toggle('fa-volume-up');
    this.muteBtn.classList.toggle('fa-volume-off');
    this.muted = this.muted ? false : true;
  }

  checkSequences() {
    const passed = this.match();

    if (this.userSequence.length === this.sequence.length && passed) {
      this.sequence.addRandomValue();
      this.playAnimations();
      this.userSequence.clear();
      this.updateCount();
    }
  }

  updateCount() {
    this.count.innerHTML = `<h1>${this.sequence.length}</h1>`;
  }

  match() {
    let passed = true;

    this.userSequence.sequence.forEach((guess, idx) => {
      if (guess !== this.sequence.sequence[idx]) {
        passed = false;
        this.reset();
      }
    });

    return passed;
  }

  reset() {
    this.sequence.clear();
    this.userSequence.clear();
    this.started = false;
    this.updateCount();
    this.oneTimeEvents(this.startBtn, 'click', this.start.bind(this));
  }

  segmentClicked({ target: segment }) {
    if (this.started) {
      this.userSequence.sequence = segment.dataset.order;
      this.animated(segment, segment.dataset.order);
      setTimeout(() => {
        this.checkSequences();
      }, 500);
    }
  }

  animated(segment, idx) {
    segment.classList.toggle('animate');
    setTimeout(() => {
      if (!this.muted) {
        this.loadedSounds.sound[segment.dataset.order].play();
      }
      segment.classList.toggle('animate')
    }, 250);
  }

  playAnimations() {
    this.sequence.sequence.forEach((segment, idx) => {
      setTimeout(() => this.animated(this.segments[segment], idx), (idx + 1) * 500);
    });
    console.log(this.sequence.sequence);
  }
  
  start({ target: btn }) {
    this.started = true;
    this.sequence.addRandomValue();
    this.updateCount();
    this.playAnimations();
    this.oneTimeEvents(this.restartBtn, 'click', this.reset.bind(this));
  }
}

void function main() {
  const game = new Game();
}();
