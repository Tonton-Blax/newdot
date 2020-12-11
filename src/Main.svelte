<svelte:window bind:scrollY={Y} on:scroll={animate} />

<script>
  import { onMount, tick, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import Neige from './Neige.svelte'
  import anime from 'animejs/lib/anime.es.js'
  import Grain from './Grain.svelte'
  //import Pageweb from './Pageweb.svelte'
  import Sigle from './Sigle.svelte'
  import { currentStory, scrollDelta, ready, autoScroller } from './stores.js';

  const dispatch = createEventDispatcher();
  let clouds = [];
  let cloudsParents = [];
  let scroller;
  let viewport;
  let world;
  let oudot = [];
  let section1;
  let section2;
  let sigleContainer;
  let scrollerText = 'Faites défiler pour découvrir'
  let scrollReset = false;
  let tmp=0;

  let cloudAnim;

  let Y= 0;
  let lastY = 0;
  
  let scroll = {
    last : 0,
    down : 0,
    isScrolling : false
  }

  let scrollDeltaBrut = 0;
  let openCanvas = false;
  let fadeScrollerDuration = 0;
  
  let SPEED = 10000
	let worldXAngle = 0;
  let worldYAngle = 0;

 /* 
  $: if (megaReady && $ready[1] && Y >= lastY && $currentStory.stage === 'stageTwo') {
   reanimate();
  }
*/

  let newY;
  async function reanimate () {    
    if (!scroll.down || (window.innerHeight + window.scrollY) >= document.body.offsetHeight) return;
    scrollBy(0,5);
    requestAnimationFrame(reanimate)
  }

  function closest(needle, haystack) {
    return haystack.reduce((a, b) => {
        let aDiff = Math.abs(a - needle);
        let bDiff = Math.abs(b - needle);

        if (aDiff == bDiff) {
            return a > b ? a : b;
        } else {
            return bDiff < aDiff ? b : a;
        }
    });
  }

  const onload = (node) => {
    console.log('on load');
  }

  //$: $ready[2] = scrollReset && cloudAnim.progress < 10

  let scaleFactor = closest( innerWidth / 1920,  [0.5, 1, 1.5, 2, 4]);
       
  async function animate () {
    $scrollDelta = scrollDeltaBrut = (cloudAnim.progress - scroll.last) * 65
    scroll.down = cloudAnim.progress >= scroll.last;
    scroll.last = cloudAnim.progress;
    $ready[1] = false;
    window.clearTimeout( scroll.isScrolling );
    
    openCanvas = Y > 20;

		scroll.isScrolling = setTimeout(function() {
      $ready[1] = true;
      $scrollDelta = scrollDeltaBrut = 0;
      scroller.style.marginTop = openCanvas ? '85vh' : '70vh';
    }, 100);

    if (!scroll.down && cloudAnim.progress < 10 && tmp > 1) {
      cloudAnim.restart();
      scrollerText = 'Cliquez Pour rejouer'
      scroller.style.cursor = 'pointer'
      scrollReset = true;
      tmp=0;
    }
    cloudAnim.seek(cloudAnim.duration * (Y/9000) + 300);
    await tick;
  }

  onMount(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  $ready[2] = false;
  $ready[3] = false;
  $currentStory.stage = 'stageOne';
  $currentStory.refresh = true;
  openCanvas = false;
  $ready[1] = true
  dispatch('readygo', {});
  //$ready[1]=true;
  /*
  const observer = new window.IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      //$ready[3] = scroll.down;  // <---------- TRIGGER AFFICHAGE PAGE WEB
      return
    }
    if (entry.boundingClientRect.top > 0)
      $ready[3] = false;  //console.log("BELOW")
  }, { root: null, threshold: 0, rootMargin: '-25% 0% -40% 0%', })

    observer.observe(section2);
*/
    cloudAnim = anime.timeline({
      targets: clouds,
      autoplay : false,
      direction:'alternate',
      loop:true,
    })
    .add({
      targets: cloudsParents,
      translateX: [anime.stagger([-1600 * scaleFactor, -900 * scaleFactor]), 1300 * scaleFactor],
      translateY: `-=${-2200 * -scaleFactor}`,
      easing: 'linear',
      delay: anime.stagger(200 * scaleFactor),
      duration:6000,
    })
    .add({
      targets:oudot[0],
      opacity: [0,1],
      duration:1000,
      easing: 'easeInSine',
    }, '-=3400')
    .add({
      targets:oudot[1],
      changeBegin: function () { 
        $ready[2] = scroll.down 
        if ($currentStory.stage !== 'stageOne') {
          $currentStory.stage = 'stageOne';
          $currentStory.refresh = true
        }
      },
      opacity: [0,1],
      duration:1000,
      easing: 'linear',
    },'-=2400')
    .add({
      targets:'#galaxie-bg',
      opacity: [0,1],
      duration:1500,
      changeBegin: function () 
      {
        $ready[2] = scroll.down
        if ($currentStory.stage !== 'stageTwo') {
          $currentStory.stage = 'stageTwo';
          $currentStory.refresh = true
        }
      },
      easing: 'easeInOutSine',
    },'-=2100')
   
  });
