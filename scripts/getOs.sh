#!/bin/bash

lsb_release -a | grep "Description"| cut -f2 | awk '{print $1}'
