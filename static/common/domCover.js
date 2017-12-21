/* domCover.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

//eslint-disable-next-line max-statements
define(()=>{
  const featureMap = {};

  const xdom = Symbol('dom cover in domCover');
  function isXdom(elm) {
    return xdom in elm;
  }


  function addText(cntxt, txt) {
    cntxt.dom.appendChild(
      document.createTextNode(txt)
    );
    return cntxt.self;
  }

  featureMap.text = Object.entries({
    addText,
    setText(cntxt, txt) {
      cntxt.dom.textContent = txt;
      return cntxt.self;
    },
    getText(cntxt) {
      return cntxt.dom.textContent;
    },
    clear(cntxt) {
      cntxt.dom.textContent = '';
      return cntxt.self;
    },
  });

  function append(cntxt, elms, noNestedFlag = true) {
    if (noNestedFlag && Array.isArray(elms)) {
      elms.forEach((elm) => {
        append(cntxt, elm, false);
      });
    } else if (typeof elms === 'string') {
      addText(cntxt, elms);
    } else if (isXdom(elms)) {
      cntxt.dom.appendChild(elms.dom);
    } else {
      throw new Error(`can not append type ${typeof elms}:\n ${elms}`);
    }
    return cntxt.self;
  }

  featureMap.container = Object.entries({
    append,
  });

  featureMap.attribute = Object.entries({
    attr(cntxt, attrName) {
      return cntxt.dom.getAttribute(attrName);
    },
    setAttr(cntxt, attrName, attrVal) {
      cntxt.dom.setAttribute(attrName, attrVal);
      return cntxt.self;
    },
  });

  featureMap.class = Object.entries({
    isClass(cntxt, className) {
      return cntxt.dom.contains(className);
    },
    addClass(cntxt, className) {
      cntxt.dom.classList.add(className);
      return cntxt.self;
    },
    removeClass(cntxt, className) {
      cntxt.dom.classList.remove(className);
      return cntxt.self;
    },
    toggleClass(cntxt, className) {
      cntxt.dom.classList.toggle(className);
      return cntxt.self;
    },
  });

  featureMap.val = Object.entries({
    val(cntxt) {
      return cntxt.dom.value;
    },
    setVal(cntxt, val) {
      cntxt.dom.value = val;
      return cntxt.dom.self;
    }
  });

  featureMap.event = Object.entries({
    on(cntxt, eventName, eventHandler) {
      cntxt.dom.addEventListener(eventName, eventHandler);
      return cntxt.self;
    },
  });

  function addFeature(cntxt, features0) {
    let features = null;
    if (Array.isArray(features0)) {
      features = features0;
    } else if (typeof features0 === 'string') {
      features = [features0];
    } else {
      throw new Error(`bad type feature(${typeof feature0})`);
    }
    features.forEach((feature) => {
      const fMap = featureMap[feature];
      if (Object.keys(fMap).length === 0) {
        throw new Error(`feature[${feature}] is unkown.`);
      }
      fMap.forEach(([name, entry])=>{
        cntxt.self[name] = entry.bind(null, cntxt);
      });
    });
    return cntxt.self;
  }

  featureMap.base = Object.entries({
    addFeature,
    feature(cntxt, featureList, handle) {
      const tempSelf = cntxt.self;
      cntxt.self = {};
      addFeature(cntxt, featureList);
      handle(cntxt.self);
      cntxt.self = tempSelf;
      return cntxt.self;
    },
    remove(cntxt) {
      cntxt.dom.remove();
      return cntxt.self;
    },
  });


  function genElm(domElm) {
    const domInfo = {
      dom: domElm,
      self: {},
    };
    domInfo.self[xdom] = domInfo;
    domInfo.self.dom = domElm;
    addFeature(domInfo, 'base');

    return domInfo.self;
  }
  return {
    genElm,
  };

});
