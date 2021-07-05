import os
import random
import numpy as np
from flask_cors import CORS
from flask.globals import request
from flask import Flask, jsonify, render_template

app = Flask(__name__, static_folder="client/build/static/",
            template_folder="client/build/")
CORS(app)

path = './data/sample/'
time_list = [
   "11/12/2016",
   "12/12/2016",
   "13/12/2016",
   "14/12/2016",
   "15/12/2016",
   "16/12/2016",
   "17/12/2016",
   "18/12/2016",
   "19/11/2016",
   "20/12/2016",
   "21/12/2016"
]

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/data', methods=['POST'])
def data():
    file_list = sorted(os.path.join(r, fn) for r, ds, fs in os.walk(path) for fn in fs if fn.endswith('npy'))
    return jsonify({'data': np.load(file_list[random.randint(0,1)]).tolist(), 'time':time_list})



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
