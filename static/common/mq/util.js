/* mq util.js */
/*eslint-env browser */
/*eslint no-console: off */
/*global define */

define(() => {

  function setKey(cntx, k) {
    cntx.keyid=k;
    return cntx.thisIF;
  }

  function callRenderForArray(prow, idx) {
    if (prow.render) {
      if (prow.key) {
        return prow.key(idx).render();
      }
      return prow.render();
    }
    return prow;
  }

  // for classes
  const genClasses = (() =>{
    function setVal(cntxt,val, memberName) {
      const className = cntxt.nameTable[memberName];
      if (typeof className === 'undefined') {
        throw new Error(`unkown name(${memberName}).`);
      }
      const orgVal = cntxt.classesObj[className];
      if (orgVal !== val) {
        cntxt.classesObj[className] = val;
        cntxt.update = true;
      }
    }
    function obj(cntxt) {
      return Object.assign({}, cntxt.classesObj);
    }
    function parseArgs(name, args) {
      const typeOfArgs = typeof args;

      if (typeOfArgs === 'string') {
        return [args, true];
      }
      if (typeOfArgs === 'boolean') {
        return [name, args];
      }
      if (args instanceof Array) {
        return args;
      }
      throw new Error(`unkown pattern on ${name} value define: ${args}`);
    }

    function add (cntxt, members) {
      // members: {
      //   name: [className, initBoolean]
      //   name: initBoolean(true or false), (className = name)
      //   name: 'className',   (initBoolean = true)
      //    :
      // }
      const classesObj = cntxt.classesObj,
            nameTable = cntxt.nameTable;

      Object.entries(members).forEach(([name, args])=>{
        const [className, val] = parseArgs(name, args);
        classesObj[className] = val;
        nameTable[name] = className;
      });

    }
    return (members)=>{
      const classesObj = {},
            nameTable = {};
      const cntxt = {
          classesObj,
          nameTable,
          update: true,
      };
      // 初期化
      add(cntxt, members);

      return {
        add: add.bind(null, cntxt),
        set: setVal.bind(null, cntxt, true),
        unset: setVal.bind(null, cntxt, false),
        obj: obj.bind(null, cntxt),
      };
    };
  })();

  return {
    setKey,
    callRenderForArray,
    genClasses,
  };
});
