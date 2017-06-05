var fs = require('fs');
var path = require('path');
var getPages = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    var pending = list.length;
    if (!pending) return null;
    list.forEach(function (file) {
        file = path.resolve(dir, file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            var res = getPages(file);
            results = results.concat(res);
            if (!--pending) return null;
        } else {
            results.push(file);
            if (!--pending) return null;
        }
    });
    return results;
};

module.exports = getPages;