
const config = { video: {width: 640, height: 480, fps: 30} }

const landmarkcolor = {
  thumb: 'black',
  index: 'blue',
  middle: 'red',
  ring: 'green',
  pinky: 'yellow',
  wirst: 'white'
}

const gestureStrings = {
  'thumbs_up': '👍',
  'victory': '✌🏻',
  'rock': '✊️',
  'paper': '🖐',
  'scissors': '✌️',
  'dont': '🙅'
}

const base = ['Horizontal', 'Diagonal Up']
const dont = {
  left: [...base].map( i => i.concat(`Right`)), // left arm positioned on horizontal / diagonal up | Right
  right: [...base].map( i => i.concat(`Left`)), // right arm positioned on horizontal / diagonal up | left
}

async function createDetector() {
  return window.handPoseDetection.createDetector(
    window.handPoseDetection.SupportedModels.MediaPipeHands,
    {
      runtime: 'mediapipe',
      modelType: 'full',
      maxHands: 2,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`,
    }
  )
}

