

document.addEventListener("DOMContentLoaded",
  function(e){
    var mousePressed = false;
    var lastX, lastY;
    var ctx;
    var c = document.getElementById('myCanvas');

    c.height = 500;
    c.width = 500;

    function InitThis() {
        ctx = document.getElementById('myCanvas').getContext("2d");

        c.addEventListener('mousedown',(function (e) {
            mousePressed = true;
            Draw(e.pageX - c.offsetLeft, e.pageY - c.offsetTop, false);
        }));

        c.addEventListener('mousemove',(function (e) {
            if (mousePressed) {
                Draw(e.pageX - c.offsetLeft, e.pageY - c.offsetTop, true);
            }
        }));

        c.addEventListener('mouseup',(function (e) {
            mousePressed = false;
        }));
    	  c.addEventListener('mouseleave',(function (e) {
            mousePressed = false;
        }));
    }

    function Draw(x, y, isDown) {
        if (isDown) {
            ctx.beginPath();
            ctx.strokeStyle = document.getElementById('selColor').value;
            ctx.lineWidth = document.getElementById('selWidth').value;
            ctx.lineJoin = "round";
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
        lastX = x; lastY = y;
    }

    function clearArea() {
        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    var downbtn  = document.getElementById('download');
    downbtn.addEventListener('click', function(){
      var download = document.getElementById("download");
      var image = document.getElementById("myCanvas").toDataURL("image/png")
                  .replace("image/png", "image/octet-stream");
      download.setAttribute("href", image);
      console.log("download");
    });

    InitThis();

});
