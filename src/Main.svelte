<svelte:window bind:scrollY={Y} on:scroll={animate} />

<script>
  import { onMount, tick, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import Neige from './Neige.svelte'
  import anime from 'animejs/lib/anime.es.js'
  import Grain from './Grain.svelte'
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

  let checkDevice = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  let isMobile = checkDevice();

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

  let animAjust = isMobile ? 600 : 300;

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

  let scaleFactor = closest( innerWidth / 1920,  [0.7, 1, 1.5, 2, 4]);
       
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

    $ready[5] = cloudAnim.progress > 90;

    cloudAnim.seek(cloudAnim.duration * (Y/9000) + animAjust);
    await tick;
  }

  onMount(async () => {
    console.log("sur desktop : ", isMobile);

    const initialValues = { //true : mobile
      x2 : {
        false : 1300,
        true : 500
      },
      x1 : {
        false: -1600,
        true : -1600
      },
      x1p : {
        false: -900,
        true: -1500
      },
      y1 : {
        false:-2200,
        true:-2200
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    $ready[2] = false;
    $ready[3] = false;
    $currentStory.stage = 'stageOne';
    $currentStory.refresh = true;
    openCanvas = false;
    dispatch('readygo', {});
    $ready[1] = true

      cloudAnim = anime.timeline({
        targets: clouds,
        autoplay : false,
        direction:'alternate',
        loop:true,
      })
      .add({
        targets: cloudsParents,
        translateX: [anime.stagger([initialValues.x1[isMobile] * scaleFactor, initialValues.x1p[isMobile] * scaleFactor]), initialValues.x2[isMobile] * scaleFactor],
        translateY: `-=${initialValues.y1[isMobile] * -scaleFactor}`,
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
          if ($currentStory.stage !== 'stageOne') 
          {
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
        changeComplete: function () {$ready[2] = scroll.down},
        easing: 'easeInOutSine',
      },'-=2100'
    )
  });

</script>
<!-- <div class="relou" class:jeanpierre={openCanvas}></div> -->
<div class="barrehaut" class:jeanpierre={openCanvas}></div>
<div class="barrebas"  class:jeanmarc={openCanvas}></div>

<Grain >

  <div class="scroller" bind:this={scroller} >
  {#if $ready[1]}
    <img class:reverse={$ready[5]}
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

          {#if !isMobile}
            <div class="pingouin">
              <div class="nuage cloudlayer1" bind:this={clouds[0]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({-400 * scaleFactor}px) translateY({750 * scaleFactor}px) translateZ({100 * scaleFactor}px) rotateZ(0deg) scale({1.8 * scaleFactor});">
              <img src="../cloud-01-mob.png" alt="nuage">
              </div>
            </div>
          {/if}

            <div class="pingouin">
              <div class="nuage2 cloudlayer2" bind:this={clouds[1]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({-300 * scaleFactor}px) translateY({1000 * scaleFactor}px) translateZ({360 * scaleFactor}px) rotateZ(90deg) scale({1 * scaleFactor});">
              <img src="../cloud-02-mob.png" alt="nuage">
              </div>
            </div>

          </div>

          <div class="cloudBase" bind:this={cloudsParents[1]}
          style="transform:translateX(20px) translateY(-10px) translateZ(0px)" > 

          {#if !isMobile}

            <div class="pingouin">
              <div class="nuage2 cloudlayer3" bind:this={clouds[2]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({-320 * scaleFactor}px) translateY({720 * scaleFactor}px) translateZ({105 * scaleFactor}px) rotateZ(-27deg) scale({1.7 * scaleFactor});">
              <img src="../cloud-03-mob.png" alt="nuage">
              </div>
            </div>

          {/if}
            
            <div class="pingouin">
              <div class="nuage cloudlayer5" bind:this={clouds[4]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({-670 * scaleFactor}px) translateY({1000 * scaleFactor}px) translateZ({365 * scaleFactor}px) rotateZ(90deg) scale({0.8 * scaleFactor});">
              <img src="../cloud-02-mob.png" alt="nuage">  
              </div>
            </div>
            
          </div>

          <div class="cloudBase" bind:this={cloudsParents[2]}
          style="transform:translateX(30px) translateY(0px) translateZ(0px)" > 
            
            <div class="pingouin">
              <div class="nuage cloudlayer6" bind:this={clouds[5]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({-100 * scaleFactor}px) translateY({550  * scaleFactor}px) translateZ({100 * scaleFactor}px) rotateZ(15deg) scale({2 * scaleFactor});">
              <img src="../cloud-01-mob.png" alt="nuage">
              </div>
            </div>

          {#if !isMobile}

            <div class="pingouin">
              <div class="nuage2 cloudlayer7" bind:this={clouds[6]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({-270 * scaleFactor}px) translateY({720 * scaleFactor}px) translateZ({440 * scaleFactor}px) rotateZ(60deg) scale({1 * scaleFactor});">
              <img src="../cloud-01-mob.png" alt="nuage">
              </div>
            </div>

            <div class="pingouin">
              <div class="nuage cloudlayer8" bind:this={clouds[7]}
              style="transform: rotateY(0deg) rotateX(0deg)  translateX({270 * scaleFactor}px) translateY({790 * scaleFactor}px) translateZ({200 * scaleFactor}px) rotateZ(60deg) scale({2 * scaleFactor});">
              <img src="../cloud-01-mob.png" alt="nuage">  
              </div>
            </div>
          {/if}
          </div>
      </div>  
    </div>
  </section>


  <div class="galaxie cosmos"> </div>
  <div id="galaxie-bg" style="background: url({ !isMobile ? '../galaxie.jpg' : '../galaxie-mob.jpg'});"/>

</Grain>

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
  will-change:transform;
  left: 0px;
  z-index: 21;
  transform: translateY(0%);
  opacity:1;
  transition: all 3s ease-out;
}

.barrehaut {
  top: 0vh;
}
.barrebas {
  bottom:0vh;
}

.jeanpierre {
  transform: translateY(-25vh);
  /* clip-path: polygon(100% 0, 0 0, 0 100%, 100% 100%, 100% 100%, 0 100%, 0 0%, 100% 0%); */
}

.jeanmarc {
  transform: translateY(25vh);
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
.reverse {
  transform: rotateZ(180deg);
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
  will-change:transform;
}
.nuage img {
  animation: rotating 45s linear infinite;
}
.nuage2 img {
  animation: rotating-ccw 59s linear infinite;
}

.nuage img, .nuage2 img{
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

  section {
    width: fill-available;
    min-height: fill-available;
    transition : all 2s ease-out;
  }
  section::after {
    width:auto;
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
