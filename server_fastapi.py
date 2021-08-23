""" @author: koren hamra """
import uvicorn
from fastapi import FastAPI, Request
from utils.config import single_path
from utils.detections import detections
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.mount("/static", StaticFiles(directory="client/build/static/"), name="client/build/")
templates = Jinja2Templates(directory="client/build/")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.get("/")
async def client(request: Request):
    """ Render react build """
    return templates.TemplateResponse("index.html", {"request": request})


@app.get('/image/<path:filename>')
async def image(filename):
    """ Serve single images by directory & filename """
    return FileResponse(single_path, filename)


@app.post("/data")
async def data(request: Request):
    """ Generate labels list, times list & np data """
    dt_data, dt_time, dt_labels = detections(await request.json())
    return {'dt': {'data': dt_data, 'time': dt_time, 'labels': dt_labels}}


if __name__ == "__main__":
    """ WSGI server """
    uvicorn.run(app, host="0.0.0.0", port=8080)