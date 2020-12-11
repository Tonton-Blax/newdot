<script>
  import { onMount } from 'svelte';
  import * as PIXI from 'pixi.js'
  import { Pixi } from 'svelte-pixi'
  import { rotation, currentStory, scrollDelta, ready } from './stores.js';
  import Filantes from './Filantes.svelte'
  export let scrollDeltaBrut;

  const { Application, Graphics } = PIXI
  // App constraints
  const F_UPPER_LIMIT_Y = 10
  const F_UPPER_LIMIT_X = 2
  const F_LOWER_LIMIT_X = -2
  const F_MAX_SIZE = 64
  const F_MIN_SIZE = 1
  let F_AMOUNT = {
    'stageOne' : innerWidth > 1024 ? 10 : 2,
    'stageTwo' : 0
  }
  const F_COLOR = 0xffffff
  const F_MAXROTATIONSPEED = 0.26 // Entre 0 et 1
  const UPPER_LIMIT_Y = 10
  const UPPER_LIMIT_X = 5
  const LOWER_LIMIT_X = -5
  const MAX_SIZE = 30
  const MIN_SIZE = 1
  let AMOUNT = {
    'stageOne' : innerWidth > 1024 ? 850 : 250,
    'stageTwo' : innerWidth > 1024 ? 250 : 125
  }
  const COLOR = 0xffffff
  const SIZES = innerWidth < 2000 ? [2,2,2,2,2,2,2,3,3,3,3,5,5,8,8,10,12,14,18,20] : [4,4,4,4,4,4,4,6,6,6,6,10,10,16,16,20,24,28,36,40]
  const F_SIZES = innerWidth < 2000 ? [10,10,50,50,50,50,204] : [20,20,100,100,100,100,408]


  const COLORS = {
    'stageOne' : [0xbe8b1d, 0x8f6a1b, 0xc9ad34, 0xd19017, 0xc28e2d, 0xd19017, 0xd19017],
    'stageTwo' : [0xCCCCFD, 0xCCCCFF, 0xCCCCFF, 0xCCCCEF, 0xCCCCFF, 0xCCCCF2, 0xCCCCFE]
  }


  let f_localRandom;
  const neige = new Application({
    antialias: false,
    transparent: true,
      rotation: true,
    alpha: true,
    sharedTicker:false
  })
  const drops = new PIXI.ParticleContainer(AMOUNT[$currentStory.stage], {
    scale: true,
    position: true,
    rotation: true,
    alpha: true,
  })
  const flocons = new PIXI.ParticleContainer(F_AMOUNT[$currentStory.stage], {
    scale: true,
    position: true,
    rotation: true,
    alpha: true,
  })
  neige.stage.addChild(flocons)
  neige.stage.addChild(drops)
  
  let texture = PIXI.Texture.from('../flocon_white.png');
  let f_texture = PIXI.Texture.from('../sigle_oudot_big_blur.png');
  

  const floored = v => Math.floor(Math.random() * v)
  // Update value by either subtracting to adding
  const f_update = p =>
    Math.random() > 0.5
      ? Math.max(F_LOWER_LIMIT_X + scrollDeltaBrut, p - 1 + scrollDeltaBrut)
      : Math.min(p + 1, F_UPPER_LIMIT_X)
  // Generate a particle set based on a given f_texture
  let hasBigOne = false;

  const genParticles = (t) =>
    new Array(AMOUNT[$currentStory.stage]).fill().map(p => {
      //const SIZE = floored(MAX_SIZE) + MIN_SIZE
      const SIZE = SIZES[Math.round(Math.random() * SIZES.length)];
      p = new PIXI.Sprite(t);
      p.size = SIZE
      p.vx = floored(UPPER_LIMIT_X) - UPPER_LIMIT_X
      p.vy = floored(UPPER_LIMIT_Y) + 2
      p.alpha = Math.random()
      p.x = p.startX = floored(neige.renderer.width)
      p.y = p.startY = -(SIZE + floored(neige.renderer.height))
      p.width = p.height = SIZE

      p.anchor.set(0.5);
      f_localRandom = Math.random();
      p.randomRotation = f_localRandom > F_MAXROTATIONSPEED ? 0.09 : f_localRandom;
      // p.scale.x = 5
      p.tint = getRandomColor()
      drops.addChild(p)
      return p
  })

  const f_genParticles = (t) =>
    new Array(F_AMOUNT[$currentStory.stage]).fill().map((p,idx, that) => {
      //const SIZE = floored(F_MAX_SIZE) + F_MIN_SIZE
      let SIZE = F_SIZES[Math.floor(Math.random() * F_SIZES.length)];
      if (SIZE === F_SIZES[F_SIZES.length - 1])
        hasBigOne = true;
      if (idx+1 === that.length && !hasBigOne) {
        SIZE = F_SIZES[F_SIZES.length - 1];
      }
      p = new PIXI.Sprite(t)
      p.size = SIZE
      p.vx = floored(F_UPPER_LIMIT_X) - F_UPPER_LIMIT_X
      p.vy = floored(F_UPPER_LIMIT_Y) + 2
      p.alpha = Math.random()
      p.x = p.startX = floored(neige.renderer.width)
      p.y = p.startY = -(SIZE + floored(neige.renderer.height))
      p.width = p.height = SIZE
      p.anchor.set(0.5);
      f_localRandom = Math.random();
      p.randomRotation = f_localRandom > F_MAXROTATIONSPEED ? 0.09 : f_localRandom;
      // p.scale.x = 5
      p.tint = getRandomColor()
      flocons.addChild(p)
      return p
    })
  
    const getRandomColor = () => COLORS[$currentStory.stage][ Math.floor(Math.random() * 7) ]
      
    let particles = genParticles(texture)
    let f_particles = f_genParticles(f_texture)
  
    // Update value by either subtracting to adding
  const update = p =>
    Math.random() > 0.5
      ? Math.max(LOWER_LIMIT_X + scrollDeltaBrut, p - 1 + scrollDeltaBrut)
      : Math.min(p + 1, UPPER_LIMIT_X)
  // Reset particle start points based on screen

  const reset = p => {
    p.x = floored(neige.renderer.width)
    p.y = -(p.size + floored(neige.renderer.height)) /* + $scrollDelta */
    p.vy = floored(UPPER_LIMIT_Y) + 2
  }


  ///////////// STARS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const starTexture = PIXI.Texture.from('../flare_2.png');
