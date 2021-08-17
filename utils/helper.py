""" @author: koren hamra """
import json
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime as dt
from typing import Union, List, NoReturn, Tuple

client = MongoClient('mongodb://localhost:27017')
database = client['db']
collection = database['test2']


def file_map(path: Union[str, Path]) -> List[Union[str, Path]]:
    """ Map directory by date format """
    return sorted(path.rglob('*.json'), key=lambda f: dt.strptime(f.stem, "%d-%m-%Y_%H-%M-%S"))


def file_loop(file_list: List[Union[str, Path]]) -> NoReturn:
    """ Loop over file_list and implement following """
    for idx, file in enumerate(file_list):
        name, data = file_data(file)
        mongo_insert(name, data)


def file_data(file: Union[str, Path]) -> Tuple[str, dict]:
    """ Read file Data """
    with open(file) as d:
        return file.stem, json.load(d)


def mongo_insert(name: str, data: List[dict]) -> NoReturn:
    """ Insert into MongoDB """
    collection.find_one_and_update(
        {'_id': name},
        {'$set':
            {
                '_id': name,
                'result': data
            }
        },
        upsert=True
    )


def mongo_get_data() -> NoReturn:
    """ Show data from MongoDB """
    labels = []
    times = []
    for idx, l in enumerate(collection.find().skip(collection.count() - 2)):
        times.append(l['_id'])
        for label in l['result']:
            labels.append({
                'type': 'rect',
                'x0': label['bbox']['x1'],
                'y0': (label['bbox']['y1'] / 120000) + idx - 0.5,
                'x1': label['bbox']['x2'],
                'y1': (label['bbox']['y2'] / 120000) + idx - 0.5,
                'line': {'color':
                             {1: 'yellow', 2: 'blue', 3: 'green', 4: 'pink', 5: 'purple'}.get(label['cls'], 'white')}})
    print(labels)


if __name__ == "__main__":
    # path = Path('./data/labels2')
    # file_list = file_map(path)
    # file_loop(file_list)

    mongo_get_data()
