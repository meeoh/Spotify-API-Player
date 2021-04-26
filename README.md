# Spotify API Player

The point of this project is to be able to play a certain spotify playlist from code. The setup is a bit involved, but my end goal was to be able to play a spotify playlist on a certain device by issuing a google assistant command e.g "Hey google, morning playlist".

Note: Spotify premium is REQUIRED for this to work

## Setup

0. Before actually setting this repo up, you're going to need a client id + client secret from spotify. You can get that by going [here](https://developer.spotify.com/dashboard/applications) and registering a new application. Set this as `CLIENT_ID` and `CLIENT_SECRET` in the `.env` file

1. Firstly, you need to get a Spotify refresh token. The easiest way I found to get this was by cloning [this](https://github.com/spotify/web-api-auth-examples), and running the authorization code example with the following scopes: `user-modify-playback-state user-modify-playback-state`. (Dont forget to also set the client_id, client_secret, and redirect URI). Set this as `REFRESH_TOKEN` in the `.env` file.

2. Now you need to get the remaining `.env` vars, `DEVICE_ID`, `PLAYLIST_ID`, `ENDPOINT_URL`, and `PORT` vars:

- `DEVICE_ID`: Easiest way to get this is by going to the [Spotify docs](https://developer.spotify.com/console/get-users-available-devices/) and making a sample request. **IMPORTANT:** If the device is not active (not used recently), then it will **NOT** show up in the api result.

- `PLAYLIST_ID`: Easiest way for this one is also the [Spotify docs](https://developer.spotify.com/console/get-current-user-playlists/).

- `ENDPOINT_URL`: This can be whatever you want, just make sure you take note of it if you want to have this working through the google assistant. e.g `/myCallbackURL` (DONT FORGET THE LEADING SLASH)

- `PORT`: This can be whatever port you want the web server to run on. Defaults to 7070.

3. Install [ngrok](https://ngrok.com/)

4. Run `npm i` then `node main.js` and make sure it doesnt error out.

5. Run `ngrok http PORT_YOU_SET`. Take note of the url it generated for you.

6. Create a new applet in IFTTT. In the IF section you can select google assistant and setup a custom command, in the THEN section set a 'Web request' to your nrgok url (DO NOT FORGET YOUR ENDPOINT FROM STEP 2). In the end it's going to look something like `http://211231a2915a.ngrok.io/YOUR_ENDPOINT`.

7. Use a google assistant to trigger your applet, and test if it works

## Drawbacks

- Since Spotify only sees 'active' devices, you have to make sure your device is active before running your applet. This kind of sucks because it means you have to use your phone, play a song and pause it right away on the target device, then you can run your applet
- You need ngrok/the server to be running 24/7. Ideally this can be ran on a raspberry pi.
- Not really a drawback, but since Spotify uses an OAuth style flow, everytime this code runs, its requesting a new access token. Each access token expires in 1 hour so its fine. An optimization would be writing the access_token to disk, then if it 401s ask for another one, but since Im not going to be running this multiple times within an hour (probably once a day at most), I just request a new token.
