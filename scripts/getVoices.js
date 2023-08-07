JSON.stringify(
	[...document.querySelector('#iconSet').childNodes].map((item) => ({
		name: `${item.alt}`,
		img: `${item.src}`,
		voice: `https://mynoise.world/NoisesOnline/Audio/${item.id}.ogg`,
		color: item.style.background
	}))
);
