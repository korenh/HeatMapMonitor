""" @author: koren hamra """
from waitress import serve
from flask_cors import CORS
from flask.globals import request
from utils.config import single_path
from utils.detections import detections
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__, static_folder="client/build/static/",
            template_folder="client/build/")
CORS(app)


@app.route('/')
def main():
    """ Render react build """
    return render_template('index.html')


@app.route('/image/<path:filename>')
def single(filename):
    """ Serve single images by directory & filename """
    return send_from_directory(single_path, filename)


@app.route('/data', methods=['POST'])
def data():
    """ Generate labels list, times list & np data """
    dt_data, dt_time, dt_labels = detections(request.json)
    return jsonify({'dt': {'data': dt_data, 'time': dt_time, 'labels': dt_labels}})


if __name__ == "__main__":
    """ WSGI server """
    serve(app)
