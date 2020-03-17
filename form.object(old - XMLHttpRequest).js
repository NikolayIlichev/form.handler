

function FormObject(form, errorClass) {
  this.formObj = form;

  this.formFields = Array.from(form.querySelectorAll('[name]')).filter(function(el) {
    return el.classList.contains('required');
  });

  this.validateForm = function() {
    this.formFields.forEach(function(el) {
      let elValue = el.value.trim();
      switch (el.getAttribute('name')) {
        case 'name':
          if (!isValidName(elValue) || elValue == '') {
            el.classList.add(errorClass);
          } else {
            el.classList.remove(errorClass);
          }
          break;        
        case 'email':
          if (elValue == '' || !isValidEmailAddress(elValue)) {
            el.classList.add(errorClass);
          } else {
            el.classList.remove(errorClass);
          }
          break;
        default:
          if (elValue == '') {
            el.classList.add(errorClass);
          } else {
            el.classList.remove(errorClass);
          }
          break;
      }
    });
  }

  this.ajaxSend = function(formType, successFunc) {
    let btn = this.formObj.querySelector('button');
    let _this = this;
    if (!_this.formObj.querySelectorAll('.' + errorClass).length) {
      let formData = new FormData(_this.formObj);
      btn.setAttribute('disabled', true);

      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/local/templates/eva/ajax/ajax.php?type=' + formType);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      xhr.addEventListener('load', function() {
        try {
          let response = JSON.parse(xhr.response);

          if (response.status === 'success') {
            _this.formObj.reset();
            _this.successSend(successFunc);
          } else {
            alert(response.message);
            btn.removeAttribute('disabled');
          }
        } catch (error) {
          console.log(error);
          btn.removeAttribute('disabled');
        }
      });

      xhr.send(formData);
    }
  }

  this.successSend = function(successFunc) {
    successFunc(this.formObj);
  }
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}

function isValidName(name) {
    var pattern = new RegExp(/^[a-zA_Zа-яА-ЯёЁ\s]+$/i);
    return pattern.test(name);
}

// Polifills

// Шаги алгоритма ECMA-262, 6-е издание, 22.1.2.1
// Ссылка: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function() {
    var toStr = Object.prototype.toString;
    var isCallable = function(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // Свойство length метода from равно 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Положим C равным значению this.
      var C = this;

      // 2. Положим items равным ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. Если mapfn равен undefined, положим mapping равным false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. иначе
        // 5. a. Если вызов IsCallable(mapfn) равен false, выкидываем исключение TypeError.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Положим lenValue равным Get(items, "length").
      // 11. Положим len равным ToLength(lenValue).
      var len = toLength(items.length);

      // 13. Если IsConstructor(C) равен true, то
      // 13. a. Положим A равным результату вызова внутреннего метода [[Construct]]
      //     объекта C со списком аргументов, содержащим единственный элемент len.
      // 14. a. Иначе, положим A равным ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Положим k равным 0.
      var k = 0;
      // 17. Пока k < len, будем повторять... (шаги с a по h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Положим putStatus равным Put(A, "length", len, true).
      A.length = len;
      // 20. Вернём A.
      return A;
    };
  }());
}