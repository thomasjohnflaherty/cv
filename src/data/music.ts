export const musicHero = {
  name: "Thom Clarity",
  tagline: "Electronic Music Producer · Sound Design · Live DAWless Performance",
  bio: "Hardware-first electronic music — tactile, improvisational, alive. Available for sound design, soundtrack, and mastering work.",
};

export interface PressQuote {
  text: string;
  source: string;
}

export const pressQuotes: PressQuote[] = [
  {
    text: "Squalling like Neil Young's Dead Man as performed by Stephen O'Malley.",
    source: "The Quietus",
  },
  {
    text: "Like a giant pipe organ being torn from its foundation and spun into space with pipes still playing.",
    source: "Lost in a Sea of Sound",
  },
  {
    text: "A truly mesmerizing fork-in-the-road in one of most undersung but praiseworthy groups putting out music today.",
    source: "Tome to the Weather Machine",
  },
  {
    text: "Taking the forms of post-rock and making it bleed a million colors.",
    source: "Was Ist Das",
  },
];

export interface Release {
  title: string;
  url: string;
  cover: string;
}

export const bugGasReleases: Release[] = [
  {
    title: "Mercy View",
    url: "https://bbuussggaass.bandcamp.com/album/mercy-view",
    cover: "https://f4.bcbits.com/img/a0045324856_16.jpg",
  },
  {
    title: "Immortal Yeller / Mountains Past",
    url: "https://bbuussggaass.bandcamp.com/album/immortal-yeller-mountains-past",
    cover: "https://f4.bcbits.com/img/a2878293985_16.jpg",
  },
  {
    title: "Live On Leave Us",
    url: "https://bbuussggaass.bandcamp.com/album/live-on-leave-us",
    cover: "https://f4.bcbits.com/img/a3307675077_16.jpg",
  },
  {
    title: "Snake Hymns",
    url: "https://bbuussggaass.bandcamp.com/album/snake-hymns",
    cover: "https://f4.bcbits.com/img/a2716852377_16.jpg",
  },
  {
    title: "Train Out",
    url: "https://bbuussggaass.bandcamp.com/album/train-out",
    cover: "https://f4.bcbits.com/img/a1550013334_16.jpg",
  },
  {
    title: "Six Movements in Four Hours",
    url: "https://bbuussggaass.bandcamp.com/album/six-movements-in-four-hours",
    cover: "https://f4.bcbits.com/img/a0432760064_16.jpg",
  },
];

export const services = [
  {
    title: "Sound Design",
    description: "Custom patches, SFX, texture and atmosphere work",
  },
  {
    title: "Soundtrack / Score",
    description: "Electronic, ambient, experimental",
  },
  {
    title: "Mastering",
    description: "Hardware-chain finishing",
  },
];

export const platforms = [
  { label: "Twitch", href: "https://twitch.tv/thomclarity" },
  { label: "YouTube", href: "https://youtube.com/@thomclarity" },
  { label: "TikTok", href: "https://tiktok.com/@thomclarity" },
];

export const bugGasBandcamp = "https://bbuussggaass.bandcamp.com/music";