</script>
<!-- <div class="relou" class:jeanpierre={openCanvas}></div> -->
<div class="barrehaut" class:jeanpierre={openCanvas}></div>
<div class="barrebas"  class:jeanmarc={openCanvas}></div>

<Grain >

  <div class="scroller" bind:this={scroller} on:click={() => scrollReset ? location.reload() : () => {} } >
  {#if $ready[1]}
    <img 
      width="{32 * scaleFactor}px" in:fade={{duration:1000}} out:fade={{duration:300}} src="../scroller.svg" alt="pingouin">
  <h3 in:fade={{duration:1000}} out:fade={{duration:300}} >{scrollerText}</h3>
  {/if}
  </div>

  <div class="box" style="margin-top:0;">
    
    <div class="sigle" bind:this={sigleContainer} style="transform: scale({window.innerWidth >= 700 ? '0.55' : '0.35'})">
      <Sigle />
    </div>
    
    <h1 bind:this={oudot[0]}>OUDOT</h1>
    <h5 bind:this={oudot[1]}>Vous souhaite<br>une excellente<br>année 2021</h5>
  </div>

  <section id="section1" bind:this={section1} class:detached={$ready[3]}>

    <Neige {openCanvas} {scrollDeltaBrut} />

    <div id="viewport" bind:this={viewport}>
      <div id="world" bind:this={world} >
        
          <div class="cloudBase" bind:this={cloudsParents[0]}
          style="transform:translateX(12px) translateY(0px) translateZ(0px)"> 

            <div class="pingouin">
            <div class="nuage cloudlayer1" bind:this={clouds[0]}
            style="transform: rotateY(0deg) rotateX(0deg)  translateX({-1150 * scaleFactor}px) translateY({1050 * scaleFactor}px) translateZ({300 * scaleFactor}px) rotateZ(0deg) scale({1.5 * scaleFactor});">
            </div>
            </div>

            <div class="pingouin">
            <div class="nuage2 cloudlayer2" bind:this={clouds[1]}
            style="transform: rotateY(0deg) rotateX(0deg)  translateX({-300 * scaleFactor}px) translateY({1000 * scaleFactor}px) translateZ({360 * scaleFactor}px) rotateZ(90deg) scale({1 * scaleFactor});">
            </div>
            </div>

          </div>

          <div class="cloudBase" bind:this={cloudsParents[1]}
          style="transform:translateX(20px) translateY(-10px) translateZ(0px)" > 

            <div class="pingouin">
            <div class="nuage2 cloudlayer3" bind:this={clouds[2]}
            style="transform: rotateY(0deg) rotateX(0deg)  translateX({-320 * scaleFactor}px) translateY({720 * scaleFactor}px) translateZ({105 * scaleFactor}px) rotateZ(-27deg) scale({1.7 * scaleFactor});">
            </div>
            </div>

            <div class="pingouin">
            <div class="nuage cloudlayer4" bind:this={clouds[3]}
            style="transform: rotateY(0deg) rotateX(0deg)  translateX({-250 * scaleFactor}px) translateY({900 * scaleFactor}px) translateZ({195 * scaleFactor}px) rotateZ(90deg) scale({2.5 * scaleFactor});">
            </div>
            </div>
            <div class="pingouin">
              <div class="nuage cloudlayer5" bind:this={clouds[4]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({-670 * scaleFactor}px) translateY({14000 * scaleFactor}px) translateZ({365 * scaleFactor}px) rotateZ(90deg) scale({0.8 * scaleFactor});">
              </div>
            </div>
            
          </div>

          <div class="cloudBase" bind:this={cloudsParents[2]}
          style="transform:translateX(30px) translateY(0px) translateZ(0px)" > 
            
            <div class="pingouin">
            <div class="nuage cloudlayer6" bind:this={clouds[5]}
            style="transform: rotateY(0deg) rotateX(0deg)  translateX({-100 * scaleFactor}px) translateY({550  * scaleFactor}px) translateZ({100 * scaleFactor}px) rotateZ(15deg) scale({2 * scaleFactor});">
            </div>
            </div>

            <div class="pingouin">
            <div class="nuage2 cloudlayer7" bind:this={clouds[6]}
            style="transform: rotateY(0deg) rotateX(0deg)  translateX({-270 * scaleFactor}px) translateY({720 * scaleFactor}px) translateZ({440 * scaleFactor}px) rotateZ(60deg) scale({1 * scaleFactor});">
            </div>
            </div>

            <div class="pingouin">
              <div class="nuage cloudlayer8" bind:this={clouds[7]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({270 * scaleFactor}px) translateY({790 * scaleFactor}px) translateZ({200 * scaleFactor}px) rotateZ(60deg) scale({2 * scaleFactor});">
              </div>
            </div>
          </div>
      </div>  
    </div>
  </section>


  <div class="galaxie cosmos"> </div>
  <div id="galaxie-bg" />

</Grain>



<!--
<div bind:this={section2} class="detached">
  
    <div>
      <Pageweb />
    </div>
  
</div>
-->
<style>

  .galaxie {
    background-color: #814e12;
    position: absolute;
    background: radial-gradient(ellipse at center, #814e12, black);
    height:100%;
    opacity:1;
    min-width:100vw;
    /* transition: background-color 2s ease-out; */
    z-index: -10;
  }

  #galaxie-bg {
    background: url(../galaxie.jpg);
    width: 1000%;
    height: 1000%;
    position: fixed;
    animation: rotating-cosmos 145s linear infinite;
    top: -500%;
    left: -500%;
    z-index:-1;
  }

  .sigle {
    margin-bottom:13rem;
  }

.barrehaut, .barrebas {
  position: fixed;
  width: 100vw;
  height: 15vh;
  background: black!important;
  left: 0px;
  z-index: 21;
  transform: translateY(0%);
  transition: all 2s ease-out;
}

.barrehaut {
  top: 0px;
}
.barrebas {
  bottom:0px;
}

.jeanpierre {
  transform: translateY(-100%)
  /* clip-path: polygon(100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%, 0 0%, 100% 0%); */
}

.jeanmarc {
  transform: translateY(100%)
}

.box {
  position: fixed;
  left: 50%;
  top: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}
.box h1 {
  font-size:8.5rem;
  font-weight:600;
  letter-spacing: 1.45rem;
  /*
  text-shadow: 0 0 10px rgb(255, 255, 255, 0.2), 
  0 0 20px rgb(255, 255, 255, 0.2), 
  0 0 50px  rgb(255, 255, 255, 0.2), 
  0 0 60px  rgb(34, 141, 255, 0.2), 
  0 0 90px  rgb(34, 141, 255, 0.2), 
  0 0 120px rgb(34, 141, 255, 0.2), 
  0 0 150px rgb(34, 141, 255, 0.2), 
  0 0 210px rgb(34, 141, 255, 0.2);
  */
}
.box h5 {
  margin-top:3.5rem;
  font-size:2.5em;
  font-weight: 200;
  color:white;
  text-transform: uppercase;
  letter-spacing: 1rem;
  line-height: 3.2rem;
}
.detached {
  position: absolute!important;
  z-index:200;
  width:fill-available;
}
.detached:after {
  box-shadow: none;
}
h1 {
  font-size: 18px;
  font-family: 'Montserrat', sans-serif;
  color:white;
  margin-bottom:0px;
  line-height:32px;
}
.scroller {
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 150;
  width: 100vw;
  margin-top: 70vh;
  justify-content:center;
  align-items: center;
  opacity:0.65;
}
.scroller > h3 {
  color:white;
  font-size:18px;
  font-weight:300;
}
section {
  position: fixed;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 100vw;
  max-height: 100vh;
  height:100vh;
  overflow:hidden;
  transition: all 2s ease-out;
  z-index:20;
}

section:after {
  content: '';
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  box-shadow: inset 0px 0px 150px 60px rgba(0,0,0,0.8);
/*  transition: box-shadow 1s ease-out; */
}

#viewport {
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
  perspective: 500px;
  height:100vh;
}
#world {
  height: 1024px;
  left: 50%;
  margin-left: -512px;
  margin-top: -512px;
  position: absolute;
  top: 50%;
  transform-style: preserve-3d;
  width: 1024px;
  transform: translateZ(0) translateY(500px);
  /* background: linear-gradient(54deg, rgba(73,8,107,1) 0%, rgba(28,75,135,1) 51%, rgba(195,48,48,1) 100%); */
}
	
.cloudBase {
  height: 20px;
  left: 512px;
  margin-left: -20px;
  margin-top: -20px;
  position: absolute;
  top: 512px;
  width: 40px;
  transform-style: preserve-3d;  
}
.nuage:after {
  animation: rotating 45s linear infinite;
}
.nuage2:after {
  animation: rotating-ccw 59s linear infinite;
}

.cloudlayer1:after, .cloudlayer6:after {
  background-image: url('../cloud-01-mob.png');
}
.cloudlayer2:after, .cloudlayer5:after {
  background-image: url('../cloud-02-mob.png');
}
.cloudlayer3:after {
  background-image: url('../cloud-03-mob.png');
}
.cloudlayer4:after {
  background-image: url('../cloud-04-mob.png');
}

.nuage:after, .nuage2:after{
  content: "";
  height: 512px;
  left: 50%;
  padding-left:256px;
  margin-left: -256px;
  margin-top: -256px;
  position: absolute;
  top: 50%;
  width: 512px;
  overflow:visible;
  background-size: 512px 468px;
  background-repeat: no-repeat;
  background-position: center;
  transform:translate3d(0,0,0);
}
@keyframes rotating {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}
@keyframes rotating-ccw {
  from {
    transform: rotateZ(360deg);
  }
  to {
    transform: rotateZ(0deg);
  }
}

@keyframes rotating-cosmos {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}
.pingouin {
  height: 512px;
  width: 512px;
  left: 50%;
  top: 50%;
  padding-left:256px;
  margin-left: -256px;
  margin-top: -256px;
  position: absolute;
}
:global(body) {
  width: 100vw;
  height: 1000vh;
  margin: 0!important;
  padding: 0!important;
  scroll-behavior: smooth;
}


@media screen and (min-width: 2500px) {
  :global(body) {
    height:700vh!important;
  }
  .box {
    transform: translate(-50%, -50%) scale(1.5);
  }
  .scroller > h3 {
    font-size:36px;
    font-weight:300;
  } 
}

@media screen and (max-width: 1024px) {
  :global(body) {
    min-width:min-content;
    height:1200vh;
  }
  .jeanpierre {
    min-height: fill-available;
    height:min-content;
  }
  section {
    width: fill-available;
    min-height: fill-available;
    transition : all 2s ease-out;

  }
  #viewport {
    height:fill-available;
  }
  .box h1 {
    font-size:4rem;
    font-weight:600;
    letter-spacing: 1rem;
  }
  .box h5 {
    margin-top:3rem;
    font-size:1em;
    font-weight: 200;
    color:white;
    text-transform: uppercase;
    letter-spacing: 0.7rem;
    line-height: 1.2rem;
  }
  .scroller{
    width:100%;
    margin-top:87vh;
  }
}

</style>
