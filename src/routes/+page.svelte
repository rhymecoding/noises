<script lang="ts">
	import { browser } from '$app/environment';
	import rawVoices from '../voices.json';
	import Voice from './Voice.svelte';
	import Controller from './Controller.svelte';
	import { VoiceVolume } from './VoiceVolume';
	import { VoiceStatus } from './VoiceStatus';
	import { onMount } from 'svelte';
	import img1 from '../assets/1.png';
	import img2 from '../assets/2.png';
	import img3 from '../assets/3.png';
	import img4 from '../assets/4.png';
	import img5 from '../assets/5.png';
	import img6 from '../assets/6.png';
	import img7 from '../assets/7.png';
	import img8 from '../assets/8.png';
	import img9 from '../assets/9.png';
	import img10 from '../assets/10.png';
	import img11 from '../assets/11.png';
	import img12 from '../assets/12.png';
	import img13 from '../assets/13.png';
	import img14 from '../assets/14.png';
	import img15 from '../assets/15.png';
	import img16 from '../assets/16.png';
	import img17 from '../assets/17.png';
	import img18 from '../assets/18.png';
	import img19 from '../assets/19.png';
	import img20 from '../assets/20.png';
	import img21 from '../assets/21.png';
	import img22 from '../assets/22.png';
	import img23 from '../assets/23.png';
	import img24 from '../assets/24.png';
	import img25 from '../assets/25.png';
	import img26 from '../assets/26.png';
	import img27 from '../assets/27.png';
	import img28 from '../assets/28.png';
	import img29 from '../assets/29.png';
	import img30 from '../assets/30.png';

	const imgs = new Map();
	imgs.set(1, img1);
	imgs.set(2, img2);
	imgs.set(3, img3);
	imgs.set(4, img4);
	imgs.set(5, img5);
	imgs.set(6, img6);
	imgs.set(7, img7);
	imgs.set(8, img8);
	imgs.set(9, img9);
	imgs.set(10, img10);
	imgs.set(11, img11);
	imgs.set(12, img12);
	imgs.set(13, img13);
	imgs.set(14, img14);
	imgs.set(15, img15);
	imgs.set(16, img16);
	imgs.set(17, img17);
	imgs.set(18, img18);
	imgs.set(19, img19);
	imgs.set(20, img20);
	imgs.set(21, img21);
	imgs.set(22, img22);
	imgs.set(23, img23);
	imgs.set(24, img24);
	imgs.set(25, img25);
	imgs.set(26, img26);
	imgs.set(27, img27);
	imgs.set(28, img28);
	imgs.set(29, img29);
	imgs.set(30, img30);

	type VoiceItem = {
		name: string;
		img: string;
		voice: string;
		color: string;
		status: VoiceStatus;
	};

	let voices: VoiceItem[] = rawVoices.map((item, index) => ({
		name: item.name,
		img: imgs.get(index + 1),
		voice: `/voice/${index + 1}.ogg`,
		color: item.color,
		status: VoiceStatus.OFF
	}));

	imgs.clear();

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
			for (const [voice, el] of audios.entries()) {
				if (voice.status === VoiceStatus.ACTIVE) {
					el.pause();
				}
			}
		} else {
			for (const [voice, el] of audios.entries()) {
				if (voice.status === VoiceStatus.ACTIVE) {
					el.play();
				}
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
				if (playing) {
					audios.get(voice)?.play();
				}
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
	<div class="mt-8">
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
