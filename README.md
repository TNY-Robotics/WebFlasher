<div align="center">

# TNY Web Flasher

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Framework](https://img.shields.io/badge/Framework-Nuxt_4-00DC82.svg?logo=nuxt.js)](https://nuxt.com/)
[![Tool](https://img.shields.io/badge/Tool-WebSerial-blue.svg)](#)

**The fastest way to install, update, or downgrade your TNY robot's firmware directly from your browser.**

[⚡ Open Live Flasher](https://flasher.tny-robotics.com) • [🤖 TNY-360 Repo](https://github.com/TNY-Robotics/TNY-360) • [💬 Discord](https://discord.gg/XGABkx5A4y)

</div>

---

## 🚀 Overview & Live Tool

We built the **TNY Web Flasher** to make firmware management accessible to everyone. You no longer need to install VS Code, PlatformIO, or Python just to get your robot running. By leveraging the WebSerial API and `esptool.js`, this tool fetches the latest official releases from our GitHub repositories and flashes the compiled binaries straight to your ESP32.

You can use the live version immediately without installing anything:

1. Open **[flasher.tny-robotics.com](https://flasher.tny-robotics.com)**.
2. Connect your robot to your computer via USB.
3. Select your robot model, desired firmware version, and target device.
4. Click **Flash** and watch the magic happen!

> **⚠️ Browser Compatibility Requirement**
> Because this application uses the WebSerial API to communicate with your USB ports, **you must use a Chromium-based browser** (such as Google Chrome, Microsoft Edge, Brave, or Opera). Safari and Firefox are not supported and will trigger a built-in warning popup.

## ✨ Key Features

*   **One-Click Flashing:** Select your specs from the intuitive dropdown menus.
*   **Cloud-Synced Releases:** The app automatically fetches the latest `.bin` files directly from the official TNY-Robotics GitHub repositories.
*   **Downgrade Friendly:** Easily roll back to older firmware versions for testing or if you prefer a previous setup over the integrated OTA updates.
*   **No Code Required:** Perfect for users building the physical robot who do not want to mess with complex C++ compilation environments.

## 🛠️ Local Development (For Contributors)

If you want to help improve the web interface, you can easily run the Nuxt v4 app locally.

*   Clone this repository: `git clone https://github.com/TNY-Robotics/WebFlasher.git`
*   Install the dependencies: `npm install`
*   Start the development server: `npm run dev`

## 📄 License & Open Source

This project is licensed under **CC BY-NC-SA 4.0**, maintaining the same ecosystem license as the hardware and Web UI.

*Note: This software utilizes the amazing `esptool-js` library, which is distributed under the Apache License 2.0.*
