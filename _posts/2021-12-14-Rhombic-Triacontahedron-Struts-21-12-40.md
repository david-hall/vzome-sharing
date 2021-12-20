---
title: vZome Online KaTeX Example
image: https://david-hall.github.io/vzome-sharing/2021/12/14/21-12-40-Rhombic-Triacontahedron-Struts/Rhombic-Triacontahedron-Struts.png
layout: vzome-katex
description: KaTeX Demo of Rhombic Triacontahedron. Click and drag for 3D viewing.
---

{% comment %}
 - [***web page generated from this source***][post]
 - [data assets and more info][github]

[post]: <https://david-hall.github.io/vzome-sharing/2021/12/14/Rhombic-Triacontahedron-Struts-21-12-40.html>
[github]: <https://github.com/david-hall/vzome-sharing/tree/main/2021/12/14/21-12-40-Rhombic-Triacontahedron-Struts/>
{% endcomment %}

This page uses [***KaTeX***](https:///katex.org) as mentioned at 
[stackoverflow](https://stackoverflow.com/questions/26275645/how-to-support-latex-in-github-pages/57370526#57370526).

Note that the value of `layout` in the Jekyl front matter of the markdown for this page is set to `vzome-katex`, not `vzome`.
This allows use of KaTeX on the same page as the `vzome-viewer`.

In order to use `vzome-katex` as the layout, 
I first had to make [vzome-katex.html](https://github.com/david-hall/vzome-sharing/blob/main/_layouts/vzome-katex.html)
in the `_layouts` folder of my `vzome-sharing` repo.

The following paragraph is a simple example of KaTeX. 

The diagonals of the rhombic triacontahedron's faces have a ratio of $$\frac 1 \phi $$ where 
$$\phi = \frac {1 + \sqrt{5}} {2} $$.

<vzome-viewer style="width: 100%; height: 65vh;"
       src="https://david-hall.github.io/vzome-sharing/2021/12/14/21-12-40-Rhombic-Triacontahedron-Struts/Rhombic-Triacontahedron-Struts.vZome" >
  <img src="https://david-hall.github.io/vzome-sharing/2021/12/14/21-12-40-Rhombic-Triacontahedron-Struts/Rhombic-Triacontahedron-Struts.png" />
</vzome-viewer>
