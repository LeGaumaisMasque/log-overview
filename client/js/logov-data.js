// Get some measurements on the intervals/data
function summary(data) {
    var intervals = data.intervals;
    intervals.forEach(tagLevel);

    // For each interval of 'intervals', find the maximum nb of levels
    var nbLevels = intervals.map(function (i) { return d3.max(i.data, function(d) { return d.level; }); });

    // Map to each interval of 'intervals', the sum of the number of levels in the intervals before
    var nbSumLevels = nbLevels.reduce(function(acc,c) { acc.push(acc[acc.length-1] + c + 1); return acc; }, [0]);

    return {
        firstTime: d3.min(intervals, function(e) { return d3.min(e.data, function(d) { return d.t[0]; }); }),
        lastTime:  d3.max(intervals, function(e) { return d3.max(e.data, function(d) { return d.t[1]; }); }),
        nbLevels:  nbLevels,
        nbSumLevels: nbSumLevels,
        totalNbLevels: nbSumLevels[nbSumLevels.length-1]
    };
}


///////////////////////////////////////////////////////////////////////////////
// Adds a 'level' property to each interval
///////////////////////////////////////////////////////////////////////////////

function tagLevel(iDef) {
    var trees = [];

    iDef.data.forEach(function(e) {
        for (var i = trees.length - 1; i >= 0; i--) {
            if (trees[i].intersects(e.t)) {
                e.level = i+1;
                break;
            }
        }

        e.level = e.level || 0;
        if (e.level == trees.length) {
            var it = new IntervalTree();
            trees.push(it);
        }

        trees[e.level].add(e.t);
    });
}
