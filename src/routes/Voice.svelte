<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { VoiceStatus } from './VoiceStatus';

	const dispatch = createEventDispatcher();

	export let img: string;
	export let name: string;
	export let color: string;
	export let status: VoiceStatus;

	let src: string;
	$: if (status === VoiceStatus.LOADING) {
		src = `/img/loading.gif`;
	} else {
		src = img;
	}

	$: colorStyle = `background-color: ${color}; border-color: ${color};`;

	const onActive = () => {
		dispatch('active');
	};
</script>

<img
	{src}
	class:active={status === VoiceStatus.ACTIVE}
	alt={name}
	style={colorStyle}
	on:click={onActive}
/>

<style lang="postcss">
	img {
		@apply inline-block w-[52px] h-[52px] border-[3px] rounded-full cursor-pointer opacity-30 duration-100 hover:scale-[1.1];
	}
	img:hover {
		box-shadow: 0 0 16px #666;
	}
	.active {
		opacity: 1;
	}
</style>
