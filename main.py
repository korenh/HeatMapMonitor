import numpy as np
from scipy import signal
from flask_cors import CORS
from flask import Flask, jsonify, render_template
from scipy.signal import butter, lfilter
from matplotlib.colors import LogNorm

app = Flask(__name__, static_folder="client/build/static/",
            template_folder="client/build/")
CORS(app)

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

@app.route('/data')
def data():
    signals = np.load('./data/20-02-2021_07-20-24.npy', mmap_mode='r')
    b, a = butter(5, Wn=10, btype='highpass', fs=2000)
    x = np.abs(lfilter(b, a, np.cumsum(signals, axis=1))).T
    x = x / np.expand_dims(np.percentile(x, 10, axis=1), axis=1)
    x = signal.resample(x, 1200)
    return jsonify({'data':x.tolist(), 'time':time_list})



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
