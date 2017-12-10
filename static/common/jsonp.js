/* jsonp.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */


define((require)=>{
  const {
    create,
    head,
  } = require('./domUtil');

  function callJsonp(url,params) {
    const callbackName = params.callback;
    const paramStr = Object.entries(params).map((keyval)=>{
      return keyval.join('=');
    }).join('&');

    const $script = create('script');
    $script
      .setAttr('type', 'text/javascript')
      .setAttr('src', [url, paramStr].join('?'));
    const prms = new Promise((resolve, reject)=>{
      window[callbackName] = (data)=>{
        resolve(data);
        $script.remove();
        // delete window[callbackName];
      };
      try {
        head().append($script);
      } catch (err) {
        reject(err);
      }
    });
    return prms;
  }

  return {
    callJsonp
  };
});
