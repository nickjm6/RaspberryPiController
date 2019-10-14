# RaspberryPiController
This is a Web Site that I made in order to control my Raspberry Pi
It interfaces with multiple Web Servers on my raspberry Pi, Which each run On a different Operating System.
The Operating Systems are Kodi(OSMC), Raspbian, RetroPie, and Rasplex.

Right now I only have my set up with Raspbian and RetroPie. The setup for Kodi (OMSC) is pretty much the same. The setup for Rasplex and Kodi(LibreElec) is a little bit more difficult FYI. With them having a read-only filesystem it complicates things so that git/nodejs cannot be used. Getting the UI to work would require some restructuring in bare HTML/CSS, and the API can be created in another language.

To find the multi-boot set up that I used for the Raspberry Pi, go Here:

	http://www.multibootpi.com/builds/quad-boot-raspbian-pixel-retropie-rasplex-kodi/

## Setup

Make sure to follow the following steps in each OS that you have on your raspberry PI

1. After cloning this repo, run `npm i` to install packages
2. Run `npm run build` and answer the following questions about the config to create a config.json file. Following that, it will build the react components for the UI.
3. Make sure to use the UI on each OS to switch to the other Operating Systems. This will create files on your machine allowing you to run a shell command to switch operating systems.
4. install the pm2 npm package by running `sudo npm i -g pm2`. Then run the following commands:
	- `pm2 start app.js`
	- `pm2 startup`
	- `pm2 save`
   This will make it so that the server will start every time you reboot your raspberry PI
5. (Optional) - open config settings for your raspberry pi by running `raspi-config` and set the hostname to something eazy to remember (I set mine to myrazpi). This will allow you to reach the webpage by going to http://{hostname}.local.

Note: This project is really just a work in progress, something that I wanted to do in my own time to build up experience. 
Therefore, The Web Site isn't very robust. If You would like to use it for your own purposes, feel free to 
adopt this code.
