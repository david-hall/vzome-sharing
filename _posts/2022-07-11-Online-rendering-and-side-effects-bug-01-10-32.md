---
title: Online rendering and side effects bug
description: A vZome bug report.
image: https://david-hall.github.io/vzome-sharing/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.png
published: true
layout: vzome
---

{% comment %}
 - [***web page generated from this source***](<https://david-hall.github.io/vzome-sharing/2022/07/11/Online-rendering-and-side-effects-bug-01-10-32.html>)
 - [data assets and more info](<https://github.com/david-hall/vzome-sharing/tree/main/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/>)
 
{% endcomment %}

__{{ page.description }}__

__*Edit 7/11/2022*__
Scott promptly found and fixed the bug in the online debugger with the release of version 50. 

I can now locate the original problem with loading the actual model. The javascript console shows that 7 struts should be selected after the `SelectNeighbors` at edit number 154. It's finding none selected.

The following post describes the problem as it was originally reported.

There are at least two bugs in the current vZome online viewer/debugger (version 49) that are manifested in this model.
This model renders correctly in desktop 7.0.80. It takes about a minute to load in desktop, but closer to 15 minutes to load it from a local file in the vZome online debugger. It's a complex model in the 30-gon field, so the lengthy load times are to be expected.

The first problem is that in desktop, the model correctly opens, having two distinctive large groups of parallel struts selected as shown in the screen shot below, whereas online, one of the groups of parallel struts is completely missing. Online also logs `"warn ACCOMMODATION: null manifestation"` to the javascript console, which I assume is caused by a prior manifestation not being correctly generated or selected since the problem doesn't show up in desktop and neither does the ACCOMMODATION warning. Online also has several superfluous struts that are not present in the actual model as shown by desktop.

The second bug is in the [online debugger](https://www.vzome.com/app/?debug=true). Since desktop 7.0.80 does not include the new "effects exporter", I ran a build of desktop in Eclipse using the current master commit # dcec47b4037facd078a7811de7c0c9cb8905d228 and I exported the side-effects for this model and attempted to open that side-effects file in the online debugger. It opens OK, but as I step into the file, the debugger fails on the 9th command which is ImportColoredMeshJson. The browser console records the following error: `"getScene error: this.getXmlElementName is not a function"`. The online debugger has has no problem rendering the ImportColoredMeshJson command from the original vZome file. The problem with ImportColoredMeshJson only shows up when loading it in the debugger from the effects file. Because of the second issue, I can't get past that point as I try to debug the first issue.

The remote url to use in the online debugger is [https://raw.githubusercontent.com/david-hall/vzome-sharing/main/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.vZome](https://raw.githubusercontent.com/david-hall/vzome-sharing/main/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.vZome).
 
The remote url for the side-effects file is [https://raw.githubusercontent.com/david-hall/vzome-sharing/main/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.effects.vZome](https://raw.githubusercontent.com/david-hall/vzome-sharing/main/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.effects.vZome).
 
Here's the screen shot from desktop:

<img src="https://david-hall.github.io/vzome-sharing/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.png" />

Here's the rendering from shapes.json which is also correct.

<vzome-viewer style="width: 87%; height: 60vh; margin: 5%"
       src="https://david-hall.github.io/vzome-sharing/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.vZome" >
  <img src="https://david-hall.github.io/vzome-sharing/2022/07/11/01-10-32-Online-rendering-and-side-effects-bug/Online-rendering-and-side-effects-bug.png" />
</vzome-viewer>

