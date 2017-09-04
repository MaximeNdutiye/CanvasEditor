# Canvas

![Canvas Screenshot](https://raw.githubusercontent.com/MaximeNdutiye/CanvasEditor/master/images/screenshot.PNG)

## About

Simple Electron app for desktop capture.
this app used Electron's ` desktopCapturer ` API

### To Run

```Bash
  npm start
```
or

```Bash
  electron .
```

Known issue with desktopCapturer() API
results in seeing black windows in Chrome
except when capturing entire screen.

These commands fix some of the black screen issues
```Bash
  npm start
  electron . --disable-d3d11
```

## TODO

  * Add a NodeJS server and a database to host images, and allow of online storage
  * Allow saving of videos in more formats
  * Allow editing of images in image editor
  * Add svg shape creation to editor
