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

/***/ "3816":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SchemaForm_vue_vue_type_style_index_0_id_4f4339a1_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("9c8d");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SchemaForm_vue_vue_type_style_index_0_id_4f4339a1_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_v16_dist_index_js_ref_0_1_SchemaForm_vue_vue_type_style_index_0_id_4f4339a1_lang_css__WEBPACK_IMPORTED_MODULE_0__);
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

/***/ "9c8d":
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
__webpack_require__.d(__webpack_exports__, "useSchemaForm", function() { return /* reexport */ useSchemaForm; });
__webpack_require__.d(__webpack_exports__, "constants", function() { return /* reexport */ constants_namespaceObject; });

// NAMESPACE OBJECT: ./src/utils/constants.js
var constants_namespaceObject = {};
__webpack_require__.r(constants_namespaceObject);
__webpack_require__.d(constants_namespaceObject, "IS_SCHEMA_WIZARD", function() { return IS_SCHEMA_WIZARD; });
__webpack_require__.d(constants_namespaceObject, "PARENT_SCHEMA_EXISTS", function() { return PARENT_SCHEMA_EXISTS; });
__webpack_require__.d(constants_namespaceObject, "INJECTED_SCHEMA", function() { return INJECTED_SCHEMA; });
__webpack_require__.d(constants_namespaceObject, "SCHEMA_MODEL_PATH", function() { return SCHEMA_MODEL_PATH; });
__webpack_require__.d(constants_namespaceObject, "FORM_MODEL", function() { return FORM_MODEL; });
__webpack_require__.d(constants_namespaceObject, "FIND_NESTED_FORM_MODEL_PROP", function() { return FIND_NESTED_FORM_MODEL_PROP; });
__webpack_require__.d(constants_namespaceObject, "UPDATE_FORM_MODEL", function() { return UPDATE_FORM_MODEL; });
__webpack_require__.d(constants_namespaceObject, "DELETE_FORM_MODEL_PROP", function() { return DELETE_FORM_MODEL_PROP; });

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

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/SchemaForm.vue?vue&type=template&id=4f4339a1

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SchemaField = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SchemaField");

  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDynamicComponent"])($setup.behaveLikeParentSchema ? 'form' : 'div'), $setup.formBinds, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(function () {
      return [$setup.behaveLikeParentSchema ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "beforeForm", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["mergeProps"])({
        key: 0
      }, $setup.slotBinds)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])($setup.parsedSchema, function (fields, index) {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("div", {
          class: ['schema-row', $props.schemaRowClasses],
          key: index
        }, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(fields, function (field) {
          return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_SchemaField, {
            key: field.model,
            field: field,
            sharedConfig: $props.sharedConfig,
            preventModelCleanupOnSchemaChange: $props.preventModelCleanupOnSchemaChange,
            class: "schema-col"
          }, null, 8, ["field", "sharedConfig", "preventModelCleanupOnSchemaChange"]);
        }), 128))], 2);
      }), 128)), $setup.behaveLikeParentSchema ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "afterForm", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["mergeProps"])({
        key: 1
      }, $setup.slotBinds)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)];
    }),
    _: 3
  }, 16);
}
// CONCATENATED MODULE: ./src/SchemaForm.vue?vue&type=template&id=4f4339a1

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



/**
 * Find the elements in the row that have a schema property
 * @param {Array} row
 * @returns
 */

var findSchemaElementsInRow = function findSchemaElementsInRow(row) {
  return row.filter(function (el) {
    return el.schema;
  });
};
/**
 * Find the elements in the top level row of a schema
 * that are considered "schema" elements, aka. they have a schema prop
 * @param {Array} normalizedSchema
 * @returns
 */


var findSchemaElements = function findSchemaElements(normalizedSchema) {
  var _iterator = _createForOfIteratorHelper(normalizedSchema),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var row = _step.value;
      var elements = findSchemaElementsInRow(row);
      if (elements.length) return elements;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return [];
};
/**
 * Traverse a schema recursively and find the schema element
 * that matches the given model
 * @param {String} model
 * @param {Array} normalizedSchema
 * @returns
 */


var findElementInSchema = function findElementInSchema(model, normalizedSchema) {
  var schemaElements = findSchemaElements(normalizedSchema);

  var isCorrectElement = function isCorrectElement(el) {
    return (el === null || el === void 0 ? void 0 : el.model) === model;
  };

  if (!schemaElements.length) {
    return null;
  }

  var _iterator2 = _createForOfIteratorHelper(schemaElements),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var el = _step2.value;
      if (isCorrectElement(el)) return el; // Check the subschemas recursively

      var subElement = findElementInSchema(model, normalizeSchema(el.schema));
      if (isCorrectElement(subElement)) return subElement;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return null;
};
/**
 * Parse a user given schema into FVL internal format
 * @param {Array|Object} schema
 * @returns
 */


