# RaspberryPiController
This is a Web Site that I made in order to control my Raspberry Pi
It interfaces with 4 Web Servers on my raspberry Pi, Which each run On a different Operating System.
The Operating Systems are Kodi(OSMC), Raspbian, RetroPie, and Rasplex

To find the multi-boot set up that I used for the Raspberry Pi, go Here:

	http://www.multibootpi.com/builds/quad-boot-raspbian-pixel-retropie-rasplex-kodi/

Also, Each Web Server that I am running on my Raspberry Pi is also on my GitHub account:
	
	https://github.com/nickjm6

To Install this Web Server on your own machine:

Install node.js - https://nodejs.org/en/download/
Install a Node package to run the Server on boot with the following command:

	sudo npm install -g pm2

Download this repository from GitHub
To set up the server, change to the directory of the project and run the following:

	npm install
	sudo pm2 start Server.js
	sudo pm2 startup
	sudo pm2 save


This project is really just a work in progress, something that I wanted to do in my own time to build up experience. 
Therefore, The Web Site isn't very robust. If You would like to use it for your own purposes, feel free to 
adopt this code.
