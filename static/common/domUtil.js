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

  function on(self, eventName, eventHandler) {
    self.dom.addEventListener(eventName, eventHandler);
  }
  function text(self, txt) {
    self.text = txt;
    self.dom.textContent = self.text;
  }
  function addText(self, txt) {
    self.text += txt;
    self.dom.textContent = self.text;
  }
  function isClass(self, className) {
    return self.dom.contains(className);
  }
  function addClass(self, className) {
    self.dom.classList.add(className);
  }
  function removeClass(self, className) {
    self.dom.classList.remove(className);
  }
  function toggleClass(self, className) {
    self.dom.classList.toggle(className);
  }
  function attr(self, attrName) {
    return self.dom.getAttribute(attrName);
  }
  function setAttr(self, attrName, attrVal) {
    self.dom.setAttribute(attrName, attrVal);
  }

  function genElm(domElm) {
    const domInfo = {
      dom: domElm,
      text: null,
    };

    return {
      dom: domInfo.dom,
      on: on.bind(null, domInfo),

      text: text.bind(null, domInfo),
      isClass: isClass.bind(null, domInfo),
      addClass: addClass.bind(null, domInfo),
      removeClass: removeClass.bind(null, domInfo),
      toggleClass: toggleClass.bind(null, domInfo),
      setAttr: setAttr.bind(null, domInfo),
      attr: attr.bind(null, domInfo),

      // ---
      addText: addText.bind(null, domInfo),
    };
  }

  function $(idStr) {
    return genElm(document.getElementById(idStr));
  }

  function body() {
    return genElm(document.body);
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
  function bodyClear() {
    getTag$List('body').forEach(($)=>{
      $.text('');
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
    $,
    getClass$List,
    getTag$List,
    body,
    bodyClear,
    checkLoadedDocument,
    deviceType,
  };
});
