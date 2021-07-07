import os
import random
import numpy as np
from flask_cors import CORS
from flask.globals import request
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder="client/build/static/",
            template_folder="client/build/")
CORS(app)

path = './data/sample/'
time_list = [
   "2020-09-08_17-11-39",
   "2020-09-08_17-12-39",
   "2020-09-08_17-13-39",
   "2020-09-08_17-14-39",
   "2020-09-08_17-15-39",
   "2020-09-08_17-16-39",
   "2020-09-08_17-17-39",
   "2020-09-08_17-18-39",
   "2020-09-08_17-19-39",
   "2020-09-08_17-20-39",
   "2020-09-08_17-21-39"
]

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/image/<path:filename>')
def send_file(filename):
    return send_from_directory('./data/images', filename)

@app.route('/data', methods=['POST'])
def data():
    file_list = sorted(os.path.join(r, fn) for r, ds, fs in os.walk(path) for fn in fs if fn.endswith('npy'))
    return jsonify({'data': np.load(file_list[random.randint(0,1)]).tolist(), 'time':time_list})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
