export const musicHero = {
  name: "Thom Clarity",
  tagline: "Hardware synths, no laptop, no DAW, no problem.",
  bio: "Live electronic music, sound design, and mastering. Open to collaboration.",
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
];

export interface MasteringCredit {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export const masteringCredits: MasteringCredit[] = [
  {
    title: "Bell Mountain",
    artist: "Bell Mountain",
    url: "https://bellmountain.bandcamp.com/album/bell-mountain-2",
    cover: "https://f4.bcbits.com/img/a2001170117_16.jpg",
  },
  {
    title: "Tertiary Colors EP",
    artist: "Bell Mountain",
    url: "https://bellmountain.bandcamp.com/album/tertiary-colors-ep",
    cover: "https://f4.bcbits.com/img/a0561851656_16.jpg",
  },
  {
    title: "Soloists",
    artist: "Ben Eisenberger",
    url: "https://beneisenberger.bandcamp.com/album/soloists",
    cover: "https://f4.bcbits.com/img/a1899808830_16.jpg",
  },
  {
    title: "Screaming Plastic",
    artist: "Screaming Plastic",
    url: "https://screamingplastic.bandcamp.com/album/screaming-plastic-2",
    cover: "https://f4.bcbits.com/img/a1751279411_16.jpg",
  },
  {
    title: "High Ruler",
    artist: "High Ruler",
    url: "https://highruler.bandcamp.com/album/high-ruler",
    cover: "https://f4.bcbits.com/img/a2112697761_16.jpg",
  },
  {
    title: "From the Sun",
    artist: "Those Far Out Arrows",
    url: "https://thosefaroutarrows.bandcamp.com/album/from-the-sun",
    cover: "https://f4.bcbits.com/img/a0315632449_16.jpg",
  },
  {
    title: "Heavyweight: Volume I",
    artist: "Jeremy Mercy and the Rapture Orphans",
    url: "https://jeremymercy.bandcamp.com/album/heavyweight-volume-i",
    cover: "https://f4.bcbits.com/img/a0644601383_16.jpg",
  },
  {
    title: "Snake Hymns",
    artist: "Bus Gas",
    url: "https://bbuussggaass.bandcamp.com/album/snake-hymns",
    cover: "https://f4.bcbits.com/img/a2716852377_16.jpg",
  },
];

export const services = [
  {
    title: "Sound Design",
    description: "Patches, textures, SFX, atmosphere",
  },
  {
    title: "Soundtrack / Score",
    description: "Electronic, ambient, experimental composition",
  },
  {
    title: "Mastering",
    description: "Hybrid analog mastering",
  },
];

export const platforms = [
  { label: "Twitch", href: "https://twitch.tv/thomclarity" },
  { label: "YouTube", href: "https://youtube.com/@thomclarity" },
  { label: "TikTok", href: "https://tiktok.com/@thomclarity" },
];

export const bugGasBandcamp = "https://bbuussggaass.bandcamp.com/music";
