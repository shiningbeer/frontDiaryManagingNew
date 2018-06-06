screen -S front -X quit
screen -dmS front
sleep 2s
cmd=$"npm start"
screen -S front -X stuff "$cmd"
screen -S front -X stuff $'\n'
