<script lang="ts">
	import { browser } from '$app/environment';
	import rawVoices from '../voices.json';
	import Voice from './Voice.svelte';
	import Controller from './Controller.svelte';
	import { VoiceVolume } from './VoiceVolume';
	import { VoiceStatus } from './VoiceStatus';
	import { onMount } from 'svelte';

	type VoiceItem = {
		name: string;
		img: string;
		voice: string;
		color: string;
		status: VoiceStatus;
	};

	let voices: VoiceItem[] = rawVoices.map((item, index) => ({
		name: item.name,
		img: `/img/${index + 1}.png`,
		voice: `/voice/${index + 1}.ogg`,
		color: item.color,
		status: VoiceStatus.OFF
	}));

	$: activeVoices = voices.filter((item) => item.status === VoiceStatus.ACTIVE);

	let volume = VoiceVolume.LEVEL_3;

	let playing = false;

	let audios = new Map<VoiceItem, HTMLAudioElement>();

	let mounted = false;
	$: {
		if (browser && mounted) {
			localStorage.setItem('voices', activeVoices.map((item) => item.name).join(','));
			localStorage.setItem('volume', String(volume));
		}
	}

	const play = () => {
		if (playing) {
			for (const el of audios.values()) {
				el.pause();
			}
		} else {
			for (const el of audios.values()) {
				el.play();
			}
		}
		playing = !playing;
	};

	const increment = () => {
		switch (volume) {
			case VoiceVolume.LEVEL_0:
				volume = VoiceVolume.LEVEL_1;
				break;
			case VoiceVolume.LEVEL_1:
				volume = VoiceVolume.LEVEL_2;
				break;
			case VoiceVolume.LEVEL_2:
				volume = VoiceVolume.LEVEL_3;
				break;
			case VoiceVolume.LEVEL_3:
				volume = VoiceVolume.LEVEL_4;
				break;
			case VoiceVolume.LEVEL_4:
				volume = VoiceVolume.LEVEL_5;
				break;
		}

		for (const el of audios.values()) {
			el.volume = volume;
		}
	};

	const decrement = () => {
		switch (volume) {
			case VoiceVolume.LEVEL_5:
				volume = VoiceVolume.LEVEL_4;
				break;
			case VoiceVolume.LEVEL_4:
				volume = VoiceVolume.LEVEL_3;
				break;
			case VoiceVolume.LEVEL_3:
				volume = VoiceVolume.LEVEL_2;
				break;
			case VoiceVolume.LEVEL_2:
				volume = VoiceVolume.LEVEL_1;
				break;
			case VoiceVolume.LEVEL_1:
				volume = VoiceVolume.LEVEL_0;
				break;
		}

		for (const el of audios.values()) {
			el.volume = volume;
		}
	};

	const onActive = (voice: VoiceItem) => {
		if (voice.status === VoiceStatus.ACTIVE) {
			voice.status = VoiceStatus.OFF;
			voices = voices;
			audios.get(voice)?.pause();
		} else if (voice.status === VoiceStatus.OFF || voice.status === VoiceStatus.FAILED) {
			voice.status = VoiceStatus.LOADING;
			voices = voices;
			if (audios.has(voice)) {
				audios.get(voice)?.play();
				voice.status = VoiceStatus.ACTIVE;
				voices = voices;
				return;
			}
			const el = document.createElement('audio');
			el.src = voice.voice;
			el.loop = true;
			el.preload = 'auto';
			document.body.appendChild(el);
			audios.set(voice, el);
			el.oncanplaythrough = () => {
				el.volume = volume;
				if (playing) {
					el.play();
				}
				voice.status = VoiceStatus.ACTIVE;
				voices = voices;
			};
			el.onerror = () => {
				voice.status = VoiceStatus.FAILED;
				voices = voices;
				el.remove();
				audios.delete(voice);
			};
		}
	};

	onMount(() => {
		mounted = true;

		const activeVoiceNames =
			localStorage
				.getItem('voices')
				?.split(',')
				.filter((item) => item !== '') || [];

		volume = localStorage.getItem('volume')
			? Number(localStorage.getItem('volume'))
			: VoiceVolume.LEVEL_3;

		for (const voice of voices) {
			if (activeVoiceNames.includes(voice.name)) {
				onActive(voice);
			}
		}
	});
</script>

<div class="h-screen">
	<h1 class="text-center text-gray-800 text-4xl pt-8">白噪音</h1>
	<div class="mt-10">
		<Controller
			{volume}
			{playing}
			on:increment={increment}
			on:decrement={decrement}
			on:play={play}
		/>
	</div>
	<div class="py-8 px-4 lg:px-32 flex flex-wrap justify-center gap-4">
		{#each voices as voice (voice.name)}
			<Voice
				img={voice.img}
				name={voice.name}
				color={voice.color}
				status={voice.status}
				on:active={() => onActive(voice)}
			/>
		{/each}
	</div>
</div>

<style lang="postcss">
	:global(html) {
		@apply bg-[#dcd8cf];
	}
</style>
