/* mq partsMessage.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

// display message parts
// parts(initMessage).set(message)
define((require) => {
  const maquette = require('maquette'),
        {
          genClasses: genMqClasses,
        } = require('./util');
  const h = maquette.h;

  // class names

  function render(cntx) {
    const classesObj = cntx.mqClasses.obj();
    return h('span', {
      // t: cntx.ct,
      //classes: Object.assign({},cntx.classes),
      classes: classesObj,
    }, cntx.message);
  }

  function set(cntx, msg) {
    cntx.ct += 1;
    if (msg === '' || msg === null || typeof msg === 'undefined') {
      cntx.message = cntx.initMessage;
      //cntx.colorClass = 'light';
      cntx.mqClasses.set('light');
    } else {
      cntx.message = msg;
      //cntx.colorClass = 'main';
      cntx.mqClasses.unset('light');
    }
  }
  function show(cntx) {
    cntx.mqClasses.set('hide');
  }
  function hide(cntx) {
    cntx.mqClasses.unset('hide');
  }

  function parts(initMessage='ready..') {
    const cntx = {
        initMessage,
        message: initMessage,
        // colorClass: 'light',
        mqClasses: genMqClasses({
            light: ['color-light', true],
            hide: false,
          }),
        };
    return {
      [Symbol.for('develop')]: {
        context: cntx,
      },
      set: set.bind(null, cntx),
      hide: hide.bind(null, cntx),
      show: show.bind(null, cntx),
      render: render.bind(null, cntx)
    };
  }

  return {
    parts,
  };
});
