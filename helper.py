import numpy as np
from pathlib import Path
from scipy import signal
import matplotlib.pyplot as plt
from matplotlib.colors import LogNorm
from scipy.signal import butter, lfilter


def waterfall(file_p):
    signals = np.load(file_p, mmap_mode='r')
    b, a = butter(5, Wn=10, btype='highpass', fs=2000)
    x = np.abs(lfilter(b, a, np.cumsum(signals, axis=1))).T
    x = x / np.expand_dims(np.percentile(x, 10, axis=1), axis=1)
    # Resample
    x = signal.resample(x, 1000)
    # Normalization

    # [np.abs(np.amax(x)-np.amin(x)) < 0.0000000001]
    #x /= (x-np.amin(x))/(np.amax(x)-np.amin(x)) 

    # Show
    plt.figure(1, figsize=(38.71, 19.485), dpi=100, frameon=False)
    plt.imshow(x, aspect='auto')
    plt.axis('off')


    np.save('./data/sample/20-02-2021_07-21-24.npy', x)
    #image_path = './data/{}.png'.format(Path(file_p).stem)
    #plt.savefig(image_path, bbox_inches='tight', pad_inches=0, dpi=100)
    #plt.close('all')

if __name__=='__main__':
    waterfall('./data/data/20-02-2021_07-21-24.npy')