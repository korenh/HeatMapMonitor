import os
import random
import numpy as np
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
    data, time, shapes = get_data(request.json)
    return jsonify({'data': data, 'time': time, 'shapes': shapes})


def get_data(obj):
    path = './data/sample/'
    time_list = ["2020-09-08_17-11-39", "2020-09-08_17-12-39", "2020-09-08_17-13-39", "2020-09-08_17-14-39", 
    "2020-09-08_17-15-39","2020-09-08_17-16-39", "2020-09-08_17-17-39","2020-09-08_17-18-39", "2020-09-08_17-19-39", 
    "2020-09-08_17-20-39","2020-09-08_17-21-39"]

    shapes = [
    { 'type': 'rect', 'x0': random.randint(50,100), 'y0': 1, 'x1': random.randint(500,1000), 'y1': 3, 'line': { 'color': 'yellow' } },
    { 'type': 'rect', 'x0': random.randint(100,550), 'y0': 4, 'x1': random.randint(600,800), 'y1': 7, 'line': { 'color': 'blue' } }
    ]

    if 'date_key' in obj.keys():
        date_key = datetime.fromtimestamp(obj.json['date_key']/1000.0).strftime("%d-%m-%Y")
    else:
        file_list = sorted(Path(path).rglob('*.npy')) #key=lambda f: datetime.strptime(f.stem, 'date_format')
        data = np.load(file_list[random.randint(0,1)]).tolist()
    return data , time_list, shapes


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
