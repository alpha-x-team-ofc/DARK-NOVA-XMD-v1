const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    Browsers 
} = require("@whiskeysockets/baileys");
const { 
    getBuffer, 
    getGroupAdmins, 
    getRandom, 
    h2k, 
    isUrl, 
    Json, 
    runtime, 
    sleep, 
    fetchJson 
} = require("./lib/functions");
const fs = require("fs");
const P = require("pino");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const util = require("util");
const { sms, downloadMediaMessage } = require("./lib/msg");
const axios = require("axios");
const { File } = require("megajs");
const express = require("express");
const path = require("path");

// Initialize global fetch
(async () => { 
    const { default: fetch } = await import("node-fetch"); 
    globalThis.fetch = fetch; 
})();

const prefix = config.PREFIX;
const ownerNumber = config.OWNER_NUM;
const app = express();
const port = process.env.PORT || 8000;

// Session Authentication
async function setupSession() {
    const authDir = path.join(__dirname, "auth_info_baileys");
    const credsFile = path.join(authDir, "creds.json");
    
    if (!fs.existsSync(credsFile)) {
        if (!config.SESSION_ID) {
            console.error("❌ Error: Please add your session to SESSION_ID env");
            process.exit(1);
        }

        try {
            if (!fs.existsSync(authDir)) {
                fs.mkdirSync(authDir, { recursive: true });
            }

            const filer = File.fromURL(`https://mega.nz/file/${config.SESSION_ID}`);
            const data = await new Promise((resolve, reject) => {
                filer.download((err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });

            await fs.promises.writeFile(credsFile, data);
            console.log("✅ Session downloaded successfully");
        } catch (err) {
            console.error("❌ Error downloading session:", err);
            process.exit(1);
        }
    }
}

// WhatsApp Connection
async function connectToWA() {
    await setupSession();

    console.log("🔌 Connecting DARK-NOVA-XMD...");
    const { state, saveCreds } = await useMultiFileAuthState(
        path.join(__dirname, "auth_info_baileys")
    );
    
    const { version } = await fetchLatestBaileysVersion();

    const robin = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: true,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version,
    });

    robin.ev.on("creds.update", saveCreds);

    // Event Handlers
    robin.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === "close") {
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                console.log("🔁 Reconnecting...");
                setTimeout(connectToWA, 5000);
            } else {
                console.log("❌ Logged out from WhatsApp. Delete auth folder and try again.");
                process.exit(1);
            }
        } else if (connection === "open") {
            console.log("✅ DARK-NOVA-XMD Connected!");
        }
    });

    // 📂 Plugin Loader
    const pluginsDir = path.join(__dirname, "plugins");
    fs.readdirSync(pluginsDir).forEach(file => {
        if (file.endsWith(".js")) {
            try {
                require(path.join(pluginsDir, file));
                console.log("✅ Plugin Loaded:", file);
            } catch (e) {
                console.error("❌ Error loading plugin:", file, e);
            }
        }
    });
}

// Start Bot
connectToWA();
