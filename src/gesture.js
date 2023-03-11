const {
  GestureDescription, 
  Finger, 
  FingerCurl, 
  FingerDirection
} = window.fp;


const rockGesture = new GestureDescription('rock')  // ✊️
const paperGesture = new GestureDescription('paper')  // 🖐
const scissorsGesture = new GestureDescription('scissors') // ✌️


rockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
rockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5)

for(let finer of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  rockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0)
  rockGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9)
}


for (let finger of Finger.all) { paperGesture.addCurl(finger, FingerCurl.NoCurl, 1.0) }


scissorsGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
scissorsGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

scissorsGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
scissorsGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

scissorsGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
scissorsGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);


const gestures = [ 
  rockGesture,
  paperGesture
]

export {gestures}
