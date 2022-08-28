---
title: Embedded Video Demo
description: An example of embedding a vZome model and a video in a github markdown file.
image: https://ThynStyx.github.io/vzome-sharing/2022/08/27/09-01-49-Platonics-hull-vid-test/Platonics-hull-vid-test.png
published: true
layout: vzome
---
__{{ page.description }}__

The optional `poster` attribute of the `video` tag specifies an image to be shown while the video is downloading, or until the user hits the play button.
In this case, an animated gif file is rendered until the play button is clicked to start looping the mp4 video.

<figure style="width: 87%; margin: 5%">
     <video width="548" height="440" name="John Kostick's Great Circle video" 
		controls loop muted
		poster="https://raw.githubusercontent.com/ThynStyx/vzome-sharing/main/2022/08/27/09-01-49-Platonics-hull-vid-test/Model-of-hull-from-net-clip_1.gif" >
     <source src="https://raw.githubusercontent.com/ThynStyx/vzome-sharing/main/2022/08/27/09-01-49-Platonics-hull-vid-test/Model-of-hull-from-net-clip_1.mp4">
     This browser does not support the video tag.
   </video>
  <figcaption style="text-align: center; font-style: italic;">
    Platonics hull video
  </figcaption>
</figure>

The model and video are by John Kostick. 

The markdown source file for this post is [here](https://github.com/david-hall/vzome-sharing/blob/main/_posts/2022-08-27-Embedded-video-demo-22-30-00.md).

<figure style="width: 87%; margin: 5%">
  <vzome-viewer style="width: 100%; height: 60vh" src="https://ThynStyx.github.io/vzome-sharing/2022/08/27/09-01-49-Platonics-hull-vid-test/Platonics-hull-vid-test.vZome">
    <img style="width: 100%" src="https://ThynStyx.github.io/vzome-sharing/2022/08/27/09-01-49-Platonics-hull-vid-test/Platonics-hull-vid-test.png" />
  </vzome-viewer>
  <figcaption style="text-align: center; font-style: italic;">
    Platonics hull vZome model
  </figcaption>
</figure>

