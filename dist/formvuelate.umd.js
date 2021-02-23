(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["formvuelate"] = factory(require("vue"));
	else
		root["formvuelate"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "2b09":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_dist_index_js_ref_0_1_SchemaForm_vue_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dc65");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_dist_index_js_ref_0_1_SchemaForm_vue_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_dist_index_js_ref_0_1_SchemaForm_vue_vue_type_style_index_0_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 

/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "dc65":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "SchemaForm", function() { return /* reexport */ SchemaForm; });
__webpack_require__.d(__webpack_exports__, "SchemaWizard", function() { return /* reexport */ SchemaWizard; });
__webpack_require__.d(__webpack_exports__, "SchemaFormFactory", function() { return /* reexport */ SchemaFormFactory; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/dist??ref--0-1!./src/SchemaForm.vue?vue&type=template&id=e36df94c

function render(_ctx, _cache) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDynamicComponent"])(!_ctx.hasParentSchema ? 'form' : 'div'), _ctx.formBinds, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(function () {
      return [!_ctx.hasParentSchema ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "beforeForm", {
        key: 0
      }) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.parsedSchema, function (fields, index) {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("div", {
          class: ['schema-row', _ctx.schemaRowClasses],
          key: index
        }, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(fields, function (field) {
          return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDynamicComponent"])(field.component), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["mergeProps"])(_ctx.binds(field), {
            key: field.model,
            modelValue: _ctx.val(field),
            "onUpdate:modelValue": function onUpdateModelValue($event) {
              return _ctx.update(field.model, $event);
            },
            "onUpdate-batch": function onUpdateBatch($event) {
              return _ctx.updateBatch(field.model, $event);
            },
            class: "schema-col"
          }), null, 16, ["modelValue", "onUpdate:modelValue", "onUpdate-batch"]);
        }), 128
        /* KEYED_FRAGMENT */
        ))], 2);
      }), 128
      /* KEYED_FRAGMENT */
      )), !_ctx.hasParentSchema ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "afterForm", {
        key: 1
      }) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)];
    }),
    _: 1
  }, 16);
}
// CONCATENATED MODULE: ./src/SchemaForm.vue?vue&type=template&id=e36df94c

// CONCATENATED MODULE: ./src/features/UniqueID.js
function useUniqueID() {
  var UUID = Math.floor(Math.random() * 1000000000);
  var UUIDBindings = new Map();

  function getID(model) {
    if (UUIDBindings.has(model)) {
      return UUIDBindings.get(model);
    } else {
      UUID++;
      UUIDBindings.set(model, UUID);
      return UUID;
    }
  }

  return {
    UUID: UUID,
    UUIDBindings: UUIDBindings,
    getID: getID
  };
}
// CONCATENATED MODULE: ./src/features/ParsedSchema.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



function useParsedSchema(props) {
  var _useUniqueID = useUniqueID(),
      getID = _useUniqueID.getID;

  var parsedSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
    var arraySchema = Array.isArray(props.schema) ? props.schema : Object.keys(props.schema).map(function (model) {
      return _objectSpread(_objectSpread({}, props.schema[model]), {}, {
        model: model
      });
    });
    var normalizedSchema = arraySchema.map(function (field) {
      return Array.isArray(field) ? field : [field];
    });
    return normalizedSchema.map(function (fieldGroup) {
      return fieldGroup.map(function (field) {
        return _objectSpread(_objectSpread({}, field), {}, {
          uuid: getID(field.model)
        });
      });
    });
  });
  return {
    parsedSchema: parsedSchema
  };
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/dist??ref--0-1!./src/SchemaForm.vue?vue&type=script&lang=js
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function SchemaFormvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function SchemaFormvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { SchemaFormvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { SchemaFormvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { SchemaFormvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function SchemaFormvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ var SchemaFormvue_type_script_lang_js = ({
  props: {
    schema: {
      type: [Object, Array],
      required: true,
      validator: function validator(schema) {
        if (!Array.isArray(schema)) return true;
        return schema.filter(function (field) {
          return !Array.isArray(field) && !field.model && !field.schema;
        }).length === 0;
      }
    },
    modelValue: {
      type: Object,
      required: true
    },
    sharedConfig: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    preventModelCleanupOnSchemaChange: {
      type: Boolean,
      default: false
    },
    schemaRowClasses: {
      type: [String, Object, Array],
      default: null
    }
  },
  emits: ['submit', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var hasParentSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])('parentSchemaExists', false);

    if (!hasParentSchema) {
      Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])('parentSchemaExists', true);
    }

    var _useParsedSchema = useParsedSchema(props),
        parsedSchema = _useParsedSchema.parsedSchema;

    var cleanupModelChanges = function cleanupModelChanges(schema, oldSchema) {
      if (props.preventModelCleanupOnSchemaChange) return;

      var reducer = function reducer(acc, val) {
        return acc.concat(val.map(function (i) {
          return i.model;
        }));
      };

      var newKeys = schema.reduce(reducer, []);
      var oldKeys = oldSchema.reduce(reducer, []);
      var diff = oldKeys.filter(function (i) {
        return !newKeys.includes(i);
      });
      if (!diff.length) return;

      var val = SchemaFormvue_type_script_lang_js_objectSpread({}, props.modelValue);

      var _iterator = _createForOfIteratorHelper(diff),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          delete val[key];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      emit('update:modelValue', val);
    };

    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["watch"])(parsedSchema, cleanupModelChanges);

    var update = function update(property, value) {
      emit('update:modelValue', SchemaFormvue_type_script_lang_js_objectSpread(SchemaFormvue_type_script_lang_js_objectSpread({}, props.modelValue), {}, SchemaFormvue_type_script_lang_js_defineProperty({}, property, value)));
    };

    var updateBatch = function updateBatch(property, values) {
      emit('update:modelValue', SchemaFormvue_type_script_lang_js_objectSpread(SchemaFormvue_type_script_lang_js_objectSpread({}, props.modelValue), values));
    };

    var binds = function binds(field) {
      return field.schema ? {
        schema: field.schema
      } : SchemaFormvue_type_script_lang_js_objectSpread(SchemaFormvue_type_script_lang_js_objectSpread({}, props.sharedConfig), field);
    };

    var val = function val(field) {
      if (field.schema && !props.modelValue[field.model]) {
        return {};
      }

      return props.modelValue[field.model];
    };

    var formBinds = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      if (hasParentSchema) return {};
      return {
        onSubmit: function onSubmit(event) {
          event.preventDefault();
          emit('submit', event);
        }
      };
    });
    return {
      parsedSchema: parsedSchema,
      val: val,
      binds: binds,
      update: update,
      updateBatch: updateBatch,
      hasParentSchema: hasParentSchema,
      formBinds: formBinds
    };
  }
});
// CONCATENATED MODULE: ./src/SchemaForm.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./src/SchemaForm.vue?vue&type=style&index=0&lang=css
var SchemaFormvue_type_style_index_0_lang_css = __webpack_require__("2b09");

