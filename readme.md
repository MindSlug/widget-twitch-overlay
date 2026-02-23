# MindSlug's Multichat Overlay

This project utilizes WebSockets to interface with **Streamer.bot**, providing a unified, real-time chat experience for Twitch and YouTube. This chat overlay is designed for OBS but can be used with other streaming clients that have a browser extension. This widget is highly customizable.

## License
This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.
You are free to use and modify this overlay for your personal stream, but you may not sell this code or use it for commercial gain without explicit permission.

## Key Features

* **Tokenized Emote Parsing:** Optimized rendering for Twitch, 7TV, BTTV, and FFZ emotes using word-tokenization to ensure precision and prevent text-corruption.
* **Dynamic Configuration:** Hybrid settings system allowing global defaults via `config.js` or per-instance overrides via URL query parameters.
* **Security & Filtering:** Integrated user (bot) blacklist system with case-insensitive matching to filter out bots or disruptive users.
* **OBS Optimized:** Designed with a transparent background and hardware-accelerated CSS animations.

---

## Prerequisites

### 1. Streamer.bot Configuration
1.  Open **Streamer.bot**.
2.  Navigate to **Servers/Clients** > **WebSocket Server**.
3.  Set **Port** to `8080`.
4.  Ensure **Auto Start** is checked and the server status is **Started**.

If you have other services running on 8080, a commonly used port, choose another and adjust the `config.js`.

### 2. 3rd-Party Emotes (Optional)

1.  Navigate to **Platforms** in Streamer.bot.
2.  Click on Twitch
3.  Enable your preferred 3rd party emote handlers (BetterTTV, SevenTV, FrankerFaceZ)

---

## File Structure

* `index.html`: The main entry point for the OBS Browser Source.
* `style.css`: Contains the layout logic, theme variables, and animations.
* `config.js`: Global manifest for default settings.
* `app.js`: The core engine handling WebSocket lifecycle, message parsing, and DOM injection.

---

## Configuration

### Global Defaults (`config.js`)
Modify this file to set your primary theme and connection details.

| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `websocketUrl` | String | `ws://127.0.0.1:8080/` | Streamer.bot WebSocket address. |
| `maxMessages` | Number | `50` | Maximum messages retained in the DOM. |
| `blacklistedUsers` | Array | `[...]` | List of usernames (lowercase) to ignore. |
| `fontSize` | String | `16px` | Default font size for chat messages. |
| `messageTimeOut` | Number | `0` | Time in ms before a message fades out (0 = permanent). |

and a few more, check them out!

### OBS URL Overrides
You can override any key in `config.js` by adding it to the URL in OBS. This allows for multiple styles using the same local files.

**Example Override URL:**
`index.html?fontSize=22&maxMessages=10&twitchColor=orange`

This would adjust the values for fontSize to 22, maxMessages to 10, and changing the sidebar color to orange for Twitch messages.

---

## OBS Setup

1.  Add a new **Browser Source** in OBS.
2.  Check **Local file** and select the `index.html`.
3.  Set **Width/Height** to your liking (e.g., 400x800).
4.  Check **Refresh browser when scene becomes active** to ensure a fresh WebSocket connection upon scene switching.

`Note: If you switch between scenes a lot, don't click on Refresh browser when scene becomes active. Otherwise the chat will get cleared often.`

---

Screenshots from a stream will follow...