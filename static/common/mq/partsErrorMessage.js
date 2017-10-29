/* mq partsErrorMessage.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

// display Error message parts
define((require) => {
  const {
          parts: partsMessage,
        } = require('./partsMessage');

  function parts() {
    const partsElm = partsMessage(),
          cntxt = partsElm[Symbol.for('develop')].context;

    cntxt.mqClasses.add({
        'color-error': ['color-error', true],
      });

    return partsElm;
  }
  return {
    parts,
  };
});