// CONCATENATED MODULE: ./src/SchemaForm.vue





SchemaFormvue_type_script_lang_js.render = render

/* harmony default export */ var SchemaForm = (SchemaFormvue_type_script_lang_js);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/dist??ref--0-1!./src/SchemaWizard.vue?vue&type=template&id=8ec1805c

function SchemaWizardvue_type_template_id_8ec1805c_render(_ctx, _cache) {
  var _component_SchemaForm = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SchemaForm");

  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("form", {
    onSubmit: _cache[1] || (_cache[1] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])(function ($event) {
      return _ctx.$emit('submit', $event);
    }, ["prevent"]))
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "beforeForm"), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SchemaForm, {
    schema: _ctx.currentSchema,
    modelValue: _ctx.modelValue[_ctx.step] || {},
    "onUpdate:modelValue": _ctx.update
  }, null, 8, ["schema", "modelValue", "onUpdate:modelValue"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "afterForm")], 32);
}
// CONCATENATED MODULE: ./src/SchemaWizard.vue?vue&type=template&id=8ec1805c

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/dist??ref--0-1!./src/SchemaWizard.vue?vue&type=script&lang=js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || SchemaWizardvue_type_script_lang_js_unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function SchemaWizardvue_type_script_lang_js_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return SchemaWizardvue_type_script_lang_js_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SchemaWizardvue_type_script_lang_js_arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return SchemaWizardvue_type_script_lang_js_arrayLikeToArray(arr); }

function SchemaWizardvue_type_script_lang_js_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



/* harmony default export */ var SchemaWizardvue_type_script_lang_js = ({
  components: {
    SchemaForm: SchemaForm
  },
  props: {
    schema: {
      type: Array,
      required: true
    },
    step: {
      type: Number,
      required: true,
      default: 0
    },
    modelValue: {
      type: Array,
      required: true
    }
  },
  emits: ['submit', 'update:modelValue'],
  setup: function setup(props, context) {
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])('parentSchemaExists', true);
    var currentSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      return props.schema[props.step];
    });

    var update = function update(data) {
      var value = _toConsumableArray(props.modelValue);

      value[props.step] = data;
      context.emit('update:modelValue', value);
    };

    return {
      currentSchema: currentSchema,
      update: update
    };
  }
});
// CONCATENATED MODULE: ./src/SchemaWizard.vue?vue&type=script&lang=js
 
// CONCATENATED MODULE: ./src/SchemaWizard.vue



SchemaWizardvue_type_script_lang_js.render = SchemaWizardvue_type_template_id_8ec1805c_render

/* harmony default export */ var SchemaWizard = (SchemaWizardvue_type_script_lang_js);
// CONCATENATED MODULE: ./src/SchemaFormFactory.js
function SchemaFormFactory_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function SchemaFormFactory_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { SchemaFormFactory_ownKeys(Object(source), true).forEach(function (key) { SchemaFormFactory_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { SchemaFormFactory_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function SchemaFormFactory_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


function SchemaFormFactory() {
  var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  // Copy the original SchemaForm setup
  var originalSetup = SchemaForm.setup;

  function setup(props, context) {
    // Call the original setup and preserve its results
    var baseSchemaFormReturns = originalSetup(props, context);
    if (!plugins.length) return baseSchemaFormReturns;else {
      // Apply plugins on the data returned
      // by the original Schemaform
      return plugins.reduce(function (schemaFormReturns, plugin) {
        return plugin(schemaFormReturns, props, context);
      }, baseSchemaFormReturns);
    }
  }

  return SchemaFormFactory_objectSpread(SchemaFormFactory_objectSpread({}, SchemaForm), {}, {
    components: SchemaFormFactory_objectSpread(SchemaFormFactory_objectSpread({}, SchemaForm.components), components),
    // Return a customized setup function with plugins
    // as the new SchemaForm setup
    setup: setup
  });
}
// CONCATENATED MODULE: ./src/index.js



/* harmony default export */ var src_0 = (SchemaForm);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_0);



/***/ })

/******/ });
});
//# sourceMappingURL=formvuelate.umd.js.map