import json
import random
import numpy as np
from time import time
from pathlib import Path
from scipy import signal
from flask_cors import CORS
from datetime import datetime
from flask.globals import request
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder="client/build/static/",
            template_folder="client/build/")
CORS(app)

base_path_dt = './data/labels/'
base_path_wf = './data/sample/'
date_format = "%d-%m-%Y_%H-%M-%S"
date_format2 = "%d:%m:%Y|%H:%M:%S"


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/image/<path:filename>')
def serve_image(filename):
    return send_from_directory('./data/images', filename)


@app.route('/data', methods=['POST'])
def data():
    wf_data, wf_time, wf_labels = get_waterfall(request.json)
    dt_data, dt_time, dt_labels = get_detections(request.json)
    return jsonify({
        'wf': {'data': wf_data,'time': wf_time, 'labels': wf_labels},
        'dt': {'data': dt_data,'time': dt_time, 'labels': dt_labels}, 
        })


def get_waterfall(obj):
    wf_data, wf_time, wf_labels = [], [], []
    minutes = 5

    file_list = sorted(Path(base_path_wf).rglob('*.npy'), key=lambda f: datetime.strptime(f.stem, date_format))[-minutes:]
    time_stamp = int(datetime.strptime(file_list[0].stem, date_format).strftime('%s'))
    wf_data = waterfall_creation(file_list, 60)
    wf_time = time_list_creation(len(file_list)*60, time_stamp, 1)

    return wf_data, wf_time, wf_labels


def get_detections(obj):
    dt_labels, dt_time, dt_data = [], [], []
    minutes = 720

    file_list = sorted(Path(base_path_dt).rglob('*.json'), key=lambda f: datetime.strptime(f.stem, date_format))[-minutes:]
    time_stamp = int(datetime.strptime(file_list[0].stem, date_format).strftime('%s'))
    dt_labels = detction_convert(file_list, minutes)
    dt_time = time_list_creation(minutes, time_stamp, 60)
    dt_data = np.zeros((minutes,1207), dtype='float32')
       
    return dt_data.tolist(), dt_time, dt_labels


def detection_color(cls):
    return {1:'yellow', 2:'blue', 3:'green', 4:'pink', 5: 'purple'}.get(cls, 'white')


def detction_convert(file_list, proportion):
    labels = []
    for f in file_list:
        with open(f) as d:
            for idx, label in enumerate(json.load(d)):
                labels.append({ 
                    'type': 'rect', 
                    'x0': label['bbox']['x1'] , 
                    'y0': (label['bbox']['x1']/proportion)*idx , 
                    'x1': label['bbox']['x2'] , 
                    'y1': (label['bbox']['x2']/proportion)*idx ,
                    'line': { 'color': detection_color(label['cls']) }}) 
    return labels


def time_list_creation(time_range, time_stamp, proportion):
    time_list = []
    for i in range(time_range):
        time_list.append(datetime.fromtimestamp(time_stamp+(i*proportion)).strftime(date_format2))
    return time_list


def waterfall_creation(file_list, minutes):
    waterfall_data = []
    for f in file_list:
        if len(waterfall_data) == 0:
            waterfall_data = np.load(f, mmap_mode='r')
        else:
            waterfall_data = np.concatenate((waterfall_data, np.load(f, mmap_mode='r')) , axis=0)
    return signal.resample(waterfall_data, len(file_list)*minutes ).tolist()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
