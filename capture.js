const {desktopCapturer} = require('electron')

desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
  if (error) throw error;
  for (let i = 0; i < sources.length; ++i) {
    if (sources[i].name === 'Entire screen') {
      navigator.webkitGetUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[i].id,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      }, handleStream, getUserMediaError);
      return;
    }
    console.log(sources[i].name)
  }
});

function handleStream(stream) {
  var record = false;
  var mediaRecorder = new MediaRecorder(stream)
  var recordButton = document.querySelector('.record')
  var stopButton = document.querySelector('.stop')
  var videoClips = document.querySelector('.video-clips')
  var chunks = []
  var deleteButtonNumber = 0;

  mediaRecorder.ondataavailable = e => {
    chunks.push(e.data);
  }

  recordButton.onclick = _ => {
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    console.log("recorder started");
    recordButton.style.background = "red";
    recordButton.style.color = "black";
  }

  stopButton.onclick = _ => {
    mediaRecorder.stop()
    console.log(mediaRecorder.state)
    console.log("should have stopped recording")
    recordButton.style.background = "";
    recordButton.style.color = "";
  }

  mediaRecorder.onstop = e => {
    console.log("stopped recording")

    var clipName = "myfile"
    var clipContainer = document.createElement('article');
    var clipLabel = document.createElement('p');
    var video = document.createElement('video');
    var deleteButton = document.createElement('button')

    var abtn = document.createElement('button')
    var downloadClipButton = document.createElement("a")

    clipContainer.classList.add('clip');
    video.setAttribute('controls', '');
    deleteButton.innerHTML = "Delete";
    abtn.innerHTML = "Download";
    video.classList.add('video_view');
    clipLabel.innerHTML = clipName;

    clipContainer.appendChild(video);
    clipContainer.appendChild(deleteButton);
    clipContainer.appendChild(downloadClipButton);
    videoClips.appendChild(clipContainer);
    downloadClipButton.appendChild(abtn);

    var blob = new Blob(chunks, { 'type' : 'video/mp4' });
    chunks = [];
    var videoURL = window.URL.createObjectURL(blob);
    video.src = videoURL;
    downloadClipButton.href = videoURL;
    downloadClipButton.download = clipName;

    deleteButton.onclick = e => {
      var evtTgt = e.target;
      evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    }
  }


}

function getUserMediaError(e) {
  console.log('getUserMediaError');
}
