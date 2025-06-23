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

The Chestahedron is apparently the invention of Frank Chester. It is described on [his wesite](https://frankchester.com/).

The Chestahedron is a specific heptahedron having 4 equilateral triangular faces and 3 kite faces. By definition, all 7 faces of a Chestahedron have the same area. 
Many of the explanations on frankchester.com give reasonable approximations for the Chestahedron's coordinates in various orientations. 
Many of them, especially some of the 2D nets, are based on derivations from pentagonal constructions
and are very close approximations. Unfortunately, they often give the impression that they are exact geometric constructions, but in fact, they are just near misses.

I have been trying to find a closed form (algebraic) expression for a Chestaheron's coordinates. Given that it has 3-fold rotational symmetry, 
I made vZome and [GeoGebra](https://www.geogebra.org/m/ayw9hvau) models of it such that the axis of 3-fold symmetry is on the { 1, 1, 1 } vector 
and the vertices of the "base" triangular face are at { 1, 0, 0 }, { 0, 1, 0 } and { 0, 0, 1 }. 
I can then define the vertex where the 3 kites meet to be in the first (all positive) octant of 3D space.
 This orientation allows the coordinates of the 3 remaining triangular faces' vertices to be defined with just 2 positive numbers. I call them **a** and **b**,
 so their coordinates are { **b**, **a**, **a** }, { **a**, **b**, **a** } and { **a**, **a**, **b** }. 
 The vertex where the 3 kites meet will be called { **c**, **c**, **c** }.

 The "base" triangle has edge lengths of √2 and thus an area of √3/2. Since the areas of all of the faces are defined to be equal, 
 there is necessarily unique values for the variables that define the rest of the coordinetes.

 Given that all 7 coordinates can be given in terms of these 3 positive variables **a**, **b** and **c**, 
 I'm looking for a closed form expression for thase 3 variables as well as an explanation of how they can be calculated. 
 Please post any suggestions or ideas for calculating them on the vZome Discord server.
