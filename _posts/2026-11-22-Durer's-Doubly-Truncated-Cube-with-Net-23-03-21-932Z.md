---
title: Durer's Doubly Truncated Cube with Net
description: A 2D net of a doubly truncated cube, originally by Albrecht Durer
image: https://david-hall.github.io/vzome-sharing/2026/11/22/23-03-21-932Z-Durer%27s-Doubly-Truncated-Cube-with-Net/Durer%27s-Doubly-Truncated-Cube-with-Net.png
published: trues
layout: vzome
---

{% comment %}
 - [***web page generated from this source***](<https://david-hall.github.io/vzome-sharing/2026/11/22/Durer%27s-Doubly-Truncated-Cube-with-Net-23-03-21-932Z.html>)
 - [data assets and more info](<https://github.com/david-hall/vzome-sharing/tree/main/2026/11/22/23-03-21-932Z-Durer%27s-Doubly-Truncated-Cube-with-Net/>)
 
{% endcomment %}

A 2D net of a doubly truncated cube, originally by Albrecht Durer

<figure style="width: 87%; margin: 5%">
  
  
  <vzome-viewer style="width: 100%; height: 60dvh" 
        src="https://david-hall.github.io/vzome-sharing/2026/11/22/23-03-21-932Z-Durer%27s-Doubly-Truncated-Cube-with-Net/Durer%27s-Doubly-Truncated-Cube-with-Net.vZome" >
    <img  style="width: 100%"
        src="https://david-hall.github.io/vzome-sharing/2026/11/22/23-03-21-932Z-Durer%27s-Doubly-Truncated-Cube-with-Net/Durer%27s-Doubly-Truncated-Cube-with-Net.png" >
  </vzome-viewer>

  <figcaption style="text-align: center; font-style: italic;">
   Albrecht Durer's doubly truncated cube with a corrected version of its net
  </figcaption>
</figure>

Albrecht Durer was one of the first renaissance artists to use 2D nets to describe 3D polyhedra. George Hart has a [short article]<https://www.georgehart.com/virtual-polyhedra/durer.html> describing three of Durer's noteworthy polyhedral nets. The article mentions that Durer's net of the doubly truncated cube has some significant geometric errors. Hart also notes that this particular polyhedron can be inscribed in a sphere by ensuring that the dodecagons are regular. Although the article includes 3D models of two of Durer's polyhedra, it did not include a model of the doubly truncated cube. I was [nerd-sniped]<https://xkcd.com/356/> by the article and this vZome article is the result.


The 2D net shown in this design avoids the errors in Durer's original work.


The doubly truncated cube can be generated in the **ℚ[√3]** algebraic field. However, its net requires √7 to be adjoined in addition. vZome does not (yet) support the **ℚ[√3, √7]** algebraic field directly, however, both roots can be generated in the polygon42 algebraic field which is how this design was generated. The dodecagon's edges are scaled to a length of 8 which results in all coordinates having integer coefficients, so this particular design needs only **ℤ[√3, √7]**.


<img style="width: 100%" 
src="https://david-hall.github.io/vzome-sharing/2026/11/22/23-03-21-932Z-Durer%27s-Doubly-Truncated-Cube-with-Net/Doubly-Truncated-Cube-Net-Coordinates.png">


<img style="width: 100%" 
src="https://david-hall.github.io/vzome-sharing/2026/11/22/23-03-21-932Z-Durer%27s-Doubly-Truncated-Cube-with-Net/Doubly-Truncated-Cube-Net-Coordinate-Values.png">
