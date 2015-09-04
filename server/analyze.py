import re
import datetime
import settings


# Time format: 2015-06-10 12:26:24,608
def getTime(line):
    "Given a log line, returns the corresponding Unix timestamp"
    d = datetime.datetime(int(line[:4]), int(line[5:7]), int(line[8:10]),
                                        int(line[11:13]), int(line[14:16]), int(line[17:19]), int(line[21:24])*1000)
    return int(d.timestamp()*1000)


def resolveBackRef(endRegEx, startMatcher):
    """Given a regex, replace its backreferences by the groups held by a regex matcher"""
    i = 1
    for group in startMatcher.groups():
        p = re.compile(r'\\' + str(i))
        endRegEx = p.sub(group, endRegEx)
        i = i+1
        return endRegEx


def output(iDef, startLine, endLine):
    return { 't' : [ getTime(startLine), getTime(endLine) ],
             'tip': resolveBackRef(iDef['tooltip'], re.search(iDef['startRegEx'], startLine)) };


def analyzeLine(line, iDef, endRegExs):
    out = None
    for le in endRegExs:
        if le[1].search(line):
            out = output(iDef, le[0], line)
            endRegExs.remove(le)
    match = re.search(iDef['startRegEx'], line)
    if match:
        endRegExs.append([line, re.compile(resolveBackRef(iDef['endRegEx'], match))])
    return out


def analyze(file):
    data = []
    for iDef in settings.INTERVALS:
        endRegExs = []
        d = []
        with open(file, "r") as ins:
            for line in ins:
                l = analyzeLine(line, iDef, endRegExs)
                if l != None:
                    d.append(l)
        data.append({
            'name': iDef['name'],
            'data': d
        })
    return {'intervals': data}


if __name__ == "__main__":
    import json
    import sys
    if len(sys.argv) != 2:
        print("Usage: analyze.py <file>\n\tfile: A log4j file")
    else:
        data = analyze(sys.argv[1])
        print(json.dumps(data))


__all__ = ['analyze']
