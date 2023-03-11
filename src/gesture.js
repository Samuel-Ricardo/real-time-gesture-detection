const {
  GestureDescription, 
  Finger, 
  FingerCurl, 
  FingerDirection
} = window.fp;

const rockGesture = new GestureDescription('rock')  // ✊️



rockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
rockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5)

for(let finer of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  rockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0)
  rockGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9)
}

const gestures = [ 
  rockGesture,
]

export {gestures}
