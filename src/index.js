import { gestures } from "./gesture.js"


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
  
  async function main () {
    const video = document.querySelector("#pose-video")
    const canvas = document.querySelector('#pose-canvas')
    const canvasContext = canvas.getContext('2d')
    
    
    const resultLayer = {
      right: document.querySelector('#pose-result-right'),
      left: document.querySelector('#pose-result-left'),
    }
    
    const knowGestures = [
      fp.Gestures.VictoryGesture,
      fp.Gestures.ThumbsUpGesture,
      ...gestures,
    ]
    
    const GesturesEstimator = new fp.GestureEstimator(knowGestures)
    
    const detector = await createDetector()
    console.log("mediaPose model loaded")
    
    const pair = new Set()
    
    console.log("HIIIIIIIIIII")

  function checkGestureCombination(chosenHand, poseData) {
    const addToPairIfCorrect = (chosenHand) => {

      const containsHand = poseData.some(finger => dont[chosenHand].includes(finger[2]))
      if(!containsHand) return;

      pair.add(chosenHand)
    }

    addToPairIfCorrect(chosenHand)
    if (pair.size !== 2) return;

    resultLayer.left.innerText = resultLayer.right.innerText = gestureString.dont
    pair.clear()
  } 

  const estimateHands = async () => {

    canvasContext.clearRect(0,0, config.video.width, config.video.height)
    resultLayer.right.innerText = ''
    resultLayer.left.innerText = ''

    const hands = await detector.estimateHands(video, {flipHorizontal:true})

    for (let hand in hands) {
      hand = hands[hand]
      for (const keypoint of hand.keypoints) {

        const name = keypoint.name.split('_')[0].toString().toLowerCase()
        const color = landmarkcolor[name]

        drawPoint(canvasContext, keypoint.x, keypoint.y, 3, color)

      }

      const keypoints3D = hand.keypoints3D.map(keypoint => [keypoint.x, keypoint.y, keypoint.z])
      const predictions = GesturesEstimator.estimate(keypoints3D, 9)

      if (!predictions.gestures.length) updateDebugInfo(predictions.poseData, 'left')

      if(predictions.gestures.length > 0) {
        
        const result = predictions.gestures.reduce(
          (previus,current) => (previus.score > current.score) ? previus : current
        )
      
        const found = gestureStrings[result.name]
        
        const choseHand = hand.handedness.toLowerCase()
        updateDebugInfo(predictions.poseData, choseHand)
        
        console.log({found})

        //if (found !== gestureStrings.dont) {
          resultLayer[choseHand].innerText = found
          continue;
        //}
        checkGestureCombination(choseHand, predictions.poseData)
      }
    }
    
    setTimeout(_ => {estimateHands()}, 1000 / config.video.fps)
  }

  estimateHands()
  console.log('Starting Predictions')
}

async function initCamera(width, height, fps) {

  const constraints = {
    audio: false,
    video: {
      facingMode: 'user',
      width,
      height,
      frameRate: {max: fps}
    }
  }

  const video = document.querySelector("#pose-video")
    video.width = width
    video.height = height
  
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.srcObject = stream
    
    console.log({video})

  return new Promise( resolve => {video.onloadedmetadata = () => {resolve(video)}} )
}

function drawPoint(canvasContext, x, y, r, color) {
  canvasContext.beginPath()
  canvasContext.arc(x, y, r, 0, 2 * Math.PI)
  canvasContext.fillStyle = color
  canvasContext.fill()
}

function updateDebugInfo(data, hand) {
  const summaryTable = `#summary-${hand}`
  for (let fingerIdx in data) {
    document.querySelector(`${summaryTable} span#curl-${fingerIdx}`).innerHTML = data[fingerIdx][1]
    document.querySelector(`${summaryTable} span#dir-${fingerIdx}`).innerHTML = data[fingerIdx][2]
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initCamera( config.video.width, config.video.height, config.video.fps )
    .then( video => {
      video.play()
      video.addEventListener("loadeddata", event => {
        console.log("camera is ready :D")   
        main()
      })
    })

  const canvas = document.querySelector("#pose-canvas")
    canvas.width = config.video.width
    canvas.height = config. video.height
  console.log("Canvas Initialized :D")
})
