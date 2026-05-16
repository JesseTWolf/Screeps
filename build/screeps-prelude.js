// Screeps runtime prelude for GopherJS bundles.
(function(globalObj) {
  if (!globalObj) {
    return;
  }

  if (typeof globalObj.TextDecoder !== "function") {
    function TextDecoderShim() {}

    TextDecoderShim.prototype.decode = function(input) {
      if (!input) {
        return "";
      }
      var bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
      var out = "";

      for (var i = 0; i < bytes.length; i++) {
        var c = bytes[i];
        if (c < 128) {
          out += String.fromCharCode(c);
          continue;
        }
        if ((c & 224) === 192 && i + 1 < bytes.length) {
          out += String.fromCharCode((c & 31) << 6 | (bytes[++i] & 63));
          continue;
        }
        if ((c & 240) === 224 && i + 2 < bytes.length) {
          out += String.fromCharCode((c & 15) << 12 | ((bytes[++i] & 63) << 6) | (bytes[++i] & 63));
          continue;
        }
        if ((c & 248) === 240 && i + 3 < bytes.length) {
          var cp = ((c & 7) << 18) | ((bytes[++i] & 63) << 12) | ((bytes[++i] & 63) << 6) | (bytes[++i] & 63);
          cp -= 65536;
          out += String.fromCharCode(55296 + (cp >> 10), 56320 + (cp & 1023));
        }
      }

      return out;
    };

    globalObj.TextDecoder = TextDecoderShim;
  }

  if (typeof globalObj.setTimeout !== "function" || typeof globalObj.clearTimeout !== "function") {
    var timeoutId = 0;
    var pending = Object.create(null);

    globalObj.setTimeout = function(callback) {
      var id = ++timeoutId;
      pending[id] = true;

      if (typeof Promise === "function") {
        Promise.resolve().then(function() {
          if (pending[id]) {
            delete pending[id];
            callback();
          }
        });
        return id;
      }

      if (pending[id]) {
        delete pending[id];
        callback();
      }
      return id;
    };

    globalObj.clearTimeout = function(id) {
      delete pending[id];
    };
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
        ? self
        : this
);