var normalizeSchema = function normalizeSchema(schema) {
  var arraySchema = Array.isArray(schema) ? schema : Object.keys(schema).map(function (model) {
    return _objectSpread(_objectSpread({}, schema[model]), {}, {
      model: model
    });
  });
  return arraySchema.map(function (field) {
    return Array.isArray(field) ? field : [field];
  });
};

function useParsedSchema(refSchema, model) {
  var _useUniqueID = useUniqueID(),
      getID = _useUniqueID.getID;

  var parsedSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
    var schema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["unref"])(refSchema);
    var normalizedSchema = normalizeSchema(schema);

    if (model) {
      /**
       * If the model is provided, it means a SchemaForm is trying to find
       * a subschema in the main schema that corresponds to its "model" in the
       * use provided schema. We dig into the sub schemas to find it and normalize it
       * before setting it as the returned parsed schema
       */
      var element = findElementInSchema(model, normalizedSchema);

      if (element) {
        normalizedSchema = normalizeSchema(element.schema);
      }
    }

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/SchemaField.vue?vue&type=template&id=7e85df44

function SchemaFieldvue_type_template_id_7e85df44_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $setup.schemaCondition ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDynamicComponent"])($props.field.component), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["mergeProps"])({
    key: 0
  }, $setup.binds, {
    modelValue: $setup.fieldValue,
    "onUpdate:modelValue": $setup.update,
    class: "schema-col"
  }), null, 16, ["modelValue", "onUpdate:modelValue"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true);
}
// CONCATENATED MODULE: ./src/SchemaField.vue?vue&type=template&id=7e85df44

// CONCATENATED MODULE: ./src/utils/constants.js
var KEY = 'fvl_';
var IS_SCHEMA_WIZARD = "".concat(KEY, "isSchemaWizard");
var PARENT_SCHEMA_EXISTS = "".concat(KEY, "parentSchemaExists");
var INJECTED_SCHEMA = "".concat(KEY, "injectedSchema");
var SCHEMA_MODEL_PATH = "".concat(KEY, "schemaModelPath");
var FORM_MODEL = "".concat(KEY, "formModel");
var FIND_NESTED_FORM_MODEL_PROP = "".concat(KEY, "findNestedFormModelProp");
var UPDATE_FORM_MODEL = "".concat(KEY, "updateFormModel");
var DELETE_FORM_MODEL_PROP = "".concat(KEY, "deleteFormModelProp");
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/SchemaField.vue?vue&type=script&lang=js
function SchemaFieldvue_type_script_lang_js_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function SchemaFieldvue_type_script_lang_js_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { SchemaFieldvue_type_script_lang_js_ownKeys(Object(source), true).forEach(function (key) { SchemaFieldvue_type_script_lang_js_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { SchemaFieldvue_type_script_lang_js_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function SchemaFieldvue_type_script_lang_js_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ var SchemaFieldvue_type_script_lang_js = ({
  name: 'SchemaField',
  props: {
    field: {
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
    }
  },
  setup: function setup(props) {
    var binds = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      return props.field.schema ? SchemaFieldvue_type_script_lang_js_objectSpread(SchemaFieldvue_type_script_lang_js_objectSpread({}, props.field), {}, {
        nestedSchemaModel: props.field.model
      }) : SchemaFieldvue_type_script_lang_js_objectSpread(SchemaFieldvue_type_script_lang_js_objectSpread({}, props.sharedConfig), props.field);
    });
    var formModel = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(FORM_MODEL, {});
    var path = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(SCHEMA_MODEL_PATH, null);
    var findNestedFormModelProp = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(FIND_NESTED_FORM_MODEL_PROP);
    var fieldValue = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      if (path) {
        return findNestedFormModelProp(path)[props.field.model];
      }

      return formModel.value[props.field.model];
    });
    var updateFormModel = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(UPDATE_FORM_MODEL);
    var deleteFormModelProperty = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(DELETE_FORM_MODEL_PROP);

    var update = function update(value) {
      updateFormModel(props.field.model, value, path);
    };

    var schemaCondition = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      var condition = props.field.condition;
      if (!condition || typeof condition !== 'function') return true;
      return condition(formModel.value);
    });
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["watch"])(schemaCondition, function (shouldDisplay) {
      if (shouldDisplay) return;
      if (props.preventModelCleanupOnSchemaChange) return;
      deleteFormModelProperty(props.field.model, path);
    });
    return {
      binds: binds,
      fieldValue: fieldValue,
      update: update,
      schemaCondition: schemaCondition
    };
  }
});
// CONCATENATED MODULE: ./src/SchemaField.vue?vue&type=script&lang=js
 
