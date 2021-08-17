import os
from pymongo import MongoClient

db = os.getenv('db', 'static')
dt_format = os.getenv('dt_format', '%d-%m-%Y_%H-%M-%S')
mongo_url = os.getenv('mongo_url', 'mongodb://localhost:27017')
single_path = os.getenv('single_path', './data/single/')
label_path = os.getenv('label_path', './data/labels2/')
coll = os.getenv('collection', 'test2')
collection = MongoClient(mongo_url)['db'][coll] if db == 'db' else ''
