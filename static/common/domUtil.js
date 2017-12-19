/* domUtil.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

//eslint-disable-next-line max-statements
define(['/lib/common/domCover.js'], (domCover)=>{
  const genElm = domCover.genElm;

  function checkLoadedDocument() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
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
     const pOuter = create('div').addFeature(['class','container']).addClass('row'),
           pInner = create('div').addFeature(['class','container']).addClass('col');
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
