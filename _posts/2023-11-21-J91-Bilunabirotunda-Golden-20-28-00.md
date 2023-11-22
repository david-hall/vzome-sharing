---
title: J91 Bilunabirotunda
description: A Johnson solid
image: https://david-hall.github.io/vzome-sharing/2023/11/21/20-28-00-J91-Bilunabirotunda-Golden/J91-Bilunabirotunda-Golden.png
published: true
layout: vzome
---

{% comment %}
 - [***web page generated from this source***](<https://david-hall.github.io/vzome-sharing/2023/11/21/J91-Bilunabirotunda-Golden-20-28-00.html>)
 - [data assets and more info](<https://github.com/david-hall/vzome-sharing/tree/main/2023/11/21/20-28-00-J91-Bilunabirotunda-Golden/>)
 
{% endcomment %}

A Johnson solid

<figure style="width: 87%; margin: 5%">
  <vzome-viewer style="width: 100%; height: 60vh" scene="Faces"
       src="https://david-hall.github.io/vzome-sharing/2023/11/21/20-28-00-J91-Bilunabirotunda-Golden/J91-Bilunabirotunda-Golden.vZome" >
    <img  style="width: 100%"
       src="https://david-hall.github.io/vzome-sharing/2023/11/21/20-28-00-J91-Bilunabirotunda-Golden/J91-Bilunabirotunda-Golden.png" >
  </vzome-viewer>
  <figcaption style="text-align: center; font-style: italic;">
    J91 Bilunabirotunda
  </figcaption>
</figure>

<p>
<button id="struts">Struts & balls</button>
<button id="faces">Faces</button></p>

<script>
  document.querySelector( "#struts" ).addEventListener( "click", e => document.querySelector( "vzome-viewer" ).scene = "Struts &amp; balls" );
  document.querySelector( "#faces"  ).addEventListener( "click", e => document.querySelector( "vzome-viewer" ).scene = "Faces" );
</script>