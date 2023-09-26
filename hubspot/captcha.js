var _createClass = function () {
  function c(a, b) {
    for (var d = 0; d < b.length; d++) {
      var e = b[d];
      e.enumerable = e.enumerable || false;
      e.configurable = true;
      "value" in e && (e.writable = true);
      Object.defineProperty(a, e.key, e);
    }
  }
  return function (a, b, d) {
    b && c(a.prototype, b);
    d && c(a, d);
    return a;
  };
}(), _get = function get(c, a, b) {
  null === c && (c = Function.prototype);
  var e = Object.getOwnPropertyDescriptor(c, a);
  if (void 0 === e) {
    if (c = Object.getPrototypeOf(c), null !== c) return get(c, a, b);
  } else {
    if ("value" in e) return e.value;
    a = e.get;
    return void 0 === a ? void 0 : a.call(b);
  }
};
function _classCallCheck(c, a) {
  if (!(c instanceof a)) throw new TypeError("Cannot call a class as a function");
}
function _possibleConstructorReturn(c, a) {
  if (!c) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return !a || "object" !== typeof a && "function" !== typeof a ? c : a;
}
function _inherits(c, a) {
  if ("function" !== typeof a && null !== a) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
  c.prototype = Object.create(a && a.prototype, {constructor: {value: c, enumerable: false, writable: true, configurable: true}});
  a && (Object.setPrototypeOf ? Object.setPrototypeOf(c, a) : c.__proto__ = a);
}
var Captcha = function () {
  function c(a) {
    a = a.element;
    _classCallCheck(this, c);
    this.element = a;
    this.form;
    this.isValid = false;
    this.initCaptcha();
  }
  _createClass(c, [{key: "initCaptcha", value: function () {
    this.initForm();
    this.stylizeElement();
    this.element.innerHTML = "";
  }}, {key: "initForm", value: function () {
    this.form = document.getElementById("next_step");
    this.form.addEventListener("click", this.handleSubmittingForm.bind(this));
  }}, {key: "stylizeElement", value: function () {
    this.element.style.border = "5px solid #000";
    this.element.style.width = "100px";
  }}, {key: "handleSubmittingForm", value: function (a) {
    a.preventDefault();
    this.checkValidity();
    true === this.isValid || testpage ? ($("#next_step").hide(), $(".hs_your_industry_").fadeIn("slow"), $(".hs_number_of_techs").fadeIn("slow"), $(".hs_how_did_you_hear_about_sherpadesk_").fadeIn("slow"), $(".legal-consent-container").fadeIn("slow"), $(".hs_submit").fadeIn("slow")) : a.preventDefault();
  }}, {key: "checkValidity", value: function () {
    true === this.isValid ? this.enteredValidValue() : false === this.isValid && this.enteredInvalidValue();
  }}, {key: "enteredValidValue", value: function () {
    this.element.style.border = "5px solid #00ff00";
    this.element.classList.contains("captcha_invalid") && this.element.classList.remove("captcha_invalid");
    this.element.classList.contains("alerts-border") && this.element.classList.remove("alerts-border");
    this.element.classList.contains("captcha_valid") || this.element.classList.add("captcha_valid");
  }}, {key: "enteredInvalidValue", value: function () {
    var a = this;
    this.element.classList.contains("captcha_valid") && this.element.classList.remove("captcha_valid");
    this.element.classList.contains("alerts-border") && this.element.classList.remove("alerts-border");
    this.element.classList.contains("alerts-border") || setTimeout(function () {
      return a.element.classList.add("alerts-border");
    }, 500);
    this.element.classList.contains("captcha_invalid") || this.element.classList.add("captcha_invalid");
  }}, {key: "resetClassNames", value: function () {
    this.element.classList.contains("captcha_valid") && this.element.classList.remove("captcha_valid");
    this.element.classList.contains("captcha_invalid") && this.element.classList.remove("captcha_invalid");
  }}, {key: "resetStyling", value: function () {
    this.element.style.border = "1px solid #000000";
  }}]);
  return c;
}();
"use strict";
var BaseCaptcha = function (c) {
  function a(b) {
    b = b.element;
    _classCallCheck(this, a);
    b = _possibleConstructorReturn(this, (a.__proto__ || Object.getPrototypeOf(a)).call(this, {element: b}));
    b.canvas;
    b.context;
    b.code;
    b.numberOfTries = 0;
    b.input;
    b.enteredValue;
    b.initBaseCaptcha();
    return b;
  }
  _inherits(a, c);
  _createClass(a, [{key: "initBaseCaptcha", value: function () {
    this.generateCode();
    var b = document.createElement("canvas");
    b.style.width = "100px";
    b.style.height = "50px";
    $(".captcha-base").append(b);
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.writeCode();
    this.input = document.getElementById("captcha-base__input");
  }}, {key: "generateCanvas", value: function () {
    $(".hs_submit").before('<div class="hs_captcha-base hs-fieldtype-text field hs-form-field" style="display: block;"><div class="actions"><div class="captcha-base" style="border: 1px solid rgb(0, 0, 0); width: 100px;"><canvas style="width: 100px; height: 50px;"></canvas></div> </div></div>');
  }}, {key: "appendCanvas", value: function () {
    this.canvas = document.getElementsByTagName("canvas")[0];
  }}, {key: "getContext", value: function () {
    this.context = this.canvas.getContext("2d");
  }}, {key: "generateInputElement", value: function () {
    $(".hs_captcha-base").after('<div class="hs_captcha-base__input hs-fieldtype-text field hs-form-field" style="display: block;"><div class="input"><input id="captcha-base__input" class="hs-input captcha-base__input" type="text" name="captcha-base__input" value="" placeholder="Enter the code above here" inputmode="text"></div></div>');
    this.input = document.getElementById("captcha-base__input");
  }}, {key: "appendInputElement", value: function () {
    null !== this.element.nextSibling ? this.form.insertBefore(this.input, this.element.nextSibling) : this.form.appendChild(this.input);
  }}, {key: "addResetButton", value: function () {
    var b = document.createElement("button");
    b.innerHTML = "&#8635;";
    b.setAttribute("class", "captcha-base__reset");
    b.setAttribute("type", "reset");
    this.form.insertBefore(b, this.input);
    this.resetButton = b;
  }}, {key: "handleClickResetButton", value: function (b) {
    b.preventDefault();
    this.clickResetButton();
    this.resetStyling();
  }}, {key: "clickResetButton", value: function () {
    event.preventDefault();
    this.clearCanvas();
    this.generateCode();
    this.writeCode();
    this.input.value = "";
    this.resetClassNames();
  }}, {key: "generateCode", value: function () {
    this.code = this.generateRandomNum(1e5, 999999);
  }}, {key: "writeCode", value: function () {
    this.getContext();
    this.context.font = "80px Arial";
    for (var b = this.code.toString(), d = 0; 6 > d; d++) this.context.fillStyle = this.getRandomColor(), this.transformContext(d), this.context.fillText(b[d], 52 * d, 110), this.resetTransformation();
  }}, {key: "clearCanvas", value: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }}, {key: "checkValidity", value: function () {
    this.input.value && (this.enteredValue = parseInt(this.input.value), this.isValid = this.enteredValue === this.code ? true : false, _get(a.prototype.__proto__ || Object.getPrototypeOf(a.prototype), "checkValidity", this).call(this));
  }}, {key: "enteredValidValue", value: function () {
    _get(a.prototype.__proto__ || Object.getPrototypeOf(a.prototype), "enteredValidValue", this).call(this);
    this.input.classList.contains("captcha-base__input_invalid") && (this.input.classList.remove("captcha-base__input_invalid"), this.input.placeholder = "Please try again!");
    this.input.classList.contains("captcha-base__input_valid") || (this.input.classList.add("captcha-base__input_valid"), this.input.placeholder = "Submit successful!");
  }}, {key: "enteredInvalidValue", value: function () {
    _get(a.prototype.__proto__ || Object.getPrototypeOf(a.prototype), "enteredInvalidValue", this).call(this);
    this.input.classList.contains("captcha-base__input_valid") && (this.input.classList.remove("captcha-base__input_valid"), this.input.placeholder = "Submit successful!");
    this.input.classList.contains("captcha-base__input_invalid") || (this.input.classList.add("captcha-base__input_invalid"), this.input.placeholder = "Please try again!");
    this.clickResetButton();
    this.numberOfTries++;
    5 < this.numberOfTries && (this.input.classList.add("captcha-base__input_invalid"), this.input.placeholder = "Maximum attempts reached!", this.input.setAttribute("disabled", "true"), document.getElementsByClassName("captcha-base"), document.getElementById("next_step").setAttribute("disabled", "true"));
  }}, {key: "resetClassNames", value: function () {
    _get(a.prototype.__proto__ || Object.getPrototypeOf(a.prototype), "resetClassNames", this).call(this);
    this.input.classList.contains("captcha-base__input_valid") && this.input.classList.remove("captcha-base__input_valid");
    this.input.classList.contains("captcha-base__input_invalid") && this.input.classList.remove("captcha-base__input_invalid");
  }}, {key: "generateRandomNum", value: function (b, d) {
    return Math.round(b - 0.5 + Math.random() * (d - b + 1));
  }}, {key: "getRandomColor", value: function () {
    for (var b = null, d, e = 0; 3 > e; e++) d = this.generateRandomNum(50, 230), b ? b = "#" + parseInt(d, 16) : b += parseInt(d, 16);
    return b;
  }}, {key: "getRadiansFromDegrees", value: function (b) {
    return Math.PI / 180 * b;
  }}, {key: "transformContext", value: function (b) {
    var d = this.generateRandomNum(0, 13);
    0 === b % 2 && (d = -d);
    b = this.getRadiansFromDegrees(d);
    this.context.rotate(b);
  }}, {key: "resetTransformation", value: function () {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }}]);
  return a;
}(Captcha);
"use strict";
(function () {
  new (function () {
    function c() {
      _classCallCheck(this, c);
      $(".hs_your_industry_").before('<div class="hs_captcha-base hs-fieldtype-text field hs-form-field" style="display: none; margin-bottom: 10px;"><div class="actions"><center><div class="captcha-base" style="border: 5px solid rgb(0, 0, 0); width: 100px;"></div></center></div></div>');
      $(".hs_your_industry_").before('<div class="hs_captcha-base__input hs-fieldtype-text field hs-form-field" style="display: none;"><div class="input"><input id="captcha-base__input" class="hs-input captcha-base__input" type="text" name="captcha-base__input" value="" placeholder="Enter the code above here" inputmode="text"></div></div>');
      this.baseElements = document.getElementsByClassName("captcha-base");
      this.init();
    }
    _createClass(c, [{key: "init", value: function () {
      Array.prototype.forEach.call(this.baseElements, this.handleBaseElements.bind(this));
    }}, {key: "handleBaseElements", value: function (a) {
      new BaseCaptcha({element: a});
    }}]);
    return c;
  }());
}());
