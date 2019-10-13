#!/bin/bash
cd /home/pi/.ss/
sudo mount /dev/mmcblk0p1 noobs
sudo cp /home/pi/.ss/autobootgames.txt /home/pi/.ss/noobs/autoboot.txt
sudo reboot

