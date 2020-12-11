<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;900&display=swap" rel="stylesheet">
  <meta name="viewport" content="width=device-width">
</svelte:head>

<script>
  import Loader from './Loader.svelte'
  import Main from './Main.svelte'
  import { fade } from 'svelte/transition';
  let fire;

</script>
{#if !fire}
<div class="supercontainer" transition:fade>
  <Loader color={'#fff'} size={64}/>
</div>
{/if}
<Main on:readygo={() => fire = true} />


<style>
  .supercontainer {
    position: fixed;
    display:flex;
    justify-content: center;
    background:none;
    width:100vw;
    height: 100vh;
    align-items: center;
    opacity: 1;
    z-index:100;
  }
</style>