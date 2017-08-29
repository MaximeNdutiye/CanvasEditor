const {screen, desktopCapturer} = require('electron')

desktopCapturer.getSources({types: ['window', 'screen'], minWidth: 600, minHeight: 200}, (error, sources) => {
  getInitialScreenshots(sources)
})

function getInitialScreenshots(sources){
  var sourcesHolder = document.querySelector('.sources_holder')
  sources.forEach(source => {

      var blob = new Blob([source.thumbnail.toPNG(50)])
      var str = '<div class=\"source_container\"><img class=\"source_thumbnail\"'
                +'alt=\"'+source.id+'\"src=\"'+URL.createObjectURL(blob)+'\"></img></div>'

      var sourceItem = domify(str)

      sourcesHolder.appendChild(sourceItem)

      sourceItem.childNodes[0].addEventListener('click', e => {
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

  mediaRecorder.ondataavailable = e => {
    chunks.push(e.data);
  }

  recordButton.onclick = _ => {
    mediaRecorder.start();
    previewer.style.display = "block"
    previewer.src = URL.createObjectURL(stream)
    recordButton.style.background = "red";
    recordButton.style.color = "white";
    document.querySelector('.sources_selector').style.height = "60px"
  }

  stopButton.onclick = _ => {
    mediaRecorder.stop()
    recordButton.style.background = "";
    recordButton.style.color = "";
    document.querySelector('.sources_selector').style.height = "300px"
  }

  mediaRecorder.onstop = e => {

    previewer.style.display = "none"

    var blob = new Blob(chunks, { 'type' : 'video/mp4' });
    chunks = [];

    var str = '<article class=\"clip\"><video controls class=\"video_view\"'+
              'src=\"'+URL.createObjectURL(blob)+'\"></video><button>Delete</button>'+
              '<a href=\"'+URL.createObjectURL(blob)+'\"download=\"myfile.mp4\">'+
              '<button>Download</button></a></article>'
    var videoSource = domify(str)

    videoClips.appendChild(videoSource)

    videoSource.childNodes[1].onclick = e => {
      var evtTgt = e.target;
      evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    }
  }
}

function getUserMediaError(e) {
  console.log('getUserMediaError');
}
