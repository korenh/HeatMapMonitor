import os
from pymongo import MongoClient

if 'single_path' and 'label_path' and 'db' and 'mongo_url' and 'collection' in os.environ:
    db = os.environ['db']
    dt_format = '%d-%m-%Y_%H-%M-%S'
    mongo_url = os.environ['mongo_url']
    single_path = os.environ['single_path']
    label_path = os.environ['label_path']
    coll = os.environ['collection']
else:
    db = 'static'
    mongo_url = 'mongodb://localhost:27017'
    dt_format = '%d-%m-%Y_%H-%M-%S'
    single_path = './data/single/'
    label_path = './data/labels2/'
    coll = 'test2'

collection = MongoClient(mongo_url)['db'][coll] if db == 'db' else ''
