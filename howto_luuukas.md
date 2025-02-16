
```bash
cd ./web
#bash build.sh # -> actually, should do docker compose down & up if changes to backend have been made (?)
npm run dev # to start the dev server and frontent, then go to localhost:3000 (see readme in ./web) or 3001 (see logs after npm run dev) if container with port 3000 is already running
#sudo ufw allow 3001 # to allow port 3001
#sudo ufw delete allow 3001 # to remove the rule
```

