<script lang="ts">
	import { VoiceVolume } from './VoiceVolume';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let volume: VoiceVolume;

	export let playing: boolean;

	let levelIndex: number;
	$: {
		if (volume === VoiceVolume.LEVEL_0) levelIndex = 0;
		if (volume === VoiceVolume.LEVEL_1) levelIndex = 1;
		if (volume === VoiceVolume.LEVEL_2) levelIndex = 2;
		if (volume === VoiceVolume.LEVEL_3) levelIndex = 3;
		if (volume === VoiceVolume.LEVEL_4) levelIndex = 4;
		if (volume === VoiceVolume.LEVEL_5) levelIndex = 5;
	}

	const increment = () => {
		dispatch('increment');
	};

	const decrement = () => {
		dispatch('decrement');
	};

	const play = () => {
		dispatch('play');
	};
</script>

<div class="flex justify-center">
	<img class="play-btn" src="/img/{playing ? 'play' : 'pause'}.png" alt="" on:click={play} />
</div>
<div class="flex justify-center gap-2">
	<img src="/img/volDown.png" alt="减小音量" class="volume-btn" on:click={decrement} />
	<img src={`/img/level${levelIndex}.png`} alt="音量" class="volume" />
	<img src="/img/volUp.png" alt="增加音量" class="volume-btn" on:click={increment} />
</div>

<style lang="postcss">
	.play-btn {
		@apply w-[48px] h-[48px] border-2 border-white p-[8px] cursor-pointer rounded-full opacity-50 transition-opacity duration-200 hover:opacity-100;
	}
	.volume-btn {
		@apply w-[32px] h-[32px] border-2 border-white p-[6px] rounded-full cursor-pointer opacity-50 transition-opacity duration-200 hover:opacity-100;
	}
	.volume {
		@apply w-[32px] h-[32px] opacity-75;
	}
</style>
