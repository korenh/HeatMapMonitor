# HeatMapMonitor

<img src="./client/sample/sample.png" height="300">

```bash
# Run client
cd client 
npm install
npm start

# Build client
cd client 
npm run build

# Run server
pip install {dependencies}
python server.py

# Docker mongo
docker run -d --name mongo -p 27017:27017 mongo:4.1.1

# Docker build
docker build -t monitor .

docker run -d --name monitor -p 8080:8080 -v /Users/korenhamra/Documents/heatmap/data:/app/data  -e single_path='/app/data/single/' -e label_path='/app/data/labels2/' -e db='static' -e mongo_url='mongodb://localhost:27017' -e collection='test2' monitor
```
