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

    const $script = create('script')
            .addFeature(['attribute', 'event']);
    $script
      .setAttr('type', 'text/javascript')
      .setAttr('src', [url, paramStr].join('?'));
    const prms = new Promise((resolve, reject)=>{
      $script.on('load',()=>{
        $script.remove();
      });
      $script.on('error',(err)=>{
        reject(err);
        $script.remove();
      });
      window[callbackName] = (data)=>{
        resolve(data);
        // delete window[callbackName];
      };
      try {
        head().addFeature('container').append($script);
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
