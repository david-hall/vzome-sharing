---
title: 4 pentagons folded to a rhombohedron
description: One of the 8 ways to join regular pentagons per Matt Parker's video
image: https://david-hall.github.io/vzome-sharing/2023/07/09/20-14-37-4-pentagons-folded-to-rhombohedron/4-pentagons-folded-to-rhombohedron.png
published: true
layout: vzome
---

{% comment %}
 - [***web page generated from this source***](<https://david-hall.github.io/vzome-sharing/2023/07/09/4-pentagons-folded-to-rhombohedron-20-14-37.html>)
 - [data assets and more info](<https://github.com/david-hall/vzome-sharing/tree/main/2023/07/09/20-14-37-4-pentagons-folded-to-rhombohedron/>)
 
{% endcomment %}

One of the 8 ways to join regular pentagons per [Matt Parker's video](https://www.youtube.com/watch?v=ZPMR_UT75a8)
and described in [this PDF](https://arxiv.org/pdf/2007.01753.pdf).

<button id="folded">folded view</button>
<button id="unfold">unfolded view</button>

<script>
  const viewer = document.querySelector( "vzome-viewer" );
  document.querySelector( "#folded" ).addEventListener( "click", e => viewer.scene =   "folded pentagons" );
  document.querySelector( "#unfold" ).addEventListener( "click", e => viewer.scene = "unfolded pentagons" );
</script>

<figure style="width: 87%; margin: 5%">
  <vzome-viewer style="width: 100%; height: 60vh" scene="folded pentagons" 
       src="https://david-hall.github.io/vzome-sharing/2023/07/09/20-14-37-4-pentagons-folded-to-rhombohedron/4-pentagons-folded-to-rhombohedron.vZome" >
    <img  style="width: 100%"
       src="https://david-hall.github.io/vzome-sharing/2023/07/09/20-14-37-4-pentagons-folded-to-rhombohedron/4-pentagons-folded-to-rhombohedron.png" >
  </vzome-viewer>
  <figcaption style="text-align: center; font-style: italic;">
    4 pentagons folded to a rhombohedron
  </figcaption>
</figure>
