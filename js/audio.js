const AudioContext = window.AudioContext || window.webkitAudioContext;
const sampleRate = 44100;

const context = new AudioContext({
  sampleRate: sampleRate,
});

const tracks = [
  "audio/synth-organ.ogg",
  "audio/new-wave-kit.ogg"
]

const trackNames = tracks.map( track => {
  let result = track.split('/')[1].split('.')[0].split('-').join(' ');
  return result;
})

const loadBuffer = async (url) => {
  let response = await fetch(url);

  if (response.ok) {
    let data = await response.arrayBuffer();
    let buffer = context.decodeAudioData(data);
    return buffer;
  }
}

let sourceNode = context.createBufferSource();
let gainNode = context.createGain();

const playTrack = (buffer) => {
  if (context.state !== 'running') {
        context.resume();
  }
  sourceNode = context.createBufferSource();
  gainNode = context.createGain();
  sourceNode.buffer = buffer;
  sourceNode.connect(gainNode).connect(context.destination);
  sourceNode.start(context.currentTime);
}

const stopTracks = () => {
  sourceNode.disconnect();
  gainNode.disconnect();
}

let buffers = Promise.all(tracks.map(url => loadBuffer(url)));
