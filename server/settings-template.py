"""
Log Overview --- Template settings file

Copy to settings.py and customized according to your setup.
"""

import os

# Server base dir
SERVER_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(SERVER_BASE_DIR)

# HTTP server network configuration
HOST_NAME = "0.0.0.0"
HOST_PORT = 9000

# How URLs paths map to the filesystem
ROUTES = [
    # [url_prefix ,  directory_path]
    ['/log',   '/opt/tomcat/logs'],
    ['',       os.path.join(BASE_DIR, 'client')]  # by default, serve the JS client files; points to the web client
]

# List of 'interval' definitions. An interval is an interval of adjacent lines of the input file. Each interval
# definition is a dictionary composed of the following keys:
# - 'name': the name associated with the intervals.
# - 'startRegEx': a regex matching the lines that begin an intervals.
# - 'endRegEx': a regex matching the lines that end and interval. This can contain back-references of the regex
#               matching the start of the interval.
# - 'tooltip': the content of the tooltip associated with the interval. This can contain back-references of the regex
#              matching the start of the interval.
#
# The default value matches the following type of log file:
# 2015-06-24 04:43:53,249 [ INFO] Start "charging" activity
# 2015-06-24 04:43:53,255 [ INFO] End "charging" activity
INTERVALS = [
    {
        'name':       'Activities',
        'startRegEx': r'Start "([^"]*).*',
        'endRegEx':   r'End "\1".*',
        'tooltip':    r'Activity \1'
    }
]
