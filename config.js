const DEFAULT_SETTINGS = {
    // connection
    websocketUrl: "ws://127.0.0.1:8080/",

    // blacklist - these names will not be shown to prevent spam
    // add your own bot username here
    blacklistedUsers: ["streamelements", "nightbot", "sery_bot", "moobot"],

    // ui
    maxMessages: 50,
    showBadges: true,

    // styling
    backgroundColor: "rgba(30, 30, 30, 0.85)",
    textColor: "#ffffff",
    fontSize: "16px",
    twitchColor: "#9146FF",
    youtubeColor: "#FF0000",

    // animations
    entryAnimation: "slideIn", // slideIn, fadeIn, or none
    messageTimeOut: 0 // 0 = permanent, milliseconds. i.e 1000 = 1s
};