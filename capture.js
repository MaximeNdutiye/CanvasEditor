const {screen, desktopCapturer} = require('electron')

desktopCapturer.getSources({types: ['window', 'screen'], minWidth: 600, minHeight: 200}, (error, sources) => {
  getInitialScreenshots(sources)
})

function getInitialScreenshots(sources){
  var sourcesHolder = document.querySelector('.sources_holder')
  sources.forEach(source => {

      var imageItem = document.createElement('img')
      var sourceContainer = document.createElement('div')
      var sourceButton =  document.createElement('button')

      sourceButton.value = source.id
      imageItem.alt = source.id
      //sourceButton.innerHTML = source.name.slice(0,15)

      imageItem.classList.add('source_thumbnail')
      sourceContainer.classList.add('source_container')
      sourceButton.classList.add('long_button')

      var blob = new Blob([source.thumbnail.toPNG(50)])
      imageItem.src = URL.createObjectURL(blob)

      //sourceContainer.appendChild(imageItem)
      //sourceButton.appendChild(imageItem)
      sourceContainer.appendChild(imageItem)
      sourcesHolder.appendChild(sourceContainer)

      imageItem.addEventListener('click', e => {

        var sourceId = e.target.alt
        desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
          if (error) throw error;
          for (let i = 0; i < sources.length; ++i) {
            if (sources[i].id == sourceId) {
              navigator.webkitGetUserMedia({
                audio: {
                  mandatory:{
                    chromeMediaSource: 'desktop'
                  }
                },
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sources[i].id,
                    minWidth: 1024,
                    maxWidth: 3840,
                    minHeight: 768,
                    maxHeight: 2160
                  }
                }
              }, handleStream, getUserMediaError);
              return;
            }
          }
        });
      })
    })
}

function handleStream(stream) {
  var record = false;
  var mediaRecorder = new MediaRecorder(stream)
  var recordButton = document.querySelector('.record')
  var stopButton = document.querySelector('.stop')
  var videoClips = document.querySelector('.video-clips')
  var previewer = document.querySelector('.preview')
  var chunks = []
  var deleteButtonNumber = 0;

  mediaRecorder.ondataavailable = e => {
    chunks.push(e.data);
  }

  recordButton.onclick = _ => {
    mediaRecorder.start();
    previewer.style.display = "block"
    previewer.src = URL.createObjectURL(stream)
    console.log(mediaRecorder.state);
    console.log("recorder started");
    recordButton.style.background = "red";
    recordButton.style.color = "white";
    var sources_holder = document.querySelector('.sources_selector')
    sources_holder.classList.add('compact')
  }

  stopButton.onclick = _ => {
    mediaRecorder.stop()
    console.log(mediaRecorder.state)
    console.log("should have stopped recording")
    recordButton.style.background = "";
    recordButton.style.color = "";
    var sources_holder = document.querySelector('.sources_selector')
    sources_holder.classList.remove('compact')
  }

  mediaRecorder.onstop = e => {
    console.log("stopped recording")
    previewer.style.display = "none"

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
    videoClips.prepend(clipContainer);
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
