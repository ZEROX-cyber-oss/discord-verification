require("dotenv").config();

const express = require("express");
const axios = require("axios");
const client = require("./bot");

const app = express();

app.use(express.static("public"));

app.get("/login", (req, res) => {

    const url =
        `https://discord.com/api/oauth2/authorize` +
        `?client_id=${process.env.CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=identify`;

    res.redirect(url);
});

app.get("/callback", async (req, res) => {

    try {

        const code = req.query.code;

        const tokenResponse = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.REDIRECT_URI
            }),
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

        const accessToken =
            tokenResponse.data.access_token;

        const userResponse = await axios.get(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const userId = userResponse.data.id;

        const guild =
            await client.guilds.fetch(
                process.env.GUILD_ID
            );

        const member =
            await guild.members.fetch(userId);

        await member.roles.add(
            process.env.ROLE_ID
        );

        res.send(
            "<h1>✅ Vérification réussie</h1><p>Tu peux retourner sur Discord.</p>"
        );

    } catch (err) {

        console.error(err);

        res.send(
            "<h1>❌ Erreur</h1>"
        );

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Site lancé sur le port ${PORT}`);
});