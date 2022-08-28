---
title: Embedded Video Demo
description: A minimal example of embedding vZome models and video(s) in a github pages markdown file.
image: https://ThynStyx.github.io/vzome-sharing/2022/08/27/09-01-49-Platonics-hull-vid-test/Platonics-hull-vid-test.png
published: true
layout: vzome
---
__{{ page.description }}__

<figure style="width: 87%; margin: 5%">
  <vzome-viewer style="width: 100%; height: 60vh" src="https://ThynStyx.github.io/vzome-sharing/2022/08/27/09-01-49-Platonics-hull-vid-test/Platonics-hull-vid-test.vZome">
    <img style="width: 100%" src="https://ThynStyx.github.io/vzome-sharing/2022/08/27/09-01-49-Platonics-hull-vid-test/Platonics-hull-vid-test.png" />
  </vzome-viewer>
  <figcaption style="text-align: center; font-style: italic;">
    Platonics hull vZome model
  </figcaption>
</figure>


<figure style="width: 87%; margin: 5%">
	<!-- 
		The optional poster attribute specifies an image to be shown while the video is downloading, or until the user hits the play button.
	-->
     <video width="548" height="440" name="John Kostick's Great Circle video" 
		controls loop muted
		poster="https://raw.githubusercontent.com/ThynStyx/vzome-sharing/main/2022/08/27/09-01-49-Platonics-hull-vid-test/Model-of-hull-from-net-clip_1.gif" >
     <source src="https://raw.githubusercontent.com/ThynStyx/vzome-sharing/main/2022/08/27/09-01-49-Platonics-hull-vid-test/Model-of-hull-from-net-clip_1.mp4">
     This browser does not support the video tag.
   </video>
  <figcaption style="text-align: center; font-style: italic;">
    Platonics hull video test
  </figcaption>
</figure>


