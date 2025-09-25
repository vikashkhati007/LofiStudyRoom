  export const themes = [
    {
      id: "study-lofi",
      name: "Study Lofi",
      video: "/videos/study.mp4",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "ambient",
      name: "Ambient",
      video: "/videos/ambient.mp4",
      color: "from-blue-500/20 to-cyan-500/20",
    },
  ];

  // Theme-based playlists
  export const themePlaylists = {
    "study-lofi": [
      {
        title: "Idea 15",
        artist: "Gibran Alcocer",
        src: "/music/Idea 15 - Gibran Alcocer.mp3",
      },
      {
        title: "Idea 20 - Kurate Music",
        artist: "Gibran Alcocer",
        src: "/music/Gibran Alcocer - Idea 20 - Kurate Music.mp3",
      },
      { title: "Rainy Day Vibes", artist: "Ambient Sounds", src: "/lofi.mp3" },
    ],
    ambient: [
      {
        title: "SnowFall",
        artist: "Oneheart-x-Reidenshi",
        src: "/music/ambient/oneheart-x-reidenshi-snowfall-128-ytshorts.savetube.me.mp3",
      },
      {
        title: "Watching-The-Stars",
        artist: "Oneheart",
        src: "/music/ambient/oneheart-watching-the-stars-128-ytshorts.savetube.me.mp3",
      },
      {
        title: "Rain Inside",
        artist: "Oneheart-x-Antent",
        src: "/music/ambient/oneheart-x-antent-rain-inside-128-ytshorts.savetube.me.mp3",
      },
      {
        title: "Rescue",
        artist: "Oneheart-x-Ashess",
        src: "/music/ambient/oneheart-x-ashess-rescue-128-ytshorts.savetube.me.me.mp3",
      },
    ],
  };


  export const adjectives = [
  "Chill", "Cozy", "Dreamy", "Mellow", "Peaceful", "Serene", "Calm", "Zen", "Smooth", "Soft",
  "Warm", "Cool", "Misty", "Cloudy", "Starry", "Lunar", "Solar", "Ocean", "Forest", "Mountain"
]

export const nouns = [
  "Panda", "Cat", "Fox", "Owl", "Bear", "Wolf", "Deer", "Rabbit", "Turtle", "Dolphin",
  "Leaf", "Cloud", "Star", "Moon", "Wave", "Breeze", "Rain", "Snow", "Fire", "Stone"
]


export const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smoothness
    }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: {
      duration: 0.1,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

export const inputBarVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

export const messageVariants = {
  hidden: { 
    opacity: 0, 
    y: 15, 
    scale: 0.95,
    filter: "blur(4px)"
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}
