const { capconf } = require('./preload');

module.exports.caphandler = (app, data) => {
  capconf(app.getCaptureCriteria(), data, (capid) => {
    app.routeCapture(capid, data);
  });
}

module.exports.capcombine = (apps) => {
  return apps.reduce((acc, app)=>{
    return [...acc, ...app.getCaptureCriteria()];
  }, []);
}
