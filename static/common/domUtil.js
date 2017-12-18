/* domUtil.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

//eslint-disable-next-line max-statements
define(()=>{
  const featureMap = {};
  const xdom = Symbol('dom cover in domUtil');

  function checkLoadedDocument() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

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
    remove(cntxt) {
      cntxt.dom.remove();
      return cntxt.self;
    },
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
    }
    features.forEach((feature) => {
      featureMap[feature].forEach(([name, entry])=>{
        cntxt.self[name] = entry.bind(null, cntxt);
      });
    });
    return cntxt.self;
  }

  function genElm(domElm, param={}) {
    const domInfo = {
      dom: domElm,
      param,
      self: {},
    };
    domInfo.self[xdom] = domInfo;
    domInfo.self.dom = domElm;
    domInfo.self.addFeature = addFeature.bind(null, domInfo);

    return domInfo.self;
  }

  function $(idStr) {
    return genElm(document.getElementById(idStr));
  }

  function body() {
    return genElm(document.body);
  }
  function head() {
    return genElm(document.head);
  }
  function create(tagName, param) {
    return genElm(
      document.createElement(tagName),
      param
    );
  }

  function map(domCol, handler) {
    const size = domCol.length,
          ret = [];

    for (let i=0; i<size; i+=1) {
      ret.push(handler(domCol[i]));
    }

    return ret;
  }
  function getClass$List(className) {
    return map(document.getElementsByClassName(className), (domElm)=>{
      return genElm(domElm);
    });
  }

  function getTag$List(tagName) {
    return map(document.getElementsByTagName(tagName), (domElm)=>{
      return genElm(domElm);
    });
  }

  function deviceType() {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0) {
      return 'mobile';
    }
    return 'unkown';
   }

   function genBar(children=null) {
     const pOuter = create('div').addClass('row'),
           pInner = create('div').addClass('col');
     pOuter.append(pInner);
     if (children !== null) {
       pInner.append(children);
     }
     pOuter.directAppend = pOuter.append;
     pOuter.append = pInner.append;
     pOuter.inner = pInner;

     return pOuter;
   }

  return {
    body,
    head,
    create,

    $,
    getClass$List,
    getTag$List,
    checkLoadedDocument,
    deviceType,
    genBar,
  };
});
