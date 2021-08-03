FROM python:3.8-slim-buster

WORKDIR /app

RUN pip3 install flask flask_cors numpy waitress pymongo

COPY main.py main.py
COPY ./client/build client/build

CMD [ "python3", "main.py"]
