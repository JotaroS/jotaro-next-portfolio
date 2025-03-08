---
type: 'Research'
title: 'Transcalibur: A Weight Shifting Virtual Reality Controller for 2D Shape Rendering based on Computational Perception Model'
date: '2019-01-01'
tags: ['research']
abstract: 'HugoからNext.jsへ移行し、AIツールを活用しながらポートフォリオサイトを構築した記録。'
thumbnail: '/posts/building-blog.webp'
---



### Downloads:
<a href='/transcalibur/shigeyama-preprint.pdf'>Preprint Paper (PDF 7MB)</a>  //   <a href='/transcalibur/transcalibur-movie.mp4'> Movie (MP3 20MB)</a>   //     <a href='/transcalibur/presskit.zip'> Press Kit (ZIP Archive 20MB)</a>


---
<center>
<iframe className='self-center' width="560" height="315" src="https://www.youtube.com/embed/OiSbn6D5kwA?si=FWtMajNyr92leyz3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</center>

---
<br>
<center> Transcalibur: A Weight Shifting Virtual Reality Controller<br> for 2D Shape Rendering based on Computational Perception Model</center>

#### Abstract
Humans can estimate the shape of a wielded object through the illusory feeling of the mass properties of the object obtained using their hands. Even though the shape of hand-held objects influences immersion and realism in virtual reality (VR), it is difficult to design VR controllers for rendering desired shapes according to the perceptions derived from the illusory effects of mass properties and shape perception. We propose Transcalibur, which is a hand-held VR controller that can render a 2D shape by changing its mass properties on a 2D planar area. We built a computational perception model using a data-driven approach from the collected data pairs of mass properties and perceived shapes. This enables Transcalibur to easily and effectively provide convincing shape perception based on complex illusory effects. Our user study showed that the system succeeded in providing the perception of various desired shapes in a virtual environment.  

#### Award:

<img src='/img/hm.png' style='width:30px; min-height:30px; margin-bottom:0px;'> This paper has been awarded a Best Paper Honorable Mention at CHI2019.

---

<img src='/img/transcalibur-teaser.png' width='100%'>

---

<img src='/img/transcalibur-neu.jpg' width='100%'>

---

<img src='/img/transcalibur-neu-zwei.JPG' width='100%'>

---

#### Hardware

The weight moving mechanism is designed to move along the 2D planner space and to be _non-backdrivable_. The _angular mechanism_ enables to rotate two arms, and _weight mechanisms_ enable to shift the position of the weight module independently.

<center> <img class='half' src='/img/transform.gif'> <img class='half' src='/img/transcalibur-hardware.png'></center>

---

#### Computational Perception Model

Based on the object shown in VR, the shape of the controller that users grasp is dynamically changed so that its shape perception matches the target object.
In our system, we create a computational model that maps mass properties to haptically perceived shape using a data-driven approach.
We correct the perceived shape data of the VR controller with different mass properties through a perceptual experiment and map these data using regression.
From the model, we determine the mass properties of the VR controller that optimizes the perceived shape of the controller to be the target object shown in virtual environment (VE).
In this manner, we can easily and efficiently render an arbitrary 2D shape through the controller.


We assumed a perception model $f$ that maps the physical configuration of the controller $\phi$ to the perceived shape of the wielded object in VR $\psi$:

$$
f: \phi \mapsto \psi
$$

<img src='/img/transcalibur-approach.png'>




---

#### Experiments / Results
In the data collection experiment, we provided the participants with various shapes of the controller and asked them to report the perceived shapes in VE.
This generates matched pairs of $(\phi_i,\psi_i)$, which are used to build a regression model for the training data. Using the obtained data pairs, we performed regression analysis to build a map $f$ from the configurations of the controller onto the perceived shapes.


<img src='/img/dataCollection.jpg'>

--- 

To measure the validity of the perception model, we conducted validation experiments. The ten virtual shapes were manually determined such that variations in height, width, symmetricity, and asymmetricity of the target shapes could be evaluated. Overall, our perception model succeeded in providing various target shapes in VR for Transcalibur, leaving a few shapes with confusions on shapes 4 and 5 or 8 and 9.

<img src='/img/transcalibur-outputlist.png'>


<center><img class='half' src='/img/transcalibur-confusionmat.png'></center>

---

#### Conclusion

In this paper, we introduced Transcalibur: the weight moving VR controller for 2D haptic shape illusion.
We implemented a hardware prototype, which can change its mass property in 2D planar space, and applied data-driven methods to obtain maps between mass property and perceived shape.
Based on the demonstration and experiment, we succeeded in rendering various shape perceptions through the controller based on pre-computed perception model.
As a future work, we further investigate details on time factor of shape changing in VR, and we aim to develop a simpler design and yet maximizes range of rendering shape.

---
<br>

CHI2019 Technical Paper

___Transcalibur: A Weight Shifting Virtual Reality Controller for 2D Shape Rendering based on Computational Perception Model___

#### Authors:

- [Jotaro Shigeyama](https://jotaros.github.io)
- [Takeru Hashimoto](https://takeruace.github.io/)
- [Shigeo Yoshida](http://www.shigeodayo.com)
- [Takuji Narumi](http://www.cyber.t.u-tokyo.ac.jp/~narumi/)
- [Tomohiro Tanikawa](http://www.cyber.t.u-tokyo.ac.jp/)
- and [Michitaka Hirose](https://twitter.com/_anohito)


#### Downloads:

<a href='/transcalibur/shigeyama-preprint.pdf'>Preprint Paper (PDF 7MB)</a> -//-  <a href='/transcalibur/transcalibur-movie.mp4'> Movie (MP3 20MB)</a>  -//-    <a href='/transcalibur/presskit.zip'> Press Kit (ZIP Archive 20MB)</a>


#### Acknowledgement:

We thank Yuji Suzuki and Isamu Ohashi for their help during the SIGGRAPH2018 e-tech exhibition. We thank Leo Matsumura for the engineering and development of next-version prototype "Transcalibur-neu".

#### Archive:

Previously presented SIGGRAPH2018 E-tech Promotion can be seen [here.](http://www.cyber.t.u-tokyo.ac.jp/~jotaro/transcalibur_web/)
