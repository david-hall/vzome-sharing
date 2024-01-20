---
title: ''
subtitle: J64 Augmented tridiminished icosahedron Polygon20
share-title: J64 Augmented tridiminished icosahedron Polygon20
share-description: An interactive 3D view, shared from vZome
image: https://david-hall.github.io/vzome-sharing/2024/01/20/00-58-05-J64-Augmented-tridiminished-icosahedron-Polygon20/J64-Augmented-tridiminished-icosahedron-Polygon20.png
layout: design
---

<h2 id="title"></h2>
<button id="prev">prev</button> 
<button id="next">next</button> 
 
  <vzome-viewer style="width: 100%; height: 60vh" scene="will be replaced" reactive="false"
       src="https://david-hall.github.io/vzome-sharing/2024/01/20/00-58-05-J64-Augmented-tridiminished-icosahedron-Polygon20/J64-Augmented-tridiminished-icosahedron-Polygon20.vZome" >
    <img  style="width: 100%"
       src="https://david-hall.github.io/vzome-sharing/2024/01/20/00-58-05-J64-Augmented-tridiminished-icosahedron-Polygon20/J64-Augmented-tridiminished-icosahedron-Polygon20.png" >
  </vzome-viewer>

<script> 
// copied from https://codepen.io/scottvorthmann/pen/JjeZZev
let scenes;
let index = 1; // Yes, skipping the default scene 0 intentionally

const prevButton = document.querySelector( "#prev" );
const nextButton = document.querySelector( "#next" );
const title = document.querySelector( "#title" );
const viewer = document.querySelector( "vzome-viewer" );

const changeScene = delta =>
{
  index = Math.min( Math.max( index + delta, 1 ), scenes.length-1 );
  title .innerHTML = scenes[index];
  viewer .scene = scenes[index];
  viewer .update( { camera: false } );
}

viewer .addEventListener( "vzome-scenes-discovered", (e) => {
  scenes = e.detail;
  console.log( JSON.stringify( scenes, null, 2 ) );
  console.log( 'NOTE: we are intentionally bypassing the default scene for this page.' );
  title .innerHTML = scenes[index];
  prevButton .addEventListener( "click", e => changeScene( -1 ) );
  nextButton .addEventListener( "click", e => changeScene( +1 ) );
} );

</script>

This version is built from scratch rather than from a VEF import. The scenes show the construction process. Download the vZome file for an extensive description of each scene.
  
[Source folder](<https://github.com/david-hall/vzome-sharing/tree/main/2024/01/20/00-58-05-J64-Augmented-tridiminished-icosahedron-Polygon20/>)
