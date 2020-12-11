import { writable } from 'svelte/store';
import { tweened } from 'svelte/motion'
import { quintOut, linear } from 'svelte/easing';
export const ready = writable ([false,false,false,false, false]);
export const rotation = writable(0);
export const currentStory = writable( { stage : 'stageOne', refresh : false } )
export const scrollDelta = tweened(0, {	
	duration:250,
	easing: quintOut
});

export const autoScroller = tweened(20, {	
	duration:250,
	easing: linear
});

