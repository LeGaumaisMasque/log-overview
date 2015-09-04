import os
import sys
import posixpath
import urllib.parse
import time
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from analyze import analyze

try:
    import settings
except ImportError:
    print("No settings.py file present. Please copy and customize the settings-tempate.py file.")
    sys.exit(-1)


class LogOvHTTPServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        if parsed_path.path == "/analyze":
            q = urllib.parse.parse_qs(parsed_path.query)
            if not 'file' in q:
                self.send_error(422, "Missing 'file' parameter", "Wrong URL parameter")
            else:
                self.analyze(urllib.parse.parse_qs(parsed_path.query)['file'][0])
        elif parsed_path.path == "/nav":
            self.nav(urllib.parse.parse_qs(parsed_path.query)['file'][0])
        else:
            # serve filesystem files
            super(LogOvHTTPServer, self).do_GET()

    def analyze(self, file):
        try:
            data = analyze(self.translate_path(file))
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(data), "utf-8"))
        except FileNotFoundError:
            self.send_error(422, "Log file not found", "Wrong URL parameter")

    def nav(self, path):
        """returns a JSON representation of the content of a directory"""

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        if path == '/':
            arg = [{'text': x[0][1:], 'children': True} for x in settings.ROUTES][:-1]  # remove default route
        else:
            real_path = self.translate_path(path)
            if os.path.isdir(real_path):
                arg = [{'text': x, 'children': os.path.isdir(os.path.join(real_path, x))} for x in os.listdir(real_path)]
            else:
                arg = []
        self.wfile.write(bytes(json.dumps(arg), "utf-8"))

    def translate_path(self, path):
        """translate path given routes"""

        root = None

        # look up routes and set root directory accordingly
        for pattern, rootdir in settings.ROUTES:
            if path.startswith(pattern):
                # found match!
                path = path[len(pattern):]  # consume path up to pattern len
                root = rootdir
                break

        # normalize path and prepend root directory
        path = path.split('?',1)[0]
        path = path.split('#',1)[0]
        path = posixpath.normpath(urllib.parse.unquote(path))
        words = path.split('/')
        words = filter(None, words)

        path = root
        for word in words:
            drive, word = os.path.splitdrive(word)
            head, word = os.path.split(word)
            if word in (os.curdir, os.pardir):
                continue
            path = os.path.join(path, word)

        return path


httpServer = HTTPServer((settings.HOST_NAME, settings.HOST_PORT), LogOvHTTPServer)
print(time.asctime(), "Server Starts - %s:%s" % (settings.HOST_NAME, settings.HOST_PORT))

try:
    httpServer.serve_forever()
except KeyboardInterrupt:
    pass

httpServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (settings.HOST_NAME, settings.HOST_PORT))


__all__ = ['LogOvHTTPServer']
