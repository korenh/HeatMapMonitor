import json
import random
import numpy as np
from time import time
from pathlib import Path
from flask_cors import CORS
from datetime import datetime
from flask.globals import request
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder="client/build/static/",
            template_folder="client/build/")
CORS(app)

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/image/<path:filename>')
def serve_image(filename):
    return send_from_directory('./data/images', filename)


@app.route('/data', methods=['POST'])
def data():
    dt_data, dt_time, dt_labels = detections(request.json)
    return jsonify({'dt': {'data': dt_data,'time': dt_time, 'labels': dt_labels}})


def detections(obj):
    dt_labels, dt_time, dt_data = [], [], []
    date_format = "%d-%m-%Y_%H-%M-%S"
    base_path_dt = './data/labels/'
    minutes = obj['range']

    file_list = sorted(Path(base_path_dt).rglob('*.json'), key=lambda f: datetime.strptime(f.stem, date_format))[:minutes]
    time_stamp = int(datetime.strptime(file_list[0].stem, date_format).strftime('%s'))
    dt_labels = detctions_convert(file_list, minutes)
    dt_time = detctions_time(minutes, time_stamp, 60)
    dt_data = np.zeros((minutes,1207), dtype='float32').tolist()
       
    return dt_data, dt_time, dt_labels


def detctions_convert(file_list, minutes):
    # values over (Y axis) !
    labels = []
    for idx, f in  enumerate(file_list, start=0):
        with open(f) as d:
            for label in json.load(d):
                labels.append({ 
                    'type': 'rect', 
                    'x0': label['bbox']['x1'] , 
                    'y0': (label['bbox']['y1']/120000)+idx-0.5,
                    'x1': label['bbox']['x2'] , 
                    'y1': (label['bbox']['y2']/120000)+idx-0.5,
                    'line': { 'color': {1:'yellow', 2:'blue', 3:'green', 4:'pink', 5: 'purple'}.get(label['cls'], 'white')}}) 
    return labels


def detctions_time(time_range, time_stamp, proportion):
    time_list = []
    for i in range(time_range):
        time_list.append(datetime.fromtimestamp(time_stamp+(i*proportion)).strftime('%d:%m:%Y|%H:%M:%S'))
    return time_list


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
