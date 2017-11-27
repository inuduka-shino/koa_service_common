/* domUtil.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(()=>{
  function checkLoadedDocument() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }


  const xdom = Symbol('dom cover in domUtil');
  function isXdom(elm) {
    return xdom in elm;
  }
  function on(cntxt, eventName, eventHandler) {
    cntxt.dom.addEventListener(eventName, eventHandler);
    return cntxt.self;
  }
  function clear(cntxt) {
    cntxt.dom.textContent = '';
    return cntxt.self;
  }
  function remove(cntxt) {
    cntxt.dom.remove();
    return cntxt.self;
  }
  function isClass(cntxt, className) {
    return cntxt.dom.contains(className);
  }
  function addClass(cntxt, className) {
    cntxt.dom.classList.add(className);
    return cntxt.self;
  }
  function removeClass(cntxt, className) {
    cntxt.dom.classList.remove(className);
    return cntxt.self;
  }
  function toggleClass(cntxt, className) {
    cntxt.dom.classList.toggle(className);
    return cntxt.self;
  }
  function attr(cntxt, attrName) {
    return cntxt.dom.getAttribute(attrName);
  }
  function setAttr(cntxt, attrName, attrVal) {
    cntxt.dom.setAttribute(attrName, attrVal);
    return cntxt.self;
  }
  function text(cntxt, txt) {
    cntxt.dom.textContent = txt;
    return cntxt.self;
  }
  function addText(cntxt, txt) {
    cntxt.dom.appendChild(
      document.createTextNode(txt)
    );
    return cntxt.self;
  }
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

  function genElm(domElm, param={}) {
    const domInfo = {
      dom: domElm,
      param,
      self: {},
    };
    domInfo.self[xdom] = domInfo;
    Object.assign(domInfo.self, {
      dom: domElm,
      on: on.bind(null, domInfo),

      clear: clear.bind(null, domInfo),
      remove: remove.bind(null, domInfo),

      isClass: isClass.bind(null, domInfo),
      addClass: addClass.bind(null, domInfo),
      removeClass: removeClass.bind(null, domInfo),

      toggleClass: toggleClass.bind(null, domInfo),
      setAttr: setAttr.bind(null, domInfo),
      attr: attr.bind(null, domInfo),

      append: append.bind(null, domInfo),

      // ---
      addText: addText.bind(null, domInfo),
    });
    if (param.text) {
      domInfo.self.text = text.bind(null, domInfo);
    }

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

  return {
    body,
    head,
    create,

    $,
    getClass$List,
    getTag$List,
    checkLoadedDocument,
    deviceType,
  };
});
