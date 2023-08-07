<script lang="ts">
	import { VoiceVolume } from './VoiceVolume';
	import { createEventDispatcher } from 'svelte';
	import playIcon from '../assets/play.png';
	import pauseIcon from '../assets/pause.png';
	import volDownIcon from '../assets/volDown.png';
	import volUpIcon from '../assets/volUp.png';
	import level0Icon from '../assets/level0.png';
	import level1Icon from '../assets/level1.png';
	import level2Icon from '../assets/level2.png';
	import level3Icon from '../assets/level3.png';
	import level4Icon from '../assets/level4.png';
	import level5Icon from '../assets/level5.png';

	const dispatch = createEventDispatcher();

	export let volume: VoiceVolume;

	export let playing: boolean;

	let levelIcon: string;
	$: {
		if (volume === VoiceVolume.LEVEL_0) levelIcon = level0Icon;
		if (volume === VoiceVolume.LEVEL_1) levelIcon = level1Icon;
		if (volume === VoiceVolume.LEVEL_2) levelIcon = level2Icon;
		if (volume === VoiceVolume.LEVEL_3) levelIcon = level3Icon;
		if (volume === VoiceVolume.LEVEL_4) levelIcon = level4Icon;
		if (volume === VoiceVolume.LEVEL_5) levelIcon = level5Icon;
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
	<img class="play-btn" src={playing ? playIcon : pauseIcon} alt="" on:click={play} />
</div>
<div class="flex justify-center gap-2">
	<img src={volDownIcon} alt="减小音量" class="volume-btn" on:click={decrement} />
	<img src={levelIcon} alt="音量" class="volume" />
	<img src={volUpIcon} alt="增加音量" class="volume-btn" on:click={increment} />
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