const starAmount = innerWidth > 1024 ? 350 : 150
let cameraZ = 5;
const fov = 20;
const baseSpeed = 0.025;
let speed = 0;
let warpSpeed = 0.05;
const starStretch = 3;
const starBaseSize = 0.25;

// Create the stars
const stars = [];
for (let i = 0; i < starAmount; i++) {
    const star = {
        sprite: new PIXI.Sprite(starTexture),
        z: 0,
        x: 0,
        y: 0,
    };
    star.sprite.alpha = 0;
    star.sprite.anchor.x = 0.5;
    star.sprite.anchor.y = 0.7;
    star.sprite.tint = [0xFFFFFF, 0xFFEEAA, 0xFEFEFE, 0xEEDD00] [Math.floor(Math.random()*4)];  // added
    randomizeStar(star, true);
    neige.stage.addChild(star.sprite);
    stars.push(star);
}

function randomizeStar(star, initial) {
    star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

    // Calculate star positions with radial random coordinate so no star hits the camera.
    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 25 + 1;
    star.x = Math.cos(deg) * distance;
    star.y = Math.sin(deg) * distance;
}


  ///////////// TICKER ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  neige.ticker.add(delta => {
    scrollDelta.duration = delta
    $rotation = ($rotation+1)%360
    if (neige.renderer.height !== innerHeight || neige.renderer.width !== innerWidth || $currentStory.refresh)
    {
      neige.renderer.resize(innerWidth, innerHeight)
      flocons.removeChildren()
      f_particles = f_genParticles(f_texture)
      drops.removeChildren()
      particles = genParticles(texture)
       for (let i = 0; i < starAmount; i++) {
          const star = stars[i];
          star.sprite.alpha = 0;
       }
    }

    for (let particle of f_particles) {
      if (particle.y > 0) 
        particle.x += particle.vx
      particle.y += particle.vy - (scrollDeltaBrut < 0 ? scrollDeltaBrut : 0);
      particle.rotation += particle.randomRotation;
      if (Math.random() > 0.9) 
        particle.vx = f_update(particle.vx, false)
          // if (Math.random() > 0.9) particle.vy = Math.min(particle.vy + 1, F_UPPER_LIMIT_Y)
      if (particle.x > neige.renderer.width || particle.x < 0 || particle.y > neige.renderer.height)
        reset(particle)
    }

    for (let particle of particles) {
      if ($currentStory.refresh) particle.tint = getRandomColor()
      if (particle.y > 0) 
        particle.x += particle.vx
      particle.y += particle.vy - (scrollDeltaBrut < 0 ? scrollDeltaBrut : 0);
      particle.rotation += particle.randomRotation;

      if (Math.random() > 0.9) 
        particle.vx = update(particle.vx)
      // if (Math.random() > 0.9) particle.vy = Math.min(particle.vy + 1, UPPER_LIMIT_Y)
      if (particle.x > neige.renderer.width || particle.x < 0 || particle.y > neige.renderer.height)
        reset(particle)
    }

    // STARS TICKER /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if ($currentStory.stage !== 'stageOne') {
      speed += (warpSpeed - speed + ($scrollDelta * 0.02)) / 2;
      cameraZ += delta * 10 * (speed + baseSpeed);

      for (let i = 0; i < starAmount; i++) {
          const star = stars[i];
          
          if (star.sprite.alpha < 1) 
            star.sprite.alpha+=0.03
          
          if (star.z < cameraZ) randomizeStar(star);

          // Map star 3d position to 2d with really simple projection
          const z = star.z - cameraZ;
          
          star.sprite.x = star.x * (fov / z) * neige.renderer.screen.width + neige.renderer.screen.width / 2;
          star.sprite.y = star.y * (fov / z) * neige.renderer.screen.width + neige.renderer.screen.height/ 2;
          //star.sprite.y -= $scrollDelta;

          // Calculate star scale & rotation.
          const dxCenter = star.sprite.x - neige.renderer.screen.width / 2;
          const dyCenter = (star.sprite.y) - neige.renderer.screen.height / 2;
          const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter + dyCenter);
          const distanceScale = Math.max(0, (2000 - z) / 2000);
          star.sprite.scale.x = distanceScale * starBaseSize;
          // Star is looking towards center so that y axis is towards center.
          // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
          star.sprite.scale.y = distanceScale * starBaseSize + distanceScale * speed * starStretch * distanceCenter / neige.renderer.screen.width;
          star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
      }
    }

    $currentStory.refresh = false;
    //neige.renderer.render(flocons)
    //neige.renderer.render(drops)
    $ready[4] = true;
  })
  // Hook up blur modifier
  </script>
  
  {#if $currentStory.stage == 'stageTwo'}
    <Filantes />
  {/if}
  {#if $ready[4]}
  <Pixi app={neige} let:render>
  <div class="custom" use:render>
      <!-- some cool components -->
  </div>
  </Pixi>
  {/if}

  
  <style>
    
    :global(.custom canvas){
      max-height: 100vh;
      max-width: 100vw;
    }

    .custom {
      height:100vh;
      overflow:hidden;
      max-width:100vw;
      background:transparent;
    }

  @media screen and (max-width: 1024px) {
    .custom {
      max-width: fill-available;
      height:min-content;
    }
    :global(canvas) {
      color : #d19017;
      max-height: unset!important;
      max-width: unset!important;
    }
  }

</style>
