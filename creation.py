import numpy as np
from pathlib import Path
from scipy import signal
from datetime import datetime
import matplotlib.pyplot as plt
from matplotlib.colors import LogNorm
from scipy.signal import butter, lfilter


def creation(f):
    data = np.load(f, mmap_mode='r')
    b, a = butter(5, Wn=10, btype='highpass', fs=2000)
    x = np.abs(lfilter(b, a, np.cumsum(data, axis=1))).T
    x = x / np.expand_dims(np.percentile(x, 10, axis=1), axis=1)
    x = signal.resample(x, 1000)
    min_v = .1
    x[x > min_v] = np.log2((x[x > min_v]-min_v)/(np.amax(x[x > min_v])-min_v))
    # x = np.flipud(x)
    np.save('./data/sample/{}.npy'.format(f.stem), x)
    
if __name__=='__main__':
    f_list = sorted(Path('./data/data').glob('*.npy'), key=lambda f: datetime.strptime(f.stem,  "%d-%m-%Y_%H-%M-%S"))
    for f in f_list:
        print(f)
        creation(f)