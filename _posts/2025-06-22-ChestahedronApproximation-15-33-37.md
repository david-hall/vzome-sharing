---
title: Chestahedron
description: Help me find a closed form expression for the coordinates of a Chestahedron.
image: https://david-hall.github.io/vzome-sharing/2025/06/22/15-33-37-ChestahedronApproximation/ChestahedronApproximation.png
published: true
layout: vzome
---

{% comment %}
 - [***web page generated from this source***](<https://david-hall.github.io/vzome-sharing/2025/06/22/ChestahedronApproximation-15-33-37.html>)
 - [data assets and more info](<https://github.com/david-hall/vzome-sharing/tree/main/2025/06/22/15-33-37-ChestahedronApproximation/>)
 
{% endcomment %}

This model is a rational approximation of a Chestahedron. What is the exact closed form expression for its coordinates?

The Chestahedron is apparently the invention of Frank Chester. It is described on [his wesite](https://frankchester.com/).

The Chestahedron is a specific heptahdron having 4 equilateral triangular faces and 3 kite faces. By definition, all 7 faces of a Chestahedron have the same area. 
Many of the documents on frankchester.com give rational approximations for the Chestahedron. Many of then are based on derivations from pentagonal constructions
and are very close approximations. Unfortunately, many of them give the impression that they are exact geometric constructions, but in facet, they are near misses.

I have been trying to find a closed form (algebraic) expression for a Chestaheron's coordinates. Given that it has 3-fold rotational symmetry, 
I made vZome and Geogebra models of it such that the axis of symmetry is on the { 1, 1, 1 } vector and the vetrices of the "base" triangular face 
are at { 1, 0, 0 }, { 0, 1, 0 } and { 0, 0, 1 }. I can then define the vertex where the 3 kites meet to be in the first (all positive) octant of 3D space.
 This orientation allows the coordinates of the 3 remaining triangular faces' vertices to be defined with just 2 positive numbers. I'll call them **a** and **b**,
 so their coordinates are { **b**, **a**, **a** }, { **a**, **b**, **a** } and { **a**, **a**, **b** }. 
 The vertex where the 3 kites meet can then be called { **c**, **c**, **c** }.

 The area of the equilateral "base" triangle can easily be calculated, and since the areas of the other triangular faces and the kites are constrained to all be equal, 
 there is necessarily a single unique value for the variables that define the rest of the coordinetes.

 Given that all 7 coordinates can be given in terms of the 3 positive variables **a**, **b** and **c**, 
 I'm looking for a closed form expression for thase 3 variables aswell as an explanation of how they can be calculated. 
 I'll post some of my ideas for calculating the on the Discord server.


<figure style="width: 87%; margin: 5%">
  
  
  <vzome-viewer style="width: 100%; height: 60dvh" 
        src="https://david-hall.github.io/vzome-sharing/2025/06/22/15-33-37-ChestahedronApproximation/ChestahedronApproximation.vZome" >
    <img  style="width: 100%"
        src="https://david-hall.github.io/vzome-sharing/2025/06/22/15-33-37-ChestahedronApproximation/ChestahedronApproximation.png" >
  </vzome-viewer>

  <figcaption style="text-align: center; font-style: italic;">
    Chestahedron
  </figcaption>
</figure>