// CONCATENATED MODULE: ./src/SchemaField.vue



SchemaFieldvue_type_script_lang_js.render = SchemaFieldvue_type_template_id_7e85df44_render

/* harmony default export */ var SchemaField = (SchemaFieldvue_type_script_lang_js);
// CONCATENATED MODULE: ./src/features/ParentSchema.js


function useParentSchema() {
  var isChildOfWizard = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(IS_SCHEMA_WIZARD, false);
  var hasParentSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(PARENT_SCHEMA_EXISTS, false);

  if (!hasParentSchema) {
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(PARENT_SCHEMA_EXISTS, true);
  }

  var behaveLikeParentSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
    return !isChildOfWizard && !hasParentSchema;
  });
  return {
    behaveLikeParentSchema: behaveLikeParentSchema,
    hasParentSchema: hasParentSchema,
    isChildOfWizard: isChildOfWizard
  };
}
// CONCATENATED MODULE: ./src/features/InjectedSchema.js


function useInjectedSchema(props, behaveLikeParentSchema) {
  var _toRefs = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toRefs"])(props),
      schema = _toRefs.schema;

  var injectedSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(INJECTED_SCHEMA, false);

  if (behaveLikeParentSchema) {
    // Only the top level schema form should inject the schema
    // That way we dont have to worry about injecting the prop down into
    // sub schemas
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(INJECTED_SCHEMA, schema);
    injectedSchema = schema;
  }

  if (props.nestedSchemaModel) {
    // If the nestedSchemaModel prop is set it means this
    // component is a subschema, and we need to inform descendants
    // of the "path" for the model. ex. "info.family.parents"
    var path = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(SCHEMA_MODEL_PATH, '');
    var currentPath = path ? "".concat(path, ".").concat(props.nestedSchemaModel) : props.nestedSchemaModel;
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(SCHEMA_MODEL_PATH, currentPath);
  }

  return {
    schema: injectedSchema
  };
}
// CONCATENATED MODULE: ./src/features/FormModel.js
function FormModel_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = FormModel_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function FormModel_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return FormModel_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return FormModel_arrayLikeToArray(o, minLen); }

function FormModel_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



function useFormModel(props, parsedSchema) {
  var formModel = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["inject"])(FORM_MODEL, {});

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

    var _iterator = FormModel_createForOfIteratorHelper(diff),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var key = _step.value;
        delete formModel.value[key];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  Object(external_commonjs_vue_commonjs2_vue_root_Vue_["watch"])(parsedSchema, cleanupModelChanges);
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/SchemaForm.vue?vue&type=script&lang=js






/* harmony default export */ var SchemaFormvue_type_script_lang_js = ({
  name: 'SchemaForm',
  components: {
    SchemaField: SchemaField
  },
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
    nestedSchemaModel: {
      type: String,
      default: ''
    },
    schemaRowClasses: {
      type: [String, Object, Array],
      default: null
    }
  },
  emits: ['submit', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        attrs = _ref.attrs;

    var _useParentSchema = useParentSchema(),
        behaveLikeParentSchema = _useParentSchema.behaveLikeParentSchema,
        hasParentSchema = _useParentSchema.hasParentSchema;

    var _useInjectedSchema = useInjectedSchema(props, behaveLikeParentSchema),
        schema = _useInjectedSchema.schema;

    var _useParsedSchema = useParsedSchema(schema, attrs.model),
        parsedSchema = _useParsedSchema.parsedSchema;

    useFormModel(props, parsedSchema);
    var formBinds = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      if (hasParentSchema) return {};
      return {
        onSubmit: function onSubmit(event) {
          event.preventDefault();
          emit('submit', event);
        }
      };
    });
    var slotBinds = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      return {};
    });
    return {
      behaveLikeParentSchema: behaveLikeParentSchema,
      parsedSchema: parsedSchema,
      hasParentSchema: hasParentSchema,
      formBinds: formBinds,
      slotBinds: slotBinds
    };
  }
});
// CONCATENATED MODULE: ./src/SchemaForm.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./src/SchemaForm.vue?vue&type=style&index=0&id=4f4339a1&lang=css
var SchemaFormvue_type_style_index_0_id_4f4339a1_lang_css = __webpack_require__("3816");

