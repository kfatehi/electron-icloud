const capconf = (captureConfig, data, callback) => {
  const { pathname } = data;
  captureConfig.forEach((cfg) => {
    if (cfg.pathname) {
      if (cfg.pathname.endsWith) {
        const val = cfg.pathname.endsWith;
        if (pathname.endsWith(val)) {
          callback(cfg.id);
        }
      }
    }
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    capconf
  }
} else {
  const { ipcRenderer } = require('electron');

  const captureConfig = ipcRenderer.sendSync('get-xhr-capture-config');

  (function(open, send) {
    XMLHttpRequest.prototype.send = function(data) {
      this._requestData = data;
      send.call(this, data);
    }

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

      const capture = (_url) => () => {
        ipcRenderer.send('xhr-captured', {
          href: _url.href,
          pathname: _url.pathname,
          status: this.status,
          request: this._requestData,
          response: this.response,
        });
      }

      this.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {

          try {
            const _url = new URL(url);
            capconf(captureConfig, _url, capture(_url));
          } catch (e) {}

        }
      }, false);

      open.call(this, method, url, async, user, pass);
    };

  })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)
}
