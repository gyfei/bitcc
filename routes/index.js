//autoload all files in routes
(function() {
  module.exports = (function(_this) {
    return function(app) {
      return require("fs").readdirSync(__dirname).forEach(function(file) {
        var ext, i;
        i = file.lastIndexOf('.');
        ext = i < 0 ? '' : file.substr(i);
        if ((ext === ".js" || ext === ".coffee") && file !== "index" + ext) {
          return require("./" + file)(app);
        }
      });
    };
  })(this);

}).call(this);