// CONCATENATED MODULE: ./src/SchemaForm.vue





SchemaFormvue_type_script_lang_js.render = render

/* harmony default export */ var SchemaForm = (SchemaFormvue_type_script_lang_js);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/SchemaWizard.vue?vue&type=template&id=bcdc2c22

function SchemaWizardvue_type_template_id_bcdc2c22_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SchemaForm = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SchemaForm");

  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])("form", {
    onSubmit: _cache[1] || (_cache[1] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])(function ($event) {
      return _ctx.$emit('submit', $event);
    }, ["prevent"]))
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "beforeForm"), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SchemaForm, {
    schema: $setup.currentSchema,
    preventModelCleanupOnSchemaChange: ""
  }, null, 8, ["schema"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderSlot"])(_ctx.$slots, "afterForm")], 32);
}
// CONCATENATED MODULE: ./src/SchemaWizard.vue?vue&type=template&id=bcdc2c22

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader-v16/dist??ref--0-1!./src/SchemaWizard.vue?vue&type=script&lang=js



/* harmony default export */ var SchemaWizardvue_type_script_lang_js = ({
  name: 'SchemaWizard',
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
    }
  },
  emits: ['submit'],
  setup: function setup(props) {
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(IS_SCHEMA_WIZARD, true);
    var currentSchema = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      return props.schema[props.step];
    });
    return {
      currentSchema: currentSchema
    };
  }
});
// CONCATENATED MODULE: ./src/SchemaWizard.vue?vue&type=script&lang=js
 
// CONCATENATED MODULE: ./src/SchemaWizard.vue



SchemaWizardvue_type_script_lang_js.render = SchemaWizardvue_type_template_id_bcdc2c22_render

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

  var SchemaFieldWithComponents = SchemaFormFactory_objectSpread(SchemaFormFactory_objectSpread({}, SchemaField), {}, {
    components: SchemaFormFactory_objectSpread(SchemaFormFactory_objectSpread({}, components), SchemaField.components)
  });

  return SchemaFormFactory_objectSpread(SchemaFormFactory_objectSpread({}, SchemaForm), {}, {
    components: SchemaFormFactory_objectSpread(SchemaFormFactory_objectSpread(SchemaFormFactory_objectSpread({}, components), SchemaForm.components), {}, {
      SchemaField: SchemaFieldWithComponents
    }),
    // Return a customized setup function with plugins
    // as the new SchemaForm setup
    setup: setup
  });
}
// CONCATENATED MODULE: ./src/features/useSchemaForm.js


/**
 * Find a key inside an object, or create it if it doesn't exist
 * @param {Object} model
 * @param {String} key
 * @returns
 */

var findOrCreateProp = function findOrCreateProp(model, key) {
  if (!model[key]) {
    model[key] = {};
  }

  return model[key];
};

function useSchemaForm() {
  var initialFormValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var formModel = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["isRef"])(initialFormValue) ? initialFormValue : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["ref"])(initialFormValue);

  var findNestedFormModelProp = function findNestedFormModelProp(path) {
    var keys = path.split('.');
    var nestedProp = findOrCreateProp(formModel.value, keys[0]);

    for (var i = 1; i < keys.length; i++) {
      nestedProp = findOrCreateProp(nestedProp, keys[i]);
    }

    return nestedProp;
  };

  var updateFormModel = function updateFormModel(prop, value, path) {
    if (!path) {
      formModel.value[prop] = value;
      return;
    }

    findNestedFormModelProp(path)[prop] = value;
  };

  var deleteFormModelProperty = function deleteFormModelProperty(prop, path) {
    if (!path) {
      delete formModel.value[prop];
      return;
    }

    delete findNestedFormModelProp(path)[prop];
  };

  Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(UPDATE_FORM_MODEL, updateFormModel);
  Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(DELETE_FORM_MODEL_PROP, deleteFormModelProperty);
  Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(FIND_NESTED_FORM_MODEL_PROP, findNestedFormModelProp);
  Object(external_commonjs_vue_commonjs2_vue_root_Vue_["provide"])(FORM_MODEL, formModel);
  return {
    formModel: formModel
  };
}
// CONCATENATED MODULE: ./src/index.js





/* harmony default export */ var src_0 = (SchemaForm);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_0);



/***/ })

/******/ });
});
//# sourceMappingURL=formvuelate.umd.js.map