#!/bin/bash
#until node bot.js; do
#    echo "Bot crashed with exit code $?. Respawning.." >&2
#    sleep 1
#done
while true; do
    node bot.js
    sleep 1
done
