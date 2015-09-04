# Log Overview

**_Display a log file as a "time interval" chart_**


### What it looks like

_Log overview_ sets up a web interface displaying log files as a chart.
Charts are navigable time line displaying duration intervals.

![Screenshot](https://raw.githubusercontent.com/LeGaumaisMasque/log-overview/master/doc/images/screenshot-1.png)

Intervals start and end correspond to specific log lines. _Log overview_ setup mainly consists of defining the
regular expressions matching those start and end lines.


### Installing

Install the javascript libraries using `bower`:
```
cd client
bower install
```

To setup the server settings, copy the `server/settings-template.py` to `server/settings.py` and customize to
match your configuration.

Start the server using the `python3 server/httpserver.py` command.
