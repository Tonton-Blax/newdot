

<script>
   import { sineOut } from 'svelte/easing';
   import { ready } from './stores.js';  
   import { onMount, tick } from 'svelte';


   const TIMING = 130;
	const OFFSET = 100;
	function spin(node, { duration, delay, dimension = 'Y', deg = -90 }) {
      return {
        delay,
        duration,
        css: (t,u) => {
          const eased = sineOut(t);
          return `transform: rotate${dimension}(${u * deg}deg);`
        }
      };
    }
/*
   function setStage(stage) {
      $currentStory.stage = stage;
      $currentStory.refresh = true;
   }
*/

</script>
<!-- Generator: Adobe Illustrator 24.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
{#if $ready[2]}
<svg
   height="339.21982"
   width="339.21982"
   id="svg909"
   xml:space="preserve"
   viewBox="0 0 339.21982 339.21982"
   version="1.1"
   enable-background="new 0 0 500 500"> />
<path
	 transition:spin={{duration:1000, dimension:'X',}}
   style="stroke-width:2.53565407"
   id="gauche-petit" class="horizontal"
   d="m 50.484875,169.58455 c 0,17.01424 13.819315,30.83356 30.833554,30.83356 h 93.920631 v -11.2076 H 81.318429 c -10.827243,0 -19.625963,-8.79872 -19.625963,-19.62596 0,-8.3423 5.274161,-15.44213 12.627558,-18.28207 v -11.74007 c -13.64182,3.22028 -23.835149,15.44213 -23.835149,30.02214" />	
<path
	 transition:spin={{duration:1000, dimension:'X', delay:150}}
   style="stroke-width:2.53565407"
   id="gauche-moyen" class="horizontal"
   d="m 25.255116,169.58455 c 0,30.90963 25.153689,56.06331 56.063313,56.06331 H 175.23906 V 214.44027 H 81.318429 c -24.722628,0 -44.855722,-20.13309 -44.855722,-44.85572 0,-22.33911 16.431039,-40.87474 37.857317,-44.24716 v -11.33438 c -27.613274,3.47385 -49.064908,27.05543 -49.064908,55.58154" />
<path
   transition:spin={{duration:1000, dimension:'X', delay:300}}
	 style="stroke-width:2.53565407"
   id="gauche gros" class="horizontal"
   d="m 81.318429,239.67003 c -38.643369,0 -70.085481,-31.44211 -70.085481,-70.08548 0,-36.28521 27.689344,-66.20593 63.061719,-69.730489 V 88.64647 C 32.735295,92.221742 0,127.11234 0,169.58455 c 0,44.83037 36.462707,81.29307 81.293073,81.29307 H 175.2137 v -11.20759 z" />	
<path
	 transition:spin={{duration:1000, delay:250}}
   style="stroke-width:2.53565407"
   id="haut-petit" class="vertical"
   d="m 169.63526,50.459518 c -17.01424,0 -30.83355,13.819315 -30.83355,30.833555 V 175.2137 H 150.0093 V 81.293073 c 0,-10.827244 8.79872,-19.625964 19.62596,-19.625964 8.34231,0 15.44214,5.274161 18.28207,12.627558 h 11.74008 C 196.43713,60.652848 184.21528,50.459518 169.63526,50.459518" />	
<path		 
   transition:spin={{duration:1000, delay:400}}
	 style="stroke-width:2.53565407"
   id="haut-moyen" class="vertical"
   d="m 169.63526,25.229759 c -30.90962,0 -56.06331,25.153689 -56.06331,56.063314 V 175.2137 h 11.20759 V 81.293073 c 0,-24.722628 20.1331,-44.855723 44.85572,-44.855723 22.33912,0 40.87475,16.431039 44.24717,37.857317 H 225.2168 C 221.74296,46.681393 198.16137,25.229759 169.63526,25.229759" />
<path
	 transition:spin={{duration:1000, delay:550}}
   style="stroke-width:2.53565407"
   id="haut-grand" class="vertical"
   d="M 169.63526,0 C 124.8049,0 88.342191,36.462707 88.342191,81.293073 V 175.2137 H 99.549783 V 81.293073 c 0,-38.64337 31.442107,-70.085482 70.085477,-70.085482 36.28522,0 66.20593,27.714701 69.73049,63.06172 h 11.2076 C 246.99807,32.735295 212.08211,0 169.63526,0" />	
<path
	 transition:spin={{duration:1000, delay:500, dimension:'X'}}
	 style="stroke-width:2.53565407"
   id="droite-petit" class="horizontal"
   d="m 288.7603,169.58455 c 0,-17.01424 -13.81932,-30.83355 -30.83356,-30.83355 h -93.92063 v 11.20759 h 93.92063 c 10.82725,0 19.62597,8.79872 19.62597,19.62596 0,8.3423 -5.27417,15.44213 -12.62756,18.28207 v 11.74008 c 13.64182,-3.19493 23.83515,-15.41678 23.83515,-30.02215" />	
<path
	 transition:spin={{duration:1000, delay:650, dimension:'X'}}
   style="stroke-width:2.53565407"
   id="droite-moyen" class="horizontal"
   d="m 313.99006,169.58455 c 0,-30.90962 -25.15369,-56.06331 -56.06332,-56.06331 h -93.92063 v 11.20759 h 93.92063 c 24.72263,0 44.85572,20.13309 44.85572,44.85572 0,22.33911 -16.43103,40.87475 -37.85731,44.24717 v 11.33437 c 27.61327,-3.44849 49.06491,-27.03007 49.06491,-55.58154" />
<path
	 transition:spin={{duration:1000, delay:800, dimension:'X'}}
   style="stroke-width:2.53565407"
   id="droite-grand" class="horizontal"
   d="m 257.92674,99.524426 c 38.64337,0 70.08548,31.442114 70.08548,70.085484 0,36.28521 -27.7147,66.20593 -63.08707,69.73049 v 11.20759 c 41.55937,-3.57527 74.29466,-38.49123 74.29466,-80.93808 0,-44.83037 -36.4627,-81.293075 -81.29307,-81.293075 h -93.92063 v 11.207591 z" />
<path
	 transition:spin={{duration:1000, delay:750}}
   style="stroke-width:2.53565407"
   id="bas-petit" class="vertical"
   d="m 169.63526,288.73494 c 17.01424,0 30.83356,-13.81931 30.83356,-30.83355 v -93.92063 h -11.20759 v 93.92063 c 0,10.82724 -8.79872,19.62596 -19.62597,19.62596 -8.3423,0 -15.44213,-5.27416 -18.28206,-12.62756 h -11.74008 c 3.19492,13.64182 15.41678,23.83515 30.02214,23.83515" />
<path
	 transition:spin={{duration:1000, delay:900}}
	 style="stroke-width:2.53565407"
   id="basmoyen" class="vertical"
   d="m 169.63526,313.9647 c 30.90963,0 56.06332,-25.15369 56.06332,-56.06331 v -93.92063 h -11.20759 v 93.92063 c 0,24.72262 -20.1331,44.85572 -44.85573,44.85572 -22.33911,0 -40.87474,-16.43104 -44.24716,-37.85732 h -11.33438 c 3.44849,27.61328 27.03008,49.06491 55.58154,49.06491" />	
<path
 	 transition:spin={{duration:1000, delay:1050}}
	 style="stroke-width:2.53565407"
   id="bas-gros" class="vertical"
   d="m 239.69539,257.90139 c 0,38.64337 -31.44211,70.08548 -70.08548,70.08548 -36.28521,0 -66.20593,-27.68935 -69.730492,-63.06172 H 88.671826 c 3.575273,41.55937 38.465874,74.29466 80.938084,74.29466 44.83036,0 81.29307,-36.4627 81.29307,-81.29307 v -93.92063 h -11.20759 z" />
</svg>
{/if}

<style>
	.horizontal {
		transform-origin:50% 50%;
	}
	.vertical {
		transform-origin:50% 50%;
	}
   svg {
      position: fixed;
      left: 50%;
      top: 50%;
      text-align: center;
      transform: translate(-50%, -50%);
      opacity:1;
   }
	path {
		transform-origin:55% center;
      stroke: white;
      fill:white;
	}
</style>
