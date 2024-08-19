---
title: Spectre Roofline Algorithm
description: Solving the fold-and-cut problem for the Spectre tile
image: https://david-hall.github.io/vzome-sharing/2024/08/18/21-41-36-Spectre-Roofline/Spectre-Roofline.png
published: true
layout: vzome
---

{% comment %}
 - [***web page generated from this source***](<https://david-hall.github.io/vzome-sharing/2024/08/18/Spectre-Roofline-21-41-36.html>)
 - [data assets and more info](<https://github.com/david-hall/vzome-sharing/tree/main/2024/08/18/21-41-36-Spectre-Roofline/>)
 
{% endcomment %}

Solving the fold-and-cut problem for the Spectre tile

<figure style="width: 87%; margin: 5%">
  
  
  <vzome-viewer style="width: 100%; height: 60dvh" show-scenes='named'
        src="https://david-hall.github.io/vzome-sharing/2024/08/18/21-41-36-Spectre-Roofline/Spectre-Roofline.vZome" >
    <img  style="width: 100%"
        src="https://david-hall.github.io/vzome-sharing/2024/08/18/21-41-36-Spectre-Roofline/Spectre-Roofline.png" >
  </vzome-viewer>

  <figcaption style="text-align: center; font-style: italic;">
    Spectre Roofline Algorithm
  </figcaption>

</figure>

  David Richeson nerd sniped me!!! This design is part of my response. 

  The puzzle he proposed was to fold a sheet of paper so that a single straight cut will produce a spectre tile.

  David published [his solution](https://divisbyzero.com/2024/08/14/fold-and-cut-hat-and-spectre-tiles/) along with a comparable solution for the hat tile.
  He refered to the work of [Erik Demaine](https://erikdemaine.org/foldcut/) et al, which provides two algorithms for solving the general case.

  Dermaine calls one approach the **Disk Packing Method**. The other algorithm, which is more suited for vZome, he calls the **Straight Skeleton Method**.
  It is based in part on [this 1995 paper](https://www.jucs.org/jucs_1_12/a_novel_type_of/Aichholzer_O.pdf) published in the Journal of Universal Computer Science.
  
  That paper describes the algorithm and how it is analagous to building a constant-pitch roof on an arbitrary set of straight walls (the polygon). 
  The specific pitch is irrelevant, but must be constant for all facets of the roof. 
  The end result is that the resulting ridge line can be projected onto the polygon's plane (the spectre in our case) 
  and the projection of the various vertices of the ridge line serve as a starting point for producing the necessary folds.
  
  This design includes several views of that approach. It can be seen thathe resulting ridge line projections corespond exactly to folds in David's solution.
