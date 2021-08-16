import json
import numpy as np
from pathlib import Path
from typing import Tuple, List, Any
from datetime import datetime as dt
from utils.config import dt_format, label_path, db, collection


def detections(obj: dict) -> Tuple[Any, List[str], List[dict]]:
    """ Main function , handle request type and flow """
    dt_data = np.zeros((obj['range'], 1207), dtype='float32').tolist()

    if db == 'db':
        dt_labels, dt_time = online_detections(obj['range'], obj['timestamp'])
    else:
        dt_labels, dt_time = static_detections(obj['range'], obj['timestamp'])

    return dt_data, dt_time, dt_labels


def static_detections(n: int, ts: float) -> Tuple[List[dict], List[str]]:
    """ Return list of detections, timeline by range & time from StaticFiles """
    labels, times = [], []
    file_list = sorted(Path(label_path).rglob('*.json'), key=lambda f: dt.strptime(f.stem, dt_format))

    if ts != '':
        ts_format = dt.fromtimestamp(ts / 1000).strftime(dt_format)
        file_list = [f for f in file_list if dt.strptime(f.stem, dt_format) >
                     dt.strptime(ts_format, dt_format)][:n]

    for idx, file in enumerate(file_list[-n:]):
        times.append(file.stem)
        with open(file) as d:
            for label in json.load(d):
                labels.append(detections_convert(label, idx))

    return labels, times


def online_detections(n: int, ts: float) -> Tuple[List[dict], List[str]]:
    """ Return list of detections, timeline by range & time from MongoDB """
    labels, times = [], []
    label_list = list(collection.find())

    if ts != '':
        ts_format = dt.fromtimestamp(ts / 1000).strftime(dt_format)
        label_list = [f for f in label_list if dt.strptime(f['_id'], dt_format) >
                      dt.strptime(ts_format,dt_format)][:n]

    for idx, l in enumerate(label_list[-n:]):
        times.append(l['_id'])
        for label in l['result']:
            labels.append(detections_convert(label, idx))

    return labels, times


def detections_convert(label: dict, idx: int) -> dict:
    """ Convert labels y axis to fit gui timeline """
    return {
        'type': 'rect',
        'x0': label['bbox']['x1'],
        'y0': (label['bbox']['y1'] / 120000) + idx - 0.5,
        'x1': label['bbox']['x2'],
        'y1': (label['bbox']['y2'] / 120000) + idx - 0.5,
        'line': {'color': {1: 'yellow', 2: 'blue', 3: 'green', 4: 'pink', 5: 'purple'}.get(label['cls'], 'white')}
    }
