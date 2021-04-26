const http = require("http");
const fetch = require("node-fetch");

require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let clientAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`);
let base64data = clientAuth.toString("base64");

const DEVICE_ID = process.env.DEVICE_ID;

const PLAYLIST_ID = process.env.PLAYLIST_ID;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const ENDPOINT_URL = process.env.ENDPOINT_URL;

const required = [
  "CLIENT_ID",
  "CLIENT_SECRET",
  "DEVICE_ID",
  "PLAYLIST_ID",
  "REFRESH_TOKEN",
  "ENDPOINT_URL",
];

const missing = [];
required.forEach((envVar) => {
  if (!process.env[envVar]) {
    missing.push(envVar);
  }
});

if (missing.length) {
  console.error(
    `Cannot start, missing var${missing.length > 1 ? "s" : ""}:`,
    missing.join(", ")
  );
  process.exit(0);
}

const host = "localhost";
const port = process.env.PORT || 7070;

const requestListener = async function (req, res) {
  res.writeHead(200);
  if (req.url === ENDPOINT_URL) {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", REFRESH_TOKEN);

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: params,
        headers: {
          Authorization: `Basic ${base64data}`,
        },
      });
      const data = await response.json();
      const { access_token } = data;

      const volume_response = await fetch(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=80&device_id=${DEVICE_ID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const postBody = JSON.stringify({
        context_uri: PLAYLIST_ID,
      });

      const play_response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${DEVICE_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: postBody,
        }
      );

      console.log(await play_response);
    } catch (e) {
      console.log(e);
    }
  }

  res.end();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
