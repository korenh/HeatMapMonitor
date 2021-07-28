import json
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime as dt

client = MongoClient('mongodb://localhost:27017')
database = client['db']
collection = database['test']

def file_map(path):
    return sorted(path.rglob('*.json'), key=lambda f: dt.strptime(f.stem, "%d-%m-%Y_%H-%M-%S"))


def file_loop(file_list):
    for idx, file in enumerate(file_list):
        print(idx)
        name, data = file_data(file)
        mongo_insert(name, data)


def file_data(file):
    with open(file) as d:
            return file.stem, json.load(d)
            

def mongo_insert(name, data):
    collection.find_one_and_update(
        {'_id':name},
        {'$set':
            {
                '_id':name,
                'result': data
            }
        },
        upsert=True
    )


def mongo_get_data(id=''):
    if id == '':
        for l in collection.find({}): 
            print(l)
            exit(-1)


if __name__ == "__main__":
    
    path = Path('./data/labels2')
    file_list = file_map(path)
    file_loop(file_list)

    # mongo_get_data()