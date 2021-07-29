import os
import json
import random
import numpy as np
from time import time
from pathlib import Path
from flask_cors import CORS
from pymongo import MongoClient
from flask.globals import request
from datetime import datetime as dt
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder="client/build/static/",
            template_folder="client/build/")
CORS(app)

if 'single_path' and 'label_path' and 'db' in os.environ:
    db = os.environ['db']
    single_path = os.environ['single_path']
    label_path = os.environ['label_path']
else:
    single_path = './data/single/'
    label_path = './data/labels2/'
    db = True

if db:
    client = MongoClient('mongodb://localhost:27017')
    database = client['db']
    collection = database['test2']

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/image/<path:filename>')
def single(filename):
    return send_from_directory(single_path, filename)


@app.route('/data', methods=['POST'])
def data():
    dt_data, dt_time, dt_labels = detections(request.json)
    return jsonify({'dt': {'data': dt_data,'time': dt_time, 'labels': dt_labels}})


def detections(obj):
    dt_data = np.zeros((obj['range'],1207), dtype='float32').tolist()
    if db:
        dt_labels, dt_time = online_detections(obj['range'])
    else:
        file_list = sorted(Path(label_path).rglob('*.json'), key=lambda f: dt.strptime(f.stem, "%d-%m-%Y_%H-%M-%S"))[-obj['range']:]
        dt_labels, dt_time = static_detections(file_list)
    return dt_data, dt_time, dt_labels


def static_detections(file_list):
    labels, times = [], []
    for idx, file in  enumerate(file_list, start=0):
        times.append(file.stem)
        with open(file) as d:
            for label in json.load(d):
                labels.append(detections_convert(label, idx)) 
    return labels, times


def online_detections(n):
    labels, times = [], []
    for idx, l in enumerate(collection.find().skip(collection.count() - n)): 
        times.append(l['_id'])
        for label in l['result']:
            labels.append(detections_convert(label, idx)) 
    return labels, times


def detections_convert(label, idx):
    # Y values okay ?
    return { 
                'type': 'rect', 
                'x0': label['bbox']['x1'] , 
                'y0': (label['bbox']['y1']/120000)+idx-0.5,
                'x1': label['bbox']['x2'] , 
                'y1': (label['bbox']['y2']/120000)+idx-0.5,
                'line': { 'color': {1:'yellow', 2:'blue', 3:'green', 4:'pink', 5: 'purple'}.get(label['cls'], 'white')}
            }


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
