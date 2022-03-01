var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key2 of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key2) && (copyDefault || key2 !== "default"))
        __defProp(target, key2, { get: () => module2[key2], enumerable: !(desc = __getOwnPropDesc(module2, key2)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.288_svelte@3.46.4/node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new File(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var import_node_worker_threads, s, S, f, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/.pnpm/@sveltejs+kit@1.0.0-next.288_svelte@3.46.4/node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js"() {
    import_node_worker_threads = require("worker_threads");
    init_install_fetch();
    globalThis.DOMException || (() => {
      const port = new import_node_worker_threads.MessageChannel().port1;
      const ab = new ArrayBuffer(0);
      try {
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        return err.constructor;
      }
    })();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f = 1;
    F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.288_svelte@3.46.4/node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base642 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base642 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base642 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0;
      while (position !== part.size) {
        const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function formDataToBlob(F2, B = Blob$1) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  const { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error2 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers2(headers.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request2(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dataUriToBuffer(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_node_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL, options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s3) => {
        let endedWithEventsCount;
        s3.prependListener("end", () => {
          endedWithEventsCount = s3._eventsCount;
        });
        s3.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s3._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              headers.set("Location", locationURL);
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers2(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve2(fetch2(new Request2(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), reject);
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), reject);
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), reject);
        raw.once("data", (chunk) => {
          body = (chunk[0] & 15) === 8 ? (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflate(), reject) : (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflateRaw(), reject);
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), reject);
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
function installFetch() {
  Object.defineProperties(globalThis, {
    fetch: {
      enumerable: true,
      configurable: true,
      value: fetch2
    },
    Response: {
      enumerable: true,
      configurable: true,
      value: Response2
    },
    Request: {
      enumerable: true,
      configurable: true,
      value: Request2
    },
    Headers: {
      enumerable: true,
      configurable: true,
      value: Headers2
    }
  });
}
var import_node_http, import_node_https, import_node_zlib, import_node_stream, import_node_util, import_node_url, import_net, commonjsGlobal, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _parts, _type, _size, _a, _Blob, Blob, Blob$1, _lastModified, _name, _a2, _File, File, t, i, h, r, m, f2, e, x, _d, _a3, FormData, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, INTERNALS$2, Body, clone, getNonSpecFormDataBoundary, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers2, redirectStatus, isRedirect, INTERNALS$1, Response2, getSearch, ReferrerPolicy, DEFAULT_REFERRER_POLICY, INTERNALS, isRequest, Request2, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/.pnpm/@sveltejs+kit@1.0.0-next.288_svelte@3.46.4/node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    import_node_http = __toESM(require("http"), 1);
    import_node_https = __toESM(require("https"), 1);
    import_node_zlib = __toESM(require("zlib"), 1);
    import_node_stream = __toESM(require("stream"), 1);
    import_node_util = require("util");
    import_node_url = require("url");
    import_net = require("net");
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop4() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop4;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals && globals.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F2, V, args) {
          if (typeof F2 !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F2, V, args);
        }
        function promiseCall(F2, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F2, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a4) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry4 = this._queue.shift();
              this._queueTotalSize -= entry4.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry4.buffer, entry4.byteOffset, entry4.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a4) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a4;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a4 = stream._writableStreamController._abortController) === null || _a4 === void 0 ? void 0 : _a4.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a4) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop4);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable2 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable2, "readable", "ReadableWritablePair");
          assertReadableStream(readable2, `${context} has member 'readable' that`);
          const writable3 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable3, "writable", "ReadableWritablePair");
          assertWritableStream(writable3, `${context} has member 'writable' that`);
          return { readable: readable2, writable: writable3 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop4);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable3 = stream._writable;
              const state = writable3._state;
              if (state === "erroring") {
                throw writable3._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable2 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable2._state === "errored") {
              throw readable2._storedError;
            }
            ReadableStreamDefaultControllerClose(readable2._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable2._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error2) {
          process2.emitWarning = emitWarning;
          throw error2;
        }
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob2 } = require("buffer");
      if (Blob2 && !Blob2.prototype.stream) {
        Blob2.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = (_a = class {
      constructor(blobParts = [], options = {}) {
        __privateAdd(this, _parts, []);
        __privateAdd(this, _type, "");
        __privateAdd(this, _size, 0);
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder2 = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof _a) {
            part = element;
          } else {
            part = encoder2.encode(element);
          }
          __privateSet(this, _size, __privateGet(this, _size) + (ArrayBuffer.isView(part) ? part.byteLength : part.size));
          __privateGet(this, _parts).push(part);
        }
        const type = options.type === void 0 ? "" : String(options.type);
        __privateSet(this, _type, /^[\x20-\x7E]*$/.test(type) ? type : "");
      }
      get size() {
        return __privateGet(this, _size);
      }
      get type() {
        return __privateGet(this, _type);
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(__privateGet(this, _parts), false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(__privateGet(this, _parts), false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(__privateGet(this, _parts), true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = __privateGet(this, _parts);
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new _a([], { type: String(type).toLowerCase() });
        __privateSet(blob, _size, span);
        __privateSet(blob, _parts, blobParts);
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    }, _parts = new WeakMap(), _type = new WeakMap(), _size = new WeakMap(), _a);
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob = _Blob;
    Blob$1 = Blob;
    _File = (_a2 = class extends Blob$1 {
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        __privateAdd(this, _lastModified, 0);
        __privateAdd(this, _name, "");
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          __privateSet(this, _lastModified, lastModified);
        }
        __privateSet(this, _name, String(fileName));
      }
      get name() {
        return __privateGet(this, _name);
      }
      get lastModified() {
        return __privateGet(this, _lastModified);
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
    }, _lastModified = new WeakMap(), _name = new WeakMap(), _a2);
    File = _File;
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f2 = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = (_a3 = class {
      constructor(...a) {
        __privateAdd(this, _d, []);
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        __privateGet(this, _d).push(f2(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        __privateSet(this, _d, __privateGet(this, _d).filter(([b]) => b !== a));
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = __privateGet(this, _d), l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        __privateGet(this, _d).forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return __privateGet(this, _d).some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f2(...a);
        __privateGet(this, _d).forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        __privateSet(this, _d, b);
      }
      *entries() {
        yield* __privateGet(this, _d);
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    }, _d = new WeakMap(), _a3);
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_node_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_node_stream.default)
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = Buffer.from(String(body));
        }
        let stream = body;
        if (Buffer.isBuffer(body)) {
          stream = import_node_stream.default.Readable.from(body);
        } else if (isBlob(body)) {
          stream = import_node_stream.default.Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_node_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
        return toFormData2(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_node_stream.PassThrough({ highWaterMark });
        p2 = new import_node_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof import_node_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key2) => {
          result[key2] = this.getAll(key2);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key2) => {
          const values = this.getAll(key2);
          if (key2 === "host") {
            result[key2] = values[0];
          } else {
            result[key2] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    ReferrerPolicy = /* @__PURE__ */ new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentails.`);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_node_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
  }
});

// .svelte-kit/output/server/chunks/index-b5d175dd.js
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function custom_event(type, detail, bubbles = false) {
  const e2 = document.createEvent("CustomEvent");
  e2.initCustomEvent(type, bubbles, false, detail);
  return e2;
}
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
}
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i2 = 0; i2 < items.length; i2 += 1) {
    str += fn(items[i2], i2);
  }
  return str;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css5) => css5.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true && boolean_attributes.has(name) ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
var current_component, boolean_attributes, escaped, missing_component, on_destroy;
var init_index_b5d175dd = __esm({
  ".svelte-kit/output/server/chunks/index-b5d175dd.js"() {
    Promise.resolve();
    boolean_attributes = /* @__PURE__ */ new Set([
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ]);
    escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/store-bc6efd45.js
function writable2(value, start = noop2) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue2.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue2.length; i2 += 2) {
            subscriber_queue2[i2][0](subscriber_queue2[i2 + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
var subscriber_queue2, show, curBoard, stats, infos, showSettings, expertMode;
var init_store_bc6efd45 = __esm({
  ".svelte-kit/output/server/chunks/store-bc6efd45.js"() {
    init_index_b5d175dd();
    subscriber_queue2 = [];
    show = writable2(false);
    curBoard = writable2();
    stats = writable2();
    infos = writable2([]);
    showSettings = writable2(false);
    expertMode = writable2(false);
  }
});

// .svelte-kit/output/server/entries/pages/__layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => _layout
});
function createBackgroundColor(pos, checkedPos, uncheckedPos, offColor, onColor) {
  const relativePos = (pos - uncheckedPos) / (checkedPos - uncheckedPos);
  if (relativePos === 0) {
    return offColor;
  }
  if (relativePos === 1) {
    return onColor;
  }
  let newColor = "#";
  for (let i2 = 1; i2 < 6; i2 += 2) {
    const offComponent = parseInt(offColor.substr(i2, 2), 16);
    const onComponent = parseInt(onColor.substr(i2, 2), 16);
    const weightedValue = Math.round((1 - relativePos) * offComponent + relativePos * onComponent);
    let newComponent = weightedValue.toString(16);
    if (newComponent.length === 1) {
      newComponent = `0${newComponent}`;
    }
    newColor += newComponent;
  }
  return newColor;
}
function convertShorthandColor(color) {
  if (color.length === 7) {
    return color;
  }
  let sixDigitColor = "#";
  for (let i2 = 1; i2 < 4; i2 += 1) {
    sixDigitColor += color[i2] + color[i2];
  }
  return sixDigitColor;
}
function getBackgroundColor(pos, checkedPos, uncheckedPos, offColor, onColor) {
  const sixDigitOffColor = convertShorthandColor(offColor);
  const sixDigitOnColor = convertShorthandColor(onColor);
  return createBackgroundColor(pos, checkedPos, uncheckedPos, sixDigitOffColor, sixDigitOnColor);
}
var Modal, CloseIcon, Popup, Info, CheckedIcon, UncheckedIcon, Switch, SettingsItem, Settings, _layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/__layout.svelte.js"() {
    init_index_b5d175dd();
    init_store_bc6efd45();
    Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { show: show2 } = $$props;
      let { exit } = $$props;
      if ($$props.show === void 0 && $$bindings.show && show2 !== void 0)
        $$bindings.show(show2);
      if ($$props.exit === void 0 && $$bindings.exit && exit !== void 0)
        $$bindings.exit(exit);
      return `<div${add_attribute("class", `absolute z-10 bg-black  w-screen h-screen transition-all ${show2 ? "visible pointer-events-auto opacity-40" : "invisible pointer-events-none opacity-0"}`, 0)}></div>`;
    });
    CloseIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { width } = $$props;
      let { height } = $$props;
      if ($$props.width === void 0 && $$bindings.width && width !== void 0)
        $$bindings.width(width);
      if ($$props.height === void 0 && $$bindings.height && height !== void 0)
        $$bindings.height(height);
      return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"${add_attribute("width", width, 0)}><path fill="${"#fff"}" d="${"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}"></path></svg>`;
    });
    Popup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let guessesArray;
      let $stats, $$unsubscribe_stats;
      let $$unsubscribe_show;
      let $curBoard, $$unsubscribe_curBoard;
      let $$unsubscribe_infos;
      $$unsubscribe_stats = subscribe(stats, (value) => $stats = value);
      $$unsubscribe_show = subscribe(show, (value) => value);
      $$unsubscribe_curBoard = subscribe(curBoard, (value) => $curBoard = value);
      $$unsubscribe_infos = subscribe(infos, (value) => value);
      let { _show } = $$props;
      const getTimeToNextDay = () => {
        const now = new Date();
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diff = nextDay.getTime() - now.getTime();
        const hours = Math.floor(diff / (1e3 * 60 * 60));
        const minutes = Math.floor(diff / (1e3 * 60)) % 60;
        const seconds = Math.floor(diff / 1e3) % 60;
        return `${hours < 10 ? `0${hours.toFixed(0)}` : hours.toFixed(0)}:${minutes < 10 ? `0${minutes.toFixed(0)}` : minutes.toFixed(0)}:${seconds < 10 ? `0${seconds.toFixed(0)}` : seconds.toFixed(0)}`;
      };
      let time = getTimeToNextDay();
      if ($$props._show === void 0 && $$bindings._show && _show !== void 0)
        $$bindings._show(_show);
      guessesArray = [...Object.entries(($stats == null ? void 0 : $stats.guesses) ?? {})];
      $$unsubscribe_stats();
      $$unsubscribe_show();
      $$unsubscribe_curBoard();
      $$unsubscribe_infos();
      return `<div${add_attribute("class", `border border-[#1a1a1b] sm:w-[500px] h-max sm:aspect-auto w-11/12 aspect-square sm:aspect-auto bg-[#121213] rounded-md absolute inset-0 m-auto z-20  origin-bottom transition-all flex items-center justify-center${_show ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-0"}`, 0)}><div class="${"sm:w-[500px] sm:aspect-auto w-11/12 aspect-square relative flex flex-col text-white px-2 py-4 items-center justify-center mx-auto"}"><span class="${"absolute top-4 right-4 aspect-square"}">${validate_component(CloseIcon, "CloseIcon").$$render($$result, { height: 24, width: 24 }, {}, {})}</span>
    <span class="${"m-3 flex items-center justify-center h-5 text-lg font-semibold"}">STATISTICS
    </span>
    <span class="${"flex items-center justify-center h-20 flex-row items-center justify-center gap-2"}"><div class="${"flex flex-col w-14 h-[70px]"}"><span class="${"text-4xl font-semibold flex items-center justify-center"}">${escape($stats == null ? void 0 : $stats.played)}</span>
        <span class="${"text-xs flex items-center justify-center text-center"}">Played</span></div>
      <div class="${"flex flex-col w-14 h-[70px]"}"><span class="${"text-4xl font-semibold flex items-center justify-center"}">${escape(($stats == null ? void 0 : $stats.played) ? (100 * ($stats == null ? void 0 : $stats.wins) / ($stats == null ? void 0 : $stats.played)).toFixed(0) : 0)}</span>
        <span class="${"text-xs flex items-center justify-center text-center"}">Win %</span></div>
      <div class="${"flex flex-col w-14 h-[70px]"}"><span class="${"text-4xl font-semibold flex items-center justify-center"}">${escape($stats == null ? void 0 : $stats.streak)}</span>
        <span class="${"text-xs flex items-center justify-center text-center"}">Current Streak
        </span></div>
      <div class="${"flex flex-col w-14 h-[70px]"}"><span class="${"text-4xl font-semibold flex items-center justify-center"}">${escape($stats == null ? void 0 : $stats.maxStreak)}</span>
        <span class="${"text-xs flex items-center justify-center text-center"}">Max Streak</span></div></span>
    <span class="${"m-3 flex items-center justify-center h-5 text-lg font-semibold"}">GUESS DISTRIBUTION
    </span>
    <span class="${"flex flex-col items-center justify-center h-56 w-full px-14"}">${each(guessesArray, (guess) => {
        return `${guess[0] !== "fail" ? `<span class="${"flex flex-row w-full"}"><span>${escape(guess[0])}</span>
            <span class="${"bg-[#3a3a3c] my-[2px] mx-2 px-2 rounded-sm"}"${add_attribute("style", `${guess[1] !== 0 ? `width: ${guess[1] * 90 / $stats.wins + 10}%` : ""}`, 0)}><p class="${"ml-auto w-min"}">${escape(guess[1])}</p></span>
          </span>` : ``}`;
      })}</span>
    ${($curBoard == null ? void 0 : $curBoard.hasGuessed) ? `<span class="${"divide-x-2 divide-white grid w-full grid-cols-2 grid-rows-1"}"><div class="${"flex flex-col gap-2"}"><span class="${"small:text-lg text-sm font-semibold uppercase text-cente flex items-center justify-center"}">Next Prirdle</span>
          <span class="${"small:text-4xl text-2xl font-semibold uppercase text-cente flex items-center justify-center"}">${escape(time)}</span></div>
        <div class="${"w-full h-full flex items-center justify-center"}"><button class="${"bg-[#538d4e] hover:bg-[#4c8048] small:px-6 small:py-2 px-4 py-2 small:text-2xl text-lg font-semibold rounded-md flex flex-row gap-4 items-center justify-center"}"><p class="${"h-full"}">Share</p>
            <svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 24 24"}" class="${"small:h-[24px] small:w-[24px] w-[16px] h-[16px]"}"><path fill="${"#fff"}" d="${"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"}"></path></svg></button></div></span>` : ``}</div></div>`;
    });
    Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $infos, $$unsubscribe_infos;
      $$unsubscribe_infos = subscribe(infos, (value) => $infos = value);
      $$unsubscribe_infos();
      return `<div class="${"absolute inset-0 h-full mx-auto pointer-events-none pt-20 z-20"}">${each($infos, (info) => {
        return `<div class="${"text-black text-10xl font-bold mx-auto my-2 min-w-[8rem] w-max h-12 p-4 bg-white rounded-md flex items-center justify-center"}">${escape(info)}
    </div>`;
      })}</div>`;
    });
    CheckedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<svg height="${"100%"}" width="${"100%"}" viewBox="${"-2 -5 17 21"}" style="${"position: absolute; top: 0"}"><path d="${"M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0"}" fill="${"#fff"}" fillrule="${"evenodd"}"></path></svg>`;
    });
    UncheckedIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<svg viewBox="${"-2 -5 14 20"}" height="${"100%"}" width="${"100%"}" style="${"position: absolute; top: 0;"}"><path d="${"M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9\r\n    4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12"}" fill="${"#fff"}" fillrule="${"evenodd"}"></path></svg>`;
    });
    Switch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { checked } = $$props;
      let { disabled = false } = $$props;
      let { offColor = "#888" } = $$props;
      let { onColor = "#080" } = $$props;
      let { offHandleColor = "#fff" } = $$props;
      let { onHandleColor = "#fff" } = $$props;
      let { handleDiameter } = $$props;
      let { unCheckedIcon = UncheckedIcon } = $$props;
      let { checkedIcon = CheckedIcon } = $$props;
      let { boxShadow = null } = $$props;
      let { activeBoxShadow = "0 0 2px 3px #3bf" } = $$props;
      let { height = 28 } = $$props;
      let { width = 56 } = $$props;
      let { id = "" } = $$props;
      let { containerClass = "" } = $$props;
      createEventDispatcher();
      let state = {
        handleDiameter: 0,
        checkedPos: 0,
        uncheckedPos: 0,
        pos: 0,
        lastDragAt: 0,
        lastKeyUpAt: 0,
        startX: null,
        hasOutline: null,
        dragStartingTime: null,
        checkedStateFromDragging: false
      };
      let inputRef = null;
      state.handleDiameter = handleDiameter || height - 2;
      state.checkedPos = Math.max(width - height, width - (height + state.handleDiameter) / 2);
      state.uncheckedPos = Math.max(0, (height - state.handleDiameter) / 2);
      state.pos = checked ? state.checkedPos : state.uncheckedPos;
      state.lastDragAt = 0;
      state.lastKeyUpAt = 0;
      let CIcon = checkedIcon;
      let UIcon = unCheckedIcon;
      let rootStyle = "";
      let backgroundStyle = "";
      let checkedIconStyle = "";
      let uncheckedIconStyle = "";
      let handleStyle = "";
      let inputStyle = "";
      if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
        $$bindings.checked(checked);
      if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
        $$bindings.disabled(disabled);
      if ($$props.offColor === void 0 && $$bindings.offColor && offColor !== void 0)
        $$bindings.offColor(offColor);
      if ($$props.onColor === void 0 && $$bindings.onColor && onColor !== void 0)
        $$bindings.onColor(onColor);
      if ($$props.offHandleColor === void 0 && $$bindings.offHandleColor && offHandleColor !== void 0)
        $$bindings.offHandleColor(offHandleColor);
      if ($$props.onHandleColor === void 0 && $$bindings.onHandleColor && onHandleColor !== void 0)
        $$bindings.onHandleColor(onHandleColor);
      if ($$props.handleDiameter === void 0 && $$bindings.handleDiameter && handleDiameter !== void 0)
        $$bindings.handleDiameter(handleDiameter);
      if ($$props.unCheckedIcon === void 0 && $$bindings.unCheckedIcon && unCheckedIcon !== void 0)
        $$bindings.unCheckedIcon(unCheckedIcon);
      if ($$props.checkedIcon === void 0 && $$bindings.checkedIcon && checkedIcon !== void 0)
        $$bindings.checkedIcon(checkedIcon);
      if ($$props.boxShadow === void 0 && $$bindings.boxShadow && boxShadow !== void 0)
        $$bindings.boxShadow(boxShadow);
      if ($$props.activeBoxShadow === void 0 && $$bindings.activeBoxShadow && activeBoxShadow !== void 0)
        $$bindings.activeBoxShadow(activeBoxShadow);
      if ($$props.height === void 0 && $$bindings.height && height !== void 0)
        $$bindings.height(height);
      if ($$props.width === void 0 && $$bindings.width && width !== void 0)
        $$bindings.width(width);
      if ($$props.id === void 0 && $$bindings.id && id !== void 0)
        $$bindings.id(id);
      if ($$props.containerClass === void 0 && $$bindings.containerClass && containerClass !== void 0)
        $$bindings.containerClass(containerClass);
      {
        {
          state.pos = checked ? state.checkedPos : state.uncheckedPos;
        }
      }
      rootStyle = `
    position: relative;
    display: inline-block;
    text-align: left;
    opacity: ${disabled ? 0.5 : 1};
    direction: ltr;
    border-radius: ${height / 2}px;
    transition: opacity 0.25s;
    touch-action: none;
    webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
  `;
      backgroundStyle = `
    height: ${height}px;
    width: ${width}px;
    margin: ${Math.max(0, (state.handleDiameter - height) / 2)}px;
    position: relative;
    background: ${getBackgroundColor(state.pos, state.checkedPos, state.uncheckedPos, offColor, onColor)};
    border-radius: ${height / 2}px;
    cursor: ${disabled ? "default" : "pointer"};
    transition: ${"background 0.25s"};
  `;
      checkedIconStyle = `
    height: ${height}px;
    width: ${Math.min(height * 1.5, width - (state.handleDiameter + height) / 2 + 1)}px;
    position: relative;
    opacity:
      ${(state.pos - state.uncheckedPos) / (state.checkedPos - state.uncheckedPos)};
    pointer-events: none;
    transition: ${"opacity 0.25s"};
  `;
      uncheckedIconStyle = `
    height: ${height}px;
    width: ${Math.min(height * 1.5, width - (state.handleDiameter + height) / 2 + 1)}px;
    position: absolute;
    opacity:
      ${1 - (state.pos - state.uncheckedPos) / (state.checkedPos - state.uncheckedPos)};
    right: 0px;
    top: 0px;
    pointer-events: none;
    transition: ${"opacity 0.25s"};
  `;
      handleStyle = `
    height: ${state.handleDiameter}px;
    width: ${state.handleDiameter}px;
    background: ${getBackgroundColor(state.pos, state.checkedPos, state.uncheckedPos, offHandleColor, onHandleColor)};
    display: inline-block;
    cursor: ${disabled ? "default" : "pointer"};
    border-radius: 50%;
    position: absolute;
    transform: translateX(${state.pos}px);
    top: ${Math.max(0, (height - state.handleDiameter) / 2)}px;
    outline: 0;
    box-shadow: ${boxShadow};
    border: 0;
    transition: ${"background-color 0.25s, transform 0.25s, box-shadow 0.15s"};
  `;
      inputStyle = `
    border: 0px;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0px;
    position: absolute;
    width: 1px;
  `;
      return `<div${add_attribute("class", containerClass, 0)}${add_attribute("style", rootStyle, 0)}><div class="${"react-switch-bg"}"${add_attribute("style", backgroundStyle, 0)}${add_attribute("onmousedown", (e2) => e2.preventDefault(), 0)}><div${add_attribute("style", checkedIconStyle, 0)}>${slots.checkedIcon ? slots.checkedIcon({}) : `
        ${validate_component(CIcon, "CIcon").$$render($$result, {}, {}, {})}
      `}</div>
    <div${add_attribute("style", uncheckedIconStyle, 0)}>${slots.unCheckedIcon ? slots.unCheckedIcon({}) : `
        ${validate_component(UIcon, "UIcon").$$render($$result, {}, {}, {})}
      `}</div></div>
  <div class="${"react-switch-handle"}"${add_attribute("style", handleStyle, 0)}></div>
  <input type="${"checkbox"}" role="${"switch"}" ${disabled ? "disabled" : ""}${add_attribute("style", inputStyle, 0)}${add_attribute("this", inputRef, 0)}></div>`;
    });
    SettingsItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { changeFunc } = $$props;
      let { checked } = $$props;
      if ($$props.changeFunc === void 0 && $$bindings.changeFunc && changeFunc !== void 0)
        $$bindings.changeFunc(changeFunc);
      if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
        $$bindings.checked(checked);
      return `<span class="${"w-full h-max py-4 flex flex-row items-center justify-center px-4 gap-2"}"><div class="${"grow flex flex-col justify-center items-start"}"><span class="${"text-lg font-semibold"}">${slots.title ? slots.title({}) : ``}</span>
    <span class="${"text-sm text-[#818384]"}">${slots.description ? slots.description({}) : ``}</span></div>
  ${validate_component(Switch, "Switch").$$render($$result, {
        width: 32,
        height: 20,
        offColor: "#565758",
        onColor: "#538d4e",
        handleDiameter: 16,
        checked
      }, {}, {
        checkedIcon: () => {
          return `<div slot="${"checkedIcon"}"></div>`;
        },
        unCheckedIcon: () => {
          return `<div slot="${"unCheckedIcon"}"></div>`;
        }
      })}</span>`;
    });
    Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_showSettings;
      let $expertMode, $$unsubscribe_expertMode;
      $$unsubscribe_showSettings = subscribe(showSettings, (value) => value);
      $$unsubscribe_expertMode = subscribe(expertMode, (value) => $expertMode = value);
      $$unsubscribe_showSettings();
      $$unsubscribe_expertMode();
      return `<div class="${"absolute inset-0 bg-[#121213] text-white z-20"}"><div class="${"absolute inset-0 mx-auto max-w-[500px] w-full flex flex-col justify-start items-center gap-2"}"><span class="${"w-full relative flex items-center justify-center text-xl font-semibold uppercase py-1"}"><h1>Settings</h1>
      <span class="${"absolute aspect-square right-2 my-auto"}">${validate_component(CloseIcon, "CloseIcon").$$render($$result, { height: 24, width: 24 }, {}, {})}</span></span>
    <span class="${"w-full h-full flex flex-col justify-start items-center divide-y divide-[#3a3a3c]"}">${validate_component(SettingsItem, "SettingsItem").$$render($$result, {
        changeFunc: () => {
          $expertMode = !$expertMode;
          localStorage.setItem("expert", $expertMode.toString());
        },
        checked: $expertMode
      }, {}, {
        description: () => {
          return `<p slot="${"description"}">Every time a non prime number is inserted a line is removed, after 5
          strikes.
        </p>`;
        },
        title: () => {
          return `<p slot="${"title"}">Expert Mode</p>`;
        }
      })}
      ${validate_component(SettingsItem, "SettingsItem").$$render($$result, {
        checked: false,
        changeFunc: () => {
        }
      }, {}, {
        description: () => {
          return `<p slot="${"description"}">Toggle on and off the dark theme.</p>`;
        },
        title: () => {
          return `<p slot="${"title"}">Dark Theme</p>`;
        }
      })}</span></div></div>`;
    });
    _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_expertMode;
      let $show, $$unsubscribe_show;
      let $showSettings, $$unsubscribe_showSettings;
      $$unsubscribe_expertMode = subscribe(expertMode, (value) => value);
      $$unsubscribe_show = subscribe(show, (value) => $show = value);
      $$unsubscribe_showSettings = subscribe(showSettings, (value) => $showSettings = value);
      $$unsubscribe_expertMode();
      $$unsubscribe_show();
      $$unsubscribe_showSettings();
      return `${$$result.head += `${$$result.title = `<title>Prirdle</title>`, ""}<meta name="${"description"}" content="${"Guess the prime number in 7 tries. A new puzzle is available each day."}" data-svelte="svelte-d0lgk1"><meta property="${"og:title"}" content="${"Prirdle"}" data-svelte="svelte-d0lgk1"><meta property="${"og:description"}" content="${"Guess the prime number in 7 tries. A new puzzle is available each day."}" data-svelte="svelte-d0lgk1"><meta property="${"og:image"}" content="${"https://www.prirdle.com/icon-512x512.png"}" data-svelte="svelte-d0lgk1"><meta property="${"og:url"}" content="${"https://www.prirdle.com"}" data-svelte="svelte-d0lgk1"><meta property="${"og:site_name"}" content="${"Prirdle"}" data-svelte="svelte-d0lgk1"><meta name="${"twitter:title"}" content="${"Prirdle"}" data-svelte="svelte-d0lgk1"><meta name="${"twitter:description"}" content="${"Guess the prime number in 6 tries. A new puzzle is available each day."}" data-svelte="svelte-d0lgk1"><meta name="${"twitter:image"}" content="${"https://www.prirdle.com/icon-512x512.png"}" data-svelte="svelte-d0lgk1"><meta name="${"twitter:creator"}" content="${"@timber1901"}" data-svelte="svelte-d0lgk1"><meta name="${"twitter:card"}" content="${"app"}" data-svelte="svelte-d0lgk1">`, ""}

<div class="${"relative z-0 w-full h-full"}">${validate_component(Modal, "Modal").$$render($$result, { show: $show, exit: () => $show = !$show }, {}, {})}
  ${validate_component(Popup, "Popup").$$render($$result, { _show: $show }, {}, {})}
  ${$showSettings ? `${validate_component(Settings, "Settings").$$render($$result, {}, {}, {})}` : ``}
  ${validate_component(Info, "Info").$$render($$result, {}, {}, {})}
  ${slots.default ? slots.default({}) : ``}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  css: () => css,
  entry: () => entry,
  js: () => js,
  module: () => layout_svelte_exports
});
var entry, js, css;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    init_layout_svelte();
    entry = "pages/__layout.svelte-673b2382.js";
    js = ["pages/__layout.svelte-673b2382.js", "chunks/vendor-ec4cd4ef.js", "chunks/store-9f9ddc16.js"];
    css = ["assets/pages/__layout.svelte-cf493572.css"];
  }
});

// .svelte-kit/output/server/entries/pages/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2,
  load: () => load
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/error.svelte.js"() {
    init_index_b5d175dd();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  css: () => css2,
  entry: () => entry2,
  js: () => js2,
  module: () => error_svelte_exports
});
var entry2, js2, css2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    init_error_svelte();
    entry2 = "error.svelte-727f1eef.js";
    js2 = ["error.svelte-727f1eef.js", "chunks/vendor-ec4cd4ef.js"];
    css2 = [];
  }
});

// .svelte-kit/output/server/entries/pages/index.svelte.js
var index_svelte_exports = {};
__export(index_svelte_exports, {
  default: () => Routes
});
var primes, SettingsIcon, StatsIcon, Header, Backspace, css$1, Footer, css3, Routes;
var init_index_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/index.svelte.js"() {
    init_index_b5d175dd();
    init_store_bc6efd45();
    primes = [
      "00002",
      "00003",
      "00005",
      "00007",
      "00011",
      "00013",
      "00017",
      "00019",
      "00023",
      "00029",
      "00031",
      "00037",
      "00041",
      "00043",
      "00047",
      "00053",
      "00059",
      "00061",
      "00067",
      "00071",
      "00073",
      "00079",
      "00083",
      "00089",
      "00097",
      "00101",
      "00103",
      "00107",
      "00109",
      "00113",
      "00127",
      "00131",
      "00137",
      "00139",
      "00149",
      "00151",
      "00157",
      "00163",
      "00167",
      "00173",
      "00179",
      "00181",
      "00191",
      "00193",
      "00197",
      "00199",
      "00211",
      "00223",
      "00227",
      "00229",
      "00233",
      "00239",
      "00241",
      "00251",
      "00257",
      "00263",
      "00269",
      "00271",
      "00277",
      "00281",
      "00283",
      "00293",
      "00307",
      "00311",
      "00313",
      "00317",
      "00331",
      "00337",
      "00347",
      "00349",
      "00353",
      "00359",
      "00367",
      "00373",
      "00379",
      "00383",
      "00389",
      "00397",
      "00401",
      "00409",
      "00419",
      "00421",
      "00431",
      "00433",
      "00439",
      "00443",
      "00449",
      "00457",
      "00461",
      "00463",
      "00467",
      "00479",
      "00487",
      "00491",
      "00499",
      "00503",
      "00509",
      "00521",
      "00523",
      "00541",
      "00547",
      "00557",
      "00563",
      "00569",
      "00571",
      "00577",
      "00587",
      "00593",
      "00599",
      "00601",
      "00607",
      "00613",
      "00617",
      "00619",
      "00631",
      "00641",
      "00643",
      "00647",
      "00653",
      "00659",
      "00661",
      "00673",
      "00677",
      "00683",
      "00691",
      "00701",
      "00709",
      "00719",
      "00727",
      "00733",
      "00739",
      "00743",
      "00751",
      "00757",
      "00761",
      "00769",
      "00773",
      "00787",
      "00797",
      "00809",
      "00811",
      "00821",
      "00823",
      "00827",
      "00829",
      "00839",
      "00853",
      "00857",
      "00859",
      "00863",
      "00877",
      "00881",
      "00883",
      "00887",
      "00907",
      "00911",
      "00919",
      "00929",
      "00937",
      "00941",
      "00947",
      "00953",
      "00967",
      "00971",
      "00977",
      "00983",
      "00991",
      "00997",
      "01009",
      "01013",
      "01019",
      "01021",
      "01031",
      "01033",
      "01039",
      "01049",
      "01051",
      "01061",
      "01063",
      "01069",
      "01087",
      "01091",
      "01093",
      "01097",
      "01103",
      "01109",
      "01117",
      "01123",
      "01129",
      "01151",
      "01153",
      "01163",
      "01171",
      "01181",
      "01187",
      "01193",
      "01201",
      "01213",
      "01217",
      "01223",
      "01229",
      "01231",
      "01237",
      "01249",
      "01259",
      "01277",
      "01279",
      "01283",
      "01289",
      "01291",
      "01297",
      "01301",
      "01303",
      "01307",
      "01319",
      "01321",
      "01327",
      "01361",
      "01367",
      "01373",
      "01381",
      "01399",
      "01409",
      "01423",
      "01427",
      "01429",
      "01433",
      "01439",
      "01447",
      "01451",
      "01453",
      "01459",
      "01471",
      "01481",
      "01483",
      "01487",
      "01489",
      "01493",
      "01499",
      "01511",
      "01523",
      "01531",
      "01543",
      "01549",
      "01553",
      "01559",
      "01567",
      "01571",
      "01579",
      "01583",
      "01597",
      "01601",
      "01607",
      "01609",
      "01613",
      "01619",
      "01621",
      "01627",
      "01637",
      "01657",
      "01663",
      "01667",
      "01669",
      "01693",
      "01697",
      "01699",
      "01709",
      "01721",
      "01723",
      "01733",
      "01741",
      "01747",
      "01753",
      "01759",
      "01777",
      "01783",
      "01787",
      "01789",
      "01801",
      "01811",
      "01823",
      "01831",
      "01847",
      "01861",
      "01867",
      "01871",
      "01873",
      "01877",
      "01879",
      "01889",
      "01901",
      "01907",
      "01913",
      "01931",
      "01933",
      "01949",
      "01951",
      "01973",
      "01979",
      "01987",
      "01993",
      "01997",
      "01999",
      "02003",
      "02011",
      "02017",
      "02027",
      "02029",
      "02039",
      "02053",
      "02063",
      "02069",
      "02081",
      "02083",
      "02087",
      "02089",
      "02099",
      "02111",
      "02113",
      "02129",
      "02131",
      "02137",
      "02141",
      "02143",
      "02153",
      "02161",
      "02179",
      "02203",
      "02207",
      "02213",
      "02221",
      "02237",
      "02239",
      "02243",
      "02251",
      "02267",
      "02269",
      "02273",
      "02281",
      "02287",
      "02293",
      "02297",
      "02309",
      "02311",
      "02333",
      "02339",
      "02341",
      "02347",
      "02351",
      "02357",
      "02371",
      "02377",
      "02381",
      "02383",
      "02389",
      "02393",
      "02399",
      "02411",
      "02417",
      "02423",
      "02437",
      "02441",
      "02447",
      "02459",
      "02467",
      "02473",
      "02477",
      "02503",
      "02521",
      "02531",
      "02539",
      "02543",
      "02549",
      "02551",
      "02557",
      "02579",
      "02591",
      "02593",
      "02609",
      "02617",
      "02621",
      "02633",
      "02647",
      "02657",
      "02659",
      "02663",
      "02671",
      "02677",
      "02683",
      "02687",
      "02689",
      "02693",
      "02699",
      "02707",
      "02711",
      "02713",
      "02719",
      "02729",
      "02731",
      "02741",
      "02749",
      "02753",
      "02767",
      "02777",
      "02789",
      "02791",
      "02797",
      "02801",
      "02803",
      "02819",
      "02833",
      "02837",
      "02843",
      "02851",
      "02857",
      "02861",
      "02879",
      "02887",
      "02897",
      "02903",
      "02909",
      "02917",
      "02927",
      "02939",
      "02953",
      "02957",
      "02963",
      "02969",
      "02971",
      "02999",
      "03001",
      "03011",
      "03019",
      "03023",
      "03037",
      "03041",
      "03049",
      "03061",
      "03067",
      "03079",
      "03083",
      "03089",
      "03109",
      "03119",
      "03121",
      "03137",
      "03163",
      "03167",
      "03169",
      "03181",
      "03187",
      "03191",
      "03203",
      "03209",
      "03217",
      "03221",
      "03229",
      "03251",
      "03253",
      "03257",
      "03259",
      "03271",
      "03299",
      "03301",
      "03307",
      "03313",
      "03319",
      "03323",
      "03329",
      "03331",
      "03343",
      "03347",
      "03359",
      "03361",
      "03371",
      "03373",
      "03389",
      "03391",
      "03407",
      "03413",
      "03433",
      "03449",
      "03457",
      "03461",
      "03463",
      "03467",
      "03469",
      "03491",
      "03499",
      "03511",
      "03517",
      "03527",
      "03529",
      "03533",
      "03539",
      "03541",
      "03547",
      "03557",
      "03559",
      "03571",
      "03581",
      "03583",
      "03593",
      "03607",
      "03613",
      "03617",
      "03623",
      "03631",
      "03637",
      "03643",
      "03659",
      "03671",
      "03673",
      "03677",
      "03691",
      "03697",
      "03701",
      "03709",
      "03719",
      "03727",
      "03733",
      "03739",
      "03761",
      "03767",
      "03769",
      "03779",
      "03793",
      "03797",
      "03803",
      "03821",
      "03823",
      "03833",
      "03847",
      "03851",
      "03853",
      "03863",
      "03877",
      "03881",
      "03889",
      "03907",
      "03911",
      "03917",
      "03919",
      "03923",
      "03929",
      "03931",
      "03943",
      "03947",
      "03967",
      "03989",
      "04001",
      "04003",
      "04007",
      "04013",
      "04019",
      "04021",
      "04027",
      "04049",
      "04051",
      "04057",
      "04073",
      "04079",
      "04091",
      "04093",
      "04099",
      "04111",
      "04127",
      "04129",
      "04133",
      "04139",
      "04153",
      "04157",
      "04159",
      "04177",
      "04201",
      "04211",
      "04217",
      "04219",
      "04229",
      "04231",
      "04241",
      "04243",
      "04253",
      "04259",
      "04261",
      "04271",
      "04273",
      "04283",
      "04289",
      "04297",
      "04327",
      "04337",
      "04339",
      "04349",
      "04357",
      "04363",
      "04373",
      "04391",
      "04397",
      "04409",
      "04421",
      "04423",
      "04441",
      "04447",
      "04451",
      "04457",
      "04463",
      "04481",
      "04483",
      "04493",
      "04507",
      "04513",
      "04517",
      "04519",
      "04523",
      "04547",
      "04549",
      "04561",
      "04567",
      "04583",
      "04591",
      "04597",
      "04603",
      "04621",
      "04637",
      "04639",
      "04643",
      "04649",
      "04651",
      "04657",
      "04663",
      "04673",
      "04679",
      "04691",
      "04703",
      "04721",
      "04723",
      "04729",
      "04733",
      "04751",
      "04759",
      "04783",
      "04787",
      "04789",
      "04793",
      "04799",
      "04801",
      "04813",
      "04817",
      "04831",
      "04861",
      "04871",
      "04877",
      "04889",
      "04903",
      "04909",
      "04919",
      "04931",
      "04933",
      "04937",
      "04943",
      "04951",
      "04957",
      "04967",
      "04969",
      "04973",
      "04987",
      "04993",
      "04999",
      "05003",
      "05009",
      "05011",
      "05021",
      "05023",
      "05039",
      "05051",
      "05059",
      "05077",
      "05081",
      "05087",
      "05099",
      "05101",
      "05107",
      "05113",
      "05119",
      "05147",
      "05153",
      "05167",
      "05171",
      "05179",
      "05189",
      "05197",
      "05209",
      "05227",
      "05231",
      "05233",
      "05237",
      "05261",
      "05273",
      "05279",
      "05281",
      "05297",
      "05303",
      "05309",
      "05323",
      "05333",
      "05347",
      "05351",
      "05381",
      "05387",
      "05393",
      "05399",
      "05407",
      "05413",
      "05417",
      "05419",
      "05431",
      "05437",
      "05441",
      "05443",
      "05449",
      "05471",
      "05477",
      "05479",
      "05483",
      "05501",
      "05503",
      "05507",
      "05519",
      "05521",
      "05527",
      "05531",
      "05557",
      "05563",
      "05569",
      "05573",
      "05581",
      "05591",
      "05623",
      "05639",
      "05641",
      "05647",
      "05651",
      "05653",
      "05657",
      "05659",
      "05669",
      "05683",
      "05689",
      "05693",
      "05701",
      "05711",
      "05717",
      "05737",
      "05741",
      "05743",
      "05749",
      "05779",
      "05783",
      "05791",
      "05801",
      "05807",
      "05813",
      "05821",
      "05827",
      "05839",
      "05843",
      "05849",
      "05851",
      "05857",
      "05861",
      "05867",
      "05869",
      "05879",
      "05881",
      "05897",
      "05903",
      "05923",
      "05927",
      "05939",
      "05953",
      "05981",
      "05987",
      "06007",
      "06011",
      "06029",
      "06037",
      "06043",
      "06047",
      "06053",
      "06067",
      "06073",
      "06079",
      "06089",
      "06091",
      "06101",
      "06113",
      "06121",
      "06131",
      "06133",
      "06143",
      "06151",
      "06163",
      "06173",
      "06197",
      "06199",
      "06203",
      "06211",
      "06217",
      "06221",
      "06229",
      "06247",
      "06257",
      "06263",
      "06269",
      "06271",
      "06277",
      "06287",
      "06299",
      "06301",
      "06311",
      "06317",
      "06323",
      "06329",
      "06337",
      "06343",
      "06353",
      "06359",
      "06361",
      "06367",
      "06373",
      "06379",
      "06389",
      "06397",
      "06421",
      "06427",
      "06449",
      "06451",
      "06469",
      "06473",
      "06481",
      "06491",
      "06521",
      "06529",
      "06547",
      "06551",
      "06553",
      "06563",
      "06569",
      "06571",
      "06577",
      "06581",
      "06599",
      "06607",
      "06619",
      "06637",
      "06653",
      "06659",
      "06661",
      "06673",
      "06679",
      "06689",
      "06691",
      "06701",
      "06703",
      "06709",
      "06719",
      "06733",
      "06737",
      "06761",
      "06763",
      "06779",
      "06781",
      "06791",
      "06793",
      "06803",
      "06823",
      "06827",
      "06829",
      "06833",
      "06841",
      "06857",
      "06863",
      "06869",
      "06871",
      "06883",
      "06899",
      "06907",
      "06911",
      "06917",
      "06947",
      "06949",
      "06959",
      "06961",
      "06967",
      "06971",
      "06977",
      "06983",
      "06991",
      "06997",
      "07001",
      "07013",
      "07019",
      "07027",
      "07039",
      "07043",
      "07057",
      "07069",
      "07079",
      "07103",
      "07109",
      "07121",
      "07127",
      "07129",
      "07151",
      "07159",
      "07177",
      "07187",
      "07193",
      "07207",
      "07211",
      "07213",
      "07219",
      "07229",
      "07237",
      "07243",
      "07247",
      "07253",
      "07283",
      "07297",
      "07307",
      "07309",
      "07321",
      "07331",
      "07333",
      "07349",
      "07351",
      "07369",
      "07393",
      "07411",
      "07417",
      "07433",
      "07451",
      "07457",
      "07459",
      "07477",
      "07481",
      "07487",
      "07489",
      "07499",
      "07507",
      "07517",
      "07523",
      "07529",
      "07537",
      "07541",
      "07547",
      "07549",
      "07559",
      "07561",
      "07573",
      "07577",
      "07583",
      "07589",
      "07591",
      "07603",
      "07607",
      "07621",
      "07639",
      "07643",
      "07649",
      "07669",
      "07673",
      "07681",
      "07687",
      "07691",
      "07699",
      "07703",
      "07717",
      "07723",
      "07727",
      "07741",
      "07753",
      "07757",
      "07759",
      "07789",
      "07793",
      "07817",
      "07823",
      "07829",
      "07841",
      "07853",
      "07867",
      "07873",
      "07877",
      "07879",
      "07883",
      "07901",
      "07907",
      "07919",
      "07927",
      "07933",
      "07937",
      "07949",
      "07951",
      "07963",
      "07993",
      "08009",
      "08011",
      "08017",
      "08039",
      "08053",
      "08059",
      "08069",
      "08081",
      "08087",
      "08089",
      "08093",
      "08101",
      "08111",
      "08117",
      "08123",
      "08147",
      "08161",
      "08167",
      "08171",
      "08179",
      "08191",
      "08209",
      "08219",
      "08221",
      "08231",
      "08233",
      "08237",
      "08243",
      "08263",
      "08269",
      "08273",
      "08287",
      "08291",
      "08293",
      "08297",
      "08311",
      "08317",
      "08329",
      "08353",
      "08363",
      "08369",
      "08377",
      "08387",
      "08389",
      "08419",
      "08423",
      "08429",
      "08431",
      "08443",
      "08447",
      "08461",
      "08467",
      "08501",
      "08513",
      "08521",
      "08527",
      "08537",
      "08539",
      "08543",
      "08563",
      "08573",
      "08581",
      "08597",
      "08599",
      "08609",
      "08623",
      "08627",
      "08629",
      "08641",
      "08647",
      "08663",
      "08669",
      "08677",
      "08681",
      "08689",
      "08693",
      "08699",
      "08707",
      "08713",
      "08719",
      "08731",
      "08737",
      "08741",
      "08747",
      "08753",
      "08761",
      "08779",
      "08783",
      "08803",
      "08807",
      "08819",
      "08821",
      "08831",
      "08837",
      "08839",
      "08849",
      "08861",
      "08863",
      "08867",
      "08887",
      "08893",
      "08923",
      "08929",
      "08933",
      "08941",
      "08951",
      "08963",
      "08969",
      "08971",
      "08999",
      "09001",
      "09007",
      "09011",
      "09013",
      "09029",
      "09041",
      "09043",
      "09049",
      "09059",
      "09067",
      "09091",
      "09103",
      "09109",
      "09127",
      "09133",
      "09137",
      "09151",
      "09157",
      "09161",
      "09173",
      "09181",
      "09187",
      "09199",
      "09203",
      "09209",
      "09221",
      "09227",
      "09239",
      "09241",
      "09257",
      "09277",
      "09281",
      "09283",
      "09293",
      "09311",
      "09319",
      "09323",
      "09337",
      "09341",
      "09343",
      "09349",
      "09371",
      "09377",
      "09391",
      "09397",
      "09403",
      "09413",
      "09419",
      "09421",
      "09431",
      "09433",
      "09437",
      "09439",
      "09461",
      "09463",
      "09467",
      "09473",
      "09479",
      "09491",
      "09497",
      "09511",
      "09521",
      "09533",
      "09539",
      "09547",
      "09551",
      "09587",
      "09601",
      "09613",
      "09619",
      "09623",
      "09629",
      "09631",
      "09643",
      "09649",
      "09661",
      "09677",
      "09679",
      "09689",
      "09697",
      "09719",
      "09721",
      "09733",
      "09739",
      "09743",
      "09749",
      "09767",
      "09769",
      "09781",
      "09787",
      "09791",
      "09803",
      "09811",
      "09817",
      "09829",
      "09833",
      "09839",
      "09851",
      "09857",
      "09859",
      "09871",
      "09883",
      "09887",
      "09901",
      "09907",
      "09923",
      "09929",
      "09931",
      "09941",
      "09949",
      "09967",
      "09973",
      "10007",
      "10009",
      "10037",
      "10039",
      "10061",
      "10067",
      "10069",
      "10079",
      "10091",
      "10093",
      "10099",
      "10103",
      "10111",
      "10133",
      "10139",
      "10141",
      "10151",
      "10159",
      "10163",
      "10169",
      "10177",
      "10181",
      "10193",
      "10211",
      "10223",
      "10243",
      "10247",
      "10253",
      "10259",
      "10267",
      "10271",
      "10273",
      "10289",
      "10301",
      "10303",
      "10313",
      "10321",
      "10331",
      "10333",
      "10337",
      "10343",
      "10357",
      "10369",
      "10391",
      "10399",
      "10427",
      "10429",
      "10433",
      "10453",
      "10457",
      "10459",
      "10463",
      "10477",
      "10487",
      "10499",
      "10501",
      "10513",
      "10529",
      "10531",
      "10559",
      "10567",
      "10589",
      "10597",
      "10601",
      "10607",
      "10613",
      "10627",
      "10631",
      "10639",
      "10651",
      "10657",
      "10663",
      "10667",
      "10687",
      "10691",
      "10709",
      "10711",
      "10723",
      "10729",
      "10733",
      "10739",
      "10753",
      "10771",
      "10781",
      "10789",
      "10799",
      "10831",
      "10837",
      "10847",
      "10853",
      "10859",
      "10861",
      "10867",
      "10883",
      "10889",
      "10891",
      "10903",
      "10909",
      "10937",
      "10939",
      "10949",
      "10957",
      "10973",
      "10979",
      "10987",
      "10993",
      "11003",
      "11027",
      "11047",
      "11057",
      "11059",
      "11069",
      "11071",
      "11083",
      "11087",
      "11093",
      "11113",
      "11117",
      "11119",
      "11131",
      "11149",
      "11159",
      "11161",
      "11171",
      "11173",
      "11177",
      "11197",
      "11213",
      "11239",
      "11243",
      "11251",
      "11257",
      "11261",
      "11273",
      "11279",
      "11287",
      "11299",
      "11311",
      "11317",
      "11321",
      "11329",
      "11351",
      "11353",
      "11369",
      "11383",
      "11393",
      "11399",
      "11411",
      "11423",
      "11437",
      "11443",
      "11447",
      "11467",
      "11471",
      "11483",
      "11489",
      "11491",
      "11497",
      "11503",
      "11519",
      "11527",
      "11549",
      "11551",
      "11579",
      "11587",
      "11593",
      "11597",
      "11617",
      "11621",
      "11633",
      "11657",
      "11677",
      "11681",
      "11689",
      "11699",
      "11701",
      "11717",
      "11719",
      "11731",
      "11743",
      "11777",
      "11779",
      "11783",
      "11789",
      "11801",
      "11807",
      "11813",
      "11821",
      "11827",
      "11831",
      "11833",
      "11839",
      "11863",
      "11867",
      "11887",
      "11897",
      "11903",
      "11909",
      "11923",
      "11927",
      "11933",
      "11939",
      "11941",
      "11953",
      "11959",
      "11969",
      "11971",
      "11981",
      "11987",
      "12007",
      "12011",
      "12037",
      "12041",
      "12043",
      "12049",
      "12071",
      "12073",
      "12097",
      "12101",
      "12107",
      "12109",
      "12113",
      "12119",
      "12143",
      "12149",
      "12157",
      "12161",
      "12163",
      "12197",
      "12203",
      "12211",
      "12227",
      "12239",
      "12241",
      "12251",
      "12253",
      "12263",
      "12269",
      "12277",
      "12281",
      "12289",
      "12301",
      "12323",
      "12329",
      "12343",
      "12347",
      "12373",
      "12377",
      "12379",
      "12391",
      "12401",
      "12409",
      "12413",
      "12421",
      "12433",
      "12437",
      "12451",
      "12457",
      "12473",
      "12479",
      "12487",
      "12491",
      "12497",
      "12503",
      "12511",
      "12517",
      "12527",
      "12539",
      "12541",
      "12547",
      "12553",
      "12569",
      "12577",
      "12583",
      "12589",
      "12601",
      "12611",
      "12613",
      "12619",
      "12637",
      "12641",
      "12647",
      "12653",
      "12659",
      "12671",
      "12689",
      "12697",
      "12703",
      "12713",
      "12721",
      "12739",
      "12743",
      "12757",
      "12763",
      "12781",
      "12791",
      "12799",
      "12809",
      "12821",
      "12823",
      "12829",
      "12841",
      "12853",
      "12889",
      "12893",
      "12899",
      "12907",
      "12911",
      "12917",
      "12919",
      "12923",
      "12941",
      "12953",
      "12959",
      "12967",
      "12973",
      "12979",
      "12983",
      "13001",
      "13003",
      "13007",
      "13009",
      "13033",
      "13037",
      "13043",
      "13049",
      "13063",
      "13093",
      "13099",
      "13103",
      "13109",
      "13121",
      "13127",
      "13147",
      "13151",
      "13159",
      "13163",
      "13171",
      "13177",
      "13183",
      "13187",
      "13217",
      "13219",
      "13229",
      "13241",
      "13249",
      "13259",
      "13267",
      "13291",
      "13297",
      "13309",
      "13313",
      "13327",
      "13331",
      "13337",
      "13339",
      "13367",
      "13381",
      "13397",
      "13399",
      "13411",
      "13417",
      "13421",
      "13441",
      "13451",
      "13457",
      "13463",
      "13469",
      "13477",
      "13487",
      "13499",
      "13513",
      "13523",
      "13537",
      "13553",
      "13567",
      "13577",
      "13591",
      "13597",
      "13613",
      "13619",
      "13627",
      "13633",
      "13649",
      "13669",
      "13679",
      "13681",
      "13687",
      "13691",
      "13693",
      "13697",
      "13709",
      "13711",
      "13721",
      "13723",
      "13729",
      "13751",
      "13757",
      "13759",
      "13763",
      "13781",
      "13789",
      "13799",
      "13807",
      "13829",
      "13831",
      "13841",
      "13859",
      "13873",
      "13877",
      "13879",
      "13883",
      "13901",
      "13903",
      "13907",
      "13913",
      "13921",
      "13931",
      "13933",
      "13963",
      "13967",
      "13997",
      "13999",
      "14009",
      "14011",
      "14029",
      "14033",
      "14051",
      "14057",
      "14071",
      "14081",
      "14083",
      "14087",
      "14107",
      "14143",
      "14149",
      "14153",
      "14159",
      "14173",
      "14177",
      "14197",
      "14207",
      "14221",
      "14243",
      "14249",
      "14251",
      "14281",
      "14293",
      "14303",
      "14321",
      "14323",
      "14327",
      "14341",
      "14347",
      "14369",
      "14387",
      "14389",
      "14401",
      "14407",
      "14411",
      "14419",
      "14423",
      "14431",
      "14437",
      "14447",
      "14449",
      "14461",
      "14479",
      "14489",
      "14503",
      "14519",
      "14533",
      "14537",
      "14543",
      "14549",
      "14551",
      "14557",
      "14561",
      "14563",
      "14591",
      "14593",
      "14621",
      "14627",
      "14629",
      "14633",
      "14639",
      "14653",
      "14657",
      "14669",
      "14683",
      "14699",
      "14713",
      "14717",
      "14723",
      "14731",
      "14737",
      "14741",
      "14747",
      "14753",
      "14759",
      "14767",
      "14771",
      "14779",
      "14783",
      "14797",
      "14813",
      "14821",
      "14827",
      "14831",
      "14843",
      "14851",
      "14867",
      "14869",
      "14879",
      "14887",
      "14891",
      "14897",
      "14923",
      "14929",
      "14939",
      "14947",
      "14951",
      "14957",
      "14969",
      "14983",
      "15013",
      "15017",
      "15031",
      "15053",
      "15061",
      "15073",
      "15077",
      "15083",
      "15091",
      "15101",
      "15107",
      "15121",
      "15131",
      "15137",
      "15139",
      "15149",
      "15161",
      "15173",
      "15187",
      "15193",
      "15199",
      "15217",
      "15227",
      "15233",
      "15241",
      "15259",
      "15263",
      "15269",
      "15271",
      "15277",
      "15287",
      "15289",
      "15299",
      "15307",
      "15313",
      "15319",
      "15329",
      "15331",
      "15349",
      "15359",
      "15361",
      "15373",
      "15377",
      "15383",
      "15391",
      "15401",
      "15413",
      "15427",
      "15439",
      "15443",
      "15451",
      "15461",
      "15467",
      "15473",
      "15493",
      "15497",
      "15511",
      "15527",
      "15541",
      "15551",
      "15559",
      "15569",
      "15581",
      "15583",
      "15601",
      "15607",
      "15619",
      "15629",
      "15641",
      "15643",
      "15647",
      "15649",
      "15661",
      "15667",
      "15671",
      "15679",
      "15683",
      "15727",
      "15731",
      "15733",
      "15737",
      "15739",
      "15749",
      "15761",
      "15767",
      "15773",
      "15787",
      "15791",
      "15797",
      "15803",
      "15809",
      "15817",
      "15823",
      "15859",
      "15877",
      "15881",
      "15887",
      "15889",
      "15901",
      "15907",
      "15913",
      "15919",
      "15923",
      "15937",
      "15959",
      "15971",
      "15973",
      "15991",
      "16001",
      "16007",
      "16033",
      "16057",
      "16061",
      "16063",
      "16067",
      "16069",
      "16073",
      "16087",
      "16091",
      "16097",
      "16103",
      "16111",
      "16127",
      "16139",
      "16141",
      "16183",
      "16187",
      "16189",
      "16193",
      "16217",
      "16223",
      "16229",
      "16231",
      "16249",
      "16253",
      "16267",
      "16273",
      "16301",
      "16319",
      "16333",
      "16339",
      "16349",
      "16361",
      "16363",
      "16369",
      "16381",
      "16411",
      "16417",
      "16421",
      "16427",
      "16433",
      "16447",
      "16451",
      "16453",
      "16477",
      "16481",
      "16487",
      "16493",
      "16519",
      "16529",
      "16547",
      "16553",
      "16561",
      "16567",
      "16573",
      "16603",
      "16607",
      "16619",
      "16631",
      "16633",
      "16649",
      "16651",
      "16657",
      "16661",
      "16673",
      "16691",
      "16693",
      "16699",
      "16703",
      "16729",
      "16741",
      "16747",
      "16759",
      "16763",
      "16787",
      "16811",
      "16823",
      "16829",
      "16831",
      "16843",
      "16871",
      "16879",
      "16883",
      "16889",
      "16901",
      "16903",
      "16921",
      "16927",
      "16931",
      "16937",
      "16943",
      "16963",
      "16979",
      "16981",
      "16987",
      "16993",
      "17011",
      "17021",
      "17027",
      "17029",
      "17033",
      "17041",
      "17047",
      "17053",
      "17077",
      "17093",
      "17099",
      "17107",
      "17117",
      "17123",
      "17137",
      "17159",
      "17167",
      "17183",
      "17189",
      "17191",
      "17203",
      "17207",
      "17209",
      "17231",
      "17239",
      "17257",
      "17291",
      "17293",
      "17299",
      "17317",
      "17321",
      "17327",
      "17333",
      "17341",
      "17351",
      "17359",
      "17377",
      "17383",
      "17387",
      "17389",
      "17393",
      "17401",
      "17417",
      "17419",
      "17431",
      "17443",
      "17449",
      "17467",
      "17471",
      "17477",
      "17483",
      "17489",
      "17491",
      "17497",
      "17509",
      "17519",
      "17539",
      "17551",
      "17569",
      "17573",
      "17579",
      "17581",
      "17597",
      "17599",
      "17609",
      "17623",
      "17627",
      "17657",
      "17659",
      "17669",
      "17681",
      "17683",
      "17707",
      "17713",
      "17729",
      "17737",
      "17747",
      "17749",
      "17761",
      "17783",
      "17789",
      "17791",
      "17807",
      "17827",
      "17837",
      "17839",
      "17851",
      "17863",
      "17881",
      "17891",
      "17903",
      "17909",
      "17911",
      "17921",
      "17923",
      "17929",
      "17939",
      "17957",
      "17959",
      "17971",
      "17977",
      "17981",
      "17987",
      "17989",
      "18013",
      "18041",
      "18043",
      "18047",
      "18049",
      "18059",
      "18061",
      "18077",
      "18089",
      "18097",
      "18119",
      "18121",
      "18127",
      "18131",
      "18133",
      "18143",
      "18149",
      "18169",
      "18181",
      "18191",
      "18199",
      "18211",
      "18217",
      "18223",
      "18229",
      "18233",
      "18251",
      "18253",
      "18257",
      "18269",
      "18287",
      "18289",
      "18301",
      "18307",
      "18311",
      "18313",
      "18329",
      "18341",
      "18353",
      "18367",
      "18371",
      "18379",
      "18397",
      "18401",
      "18413",
      "18427",
      "18433",
      "18439",
      "18443",
      "18451",
      "18457",
      "18461",
      "18481",
      "18493",
      "18503",
      "18517",
      "18521",
      "18523",
      "18539",
      "18541",
      "18553",
      "18583",
      "18587",
      "18593",
      "18617",
      "18637",
      "18661",
      "18671",
      "18679",
      "18691",
      "18701",
      "18713",
      "18719",
      "18731",
      "18743",
      "18749",
      "18757",
      "18773",
      "18787",
      "18793",
      "18797",
      "18803",
      "18839",
      "18859",
      "18869",
      "18899",
      "18911",
      "18913",
      "18917",
      "18919",
      "18947",
      "18959",
      "18973",
      "18979",
      "19001",
      "19009",
      "19013",
      "19031",
      "19037",
      "19051",
      "19069",
      "19073",
      "19079",
      "19081",
      "19087",
      "19121",
      "19139",
      "19141",
      "19157",
      "19163",
      "19181",
      "19183",
      "19207",
      "19211",
      "19213",
      "19219",
      "19231",
      "19237",
      "19249",
      "19259",
      "19267",
      "19273",
      "19289",
      "19301",
      "19309",
      "19319",
      "19333",
      "19373",
      "19379",
      "19381",
      "19387",
      "19391",
      "19403",
      "19417",
      "19421",
      "19423",
      "19427",
      "19429",
      "19433",
      "19441",
      "19447",
      "19457",
      "19463",
      "19469",
      "19471",
      "19477",
      "19483",
      "19489",
      "19501",
      "19507",
      "19531",
      "19541",
      "19543",
      "19553",
      "19559",
      "19571",
      "19577",
      "19583",
      "19597",
      "19603",
      "19609",
      "19661",
      "19681",
      "19687",
      "19697",
      "19699",
      "19709",
      "19717",
      "19727",
      "19739",
      "19751",
      "19753",
      "19759",
      "19763",
      "19777",
      "19793",
      "19801",
      "19813",
      "19819",
      "19841",
      "19843",
      "19853",
      "19861",
      "19867",
      "19889",
      "19891",
      "19913",
      "19919",
      "19927",
      "19937",
      "19949",
      "19961",
      "19963",
      "19973",
      "19979",
      "19991",
      "19993",
      "19997",
      "20011",
      "20021",
      "20023",
      "20029",
      "20047",
      "20051",
      "20063",
      "20071",
      "20089",
      "20101",
      "20107",
      "20113",
      "20117",
      "20123",
      "20129",
      "20143",
      "20147",
      "20149",
      "20161",
      "20173",
      "20177",
      "20183",
      "20201",
      "20219",
      "20231",
      "20233",
      "20249",
      "20261",
      "20269",
      "20287",
      "20297",
      "20323",
      "20327",
      "20333",
      "20341",
      "20347",
      "20353",
      "20357",
      "20359",
      "20369",
      "20389",
      "20393",
      "20399",
      "20407",
      "20411",
      "20431",
      "20441",
      "20443",
      "20477",
      "20479",
      "20483",
      "20507",
      "20509",
      "20521",
      "20533",
      "20543",
      "20549",
      "20551",
      "20563",
      "20593",
      "20599",
      "20611",
      "20627",
      "20639",
      "20641",
      "20663",
      "20681",
      "20693",
      "20707",
      "20717",
      "20719",
      "20731",
      "20743",
      "20747",
      "20749",
      "20753",
      "20759",
      "20771",
      "20773",
      "20789",
      "20807",
      "20809",
      "20849",
      "20857",
      "20873",
      "20879",
      "20887",
      "20897",
      "20899",
      "20903",
      "20921",
      "20929",
      "20939",
      "20947",
      "20959",
      "20963",
      "20981",
      "20983",
      "21001",
      "21011",
      "21013",
      "21017",
      "21019",
      "21023",
      "21031",
      "21059",
      "21061",
      "21067",
      "21089",
      "21101",
      "21107",
      "21121",
      "21139",
      "21143",
      "21149",
      "21157",
      "21163",
      "21169",
      "21179",
      "21187",
      "21191",
      "21193",
      "21211",
      "21221",
      "21227",
      "21247",
      "21269",
      "21277",
      "21283",
      "21313",
      "21317",
      "21319",
      "21323",
      "21341",
      "21347",
      "21377",
      "21379",
      "21383",
      "21391",
      "21397",
      "21401",
      "21407",
      "21419",
      "21433",
      "21467",
      "21481",
      "21487",
      "21491",
      "21493",
      "21499",
      "21503",
      "21517",
      "21521",
      "21523",
      "21529",
      "21557",
      "21559",
      "21563",
      "21569",
      "21577",
      "21587",
      "21589",
      "21599",
      "21601",
      "21611",
      "21613",
      "21617",
      "21647",
      "21649",
      "21661",
      "21673",
      "21683",
      "21701",
      "21713",
      "21727",
      "21737",
      "21739",
      "21751",
      "21757",
      "21767",
      "21773",
      "21787",
      "21799",
      "21803",
      "21817",
      "21821",
      "21839",
      "21841",
      "21851",
      "21859",
      "21863",
      "21871",
      "21881",
      "21893",
      "21911",
      "21929",
      "21937",
      "21943",
      "21961",
      "21977",
      "21991",
      "21997",
      "22003",
      "22013",
      "22027",
      "22031",
      "22037",
      "22039",
      "22051",
      "22063",
      "22067",
      "22073",
      "22079",
      "22091",
      "22093",
      "22109",
      "22111",
      "22123",
      "22129",
      "22133",
      "22147",
      "22153",
      "22157",
      "22159",
      "22171",
      "22189",
      "22193",
      "22229",
      "22247",
      "22259",
      "22271",
      "22273",
      "22277",
      "22279",
      "22283",
      "22291",
      "22303",
      "22307",
      "22343",
      "22349",
      "22367",
      "22369",
      "22381",
      "22391",
      "22397",
      "22409",
      "22433",
      "22441",
      "22447",
      "22453",
      "22469",
      "22481",
      "22483",
      "22501",
      "22511",
      "22531",
      "22541",
      "22543",
      "22549",
      "22567",
      "22571",
      "22573",
      "22613",
      "22619",
      "22621",
      "22637",
      "22639",
      "22643",
      "22651",
      "22669",
      "22679",
      "22691",
      "22697",
      "22699",
      "22709",
      "22717",
      "22721",
      "22727",
      "22739",
      "22741",
      "22751",
      "22769",
      "22777",
      "22783",
      "22787",
      "22807",
      "22811",
      "22817",
      "22853",
      "22859",
      "22861",
      "22871",
      "22877",
      "22901",
      "22907",
      "22921",
      "22937",
      "22943",
      "22961",
      "22963",
      "22973",
      "22993",
      "23003",
      "23011",
      "23017",
      "23021",
      "23027",
      "23029",
      "23039",
      "23041",
      "23053",
      "23057",
      "23059",
      "23063",
      "23071",
      "23081",
      "23087",
      "23099",
      "23117",
      "23131",
      "23143",
      "23159",
      "23167",
      "23173",
      "23189",
      "23197",
      "23201",
      "23203",
      "23209",
      "23227",
      "23251",
      "23269",
      "23279",
      "23291",
      "23293",
      "23297",
      "23311",
      "23321",
      "23327",
      "23333",
      "23339",
      "23357",
      "23369",
      "23371",
      "23399",
      "23417",
      "23431",
      "23447",
      "23459",
      "23473",
      "23497",
      "23509",
      "23531",
      "23537",
      "23539",
      "23549",
      "23557",
      "23561",
      "23563",
      "23567",
      "23581",
      "23593",
      "23599",
      "23603",
      "23609",
      "23623",
      "23627",
      "23629",
      "23633",
      "23663",
      "23669",
      "23671",
      "23677",
      "23687",
      "23689",
      "23719",
      "23741",
      "23743",
      "23747",
      "23753",
      "23761",
      "23767",
      "23773",
      "23789",
      "23801",
      "23813",
      "23819",
      "23827",
      "23831",
      "23833",
      "23857",
      "23869",
      "23873",
      "23879",
      "23887",
      "23893",
      "23899",
      "23909",
      "23911",
      "23917",
      "23929",
      "23957",
      "23971",
      "23977",
      "23981",
      "23993",
      "24001",
      "24007",
      "24019",
      "24023",
      "24029",
      "24043",
      "24049",
      "24061",
      "24071",
      "24077",
      "24083",
      "24091",
      "24097",
      "24103",
      "24107",
      "24109",
      "24113",
      "24121",
      "24133",
      "24137",
      "24151",
      "24169",
      "24179",
      "24181",
      "24197",
      "24203",
      "24223",
      "24229",
      "24239",
      "24247",
      "24251",
      "24281",
      "24317",
      "24329",
      "24337",
      "24359",
      "24371",
      "24373",
      "24379",
      "24391",
      "24407",
      "24413",
      "24419",
      "24421",
      "24439",
      "24443",
      "24469",
      "24473",
      "24481",
      "24499",
      "24509",
      "24517",
      "24527",
      "24533",
      "24547",
      "24551",
      "24571",
      "24593",
      "24611",
      "24623",
      "24631",
      "24659",
      "24671",
      "24677",
      "24683",
      "24691",
      "24697",
      "24709",
      "24733",
      "24749",
      "24763",
      "24767",
      "24781",
      "24793",
      "24799",
      "24809",
      "24821",
      "24841",
      "24847",
      "24851",
      "24859",
      "24877",
      "24889",
      "24907",
      "24917",
      "24919",
      "24923",
      "24943",
      "24953",
      "24967",
      "24971",
      "24977",
      "24979",
      "24989",
      "25013",
      "25031",
      "25033",
      "25037",
      "25057",
      "25073",
      "25087",
      "25097",
      "25111",
      "25117",
      "25121",
      "25127",
      "25147",
      "25153",
      "25163",
      "25169",
      "25171",
      "25183",
      "25189",
      "25219",
      "25229",
      "25237",
      "25243",
      "25247",
      "25253",
      "25261",
      "25301",
      "25303",
      "25307",
      "25309",
      "25321",
      "25339",
      "25343",
      "25349",
      "25357",
      "25367",
      "25373",
      "25391",
      "25409",
      "25411",
      "25423",
      "25439",
      "25447",
      "25453",
      "25457",
      "25463",
      "25469",
      "25471",
      "25523",
      "25537",
      "25541",
      "25561",
      "25577",
      "25579",
      "25583",
      "25589",
      "25601",
      "25603",
      "25609",
      "25621",
      "25633",
      "25639",
      "25643",
      "25657",
      "25667",
      "25673",
      "25679",
      "25693",
      "25703",
      "25717",
      "25733",
      "25741",
      "25747",
      "25759",
      "25763",
      "25771",
      "25793",
      "25799",
      "25801",
      "25819",
      "25841",
      "25847",
      "25849",
      "25867",
      "25873",
      "25889",
      "25903",
      "25913",
      "25919",
      "25931",
      "25933",
      "25939",
      "25943",
      "25951",
      "25969",
      "25981",
      "25997",
      "25999",
      "26003",
      "26017",
      "26021",
      "26029",
      "26041",
      "26053",
      "26083",
      "26099",
      "26107",
      "26111",
      "26113",
      "26119",
      "26141",
      "26153",
      "26161",
      "26171",
      "26177",
      "26183",
      "26189",
      "26203",
      "26209",
      "26227",
      "26237",
      "26249",
      "26251",
      "26261",
      "26263",
      "26267",
      "26293",
      "26297",
      "26309",
      "26317",
      "26321",
      "26339",
      "26347",
      "26357",
      "26371",
      "26387",
      "26393",
      "26399",
      "26407",
      "26417",
      "26423",
      "26431",
      "26437",
      "26449",
      "26459",
      "26479",
      "26489",
      "26497",
      "26501",
      "26513",
      "26539",
      "26557",
      "26561",
      "26573",
      "26591",
      "26597",
      "26627",
      "26633",
      "26641",
      "26647",
      "26669",
      "26681",
      "26683",
      "26687",
      "26693",
      "26699",
      "26701",
      "26711",
      "26713",
      "26717",
      "26723",
      "26729",
      "26731",
      "26737",
      "26759",
      "26777",
      "26783",
      "26801",
      "26813",
      "26821",
      "26833",
      "26839",
      "26849",
      "26861",
      "26863",
      "26879",
      "26881",
      "26891",
      "26893",
      "26903",
      "26921",
      "26927",
      "26947",
      "26951",
      "26953",
      "26959",
      "26981",
      "26987",
      "26993",
      "27011",
      "27017",
      "27031",
      "27043",
      "27059",
      "27061",
      "27067",
      "27073",
      "27077",
      "27091",
      "27103",
      "27107",
      "27109",
      "27127",
      "27143",
      "27179",
      "27191",
      "27197",
      "27211",
      "27239",
      "27241",
      "27253",
      "27259",
      "27271",
      "27277",
      "27281",
      "27283",
      "27299",
      "27329",
      "27337",
      "27361",
      "27367",
      "27397",
      "27407",
      "27409",
      "27427",
      "27431",
      "27437",
      "27449",
      "27457",
      "27479",
      "27481",
      "27487",
      "27509",
      "27527",
      "27529",
      "27539",
      "27541",
      "27551",
      "27581",
      "27583",
      "27611",
      "27617",
      "27631",
      "27647",
      "27653",
      "27673",
      "27689",
      "27691",
      "27697",
      "27701",
      "27733",
      "27737",
      "27739",
      "27743",
      "27749",
      "27751",
      "27763",
      "27767",
      "27773",
      "27779",
      "27791",
      "27793",
      "27799",
      "27803",
      "27809",
      "27817",
      "27823",
      "27827",
      "27847",
      "27851",
      "27883",
      "27893",
      "27901",
      "27917",
      "27919",
      "27941",
      "27943",
      "27947",
      "27953",
      "27961",
      "27967",
      "27983",
      "27997",
      "28001",
      "28019",
      "28027",
      "28031",
      "28051",
      "28057",
      "28069",
      "28081",
      "28087",
      "28097",
      "28099",
      "28109",
      "28111",
      "28123",
      "28151",
      "28163",
      "28181",
      "28183",
      "28201",
      "28211",
      "28219",
      "28229",
      "28277",
      "28279",
      "28283",
      "28289",
      "28297",
      "28307",
      "28309",
      "28319",
      "28349",
      "28351",
      "28387",
      "28393",
      "28403",
      "28409",
      "28411",
      "28429",
      "28433",
      "28439",
      "28447",
      "28463",
      "28477",
      "28493",
      "28499",
      "28513",
      "28517",
      "28537",
      "28541",
      "28547",
      "28549",
      "28559",
      "28571",
      "28573",
      "28579",
      "28591",
      "28597",
      "28603",
      "28607",
      "28619",
      "28621",
      "28627",
      "28631",
      "28643",
      "28649",
      "28657",
      "28661",
      "28663",
      "28669",
      "28687",
      "28697",
      "28703",
      "28711",
      "28723",
      "28729",
      "28751",
      "28753",
      "28759",
      "28771",
      "28789",
      "28793",
      "28807",
      "28813",
      "28817",
      "28837",
      "28843",
      "28859",
      "28867",
      "28871",
      "28879",
      "28901",
      "28909",
      "28921",
      "28927",
      "28933",
      "28949",
      "28961",
      "28979",
      "29009",
      "29017",
      "29021",
      "29023",
      "29027",
      "29033",
      "29059",
      "29063",
      "29077",
      "29101",
      "29123",
      "29129",
      "29131",
      "29137",
      "29147",
      "29153",
      "29167",
      "29173",
      "29179",
      "29191",
      "29201",
      "29207",
      "29209",
      "29221",
      "29231",
      "29243",
      "29251",
      "29269",
      "29287",
      "29297",
      "29303",
      "29311",
      "29327",
      "29333",
      "29339",
      "29347",
      "29363",
      "29383",
      "29387",
      "29389",
      "29399",
      "29401",
      "29411",
      "29423",
      "29429",
      "29437",
      "29443",
      "29453",
      "29473",
      "29483",
      "29501",
      "29527",
      "29531",
      "29537",
      "29567",
      "29569",
      "29573",
      "29581",
      "29587",
      "29599",
      "29611",
      "29629",
      "29633",
      "29641",
      "29663",
      "29669",
      "29671",
      "29683",
      "29717",
      "29723",
      "29741",
      "29753",
      "29759",
      "29761",
      "29789",
      "29803",
      "29819",
      "29833",
      "29837",
      "29851",
      "29863",
      "29867",
      "29873",
      "29879",
      "29881",
      "29917",
      "29921",
      "29927",
      "29947",
      "29959",
      "29983",
      "29989",
      "30011",
      "30013",
      "30029",
      "30047",
      "30059",
      "30071",
      "30089",
      "30091",
      "30097",
      "30103",
      "30109",
      "30113",
      "30119",
      "30133",
      "30137",
      "30139",
      "30161",
      "30169",
      "30181",
      "30187",
      "30197",
      "30203",
      "30211",
      "30223",
      "30241",
      "30253",
      "30259",
      "30269",
      "30271",
      "30293",
      "30307",
      "30313",
      "30319",
      "30323",
      "30341",
      "30347",
      "30367",
      "30389",
      "30391",
      "30403",
      "30427",
      "30431",
      "30449",
      "30467",
      "30469",
      "30491",
      "30493",
      "30497",
      "30509",
      "30517",
      "30529",
      "30539",
      "30553",
      "30557",
      "30559",
      "30577",
      "30593",
      "30631",
      "30637",
      "30643",
      "30649",
      "30661",
      "30671",
      "30677",
      "30689",
      "30697",
      "30703",
      "30707",
      "30713",
      "30727",
      "30757",
      "30763",
      "30773",
      "30781",
      "30803",
      "30809",
      "30817",
      "30829",
      "30839",
      "30841",
      "30851",
      "30853",
      "30859",
      "30869",
      "30871",
      "30881",
      "30893",
      "30911",
      "30931",
      "30937",
      "30941",
      "30949",
      "30971",
      "30977",
      "30983",
      "31013",
      "31019",
      "31033",
      "31039",
      "31051",
      "31063",
      "31069",
      "31079",
      "31081",
      "31091",
      "31121",
      "31123",
      "31139",
      "31147",
      "31151",
      "31153",
      "31159",
      "31177",
      "31181",
      "31183",
      "31189",
      "31193",
      "31219",
      "31223",
      "31231",
      "31237",
      "31247",
      "31249",
      "31253",
      "31259",
      "31267",
      "31271",
      "31277",
      "31307",
      "31319",
      "31321",
      "31327",
      "31333",
      "31337",
      "31357",
      "31379",
      "31387",
      "31391",
      "31393",
      "31397",
      "31469",
      "31477",
      "31481",
      "31489",
      "31511",
      "31513",
      "31517",
      "31531",
      "31541",
      "31543",
      "31547",
      "31567",
      "31573",
      "31583",
      "31601",
      "31607",
      "31627",
      "31643",
      "31649",
      "31657",
      "31663",
      "31667",
      "31687",
      "31699",
      "31721",
      "31723",
      "31727",
      "31729",
      "31741",
      "31751",
      "31769",
      "31771",
      "31793",
      "31799",
      "31817",
      "31847",
      "31849",
      "31859",
      "31873",
      "31883",
      "31891",
      "31907",
      "31957",
      "31963",
      "31973",
      "31981",
      "31991",
      "32003",
      "32009",
      "32027",
      "32029",
      "32051",
      "32057",
      "32059",
      "32063",
      "32069",
      "32077",
      "32083",
      "32089",
      "32099",
      "32117",
      "32119",
      "32141",
      "32143",
      "32159",
      "32173",
      "32183",
      "32189",
      "32191",
      "32203",
      "32213",
      "32233",
      "32237",
      "32251",
      "32257",
      "32261",
      "32297",
      "32299",
      "32303",
      "32309",
      "32321",
      "32323",
      "32327",
      "32341",
      "32353",
      "32359",
      "32363",
      "32369",
      "32371",
      "32377",
      "32381",
      "32401",
      "32411",
      "32413",
      "32423",
      "32429",
      "32441",
      "32443",
      "32467",
      "32479",
      "32491",
      "32497",
      "32503",
      "32507",
      "32531",
      "32533",
      "32537",
      "32561",
      "32563",
      "32569",
      "32573",
      "32579",
      "32587",
      "32603",
      "32609",
      "32611",
      "32621",
      "32633",
      "32647",
      "32653",
      "32687",
      "32693",
      "32707",
      "32713",
      "32717",
      "32719",
      "32749",
      "32771",
      "32779",
      "32783",
      "32789",
      "32797",
      "32801",
      "32803",
      "32831",
      "32833",
      "32839",
      "32843",
      "32869",
      "32887",
      "32909",
      "32911",
      "32917",
      "32933",
      "32939",
      "32941",
      "32957",
      "32969",
      "32971",
      "32983",
      "32987",
      "32993",
      "32999",
      "33013",
      "33023",
      "33029",
      "33037",
      "33049",
      "33053",
      "33071",
      "33073",
      "33083",
      "33091",
      "33107",
      "33113",
      "33119",
      "33149",
      "33151",
      "33161",
      "33179",
      "33181",
      "33191",
      "33199",
      "33203",
      "33211",
      "33223",
      "33247",
      "33287",
      "33289",
      "33301",
      "33311",
      "33317",
      "33329",
      "33331",
      "33343",
      "33347",
      "33349",
      "33353",
      "33359",
      "33377",
      "33391",
      "33403",
      "33409",
      "33413",
      "33427",
      "33457",
      "33461",
      "33469",
      "33479",
      "33487",
      "33493",
      "33503",
      "33521",
      "33529",
      "33533",
      "33547",
      "33563",
      "33569",
      "33577",
      "33581",
      "33587",
      "33589",
      "33599",
      "33601",
      "33613",
      "33617",
      "33619",
      "33623",
      "33629",
      "33637",
      "33641",
      "33647",
      "33679",
      "33703",
      "33713",
      "33721",
      "33739",
      "33749",
      "33751",
      "33757",
      "33767",
      "33769",
      "33773",
      "33791",
      "33797",
      "33809",
      "33811",
      "33827",
      "33829",
      "33851",
      "33857",
      "33863",
      "33871",
      "33889",
      "33893",
      "33911",
      "33923",
      "33931",
      "33937",
      "33941",
      "33961",
      "33967",
      "33997",
      "34019",
      "34031",
      "34033",
      "34039",
      "34057",
      "34061",
      "34123",
      "34127",
      "34129",
      "34141",
      "34147",
      "34157",
      "34159",
      "34171",
      "34183",
      "34211",
      "34213",
      "34217",
      "34231",
      "34253",
      "34259",
      "34261",
      "34267",
      "34273",
      "34283",
      "34297",
      "34301",
      "34303",
      "34313",
      "34319",
      "34327",
      "34337",
      "34351",
      "34361",
      "34367",
      "34369",
      "34381",
      "34403",
      "34421",
      "34429",
      "34439",
      "34457",
      "34469",
      "34471",
      "34483",
      "34487",
      "34499",
      "34501",
      "34511",
      "34513",
      "34519",
      "34537",
      "34543",
      "34549",
      "34583",
      "34589",
      "34591",
      "34603",
      "34607",
      "34613",
      "34631",
      "34649",
      "34651",
      "34667",
      "34673",
      "34679",
      "34687",
      "34693",
      "34703",
      "34721",
      "34729",
      "34739",
      "34747",
      "34757",
      "34759",
      "34763",
      "34781",
      "34807",
      "34819",
      "34841",
      "34843",
      "34847",
      "34849",
      "34871",
      "34877",
      "34883",
      "34897",
      "34913",
      "34919",
      "34939",
      "34949",
      "34961",
      "34963",
      "34981",
      "35023",
      "35027",
      "35051",
      "35053",
      "35059",
      "35069",
      "35081",
      "35083",
      "35089",
      "35099",
      "35107",
      "35111",
      "35117",
      "35129",
      "35141",
      "35149",
      "35153",
      "35159",
      "35171",
      "35201",
      "35221",
      "35227",
      "35251",
      "35257",
      "35267",
      "35279",
      "35281",
      "35291",
      "35311",
      "35317",
      "35323",
      "35327",
      "35339",
      "35353",
      "35363",
      "35381",
      "35393",
      "35401",
      "35407",
      "35419",
      "35423",
      "35437",
      "35447",
      "35449",
      "35461",
      "35491",
      "35507",
      "35509",
      "35521",
      "35527",
      "35531",
      "35533",
      "35537",
      "35543",
      "35569",
      "35573",
      "35591",
      "35593",
      "35597",
      "35603",
      "35617",
      "35671",
      "35677",
      "35729",
      "35731",
      "35747",
      "35753",
      "35759",
      "35771",
      "35797",
      "35801",
      "35803",
      "35809",
      "35831",
      "35837",
      "35839",
      "35851",
      "35863",
      "35869",
      "35879",
      "35897",
      "35899",
      "35911",
      "35923",
      "35933",
      "35951",
      "35963",
      "35969",
      "35977",
      "35983",
      "35993",
      "35999",
      "36007",
      "36011",
      "36013",
      "36017",
      "36037",
      "36061",
      "36067",
      "36073",
      "36083",
      "36097",
      "36107",
      "36109",
      "36131",
      "36137",
      "36151",
      "36161",
      "36187",
      "36191",
      "36209",
      "36217",
      "36229",
      "36241",
      "36251",
      "36263",
      "36269",
      "36277",
      "36293",
      "36299",
      "36307",
      "36313",
      "36319",
      "36341",
      "36343",
      "36353",
      "36373",
      "36383",
      "36389",
      "36433",
      "36451",
      "36457",
      "36467",
      "36469",
      "36473",
      "36479",
      "36493",
      "36497",
      "36523",
      "36527",
      "36529",
      "36541",
      "36551",
      "36559",
      "36563",
      "36571",
      "36583",
      "36587",
      "36599",
      "36607",
      "36629",
      "36637",
      "36643",
      "36653",
      "36671",
      "36677",
      "36683",
      "36691",
      "36697",
      "36709",
      "36713",
      "36721",
      "36739",
      "36749",
      "36761",
      "36767",
      "36779",
      "36781",
      "36787",
      "36791",
      "36793",
      "36809",
      "36821",
      "36833",
      "36847",
      "36857",
      "36871",
      "36877",
      "36887",
      "36899",
      "36901",
      "36913",
      "36919",
      "36923",
      "36929",
      "36931",
      "36943",
      "36947",
      "36973",
      "36979",
      "36997",
      "37003",
      "37013",
      "37019",
      "37021",
      "37039",
      "37049",
      "37057",
      "37061",
      "37087",
      "37097",
      "37117",
      "37123",
      "37139",
      "37159",
      "37171",
      "37181",
      "37189",
      "37199",
      "37201",
      "37217",
      "37223",
      "37243",
      "37253",
      "37273",
      "37277",
      "37307",
      "37309",
      "37313",
      "37321",
      "37337",
      "37339",
      "37357",
      "37361",
      "37363",
      "37369",
      "37379",
      "37397",
      "37409",
      "37423",
      "37441",
      "37447",
      "37463",
      "37483",
      "37489",
      "37493",
      "37501",
      "37507",
      "37511",
      "37517",
      "37529",
      "37537",
      "37547",
      "37549",
      "37561",
      "37567",
      "37571",
      "37573",
      "37579",
      "37589",
      "37591",
      "37607",
      "37619",
      "37633",
      "37643",
      "37649",
      "37657",
      "37663",
      "37691",
      "37693",
      "37699",
      "37717",
      "37747",
      "37781",
      "37783",
      "37799",
      "37811",
      "37813",
      "37831",
      "37847",
      "37853",
      "37861",
      "37871",
      "37879",
      "37889",
      "37897",
      "37907",
      "37951",
      "37957",
      "37963",
      "37967",
      "37987",
      "37991",
      "37993",
      "37997",
      "38011",
      "38039",
      "38047",
      "38053",
      "38069",
      "38083",
      "38113",
      "38119",
      "38149",
      "38153",
      "38167",
      "38177",
      "38183",
      "38189",
      "38197",
      "38201",
      "38219",
      "38231",
      "38237",
      "38239",
      "38261",
      "38273",
      "38281",
      "38287",
      "38299",
      "38303",
      "38317",
      "38321",
      "38327",
      "38329",
      "38333",
      "38351",
      "38371",
      "38377",
      "38393",
      "38431",
      "38447",
      "38449",
      "38453",
      "38459",
      "38461",
      "38501",
      "38543",
      "38557",
      "38561",
      "38567",
      "38569",
      "38593",
      "38603",
      "38609",
      "38611",
      "38629",
      "38639",
      "38651",
      "38653",
      "38669",
      "38671",
      "38677",
      "38693",
      "38699",
      "38707",
      "38711",
      "38713",
      "38723",
      "38729",
      "38737",
      "38747",
      "38749",
      "38767",
      "38783",
      "38791",
      "38803",
      "38821",
      "38833",
      "38839",
      "38851",
      "38861",
      "38867",
      "38873",
      "38891",
      "38903",
      "38917",
      "38921",
      "38923",
      "38933",
      "38953",
      "38959",
      "38971",
      "38977",
      "38993",
      "39019",
      "39023",
      "39041",
      "39043",
      "39047",
      "39079",
      "39089",
      "39097",
      "39103",
      "39107",
      "39113",
      "39119",
      "39133",
      "39139",
      "39157",
      "39161",
      "39163",
      "39181",
      "39191",
      "39199",
      "39209",
      "39217",
      "39227",
      "39229",
      "39233",
      "39239",
      "39241",
      "39251",
      "39293",
      "39301",
      "39313",
      "39317",
      "39323",
      "39341",
      "39343",
      "39359",
      "39367",
      "39371",
      "39373",
      "39383",
      "39397",
      "39409",
      "39419",
      "39439",
      "39443",
      "39451",
      "39461",
      "39499",
      "39503",
      "39509",
      "39511",
      "39521",
      "39541",
      "39551",
      "39563",
      "39569",
      "39581",
      "39607",
      "39619",
      "39623",
      "39631",
      "39659",
      "39667",
      "39671",
      "39679",
      "39703",
      "39709",
      "39719",
      "39727",
      "39733",
      "39749",
      "39761",
      "39769",
      "39779",
      "39791",
      "39799",
      "39821",
      "39827",
      "39829",
      "39839",
      "39841",
      "39847",
      "39857",
      "39863",
      "39869",
      "39877",
      "39883",
      "39887",
      "39901",
      "39929",
      "39937",
      "39953",
      "39971",
      "39979",
      "39983",
      "39989",
      "40009",
      "40013",
      "40031",
      "40037",
      "40039",
      "40063",
      "40087",
      "40093",
      "40099",
      "40111",
      "40123",
      "40127",
      "40129",
      "40151",
      "40153",
      "40163",
      "40169",
      "40177",
      "40189",
      "40193",
      "40213",
      "40231",
      "40237",
      "40241",
      "40253",
      "40277",
      "40283",
      "40289",
      "40343",
      "40351",
      "40357",
      "40361",
      "40387",
      "40423",
      "40427",
      "40429",
      "40433",
      "40459",
      "40471",
      "40483",
      "40487",
      "40493",
      "40499",
      "40507",
      "40519",
      "40529",
      "40531",
      "40543",
      "40559",
      "40577",
      "40583",
      "40591",
      "40597",
      "40609",
      "40627",
      "40637",
      "40639",
      "40693",
      "40697",
      "40699",
      "40709",
      "40739",
      "40751",
      "40759",
      "40763",
      "40771",
      "40787",
      "40801",
      "40813",
      "40819",
      "40823",
      "40829",
      "40841",
      "40847",
      "40849",
      "40853",
      "40867",
      "40879",
      "40883",
      "40897",
      "40903",
      "40927",
      "40933",
      "40939",
      "40949",
      "40961",
      "40973",
      "40993",
      "41011",
      "41017",
      "41023",
      "41039",
      "41047",
      "41051",
      "41057",
      "41077",
      "41081",
      "41113",
      "41117",
      "41131",
      "41141",
      "41143",
      "41149",
      "41161",
      "41177",
      "41179",
      "41183",
      "41189",
      "41201",
      "41203",
      "41213",
      "41221",
      "41227",
      "41231",
      "41233",
      "41243",
      "41257",
      "41263",
      "41269",
      "41281",
      "41299",
      "41333",
      "41341",
      "41351",
      "41357",
      "41381",
      "41387",
      "41389",
      "41399",
      "41411",
      "41413",
      "41443",
      "41453",
      "41467",
      "41479",
      "41491",
      "41507",
      "41513",
      "41519",
      "41521",
      "41539",
      "41543",
      "41549",
      "41579",
      "41593",
      "41597",
      "41603",
      "41609",
      "41611",
      "41617",
      "41621",
      "41627",
      "41641",
      "41647",
      "41651",
      "41659",
      "41669",
      "41681",
      "41687",
      "41719",
      "41729",
      "41737",
      "41759",
      "41761",
      "41771",
      "41777",
      "41801",
      "41809",
      "41813",
      "41843",
      "41849",
      "41851",
      "41863",
      "41879",
      "41887",
      "41893",
      "41897",
      "41903",
      "41911",
      "41927",
      "41941",
      "41947",
      "41953",
      "41957",
      "41959",
      "41969",
      "41981",
      "41983",
      "41999",
      "42013",
      "42017",
      "42019",
      "42023",
      "42043",
      "42061",
      "42071",
      "42073",
      "42083",
      "42089",
      "42101",
      "42131",
      "42139",
      "42157",
      "42169",
      "42179",
      "42181",
      "42187",
      "42193",
      "42197",
      "42209",
      "42221",
      "42223",
      "42227",
      "42239",
      "42257",
      "42281",
      "42283",
      "42293",
      "42299",
      "42307",
      "42323",
      "42331",
      "42337",
      "42349",
      "42359",
      "42373",
      "42379",
      "42391",
      "42397",
      "42403",
      "42407",
      "42409",
      "42433",
      "42437",
      "42443",
      "42451",
      "42457",
      "42461",
      "42463",
      "42467",
      "42473",
      "42487",
      "42491",
      "42499",
      "42509",
      "42533",
      "42557",
      "42569",
      "42571",
      "42577",
      "42589",
      "42611",
      "42641",
      "42643",
      "42649",
      "42667",
      "42677",
      "42683",
      "42689",
      "42697",
      "42701",
      "42703",
      "42709",
      "42719",
      "42727",
      "42737",
      "42743",
      "42751",
      "42767",
      "42773",
      "42787",
      "42793",
      "42797",
      "42821",
      "42829",
      "42839",
      "42841",
      "42853",
      "42859",
      "42863",
      "42899",
      "42901",
      "42923",
      "42929",
      "42937",
      "42943",
      "42953",
      "42961",
      "42967",
      "42979",
      "42989",
      "43003",
      "43013",
      "43019",
      "43037",
      "43049",
      "43051",
      "43063",
      "43067",
      "43093",
      "43103",
      "43117",
      "43133",
      "43151",
      "43159",
      "43177",
      "43189",
      "43201",
      "43207",
      "43223",
      "43237",
      "43261",
      "43271",
      "43283",
      "43291",
      "43313",
      "43319",
      "43321",
      "43331",
      "43391",
      "43397",
      "43399",
      "43403",
      "43411",
      "43427",
      "43441",
      "43451",
      "43457",
      "43481",
      "43487",
      "43499",
      "43517",
      "43541",
      "43543",
      "43573",
      "43577",
      "43579",
      "43591",
      "43597",
      "43607",
      "43609",
      "43613",
      "43627",
      "43633",
      "43649",
      "43651",
      "43661",
      "43669",
      "43691",
      "43711",
      "43717",
      "43721",
      "43753",
      "43759",
      "43777",
      "43781",
      "43783",
      "43787",
      "43789",
      "43793",
      "43801",
      "43853",
      "43867",
      "43889",
      "43891",
      "43913",
      "43933",
      "43943",
      "43951",
      "43961",
      "43963",
      "43969",
      "43973",
      "43987",
      "43991",
      "43997",
      "44017",
      "44021",
      "44027",
      "44029",
      "44041",
      "44053",
      "44059",
      "44071",
      "44087",
      "44089",
      "44101",
      "44111",
      "44119",
      "44123",
      "44129",
      "44131",
      "44159",
      "44171",
      "44179",
      "44189",
      "44201",
      "44203",
      "44207",
      "44221",
      "44249",
      "44257",
      "44263",
      "44267",
      "44269",
      "44273",
      "44279",
      "44281",
      "44293",
      "44351",
      "44357",
      "44371",
      "44381",
      "44383",
      "44389",
      "44417",
      "44449",
      "44453",
      "44483",
      "44491",
      "44497",
      "44501",
      "44507",
      "44519",
      "44531",
      "44533",
      "44537",
      "44543",
      "44549",
      "44563",
      "44579",
      "44587",
      "44617",
      "44621",
      "44623",
      "44633",
      "44641",
      "44647",
      "44651",
      "44657",
      "44683",
      "44687",
      "44699",
      "44701",
      "44711",
      "44729",
      "44741",
      "44753",
      "44771",
      "44773",
      "44777",
      "44789",
      "44797",
      "44809",
      "44819",
      "44839",
      "44843",
      "44851",
      "44867",
      "44879",
      "44887",
      "44893",
      "44909",
      "44917",
      "44927",
      "44939",
      "44953",
      "44959",
      "44963",
      "44971",
      "44983",
      "44987",
      "45007",
      "45013",
      "45053",
      "45061",
      "45077",
      "45083",
      "45119",
      "45121",
      "45127",
      "45131",
      "45137",
      "45139",
      "45161",
      "45179",
      "45181",
      "45191",
      "45197",
      "45233",
      "45247",
      "45259",
      "45263",
      "45281",
      "45289",
      "45293",
      "45307",
      "45317",
      "45319",
      "45329",
      "45337",
      "45341",
      "45343",
      "45361",
      "45377",
      "45389",
      "45403",
      "45413",
      "45427",
      "45433",
      "45439",
      "45481",
      "45491",
      "45497",
      "45503",
      "45523",
      "45533",
      "45541",
      "45553",
      "45557",
      "45569",
      "45587",
      "45589",
      "45599",
      "45613",
      "45631",
      "45641",
      "45659",
      "45667",
      "45673",
      "45677",
      "45691",
      "45697",
      "45707",
      "45737",
      "45751",
      "45757",
      "45763",
      "45767",
      "45779",
      "45817",
      "45821",
      "45823",
      "45827",
      "45833",
      "45841",
      "45853",
      "45863",
      "45869",
      "45887",
      "45893",
      "45943",
      "45949",
      "45953",
      "45959",
      "45971",
      "45979",
      "45989",
      "46021",
      "46027",
      "46049",
      "46051",
      "46061",
      "46073",
      "46091",
      "46093",
      "46099",
      "46103",
      "46133",
      "46141",
      "46147",
      "46153",
      "46171",
      "46181",
      "46183",
      "46187",
      "46199",
      "46219",
      "46229",
      "46237",
      "46261",
      "46271",
      "46273",
      "46279",
      "46301",
      "46307",
      "46309",
      "46327",
      "46337",
      "46349",
      "46351",
      "46381",
      "46399",
      "46411",
      "46439",
      "46441",
      "46447",
      "46451",
      "46457",
      "46471",
      "46477",
      "46489",
      "46499",
      "46507",
      "46511",
      "46523",
      "46549",
      "46559",
      "46567",
      "46573",
      "46589",
      "46591",
      "46601",
      "46619",
      "46633",
      "46639",
      "46643",
      "46649",
      "46663",
      "46679",
      "46681",
      "46687",
      "46691",
      "46703",
      "46723",
      "46727",
      "46747",
      "46751",
      "46757",
      "46769",
      "46771",
      "46807",
      "46811",
      "46817",
      "46819",
      "46829",
      "46831",
      "46853",
      "46861",
      "46867",
      "46877",
      "46889",
      "46901",
      "46919",
      "46933",
      "46957",
      "46993",
      "46997",
      "47017",
      "47041",
      "47051",
      "47057",
      "47059",
      "47087",
      "47093",
      "47111",
      "47119",
      "47123",
      "47129",
      "47137",
      "47143",
      "47147",
      "47149",
      "47161",
      "47189",
      "47207",
      "47221",
      "47237",
      "47251",
      "47269",
      "47279",
      "47287",
      "47293",
      "47297",
      "47303",
      "47309",
      "47317",
      "47339",
      "47351",
      "47353",
      "47363",
      "47381",
      "47387",
      "47389",
      "47407",
      "47417",
      "47419",
      "47431",
      "47441",
      "47459",
      "47491",
      "47497",
      "47501",
      "47507",
      "47513",
      "47521",
      "47527",
      "47533",
      "47543",
      "47563",
      "47569",
      "47581",
      "47591",
      "47599",
      "47609",
      "47623",
      "47629",
      "47639",
      "47653",
      "47657",
      "47659",
      "47681",
      "47699",
      "47701",
      "47711",
      "47713",
      "47717",
      "47737",
      "47741",
      "47743",
      "47777",
      "47779",
      "47791",
      "47797",
      "47807",
      "47809",
      "47819",
      "47837",
      "47843",
      "47857",
      "47869",
      "47881",
      "47903",
      "47911",
      "47917",
      "47933",
      "47939",
      "47947",
      "47951",
      "47963",
      "47969",
      "47977",
      "47981",
      "48017",
      "48023",
      "48029",
      "48049",
      "48073",
      "48079",
      "48091",
      "48109",
      "48119",
      "48121",
      "48131",
      "48157",
      "48163",
      "48179",
      "48187",
      "48193",
      "48197",
      "48221",
      "48239",
      "48247",
      "48259",
      "48271",
      "48281",
      "48299",
      "48311",
      "48313",
      "48337",
      "48341",
      "48353",
      "48371",
      "48383",
      "48397",
      "48407",
      "48409",
      "48413",
      "48437",
      "48449",
      "48463",
      "48473",
      "48479",
      "48481",
      "48487",
      "48491",
      "48497",
      "48523",
      "48527",
      "48533",
      "48539",
      "48541",
      "48563",
      "48571",
      "48589",
      "48593",
      "48611",
      "48619",
      "48623",
      "48647",
      "48649",
      "48661",
      "48673",
      "48677",
      "48679",
      "48731",
      "48733",
      "48751",
      "48757",
      "48761",
      "48767",
      "48779",
      "48781",
      "48787",
      "48799",
      "48809",
      "48817",
      "48821",
      "48823",
      "48847",
      "48857",
      "48859",
      "48869",
      "48871",
      "48883",
      "48889",
      "48907",
      "48947",
      "48953",
      "48973",
      "48989",
      "48991",
      "49003",
      "49009",
      "49019",
      "49031",
      "49033",
      "49037",
      "49043",
      "49057",
      "49069",
      "49081",
      "49103",
      "49109",
      "49117",
      "49121",
      "49123",
      "49139",
      "49157",
      "49169",
      "49171",
      "49177",
      "49193",
      "49199",
      "49201",
      "49207",
      "49211",
      "49223",
      "49253",
      "49261",
      "49277",
      "49279",
      "49297",
      "49307",
      "49331",
      "49333",
      "49339",
      "49363",
      "49367",
      "49369",
      "49391",
      "49393",
      "49409",
      "49411",
      "49417",
      "49429",
      "49433",
      "49451",
      "49459",
      "49463",
      "49477",
      "49481",
      "49499",
      "49523",
      "49529",
      "49531",
      "49537",
      "49547",
      "49549",
      "49559",
      "49597",
      "49603",
      "49613",
      "49627",
      "49633",
      "49639",
      "49663",
      "49667",
      "49669",
      "49681",
      "49697",
      "49711",
      "49727",
      "49739",
      "49741",
      "49747",
      "49757",
      "49783",
      "49787",
      "49789",
      "49801",
      "49807",
      "49811",
      "49823",
      "49831",
      "49843",
      "49853",
      "49871",
      "49877",
      "49891",
      "49919",
      "49921",
      "49927",
      "49937",
      "49939",
      "49943",
      "49957",
      "49991",
      "49993",
      "49999",
      "50021",
      "50023",
      "50033",
      "50047",
      "50051",
      "50053",
      "50069",
      "50077",
      "50087",
      "50093",
      "50101",
      "50111",
      "50119",
      "50123",
      "50129",
      "50131",
      "50147",
      "50153",
      "50159",
      "50177",
      "50207",
      "50221",
      "50227",
      "50231",
      "50261",
      "50263",
      "50273",
      "50287",
      "50291",
      "50311",
      "50321",
      "50329",
      "50333",
      "50341",
      "50359",
      "50363",
      "50377",
      "50383",
      "50387",
      "50411",
      "50417",
      "50423",
      "50441",
      "50459",
      "50461",
      "50497",
      "50503",
      "50513",
      "50527",
      "50539",
      "50543",
      "50549",
      "50551",
      "50581",
      "50587",
      "50591",
      "50593",
      "50599",
      "50627",
      "50647",
      "50651",
      "50671",
      "50683",
      "50707",
      "50723",
      "50741",
      "50753",
      "50767",
      "50773",
      "50777",
      "50789",
      "50821",
      "50833",
      "50839",
      "50849",
      "50857",
      "50867",
      "50873",
      "50891",
      "50893",
      "50909",
      "50923",
      "50929",
      "50951",
      "50957",
      "50969",
      "50971",
      "50989",
      "50993",
      "51001",
      "51031",
      "51043",
      "51047",
      "51059",
      "51061",
      "51071",
      "51109",
      "51131",
      "51133",
      "51137",
      "51151",
      "51157",
      "51169",
      "51193",
      "51197",
      "51199",
      "51203",
      "51217",
      "51229",
      "51239",
      "51241",
      "51257",
      "51263",
      "51283",
      "51287",
      "51307",
      "51329",
      "51341",
      "51343",
      "51347",
      "51349",
      "51361",
      "51383",
      "51407",
      "51413",
      "51419",
      "51421",
      "51427",
      "51431",
      "51437",
      "51439",
      "51449",
      "51461",
      "51473",
      "51479",
      "51481",
      "51487",
      "51503",
      "51511",
      "51517",
      "51521",
      "51539",
      "51551",
      "51563",
      "51577",
      "51581",
      "51593",
      "51599",
      "51607",
      "51613",
      "51631",
      "51637",
      "51647",
      "51659",
      "51673",
      "51679",
      "51683",
      "51691",
      "51713",
      "51719",
      "51721",
      "51749",
      "51767",
      "51769",
      "51787",
      "51797",
      "51803",
      "51817",
      "51827",
      "51829",
      "51839",
      "51853",
      "51859",
      "51869",
      "51871",
      "51893",
      "51899",
      "51907",
      "51913",
      "51929",
      "51941",
      "51949",
      "51971",
      "51973",
      "51977",
      "51991",
      "52009",
      "52021",
      "52027",
      "52051",
      "52057",
      "52067",
      "52069",
      "52081",
      "52103",
      "52121",
      "52127",
      "52147",
      "52153",
      "52163",
      "52177",
      "52181",
      "52183",
      "52189",
      "52201",
      "52223",
      "52237",
      "52249",
      "52253",
      "52259",
      "52267",
      "52289",
      "52291",
      "52301",
      "52313",
      "52321",
      "52361",
      "52363",
      "52369",
      "52379",
      "52387",
      "52391",
      "52433",
      "52453",
      "52457",
      "52489",
      "52501",
      "52511",
      "52517",
      "52529",
      "52541",
      "52543",
      "52553",
      "52561",
      "52567",
      "52571",
      "52579",
      "52583",
      "52609",
      "52627",
      "52631",
      "52639",
      "52667",
      "52673",
      "52691",
      "52697",
      "52709",
      "52711",
      "52721",
      "52727",
      "52733",
      "52747",
      "52757",
      "52769",
      "52783",
      "52807",
      "52813",
      "52817",
      "52837",
      "52859",
      "52861",
      "52879",
      "52883",
      "52889",
      "52901",
      "52903",
      "52919",
      "52937",
      "52951",
      "52957",
      "52963",
      "52967",
      "52973",
      "52981",
      "52999",
      "53003",
      "53017",
      "53047",
      "53051",
      "53069",
      "53077",
      "53087",
      "53089",
      "53093",
      "53101",
      "53113",
      "53117",
      "53129",
      "53147",
      "53149",
      "53161",
      "53171",
      "53173",
      "53189",
      "53197",
      "53201",
      "53231",
      "53233",
      "53239",
      "53267",
      "53269",
      "53279",
      "53281",
      "53299",
      "53309",
      "53323",
      "53327",
      "53353",
      "53359",
      "53377",
      "53381",
      "53401",
      "53407",
      "53411",
      "53419",
      "53437",
      "53441",
      "53453",
      "53479",
      "53503",
      "53507",
      "53527",
      "53549",
      "53551",
      "53569",
      "53591",
      "53593",
      "53597",
      "53609",
      "53611",
      "53617",
      "53623",
      "53629",
      "53633",
      "53639",
      "53653",
      "53657",
      "53681",
      "53693",
      "53699",
      "53717",
      "53719",
      "53731",
      "53759",
      "53773",
      "53777",
      "53783",
      "53791",
      "53813",
      "53819",
      "53831",
      "53849",
      "53857",
      "53861",
      "53881",
      "53887",
      "53891",
      "53897",
      "53899",
      "53917",
      "53923",
      "53927",
      "53939",
      "53951",
      "53959",
      "53987",
      "53993",
      "54001",
      "54011",
      "54013",
      "54037",
      "54049",
      "54059",
      "54083",
      "54091",
      "54101",
      "54121",
      "54133",
      "54139",
      "54151",
      "54163",
      "54167",
      "54181",
      "54193",
      "54217",
      "54251",
      "54269",
      "54277",
      "54287",
      "54293",
      "54311",
      "54319",
      "54323",
      "54331",
      "54347",
      "54361",
      "54367",
      "54371",
      "54377",
      "54401",
      "54403",
      "54409",
      "54413",
      "54419",
      "54421",
      "54437",
      "54443",
      "54449",
      "54469",
      "54493",
      "54497",
      "54499",
      "54503",
      "54517",
      "54521",
      "54539",
      "54541",
      "54547",
      "54559",
      "54563",
      "54577",
      "54581",
      "54583",
      "54601",
      "54617",
      "54623",
      "54629",
      "54631",
      "54647",
      "54667",
      "54673",
      "54679",
      "54709",
      "54713",
      "54721",
      "54727",
      "54751",
      "54767",
      "54773",
      "54779",
      "54787",
      "54799",
      "54829",
      "54833",
      "54851",
      "54869",
      "54877",
      "54881",
      "54907",
      "54917",
      "54919",
      "54941",
      "54949",
      "54959",
      "54973",
      "54979",
      "54983",
      "55001",
      "55009",
      "55021",
      "55049",
      "55051",
      "55057",
      "55061",
      "55073",
      "55079",
      "55103",
      "55109",
      "55117",
      "55127",
      "55147",
      "55163",
      "55171",
      "55201",
      "55207",
      "55213",
      "55217",
      "55219",
      "55229",
      "55243",
      "55249",
      "55259",
      "55291",
      "55313",
      "55331",
      "55333",
      "55337",
      "55339",
      "55343",
      "55351",
      "55373",
      "55381",
      "55399",
      "55411",
      "55439",
      "55441",
      "55457",
      "55469",
      "55487",
      "55501",
      "55511",
      "55529",
      "55541",
      "55547",
      "55579",
      "55589",
      "55603",
      "55609",
      "55619",
      "55621",
      "55631",
      "55633",
      "55639",
      "55661",
      "55663",
      "55667",
      "55673",
      "55681",
      "55691",
      "55697",
      "55711",
      "55717",
      "55721",
      "55733",
      "55763",
      "55787",
      "55793",
      "55799",
      "55807",
      "55813",
      "55817",
      "55819",
      "55823",
      "55829",
      "55837",
      "55843",
      "55849",
      "55871",
      "55889",
      "55897",
      "55901",
      "55903",
      "55921",
      "55927",
      "55931",
      "55933",
      "55949",
      "55967",
      "55987",
      "55997",
      "56003",
      "56009",
      "56039",
      "56041",
      "56053",
      "56081",
      "56087",
      "56093",
      "56099",
      "56101",
      "56113",
      "56123",
      "56131",
      "56149",
      "56167",
      "56171",
      "56179",
      "56197",
      "56207",
      "56209",
      "56237",
      "56239",
      "56249",
      "56263",
      "56267",
      "56269",
      "56299",
      "56311",
      "56333",
      "56359",
      "56369",
      "56377",
      "56383",
      "56393",
      "56401",
      "56417",
      "56431",
      "56437",
      "56443",
      "56453",
      "56467",
      "56473",
      "56477",
      "56479",
      "56489",
      "56501",
      "56503",
      "56509",
      "56519",
      "56527",
      "56531",
      "56533",
      "56543",
      "56569",
      "56591",
      "56597",
      "56599",
      "56611",
      "56629",
      "56633",
      "56659",
      "56663",
      "56671",
      "56681",
      "56687",
      "56701",
      "56711",
      "56713",
      "56731",
      "56737",
      "56747",
      "56767",
      "56773",
      "56779",
      "56783",
      "56807",
      "56809",
      "56813",
      "56821",
      "56827",
      "56843",
      "56857",
      "56873",
      "56891",
      "56893",
      "56897",
      "56909",
      "56911",
      "56921",
      "56923",
      "56929",
      "56941",
      "56951",
      "56957",
      "56963",
      "56983",
      "56989",
      "56993",
      "56999",
      "57037",
      "57041",
      "57047",
      "57059",
      "57073",
      "57077",
      "57089",
      "57097",
      "57107",
      "57119",
      "57131",
      "57139",
      "57143",
      "57149",
      "57163",
      "57173",
      "57179",
      "57191",
      "57193",
      "57203",
      "57221",
      "57223",
      "57241",
      "57251",
      "57259",
      "57269",
      "57271",
      "57283",
      "57287",
      "57301",
      "57329",
      "57331",
      "57347",
      "57349",
      "57367",
      "57373",
      "57383",
      "57389",
      "57397",
      "57413",
      "57427",
      "57457",
      "57467",
      "57487",
      "57493",
      "57503",
      "57527",
      "57529",
      "57557",
      "57559",
      "57571",
      "57587",
      "57593",
      "57601",
      "57637",
      "57641",
      "57649",
      "57653",
      "57667",
      "57679",
      "57689",
      "57697",
      "57709",
      "57713",
      "57719",
      "57727",
      "57731",
      "57737",
      "57751",
      "57773",
      "57781",
      "57787",
      "57791",
      "57793",
      "57803",
      "57809",
      "57829",
      "57839",
      "57847",
      "57853",
      "57859",
      "57881",
      "57899",
      "57901",
      "57917",
      "57923",
      "57943",
      "57947",
      "57973",
      "57977",
      "57991",
      "58013",
      "58027",
      "58031",
      "58043",
      "58049",
      "58057",
      "58061",
      "58067",
      "58073",
      "58099",
      "58109",
      "58111",
      "58129",
      "58147",
      "58151",
      "58153",
      "58169",
      "58171",
      "58189",
      "58193",
      "58199",
      "58207",
      "58211",
      "58217",
      "58229",
      "58231",
      "58237",
      "58243",
      "58271",
      "58309",
      "58313",
      "58321",
      "58337",
      "58363",
      "58367",
      "58369",
      "58379",
      "58391",
      "58393",
      "58403",
      "58411",
      "58417",
      "58427",
      "58439",
      "58441",
      "58451",
      "58453",
      "58477",
      "58481",
      "58511",
      "58537",
      "58543",
      "58549",
      "58567",
      "58573",
      "58579",
      "58601",
      "58603",
      "58613",
      "58631",
      "58657",
      "58661",
      "58679",
      "58687",
      "58693",
      "58699",
      "58711",
      "58727",
      "58733",
      "58741",
      "58757",
      "58763",
      "58771",
      "58787",
      "58789",
      "58831",
      "58889",
      "58897",
      "58901",
      "58907",
      "58909",
      "58913",
      "58921",
      "58937",
      "58943",
      "58963",
      "58967",
      "58979",
      "58991",
      "58997",
      "59009",
      "59011",
      "59021",
      "59023",
      "59029",
      "59051",
      "59053",
      "59063",
      "59069",
      "59077",
      "59083",
      "59093",
      "59107",
      "59113",
      "59119",
      "59123",
      "59141",
      "59149",
      "59159",
      "59167",
      "59183",
      "59197",
      "59207",
      "59209",
      "59219",
      "59221",
      "59233",
      "59239",
      "59243",
      "59263",
      "59273",
      "59281",
      "59333",
      "59341",
      "59351",
      "59357",
      "59359",
      "59369",
      "59377",
      "59387",
      "59393",
      "59399",
      "59407",
      "59417",
      "59419",
      "59441",
      "59443",
      "59447",
      "59453",
      "59467",
      "59471",
      "59473",
      "59497",
      "59509",
      "59513",
      "59539",
      "59557",
      "59561",
      "59567",
      "59581",
      "59611",
      "59617",
      "59621",
      "59627",
      "59629",
      "59651",
      "59659",
      "59663",
      "59669",
      "59671",
      "59693",
      "59699",
      "59707",
      "59723",
      "59729",
      "59743",
      "59747",
      "59753",
      "59771",
      "59779",
      "59791",
      "59797",
      "59809",
      "59833",
      "59863",
      "59879",
      "59887",
      "59921",
      "59929",
      "59951",
      "59957",
      "59971",
      "59981",
      "59999",
      "60013",
      "60017",
      "60029",
      "60037",
      "60041",
      "60077",
      "60083",
      "60089",
      "60091",
      "60101",
      "60103",
      "60107",
      "60127",
      "60133",
      "60139",
      "60149",
      "60161",
      "60167",
      "60169",
      "60209",
      "60217",
      "60223",
      "60251",
      "60257",
      "60259",
      "60271",
      "60289",
      "60293",
      "60317",
      "60331",
      "60337",
      "60343",
      "60353",
      "60373",
      "60383",
      "60397",
      "60413",
      "60427",
      "60443",
      "60449",
      "60457",
      "60493",
      "60497",
      "60509",
      "60521",
      "60527",
      "60539",
      "60589",
      "60601",
      "60607",
      "60611",
      "60617",
      "60623",
      "60631",
      "60637",
      "60647",
      "60649",
      "60659",
      "60661",
      "60679",
      "60689",
      "60703",
      "60719",
      "60727",
      "60733",
      "60737",
      "60757",
      "60761",
      "60763",
      "60773",
      "60779",
      "60793",
      "60811",
      "60821",
      "60859",
      "60869",
      "60887",
      "60889",
      "60899",
      "60901",
      "60913",
      "60917",
      "60919",
      "60923",
      "60937",
      "60943",
      "60953",
      "60961",
      "61001",
      "61007",
      "61027",
      "61031",
      "61043",
      "61051",
      "61057",
      "61091",
      "61099",
      "61121",
      "61129",
      "61141",
      "61151",
      "61153",
      "61169",
      "61211",
      "61223",
      "61231",
      "61253",
      "61261",
      "61283",
      "61291",
      "61297",
      "61331",
      "61333",
      "61339",
      "61343",
      "61357",
      "61363",
      "61379",
      "61381",
      "61403",
      "61409",
      "61417",
      "61441",
      "61463",
      "61469",
      "61471",
      "61483",
      "61487",
      "61493",
      "61507",
      "61511",
      "61519",
      "61543",
      "61547",
      "61553",
      "61559",
      "61561",
      "61583",
      "61603",
      "61609",
      "61613",
      "61627",
      "61631",
      "61637",
      "61643",
      "61651",
      "61657",
      "61667",
      "61673",
      "61681",
      "61687",
      "61703",
      "61717",
      "61723",
      "61729",
      "61751",
      "61757",
      "61781",
      "61813",
      "61819",
      "61837",
      "61843",
      "61861",
      "61871",
      "61879",
      "61909",
      "61927",
      "61933",
      "61949",
      "61961",
      "61967",
      "61979",
      "61981",
      "61987",
      "61991",
      "62003",
      "62011",
      "62017",
      "62039",
      "62047",
      "62053",
      "62057",
      "62071",
      "62081",
      "62099",
      "62119",
      "62129",
      "62131",
      "62137",
      "62141",
      "62143",
      "62171",
      "62189",
      "62191",
      "62201",
      "62207",
      "62213",
      "62219",
      "62233",
      "62273",
      "62297",
      "62299",
      "62303",
      "62311",
      "62323",
      "62327",
      "62347",
      "62351",
      "62383",
      "62401",
      "62417",
      "62423",
      "62459",
      "62467",
      "62473",
      "62477",
      "62483",
      "62497",
      "62501",
      "62507",
      "62533",
      "62539",
      "62549",
      "62563",
      "62581",
      "62591",
      "62597",
      "62603",
      "62617",
      "62627",
      "62633",
      "62639",
      "62653",
      "62659",
      "62683",
      "62687",
      "62701",
      "62723",
      "62731",
      "62743",
      "62753",
      "62761",
      "62773",
      "62791",
      "62801",
      "62819",
      "62827",
      "62851",
      "62861",
      "62869",
      "62873",
      "62897",
      "62903",
      "62921",
      "62927",
      "62929",
      "62939",
      "62969",
      "62971",
      "62981",
      "62983",
      "62987",
      "62989",
      "63029",
      "63031",
      "63059",
      "63067",
      "63073",
      "63079",
      "63097",
      "63103",
      "63113",
      "63127",
      "63131",
      "63149",
      "63179",
      "63197",
      "63199",
      "63211",
      "63241",
      "63247",
      "63277",
      "63281",
      "63299",
      "63311",
      "63313",
      "63317",
      "63331",
      "63337",
      "63347",
      "63353",
      "63361",
      "63367",
      "63377",
      "63389",
      "63391",
      "63397",
      "63409",
      "63419",
      "63421",
      "63439",
      "63443",
      "63463",
      "63467",
      "63473",
      "63487",
      "63493",
      "63499",
      "63521",
      "63527",
      "63533",
      "63541",
      "63559",
      "63577",
      "63587",
      "63589",
      "63599",
      "63601",
      "63607",
      "63611",
      "63617",
      "63629",
      "63647",
      "63649",
      "63659",
      "63667",
      "63671",
      "63689",
      "63691",
      "63697",
      "63703",
      "63709",
      "63719",
      "63727",
      "63737",
      "63743",
      "63761",
      "63773",
      "63781",
      "63793",
      "63799",
      "63803",
      "63809",
      "63823",
      "63839",
      "63841",
      "63853",
      "63857",
      "63863",
      "63901",
      "63907",
      "63913",
      "63929",
      "63949",
      "63977",
      "63997",
      "64007",
      "64013",
      "64019",
      "64033",
      "64037",
      "64063",
      "64067",
      "64081",
      "64091",
      "64109",
      "64123",
      "64151",
      "64153",
      "64157",
      "64171",
      "64187",
      "64189",
      "64217",
      "64223",
      "64231",
      "64237",
      "64271",
      "64279",
      "64283",
      "64301",
      "64303",
      "64319",
      "64327",
      "64333",
      "64373",
      "64381",
      "64399",
      "64403",
      "64433",
      "64439",
      "64451",
      "64453",
      "64483",
      "64489",
      "64499",
      "64513",
      "64553",
      "64567",
      "64577",
      "64579",
      "64591",
      "64601",
      "64609",
      "64613",
      "64621",
      "64627",
      "64633",
      "64661",
      "64663",
      "64667",
      "64679",
      "64693",
      "64709",
      "64717",
      "64747",
      "64763",
      "64781",
      "64783",
      "64793",
      "64811",
      "64817",
      "64849",
      "64853",
      "64871",
      "64877",
      "64879",
      "64891",
      "64901",
      "64919",
      "64921",
      "64927",
      "64937",
      "64951",
      "64969",
      "64997",
      "65003",
      "65011",
      "65027",
      "65029",
      "65033",
      "65053",
      "65063",
      "65071",
      "65089",
      "65099",
      "65101",
      "65111",
      "65119",
      "65123",
      "65129",
      "65141",
      "65147",
      "65167",
      "65171",
      "65173",
      "65179",
      "65183",
      "65203",
      "65213",
      "65239",
      "65257",
      "65267",
      "65269",
      "65287",
      "65293",
      "65309",
      "65323",
      "65327",
      "65353",
      "65357",
      "65371",
      "65381",
      "65393",
      "65407",
      "65413",
      "65419",
      "65423",
      "65437",
      "65447",
      "65449",
      "65479",
      "65497",
      "65519",
      "65521",
      "65537",
      "65539",
      "65543",
      "65551",
      "65557",
      "65563",
      "65579",
      "65581",
      "65587",
      "65599",
      "65609",
      "65617",
      "65629",
      "65633",
      "65647",
      "65651",
      "65657",
      "65677",
      "65687",
      "65699",
      "65701",
      "65707",
      "65713",
      "65717",
      "65719",
      "65729",
      "65731",
      "65761",
      "65777",
      "65789",
      "65809",
      "65827",
      "65831",
      "65837",
      "65839",
      "65843",
      "65851",
      "65867",
      "65881",
      "65899",
      "65921",
      "65927",
      "65929",
      "65951",
      "65957",
      "65963",
      "65981",
      "65983",
      "65993",
      "66029",
      "66037",
      "66041",
      "66047",
      "66067",
      "66071",
      "66083",
      "66089",
      "66103",
      "66107",
      "66109",
      "66137",
      "66161",
      "66169",
      "66173",
      "66179",
      "66191",
      "66221",
      "66239",
      "66271",
      "66293",
      "66301",
      "66337",
      "66343",
      "66347",
      "66359",
      "66361",
      "66373",
      "66377",
      "66383",
      "66403",
      "66413",
      "66431",
      "66449",
      "66457",
      "66463",
      "66467",
      "66491",
      "66499",
      "66509",
      "66523",
      "66529",
      "66533",
      "66541",
      "66553",
      "66569",
      "66571",
      "66587",
      "66593",
      "66601",
      "66617",
      "66629",
      "66643",
      "66653",
      "66683",
      "66697",
      "66701",
      "66713",
      "66721",
      "66733",
      "66739",
      "66749",
      "66751",
      "66763",
      "66791",
      "66797",
      "66809",
      "66821",
      "66841",
      "66851",
      "66853",
      "66863",
      "66877",
      "66883",
      "66889",
      "66919",
      "66923",
      "66931",
      "66943",
      "66947",
      "66949",
      "66959",
      "66973",
      "66977",
      "67003",
      "67021",
      "67033",
      "67043",
      "67049",
      "67057",
      "67061",
      "67073",
      "67079",
      "67103",
      "67121",
      "67129",
      "67139",
      "67141",
      "67153",
      "67157",
      "67169",
      "67181",
      "67187",
      "67189",
      "67211",
      "67213",
      "67217",
      "67219",
      "67231",
      "67247",
      "67261",
      "67271",
      "67273",
      "67289",
      "67307",
      "67339",
      "67343",
      "67349",
      "67369",
      "67391",
      "67399",
      "67409",
      "67411",
      "67421",
      "67427",
      "67429",
      "67433",
      "67447",
      "67453",
      "67477",
      "67481",
      "67489",
      "67493",
      "67499",
      "67511",
      "67523",
      "67531",
      "67537",
      "67547",
      "67559",
      "67567",
      "67577",
      "67579",
      "67589",
      "67601",
      "67607",
      "67619",
      "67631",
      "67651",
      "67679",
      "67699",
      "67709",
      "67723",
      "67733",
      "67741",
      "67751",
      "67757",
      "67759",
      "67763",
      "67777",
      "67783",
      "67789",
      "67801",
      "67807",
      "67819",
      "67829",
      "67843",
      "67853",
      "67867",
      "67883",
      "67891",
      "67901",
      "67927",
      "67931",
      "67933",
      "67939",
      "67943",
      "67957",
      "67961",
      "67967",
      "67979",
      "67987",
      "67993",
      "68023",
      "68041",
      "68053",
      "68059",
      "68071",
      "68087",
      "68099",
      "68111",
      "68113",
      "68141",
      "68147",
      "68161",
      "68171",
      "68207",
      "68209",
      "68213",
      "68219",
      "68227",
      "68239",
      "68261",
      "68279",
      "68281",
      "68311",
      "68329",
      "68351",
      "68371",
      "68389",
      "68399",
      "68437",
      "68443",
      "68447",
      "68449",
      "68473",
      "68477",
      "68483",
      "68489",
      "68491",
      "68501",
      "68507",
      "68521",
      "68531",
      "68539",
      "68543",
      "68567",
      "68581",
      "68597",
      "68611",
      "68633",
      "68639",
      "68659",
      "68669",
      "68683",
      "68687",
      "68699",
      "68711",
      "68713",
      "68729",
      "68737",
      "68743",
      "68749",
      "68767",
      "68771",
      "68777",
      "68791",
      "68813",
      "68819",
      "68821",
      "68863",
      "68879",
      "68881",
      "68891",
      "68897",
      "68899",
      "68903",
      "68909",
      "68917",
      "68927",
      "68947",
      "68963",
      "68993",
      "69001",
      "69011",
      "69019",
      "69029",
      "69031",
      "69061",
      "69067",
      "69073",
      "69109",
      "69119",
      "69127",
      "69143",
      "69149",
      "69151",
      "69163",
      "69191",
      "69193",
      "69197",
      "69203",
      "69221",
      "69233",
      "69239",
      "69247",
      "69257",
      "69259",
      "69263",
      "69313",
      "69317",
      "69337",
      "69341",
      "69371",
      "69379",
      "69383",
      "69389",
      "69401",
      "69403",
      "69427",
      "69431",
      "69439",
      "69457",
      "69463",
      "69467",
      "69473",
      "69481",
      "69491",
      "69493",
      "69497",
      "69499",
      "69539",
      "69557",
      "69593",
      "69623",
      "69653",
      "69661",
      "69677",
      "69691",
      "69697",
      "69709",
      "69737",
      "69739",
      "69761",
      "69763",
      "69767",
      "69779",
      "69809",
      "69821",
      "69827",
      "69829",
      "69833",
      "69847",
      "69857",
      "69859",
      "69877",
      "69899",
      "69911",
      "69929",
      "69931",
      "69941",
      "69959",
      "69991",
      "69997",
      "70001",
      "70003",
      "70009",
      "70019",
      "70039",
      "70051",
      "70061",
      "70067",
      "70079",
      "70099",
      "70111",
      "70117",
      "70121",
      "70123",
      "70139",
      "70141",
      "70157",
      "70163",
      "70177",
      "70181",
      "70183",
      "70199",
      "70201",
      "70207",
      "70223",
      "70229",
      "70237",
      "70241",
      "70249",
      "70271",
      "70289",
      "70297",
      "70309",
      "70313",
      "70321",
      "70327",
      "70351",
      "70373",
      "70379",
      "70381",
      "70393",
      "70423",
      "70429",
      "70439",
      "70451",
      "70457",
      "70459",
      "70481",
      "70487",
      "70489",
      "70501",
      "70507",
      "70529",
      "70537",
      "70549",
      "70571",
      "70573",
      "70583",
      "70589",
      "70607",
      "70619",
      "70621",
      "70627",
      "70639",
      "70657",
      "70663",
      "70667",
      "70687",
      "70709",
      "70717",
      "70729",
      "70753",
      "70769",
      "70783",
      "70793",
      "70823",
      "70841",
      "70843",
      "70849",
      "70853",
      "70867",
      "70877",
      "70879",
      "70891",
      "70901",
      "70913",
      "70919",
      "70921",
      "70937",
      "70949",
      "70951",
      "70957",
      "70969",
      "70979",
      "70981",
      "70991",
      "70997",
      "70999",
      "71011",
      "71023",
      "71039",
      "71059",
      "71069",
      "71081",
      "71089",
      "71119",
      "71129",
      "71143",
      "71147",
      "71153",
      "71161",
      "71167",
      "71171",
      "71191",
      "71209",
      "71233",
      "71237",
      "71249",
      "71257",
      "71261",
      "71263",
      "71287",
      "71293",
      "71317",
      "71327",
      "71329",
      "71333",
      "71339",
      "71341",
      "71347",
      "71353",
      "71359",
      "71363",
      "71387",
      "71389",
      "71399",
      "71411",
      "71413",
      "71419",
      "71429",
      "71437",
      "71443",
      "71453",
      "71471",
      "71473",
      "71479",
      "71483",
      "71503",
      "71527",
      "71537",
      "71549",
      "71551",
      "71563",
      "71569",
      "71593",
      "71597",
      "71633",
      "71647",
      "71663",
      "71671",
      "71693",
      "71699",
      "71707",
      "71711",
      "71713",
      "71719",
      "71741",
      "71761",
      "71777",
      "71789",
      "71807",
      "71809",
      "71821",
      "71837",
      "71843",
      "71849",
      "71861",
      "71867",
      "71879",
      "71881",
      "71887",
      "71899",
      "71909",
      "71917",
      "71933",
      "71941",
      "71947",
      "71963",
      "71971",
      "71983",
      "71987",
      "71993",
      "71999",
      "72019",
      "72031",
      "72043",
      "72047",
      "72053",
      "72073",
      "72077",
      "72089",
      "72091",
      "72101",
      "72103",
      "72109",
      "72139",
      "72161",
      "72167",
      "72169",
      "72173",
      "72211",
      "72221",
      "72223",
      "72227",
      "72229",
      "72251",
      "72253",
      "72269",
      "72271",
      "72277",
      "72287",
      "72307",
      "72313",
      "72337",
      "72341",
      "72353",
      "72367",
      "72379",
      "72383",
      "72421",
      "72431",
      "72461",
      "72467",
      "72469",
      "72481",
      "72493",
      "72497",
      "72503",
      "72533",
      "72547",
      "72551",
      "72559",
      "72577",
      "72613",
      "72617",
      "72623",
      "72643",
      "72647",
      "72649",
      "72661",
      "72671",
      "72673",
      "72679",
      "72689",
      "72701",
      "72707",
      "72719",
      "72727",
      "72733",
      "72739",
      "72763",
      "72767",
      "72797",
      "72817",
      "72823",
      "72859",
      "72869",
      "72871",
      "72883",
      "72889",
      "72893",
      "72901",
      "72907",
      "72911",
      "72923",
      "72931",
      "72937",
      "72949",
      "72953",
      "72959",
      "72973",
      "72977",
      "72997",
      "73009",
      "73013",
      "73019",
      "73037",
      "73039",
      "73043",
      "73061",
      "73063",
      "73079",
      "73091",
      "73121",
      "73127",
      "73133",
      "73141",
      "73181",
      "73189",
      "73237",
      "73243",
      "73259",
      "73277",
      "73291",
      "73303",
      "73309",
      "73327",
      "73331",
      "73351",
      "73361",
      "73363",
      "73369",
      "73379",
      "73387",
      "73417",
      "73421",
      "73433",
      "73453",
      "73459",
      "73471",
      "73477",
      "73483",
      "73517",
      "73523",
      "73529",
      "73547",
      "73553",
      "73561",
      "73571",
      "73583",
      "73589",
      "73597",
      "73607",
      "73609",
      "73613",
      "73637",
      "73643",
      "73651",
      "73673",
      "73679",
      "73681",
      "73693",
      "73699",
      "73709",
      "73721",
      "73727",
      "73751",
      "73757",
      "73771",
      "73783",
      "73819",
      "73823",
      "73847",
      "73849",
      "73859",
      "73867",
      "73877",
      "73883",
      "73897",
      "73907",
      "73939",
      "73943",
      "73951",
      "73961",
      "73973",
      "73999",
      "74017",
      "74021",
      "74027",
      "74047",
      "74051",
      "74071",
      "74077",
      "74093",
      "74099",
      "74101",
      "74131",
      "74143",
      "74149",
      "74159",
      "74161",
      "74167",
      "74177",
      "74189",
      "74197",
      "74201",
      "74203",
      "74209",
      "74219",
      "74231",
      "74257",
      "74279",
      "74287",
      "74293",
      "74297",
      "74311",
      "74317",
      "74323",
      "74353",
      "74357",
      "74363",
      "74377",
      "74381",
      "74383",
      "74411",
      "74413",
      "74419",
      "74441",
      "74449",
      "74453",
      "74471",
      "74489",
      "74507",
      "74509",
      "74521",
      "74527",
      "74531",
      "74551",
      "74561",
      "74567",
      "74573",
      "74587",
      "74597",
      "74609",
      "74611",
      "74623",
      "74653",
      "74687",
      "74699",
      "74707",
      "74713",
      "74717",
      "74719",
      "74729",
      "74731",
      "74747",
      "74759",
      "74761",
      "74771",
      "74779",
      "74797",
      "74821",
      "74827",
      "74831",
      "74843",
      "74857",
      "74861",
      "74869",
      "74873",
      "74887",
      "74891",
      "74897",
      "74903",
      "74923",
      "74929",
      "74933",
      "74941",
      "74959",
      "75011",
      "75013",
      "75017",
      "75029",
      "75037",
      "75041",
      "75079",
      "75083",
      "75109",
      "75133",
      "75149",
      "75161",
      "75167",
      "75169",
      "75181",
      "75193",
      "75209",
      "75211",
      "75217",
      "75223",
      "75227",
      "75239",
      "75253",
      "75269",
      "75277",
      "75289",
      "75307",
      "75323",
      "75329",
      "75337",
      "75347",
      "75353",
      "75367",
      "75377",
      "75389",
      "75391",
      "75401",
      "75403",
      "75407",
      "75431",
      "75437",
      "75479",
      "75503",
      "75511",
      "75521",
      "75527",
      "75533",
      "75539",
      "75541",
      "75553",
      "75557",
      "75571",
      "75577",
      "75583",
      "75611",
      "75617",
      "75619",
      "75629",
      "75641",
      "75653",
      "75659",
      "75679",
      "75683",
      "75689",
      "75703",
      "75707",
      "75709",
      "75721",
      "75731",
      "75743",
      "75767",
      "75773",
      "75781",
      "75787",
      "75793",
      "75797",
      "75821",
      "75833",
      "75853",
      "75869",
      "75883",
      "75913",
      "75931",
      "75937",
      "75941",
      "75967",
      "75979",
      "75983",
      "75989",
      "75991",
      "75997",
      "76001",
      "76003",
      "76031",
      "76039",
      "76079",
      "76081",
      "76091",
      "76099",
      "76103",
      "76123",
      "76129",
      "76147",
      "76157",
      "76159",
      "76163",
      "76207",
      "76213",
      "76231",
      "76243",
      "76249",
      "76253",
      "76259",
      "76261",
      "76283",
      "76289",
      "76303",
      "76333",
      "76343",
      "76367",
      "76369",
      "76379",
      "76387",
      "76403",
      "76421",
      "76423",
      "76441",
      "76463",
      "76471",
      "76481",
      "76487",
      "76493",
      "76507",
      "76511",
      "76519",
      "76537",
      "76541",
      "76543",
      "76561",
      "76579",
      "76597",
      "76603",
      "76607",
      "76631",
      "76649",
      "76651",
      "76667",
      "76673",
      "76679",
      "76697",
      "76717",
      "76733",
      "76753",
      "76757",
      "76771",
      "76777",
      "76781",
      "76801",
      "76819",
      "76829",
      "76831",
      "76837",
      "76847",
      "76871",
      "76873",
      "76883",
      "76907",
      "76913",
      "76919",
      "76943",
      "76949",
      "76961",
      "76963",
      "76991",
      "77003",
      "77017",
      "77023",
      "77029",
      "77041",
      "77047",
      "77069",
      "77081",
      "77093",
      "77101",
      "77137",
      "77141",
      "77153",
      "77167",
      "77171",
      "77191",
      "77201",
      "77213",
      "77237",
      "77239",
      "77243",
      "77249",
      "77261",
      "77263",
      "77267",
      "77269",
      "77279",
      "77291",
      "77317",
      "77323",
      "77339",
      "77347",
      "77351",
      "77359",
      "77369",
      "77377",
      "77383",
      "77417",
      "77419",
      "77431",
      "77447",
      "77471",
      "77477",
      "77479",
      "77489",
      "77491",
      "77509",
      "77513",
      "77521",
      "77527",
      "77543",
      "77549",
      "77551",
      "77557",
      "77563",
      "77569",
      "77573",
      "77587",
      "77591",
      "77611",
      "77617",
      "77621",
      "77641",
      "77647",
      "77659",
      "77681",
      "77687",
      "77689",
      "77699",
      "77711",
      "77713",
      "77719",
      "77723",
      "77731",
      "77743",
      "77747",
      "77761",
      "77773",
      "77783",
      "77797",
      "77801",
      "77813",
      "77839",
      "77849",
      "77863",
      "77867",
      "77893",
      "77899",
      "77929",
      "77933",
      "77951",
      "77969",
      "77977",
      "77983",
      "77999",
      "78007",
      "78017",
      "78031",
      "78041",
      "78049",
      "78059",
      "78079",
      "78101",
      "78121",
      "78137",
      "78139",
      "78157",
      "78163",
      "78167",
      "78173",
      "78179",
      "78191",
      "78193",
      "78203",
      "78229",
      "78233",
      "78241",
      "78259",
      "78277",
      "78283",
      "78301",
      "78307",
      "78311",
      "78317",
      "78341",
      "78347",
      "78367",
      "78401",
      "78427",
      "78437",
      "78439",
      "78467",
      "78479",
      "78487",
      "78497",
      "78509",
      "78511",
      "78517",
      "78539",
      "78541",
      "78553",
      "78569",
      "78571",
      "78577",
      "78583",
      "78593",
      "78607",
      "78623",
      "78643",
      "78649",
      "78653",
      "78691",
      "78697",
      "78707",
      "78713",
      "78721",
      "78737",
      "78779",
      "78781",
      "78787",
      "78791",
      "78797",
      "78803",
      "78809",
      "78823",
      "78839",
      "78853",
      "78857",
      "78877",
      "78887",
      "78889",
      "78893",
      "78901",
      "78919",
      "78929",
      "78941",
      "78977",
      "78979",
      "78989",
      "79031",
      "79039",
      "79043",
      "79063",
      "79087",
      "79103",
      "79111",
      "79133",
      "79139",
      "79147",
      "79151",
      "79153",
      "79159",
      "79181",
      "79187",
      "79193",
      "79201",
      "79229",
      "79231",
      "79241",
      "79259",
      "79273",
      "79279",
      "79283",
      "79301",
      "79309",
      "79319",
      "79333",
      "79337",
      "79349",
      "79357",
      "79367",
      "79379",
      "79393",
      "79397",
      "79399",
      "79411",
      "79423",
      "79427",
      "79433",
      "79451",
      "79481",
      "79493",
      "79531",
      "79537",
      "79549",
      "79559",
      "79561",
      "79579",
      "79589",
      "79601",
      "79609",
      "79613",
      "79621",
      "79627",
      "79631",
      "79633",
      "79657",
      "79669",
      "79687",
      "79691",
      "79693",
      "79697",
      "79699",
      "79757",
      "79769",
      "79777",
      "79801",
      "79811",
      "79813",
      "79817",
      "79823",
      "79829",
      "79841",
      "79843",
      "79847",
      "79861",
      "79867",
      "79873",
      "79889",
      "79901",
      "79903",
      "79907",
      "79939",
      "79943",
      "79967",
      "79973",
      "79979",
      "79987",
      "79997",
      "79999",
      "80021",
      "80039",
      "80051",
      "80071",
      "80077",
      "80107",
      "80111",
      "80141",
      "80147",
      "80149",
      "80153",
      "80167",
      "80173",
      "80177",
      "80191",
      "80207",
      "80209",
      "80221",
      "80231",
      "80233",
      "80239",
      "80251",
      "80263",
      "80273",
      "80279",
      "80287",
      "80309",
      "80317",
      "80329",
      "80341",
      "80347",
      "80363",
      "80369",
      "80387",
      "80407",
      "80429",
      "80447",
      "80449",
      "80471",
      "80473",
      "80489",
      "80491",
      "80513",
      "80527",
      "80537",
      "80557",
      "80567",
      "80599",
      "80603",
      "80611",
      "80621",
      "80627",
      "80629",
      "80651",
      "80657",
      "80669",
      "80671",
      "80677",
      "80681",
      "80683",
      "80687",
      "80701",
      "80713",
      "80737",
      "80747",
      "80749",
      "80761",
      "80777",
      "80779",
      "80783",
      "80789",
      "80803",
      "80809",
      "80819",
      "80831",
      "80833",
      "80849",
      "80863",
      "80897",
      "80909",
      "80911",
      "80917",
      "80923",
      "80929",
      "80933",
      "80953",
      "80963",
      "80989",
      "81001",
      "81013",
      "81017",
      "81019",
      "81023",
      "81031",
      "81041",
      "81043",
      "81047",
      "81049",
      "81071",
      "81077",
      "81083",
      "81097",
      "81101",
      "81119",
      "81131",
      "81157",
      "81163",
      "81173",
      "81181",
      "81197",
      "81199",
      "81203",
      "81223",
      "81233",
      "81239",
      "81281",
      "81283",
      "81293",
      "81299",
      "81307",
      "81331",
      "81343",
      "81349",
      "81353",
      "81359",
      "81371",
      "81373",
      "81401",
      "81409",
      "81421",
      "81439",
      "81457",
      "81463",
      "81509",
      "81517",
      "81527",
      "81533",
      "81547",
      "81551",
      "81553",
      "81559",
      "81563",
      "81569",
      "81611",
      "81619",
      "81629",
      "81637",
      "81647",
      "81649",
      "81667",
      "81671",
      "81677",
      "81689",
      "81701",
      "81703",
      "81707",
      "81727",
      "81737",
      "81749",
      "81761",
      "81769",
      "81773",
      "81799",
      "81817",
      "81839",
      "81847",
      "81853",
      "81869",
      "81883",
      "81899",
      "81901",
      "81919",
      "81929",
      "81931",
      "81937",
      "81943",
      "81953",
      "81967",
      "81971",
      "81973",
      "82003",
      "82007",
      "82009",
      "82013",
      "82021",
      "82031",
      "82037",
      "82039",
      "82051",
      "82067",
      "82073",
      "82129",
      "82139",
      "82141",
      "82153",
      "82163",
      "82171",
      "82183",
      "82189",
      "82193",
      "82207",
      "82217",
      "82219",
      "82223",
      "82231",
      "82237",
      "82241",
      "82261",
      "82267",
      "82279",
      "82301",
      "82307",
      "82339",
      "82349",
      "82351",
      "82361",
      "82373",
      "82387",
      "82393",
      "82421",
      "82457",
      "82463",
      "82469",
      "82471",
      "82483",
      "82487",
      "82493",
      "82499",
      "82507",
      "82529",
      "82531",
      "82549",
      "82559",
      "82561",
      "82567",
      "82571",
      "82591",
      "82601",
      "82609",
      "82613",
      "82619",
      "82633",
      "82651",
      "82657",
      "82699",
      "82721",
      "82723",
      "82727",
      "82729",
      "82757",
      "82759",
      "82763",
      "82781",
      "82787",
      "82793",
      "82799",
      "82811",
      "82813",
      "82837",
      "82847",
      "82883",
      "82889",
      "82891",
      "82903",
      "82913",
      "82939",
      "82963",
      "82981",
      "82997",
      "83003",
      "83009",
      "83023",
      "83047",
      "83059",
      "83063",
      "83071",
      "83077",
      "83089",
      "83093",
      "83101",
      "83117",
      "83137",
      "83177",
      "83203",
      "83207",
      "83219",
      "83221",
      "83227",
      "83231",
      "83233",
      "83243",
      "83257",
      "83267",
      "83269",
      "83273",
      "83299",
      "83311",
      "83339",
      "83341",
      "83357",
      "83383",
      "83389",
      "83399",
      "83401",
      "83407",
      "83417",
      "83423",
      "83431",
      "83437",
      "83443",
      "83449",
      "83459",
      "83471",
      "83477",
      "83497",
      "83537",
      "83557",
      "83561",
      "83563",
      "83579",
      "83591",
      "83597",
      "83609",
      "83617",
      "83621",
      "83639",
      "83641",
      "83653",
      "83663",
      "83689",
      "83701",
      "83717",
      "83719",
      "83737",
      "83761",
      "83773",
      "83777",
      "83791",
      "83813",
      "83833",
      "83843",
      "83857",
      "83869",
      "83873",
      "83891",
      "83903",
      "83911",
      "83921",
      "83933",
      "83939",
      "83969",
      "83983",
      "83987",
      "84011",
      "84017",
      "84047",
      "84053",
      "84059",
      "84061",
      "84067",
      "84089",
      "84121",
      "84127",
      "84131",
      "84137",
      "84143",
      "84163",
      "84179",
      "84181",
      "84191",
      "84199",
      "84211",
      "84221",
      "84223",
      "84229",
      "84239",
      "84247",
      "84263",
      "84299",
      "84307",
      "84313",
      "84317",
      "84319",
      "84347",
      "84349",
      "84377",
      "84389",
      "84391",
      "84401",
      "84407",
      "84421",
      "84431",
      "84437",
      "84443",
      "84449",
      "84457",
      "84463",
      "84467",
      "84481",
      "84499",
      "84503",
      "84509",
      "84521",
      "84523",
      "84533",
      "84551",
      "84559",
      "84589",
      "84629",
      "84631",
      "84649",
      "84653",
      "84659",
      "84673",
      "84691",
      "84697",
      "84701",
      "84713",
      "84719",
      "84731",
      "84737",
      "84751",
      "84761",
      "84787",
      "84793",
      "84809",
      "84811",
      "84827",
      "84857",
      "84859",
      "84869",
      "84871",
      "84913",
      "84919",
      "84947",
      "84961",
      "84967",
      "84977",
      "84979",
      "84991",
      "85009",
      "85021",
      "85027",
      "85037",
      "85049",
      "85061",
      "85081",
      "85087",
      "85091",
      "85093",
      "85103",
      "85109",
      "85121",
      "85133",
      "85147",
      "85159",
      "85193",
      "85199",
      "85201",
      "85213",
      "85223",
      "85229",
      "85237",
      "85243",
      "85247",
      "85259",
      "85297",
      "85303",
      "85313",
      "85331",
      "85333",
      "85361",
      "85363",
      "85369",
      "85381",
      "85411",
      "85427",
      "85429",
      "85439",
      "85447",
      "85451",
      "85453",
      "85469",
      "85487",
      "85513",
      "85517",
      "85523",
      "85531",
      "85549",
      "85571",
      "85577",
      "85597",
      "85601",
      "85607",
      "85619",
      "85621",
      "85627",
      "85639",
      "85643",
      "85661",
      "85667",
      "85669",
      "85691",
      "85703",
      "85711",
      "85717",
      "85733",
      "85751",
      "85781",
      "85793",
      "85817",
      "85819",
      "85829",
      "85831",
      "85837",
      "85843",
      "85847",
      "85853",
      "85889",
      "85903",
      "85909",
      "85931",
      "85933",
      "85991",
      "85999",
      "86011",
      "86017",
      "86027",
      "86029",
      "86069",
      "86077",
      "86083",
      "86111",
      "86113",
      "86117",
      "86131",
      "86137",
      "86143",
      "86161",
      "86171",
      "86179",
      "86183",
      "86197",
      "86201",
      "86209",
      "86239",
      "86243",
      "86249",
      "86257",
      "86263",
      "86269",
      "86287",
      "86291",
      "86293",
      "86297",
      "86311",
      "86323",
      "86341",
      "86351",
      "86353",
      "86357",
      "86369",
      "86371",
      "86381",
      "86389",
      "86399",
      "86413",
      "86423",
      "86441",
      "86453",
      "86461",
      "86467",
      "86477",
      "86491",
      "86501",
      "86509",
      "86531",
      "86533",
      "86539",
      "86561",
      "86573",
      "86579",
      "86587",
      "86599",
      "86627",
      "86629",
      "86677",
      "86689",
      "86693",
      "86711",
      "86719",
      "86729",
      "86743",
      "86753",
      "86767",
      "86771",
      "86783",
      "86813",
      "86837",
      "86843",
      "86851",
      "86857",
      "86861",
      "86869",
      "86923",
      "86927",
      "86929",
      "86939",
      "86951",
      "86959",
      "86969",
      "86981",
      "86993",
      "87011",
      "87013",
      "87037",
      "87041",
      "87049",
      "87071",
      "87083",
      "87103",
      "87107",
      "87119",
      "87121",
      "87133",
      "87149",
      "87151",
      "87179",
      "87181",
      "87187",
      "87211",
      "87221",
      "87223",
      "87251",
      "87253",
      "87257",
      "87277",
      "87281",
      "87293",
      "87299",
      "87313",
      "87317",
      "87323",
      "87337",
      "87359",
      "87383",
      "87403",
      "87407",
      "87421",
      "87427",
      "87433",
      "87443",
      "87473",
      "87481",
      "87491",
      "87509",
      "87511",
      "87517",
      "87523",
      "87539",
      "87541",
      "87547",
      "87553",
      "87557",
      "87559",
      "87583",
      "87587",
      "87589",
      "87613",
      "87623",
      "87629",
      "87631",
      "87641",
      "87643",
      "87649",
      "87671",
      "87679",
      "87683",
      "87691",
      "87697",
      "87701",
      "87719",
      "87721",
      "87739",
      "87743",
      "87751",
      "87767",
      "87793",
      "87797",
      "87803",
      "87811",
      "87833",
      "87853",
      "87869",
      "87877",
      "87881",
      "87887",
      "87911",
      "87917",
      "87931",
      "87943",
      "87959",
      "87961",
      "87973",
      "87977",
      "87991",
      "88001",
      "88003",
      "88007",
      "88019",
      "88037",
      "88069",
      "88079",
      "88093",
      "88117",
      "88129",
      "88169",
      "88177",
      "88211",
      "88223",
      "88237",
      "88241",
      "88259",
      "88261",
      "88289",
      "88301",
      "88321",
      "88327",
      "88337",
      "88339",
      "88379",
      "88397",
      "88411",
      "88423",
      "88427",
      "88463",
      "88469",
      "88471",
      "88493",
      "88499",
      "88513",
      "88523",
      "88547",
      "88589",
      "88591",
      "88607",
      "88609",
      "88643",
      "88651",
      "88657",
      "88661",
      "88663",
      "88667",
      "88681",
      "88721",
      "88729",
      "88741",
      "88747",
      "88771",
      "88789",
      "88793",
      "88799",
      "88801",
      "88807",
      "88811",
      "88813",
      "88817",
      "88819",
      "88843",
      "88853",
      "88861",
      "88867",
      "88873",
      "88883",
      "88897",
      "88903",
      "88919",
      "88937",
      "88951",
      "88969",
      "88993",
      "88997",
      "89003",
      "89009",
      "89017",
      "89021",
      "89041",
      "89051",
      "89057",
      "89069",
      "89071",
      "89083",
      "89087",
      "89101",
      "89107",
      "89113",
      "89119",
      "89123",
      "89137",
      "89153",
      "89189",
      "89203",
      "89209",
      "89213",
      "89227",
      "89231",
      "89237",
      "89261",
      "89269",
      "89273",
      "89293",
      "89303",
      "89317",
      "89329",
      "89363",
      "89371",
      "89381",
      "89387",
      "89393",
      "89399",
      "89413",
      "89417",
      "89431",
      "89443",
      "89449",
      "89459",
      "89477",
      "89491",
      "89501",
      "89513",
      "89519",
      "89521",
      "89527",
      "89533",
      "89561",
      "89563",
      "89567",
      "89591",
      "89597",
      "89599",
      "89603",
      "89611",
      "89627",
      "89633",
      "89653",
      "89657",
      "89659",
      "89669",
      "89671",
      "89681",
      "89689",
      "89753",
      "89759",
      "89767",
      "89779",
      "89783",
      "89797",
      "89809",
      "89819",
      "89821",
      "89833",
      "89839",
      "89849",
      "89867",
      "89891",
      "89897",
      "89899",
      "89909",
      "89917",
      "89923",
      "89939",
      "89959",
      "89963",
      "89977",
      "89983",
      "89989",
      "90001",
      "90007",
      "90011",
      "90017",
      "90019",
      "90023",
      "90031",
      "90053",
      "90059",
      "90067",
      "90071",
      "90073",
      "90089",
      "90107",
      "90121",
      "90127",
      "90149",
      "90163",
      "90173",
      "90187",
      "90191",
      "90197",
      "90199",
      "90203",
      "90217",
      "90227",
      "90239",
      "90247",
      "90263",
      "90271",
      "90281",
      "90289",
      "90313",
      "90353",
      "90359",
      "90371",
      "90373",
      "90379",
      "90397",
      "90401",
      "90403",
      "90407",
      "90437",
      "90439",
      "90469",
      "90473",
      "90481",
      "90499",
      "90511",
      "90523",
      "90527",
      "90529",
      "90533",
      "90547",
      "90583",
      "90599",
      "90617",
      "90619",
      "90631",
      "90641",
      "90647",
      "90659",
      "90677",
      "90679",
      "90697",
      "90703",
      "90709",
      "90731",
      "90749",
      "90787",
      "90793",
      "90803",
      "90821",
      "90823",
      "90833",
      "90841",
      "90847",
      "90863",
      "90887",
      "90901",
      "90907",
      "90911",
      "90917",
      "90931",
      "90947",
      "90971",
      "90977",
      "90989",
      "90997",
      "91009",
      "91019",
      "91033",
      "91079",
      "91081",
      "91097",
      "91099",
      "91121",
      "91127",
      "91129",
      "91139",
      "91141",
      "91151",
      "91153",
      "91159",
      "91163",
      "91183",
      "91193",
      "91199",
      "91229",
      "91237",
      "91243",
      "91249",
      "91253",
      "91283",
      "91291",
      "91297",
      "91303",
      "91309",
      "91331",
      "91367",
      "91369",
      "91373",
      "91381",
      "91387",
      "91393",
      "91397",
      "91411",
      "91423",
      "91433",
      "91453",
      "91457",
      "91459",
      "91463",
      "91493",
      "91499",
      "91513",
      "91529",
      "91541",
      "91571",
      "91573",
      "91577",
      "91583",
      "91591",
      "91621",
      "91631",
      "91639",
      "91673",
      "91691",
      "91703",
      "91711",
      "91733",
      "91753",
      "91757",
      "91771",
      "91781",
      "91801",
      "91807",
      "91811",
      "91813",
      "91823",
      "91837",
      "91841",
      "91867",
      "91873",
      "91909",
      "91921",
      "91939",
      "91943",
      "91951",
      "91957",
      "91961",
      "91967",
      "91969",
      "91997",
      "92003",
      "92009",
      "92033",
      "92041",
      "92051",
      "92077",
      "92083",
      "92107",
      "92111",
      "92119",
      "92143",
      "92153",
      "92173",
      "92177",
      "92179",
      "92189",
      "92203",
      "92219",
      "92221",
      "92227",
      "92233",
      "92237",
      "92243",
      "92251",
      "92269",
      "92297",
      "92311",
      "92317",
      "92333",
      "92347",
      "92353",
      "92357",
      "92363",
      "92369",
      "92377",
      "92381",
      "92383",
      "92387",
      "92399",
      "92401",
      "92413",
      "92419",
      "92431",
      "92459",
      "92461",
      "92467",
      "92479",
      "92489",
      "92503",
      "92507",
      "92551",
      "92557",
      "92567",
      "92569",
      "92581",
      "92593",
      "92623",
      "92627",
      "92639",
      "92641",
      "92647",
      "92657",
      "92669",
      "92671",
      "92681",
      "92683",
      "92693",
      "92699",
      "92707",
      "92717",
      "92723",
      "92737",
      "92753",
      "92761",
      "92767",
      "92779",
      "92789",
      "92791",
      "92801",
      "92809",
      "92821",
      "92831",
      "92849",
      "92857",
      "92861",
      "92863",
      "92867",
      "92893",
      "92899",
      "92921",
      "92927",
      "92941",
      "92951",
      "92957",
      "92959",
      "92987",
      "92993",
      "93001",
      "93047",
      "93053",
      "93059",
      "93077",
      "93083",
      "93089",
      "93097",
      "93103",
      "93113",
      "93131",
      "93133",
      "93139",
      "93151",
      "93169",
      "93179",
      "93187",
      "93199",
      "93229",
      "93239",
      "93241",
      "93251",
      "93253",
      "93257",
      "93263",
      "93281",
      "93283",
      "93287",
      "93307",
      "93319",
      "93323",
      "93329",
      "93337",
      "93371",
      "93377",
      "93383",
      "93407",
      "93419",
      "93427",
      "93463",
      "93479",
      "93481",
      "93487",
      "93491",
      "93493",
      "93497",
      "93503",
      "93523",
      "93529",
      "93553",
      "93557",
      "93559",
      "93563",
      "93581",
      "93601",
      "93607",
      "93629",
      "93637",
      "93683",
      "93701",
      "93703",
      "93719",
      "93739",
      "93761",
      "93763",
      "93787",
      "93809",
      "93811",
      "93827",
      "93851",
      "93871",
      "93887",
      "93889",
      "93893",
      "93901",
      "93911",
      "93913",
      "93923",
      "93937",
      "93941",
      "93949",
      "93967",
      "93971",
      "93979",
      "93983",
      "93997",
      "94007",
      "94009",
      "94033",
      "94049",
      "94057",
      "94063",
      "94079",
      "94099",
      "94109",
      "94111",
      "94117",
      "94121",
      "94151",
      "94153",
      "94169",
      "94201",
      "94207",
      "94219",
      "94229",
      "94253",
      "94261",
      "94273",
      "94291",
      "94307",
      "94309",
      "94321",
      "94327",
      "94331",
      "94343",
      "94349",
      "94351",
      "94379",
      "94397",
      "94399",
      "94421",
      "94427",
      "94433",
      "94439",
      "94441",
      "94447",
      "94463",
      "94477",
      "94483",
      "94513",
      "94529",
      "94531",
      "94541",
      "94543",
      "94547",
      "94559",
      "94561",
      "94573",
      "94583",
      "94597",
      "94603",
      "94613",
      "94621",
      "94649",
      "94651",
      "94687",
      "94693",
      "94709",
      "94723",
      "94727",
      "94747",
      "94771",
      "94777",
      "94781",
      "94789",
      "94793",
      "94811",
      "94819",
      "94823",
      "94837",
      "94841",
      "94847",
      "94849",
      "94873",
      "94889",
      "94903",
      "94907",
      "94933",
      "94949",
      "94951",
      "94961",
      "94993",
      "94999",
      "95003",
      "95009",
      "95021",
      "95027",
      "95063",
      "95071",
      "95083",
      "95087",
      "95089",
      "95093",
      "95101",
      "95107",
      "95111",
      "95131",
      "95143",
      "95153",
      "95177",
      "95189",
      "95191",
      "95203",
      "95213",
      "95219",
      "95231",
      "95233",
      "95239",
      "95257",
      "95261",
      "95267",
      "95273",
      "95279",
      "95287",
      "95311",
      "95317",
      "95327",
      "95339",
      "95369",
      "95383",
      "95393",
      "95401",
      "95413",
      "95419",
      "95429",
      "95441",
      "95443",
      "95461",
      "95467",
      "95471",
      "95479",
      "95483",
      "95507",
      "95527",
      "95531",
      "95539",
      "95549",
      "95561",
      "95569",
      "95581",
      "95597",
      "95603",
      "95617",
      "95621",
      "95629",
      "95633",
      "95651",
      "95701",
      "95707",
      "95713",
      "95717",
      "95723",
      "95731",
      "95737",
      "95747",
      "95773",
      "95783",
      "95789",
      "95791",
      "95801",
      "95803",
      "95813",
      "95819",
      "95857",
      "95869",
      "95873",
      "95881",
      "95891",
      "95911",
      "95917",
      "95923",
      "95929",
      "95947",
      "95957",
      "95959",
      "95971",
      "95987",
      "95989",
      "96001",
      "96013",
      "96017",
      "96043",
      "96053",
      "96059",
      "96079",
      "96097",
      "96137",
      "96149",
      "96157",
      "96167",
      "96179",
      "96181",
      "96199",
      "96211",
      "96221",
      "96223",
      "96233",
      "96259",
      "96263",
      "96269",
      "96281",
      "96289",
      "96293",
      "96323",
      "96329",
      "96331",
      "96337",
      "96353",
      "96377",
      "96401",
      "96419",
      "96431",
      "96443",
      "96451",
      "96457",
      "96461",
      "96469",
      "96479",
      "96487",
      "96493",
      "96497",
      "96517",
      "96527",
      "96553",
      "96557",
      "96581",
      "96587",
      "96589",
      "96601",
      "96643",
      "96661",
      "96667",
      "96671",
      "96697",
      "96703",
      "96731",
      "96737",
      "96739",
      "96749",
      "96757",
      "96763",
      "96769",
      "96779",
      "96787",
      "96797",
      "96799",
      "96821",
      "96823",
      "96827",
      "96847",
      "96851",
      "96857",
      "96893",
      "96907",
      "96911",
      "96931",
      "96953",
      "96959",
      "96973",
      "96979",
      "96989",
      "96997",
      "97001",
      "97003",
      "97007",
      "97021",
      "97039",
      "97073",
      "97081",
      "97103",
      "97117",
      "97127",
      "97151",
      "97157",
      "97159",
      "97169",
      "97171",
      "97177",
      "97187",
      "97213",
      "97231",
      "97241",
      "97259",
      "97283",
      "97301",
      "97303",
      "97327",
      "97367",
      "97369",
      "97373",
      "97379",
      "97381",
      "97387",
      "97397",
      "97423",
      "97429",
      "97441",
      "97453",
      "97459",
      "97463",
      "97499",
      "97501",
      "97511",
      "97523",
      "97547",
      "97549",
      "97553",
      "97561",
      "97571",
      "97577",
      "97579",
      "97583",
      "97607",
      "97609",
      "97613",
      "97649",
      "97651",
      "97673",
      "97687",
      "97711",
      "97729",
      "97771",
      "97777",
      "97787",
      "97789",
      "97813",
      "97829",
      "97841",
      "97843",
      "97847",
      "97849",
      "97859",
      "97861",
      "97871",
      "97879",
      "97883",
      "97919",
      "97927",
      "97931",
      "97943",
      "97961",
      "97967",
      "97973",
      "97987",
      "98009",
      "98011",
      "98017",
      "98041",
      "98047",
      "98057",
      "98081",
      "98101",
      "98123",
      "98129",
      "98143",
      "98179",
      "98207",
      "98213",
      "98221",
      "98227",
      "98251",
      "98257",
      "98269",
      "98297",
      "98299",
      "98317",
      "98321",
      "98323",
      "98327",
      "98347",
      "98369",
      "98377",
      "98387",
      "98389",
      "98407",
      "98411",
      "98419",
      "98429",
      "98443",
      "98453",
      "98459",
      "98467",
      "98473",
      "98479",
      "98491",
      "98507",
      "98519",
      "98533",
      "98543",
      "98561",
      "98563",
      "98573",
      "98597",
      "98621",
      "98627",
      "98639",
      "98641",
      "98663",
      "98669",
      "98689",
      "98711",
      "98713",
      "98717",
      "98729",
      "98731",
      "98737",
      "98773",
      "98779",
      "98801",
      "98807",
      "98809",
      "98837",
      "98849",
      "98867",
      "98869",
      "98873",
      "98887",
      "98893",
      "98897",
      "98899",
      "98909",
      "98911",
      "98927",
      "98929",
      "98939",
      "98947",
      "98953",
      "98963",
      "98981",
      "98993",
      "98999",
      "99013",
      "99017",
      "99023",
      "99041",
      "99053",
      "99079",
      "99083",
      "99089",
      "99103",
      "99109",
      "99119",
      "99131",
      "99133",
      "99137",
      "99139",
      "99149",
      "99173",
      "99181",
      "99191",
      "99223",
      "99233",
      "99241",
      "99251",
      "99257",
      "99259",
      "99277",
      "99289",
      "99317",
      "99347",
      "99349",
      "99367",
      "99371",
      "99377",
      "99391",
      "99397",
      "99401",
      "99409",
      "99431",
      "99439",
      "99469",
      "99487",
      "99497",
      "99523",
      "99527",
      "99529",
      "99551",
      "99559",
      "99563",
      "99571",
      "99577",
      "99581",
      "99607",
      "99611",
      "99623",
      "99643",
      "99661",
      "99667",
      "99679",
      "99689",
      "99707",
      "99709",
      "99713",
      "99719",
      "99721",
      "99733",
      "99761",
      "99767",
      "99787",
      "99793",
      "99809",
      "99817",
      "99823",
      "99829",
      "99833",
      "99839",
      "99859",
      "99871",
      "99877",
      "99881",
      "99901",
      "99907",
      "99923",
      "99929",
      "99961",
      "99971",
      "99989",
      "99991"
    ];
    SettingsIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { width } = $$props;
      let { height } = $$props;
      if ($$props.width === void 0 && $$bindings.width && width !== void 0)
        $$bindings.width(width);
      if ($$props.height === void 0 && $$bindings.height && height !== void 0)
        $$bindings.height(height);
      return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"${add_attribute("width", width, 0)}><path fill="${"#fff"}" d="${"M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"}"></path></svg>`;
    });
    StatsIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { width } = $$props;
      let { height } = $$props;
      if ($$props.width === void 0 && $$bindings.width && width !== void 0)
        $$bindings.width(width);
      if ($$props.height === void 0 && $$bindings.height && height !== void 0)
        $$bindings.height(height);
      return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"${add_attribute("width", width, 0)} fill="${"#fff"}"><path d="${"M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"}"></path></svg>`;
    });
    Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$unsubscribe_show;
      let $$unsubscribe_showSettings;
      $$unsubscribe_show = subscribe(show, (value) => value);
      $$unsubscribe_showSettings = subscribe(showSettings, (value) => value);
      $$unsubscribe_show();
      $$unsubscribe_showSettings();
      return `<header class="${"relative h-14 w-full flex items-center justify-center font-sans text-3xl font-semibold border-b border-[#3a3a3c]"}"><p class="${"mx-auto"}">Prirdle</p>
  <span class="${"absolute inset-y-auto right-2 text-white flex flex-row gap-2"}"><span>${validate_component(StatsIcon, "StatsIcon").$$render($$result, { height: 24, width: 24 }, {}, {})}</span>
    <span>${validate_component(SettingsIcon, "SettingsIcon").$$render($$result, { height: 24, width: 24 }, {}, {})}</span></span></header>`;
    });
    Backspace = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { width } = $$props;
      let { height } = $$props;
      if ($$props.width === void 0 && $$bindings.width && width !== void 0)
        $$bindings.width(width);
      if ($$props.height === void 0 && $$bindings.height && height !== void 0)
        $$bindings.height(height);
      return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("height", height, 0)} viewBox="${"0 0 24 24"}"${add_attribute("width", width, 0)}><path fill="${"#fff"}" d="${"M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"}"></path></svg>`;
    });
    css$1 = {
      code: ".keyboardNumber.svelte-1clblvx{display:flex;aspect-ratio:43 / 58;width:10vw;align-items:center;justify-content:center;border-radius:0.25rem;font-size:1rem;line-height:1.5rem;font-weight:600\n}@media(min-width: 400px){.keyboardNumber.svelte-1clblvx{height:58px\n    }.keyboardNumber.svelte-1clblvx{width:43px\n    }.keyboardNumber.svelte-1clblvx{font-size:1.25rem;line-height:1.75rem\n    }}.keyboardNumber[data-color='0'].svelte-1clblvx{--tw-bg-opacity:1;background-color:rgb(83 141 78 / var(--tw-bg-opacity))\n}.keyboardNumber[data-color='1'].svelte-1clblvx{--tw-bg-opacity:1;background-color:rgb(181 159 59 / var(--tw-bg-opacity))\n}.keyboardNumber[data-color='2'].svelte-1clblvx{--tw-bg-opacity:1;background-color:rgb(129 131 132 / var(--tw-bg-opacity))\n}.keyboardNumber[data-color='3'].svelte-1clblvx{--tw-bg-opacity:1;background-color:rgb(58 58 60 / var(--tw-bg-opacity))\n}.keyboardKey.svelte-1clblvx{display:flex;aspect-ratio:100 / 58;width:20vw;align-items:center;justify-content:center;border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(129 131 132 / var(--tw-bg-opacity));font-size:1rem;line-height:1.5rem;font-weight:600\n}@media(min-width: 400px){.keyboardKey.svelte-1clblvx{height:58px\n    }.keyboardKey.svelte-1clblvx{width:100px\n    }.keyboardKey.svelte-1clblvx{font-size:1.25rem;line-height:1.75rem\n    }}",
      map: null
    };
    Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { addToGuess } = $$props;
      let { submitGuess } = $$props;
      let { keypadColors } = $$props;
      let { deleteFunc } = $$props;
      let keypad = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      if ($$props.addToGuess === void 0 && $$bindings.addToGuess && addToGuess !== void 0)
        $$bindings.addToGuess(addToGuess);
      if ($$props.submitGuess === void 0 && $$bindings.submitGuess && submitGuess !== void 0)
        $$bindings.submitGuess(submitGuess);
      if ($$props.keypadColors === void 0 && $$bindings.keypadColors && keypadColors !== void 0)
        $$bindings.keypadColors(keypadColors);
      if ($$props.deleteFunc === void 0 && $$bindings.deleteFunc && deleteFunc !== void 0)
        $$bindings.deleteFunc(deleteFunc);
      $$result.css.add(css$1);
      return `<footer class="${"mb-2"}"><div class="${"grid grid-cols-3 grid-rows-3 gap-2 small:w-[145px] w-[calc(30vw+16px)] mx-auto"}">${each(keypad, (digit, i2) => {
        return `<div class="${"keyboardNumber svelte-1clblvx"}"${add_attribute("data-color", keypadColors[i2 + 1], 0)}>${escape(digit)}
      </div>`;
      })}</div>
  <div class="${"flex flex-row gap-2 mt-2"}"><div class="${"keyboardKey svelte-1clblvx"}">Enter</div>
    <div class="${"keyboardNumber svelte-1clblvx"}"${add_attribute("data-color", keypadColors[0], 0)}>0
    </div>
    <div class="${"keyboardKey svelte-1clblvx"}">${validate_component(Backspace, "Backspace").$$render($$result, { width: 24, height: 24 }, {}, {})}</div></div>
</footer>`;
    });
    css3 = {
      code: ".tile.svelte-17detw2{display:flex;aspect-ratio:1 / 1;width:15vw;align-items:center;justify-content:center;font-size:1.875rem;line-height:2.25rem;font-weight:600}@media(min-width: 400px){.tile.svelte-17detw2{aspect-ratio:auto}.tile.svelte-17detw2{height:62px}.tile.svelte-17detw2{width:62px}}.tile[data-state='empty'].svelte-17detw2{border-width:2px;--tw-border-opacity:1;border-color:rgb(58 58 60 / var(--tw-border-opacity))}.tile[data-state='0'].svelte-17detw2{--tw-bg-opacity:1;background-color:rgb(83 141 78 / var(--tw-bg-opacity))}.tile[data-state='1'].svelte-17detw2{--tw-bg-opacity:1;background-color:rgb(181 159 59 / var(--tw-bg-opacity))}.tile[data-state='2'].svelte-17detw2{--tw-bg-opacity:1;background-color:rgb(58 58 60 / var(--tw-bg-opacity))}.tile[data-state='3'].svelte-17detw2{border-width:2px;--tw-border-opacity:1;border-color:rgb(86 87 88 / var(--tw-border-opacity))}.tile[data-state='4'].svelte-17detw2{--tw-bg-opacity:1;background-color:rgb(58 58 60 / var(--tw-bg-opacity));opacity:0.7}.tile[data-animation='pop'].svelte-17detw2{-webkit-animation-name:svelte-17detw2-PopIn;animation-name:svelte-17detw2-PopIn;-webkit-animation-duration:100ms;animation-duration:100ms}@-webkit-keyframes svelte-17detw2-PopIn{from{transform:scale(0.8);opacity:0}40%{transform:scale(1.1);opacity:1}}@keyframes svelte-17detw2-PopIn{from{transform:scale(0.8);opacity:0}40%{transform:scale(1.1);opacity:1}}.tile[data-animation='flip-in'].svelte-17detw2{-webkit-animation-name:svelte-17detw2-FlipIn;animation-name:svelte-17detw2-FlipIn;-webkit-animation-duration:250ms;animation-duration:250ms;-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}@-webkit-keyframes svelte-17detw2-FlipIn{0%{transform:rotateX(0)}100%{transform:rotateX(-90deg)}}@keyframes svelte-17detw2-FlipIn{0%{transform:rotateX(0)}100%{transform:rotateX(-90deg)}}.tile[data-animation='flip-out'].svelte-17detw2{-webkit-animation-name:svelte-17detw2-FlipOut;animation-name:svelte-17detw2-FlipOut;-webkit-animation-duration:250ms;animation-duration:250ms;-webkit-animation-timing-function:ease-in;animation-timing-function:ease-in}@-webkit-keyframes svelte-17detw2-FlipOut{0%{transform:rotateX(-90deg)}100%{transform:rotateX(0)}}@keyframes svelte-17detw2-FlipOut{0%{transform:rotateX(-90deg)}100%{transform:rotateX(0)}}@-webkit-keyframes svelte-17detw2-Reveal{0%{transform:rotateX(0)}50%{transform:rotateX(-90deg)}100%{transform:rotateX(0)}}@keyframes svelte-17detw2-Reveal{0%{transform:rotateX(0)}50%{transform:rotateX(-90deg)}100%{transform:rotateX(0)}}.tile[data-reveal='yes'].svelte-17detw2{-webkit-animation:svelte-17detw2-Reveal 500ms cubic-bezier(0.45, 0.05, 0.55, 0.95);animation:svelte-17detw2-Reveal 500ms cubic-bezier(0.45, 0.05, 0.55, 0.95)}",
      map: null
    };
    Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let values;
      let colors;
      let $curBoard, $$unsubscribe_curBoard;
      let $infos, $$unsubscribe_infos;
      let $show, $$unsubscribe_show;
      let $stats, $$unsubscribe_stats;
      let $expertMode, $$unsubscribe_expertMode;
      $$unsubscribe_curBoard = subscribe(curBoard, (value) => $curBoard = value);
      $$unsubscribe_infos = subscribe(infos, (value) => $infos = value);
      $$unsubscribe_show = subscribe(show, (value) => $show = value);
      $$unsubscribe_stats = subscribe(stats, (value) => $stats = value);
      $$unsubscribe_expertMode = subscribe(expertMode, (value) => $expertMode = value);
      let rightGuess;
      let guessed;
      let lines;
      let expertStrikes;
      let revealed = new Array(5).fill(false);
      let states = new Array(35).fill("idle");
      let colorStates = new Array(35).fill(void 0);
      let keypadColors = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
      let animate = new Array(7).fill(false);
      let _animate = new Array(7).fill(false);
      let initialGuesses = [];
      let initialLines;
      let x_s = new Array(7);
      const y_s = new Array(5);
      let curGuess = "";
      let pastGuesses = [];
      const updateExpert = (expert) => {
        const allRevaled = revealed.reduce((a, b) => a && b, true);
        if (expert && allRevaled) {
          for (let i2 = lines * 5; i2 < 35; i2++) {
            colorStates[i2] = 4;
          }
        } else {
          for (let i2 = lines * 5; i2 < 35; i2++) {
            colorStates[i2] = void 0;
          }
        }
      };
      const addToGuess = (n) => {
        if (curGuess.length < 5 && !guessed) {
          curGuess += `${n}`;
          const index = pastGuesses.length * 5 + curGuess.length - 1;
          states[index] = "pop";
          setTimeout(() => {
            states[index] = "idle";
          }, 100);
        }
      };
      const submitGuess = () => {
        if (curGuess.length === 5 && primes.includes(curGuess)) {
          pastGuesses.push(curGuess);
          curGuess = "";
          (async () => {
            for (let index = (pastGuesses.length - 1) * 5; index < pastGuesses.length * 5; index++) {
              states[index] = "flip-in";
              setTimeout(() => {
                states[index] = "flip-out";
                colorStates[index] = colors[index];
                setTimeout(() => {
                  states[index] = "idle";
                }, 250);
              }, 250);
              await sleep(250);
            }
          })();
        } else if (curGuess.length === 5 && $expertMode) {
          const callInfo = () => {
            set_store_value(infos, $infos = [...$infos, `Not a prime, ${expertStrikes}/3 strikes`], $infos);
            setTimeout(() => {
              set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
            }, 1e3);
            animate[pastGuesses.length] = !animate[pastGuesses.length];
            _animate[pastGuesses.length] = true;
          };
          {
            callInfo();
            lines--;
            if (lines === pastGuesses.length) {
              endGame(false);
            } else {
              updateCurBoard(pastGuesses, curGuess, guessed);
              for (let i2 = lines * 5; i2 < 35; i2++) {
                colorStates[i2] = 4;
              }
            }
          }
        } else if (curGuess.length === 5) {
          set_store_value(infos, $infos = [...$infos, "Not in prime list"], $infos);
          setTimeout(() => {
            set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
          }, 1e3);
          animate[pastGuesses.length] = !animate[pastGuesses.length];
          _animate[pastGuesses.length] = true;
        } else if (curGuess.length < 5) {
          set_store_value(infos, $infos = [...$infos, "Not enough numbers"], $infos);
          setTimeout(() => {
            set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
          }, 1e3);
          animate[pastGuesses.length] = !animate[pastGuesses.length];
          _animate[pastGuesses.length] = true;
        }
      };
      const getValues = (pg, cg) => {
        let final = [];
        pg.forEach((val) => {
          final = [...final, ...val];
        });
        return [...final, ...cg];
      };
      const getColors = (pg, cg, test) => {
        let final = [];
        const relaplaceNumber = (s3, n) => {
          return s3.slice(0, n) + "a" + s3.slice(n + 1);
        };
        pg.forEach((val) => {
          let tempRight = new String(rightGuess);
          let tempFinal = [];
          let tempGreens = [];
          [...val].forEach((char, i2) => {
            if (char === tempRight.charAt(i2)) {
              tempRight = relaplaceNumber(tempRight, i2);
              tempGreens.push(1);
              keypadColors[parseInt(char)] = 0;
            } else {
              tempGreens.push(0);
            }
          });
          [...val].forEach((char, i2) => {
            if (tempGreens[i2] === 1) {
              tempFinal.push(0);
            } else if (tempRight.includes(char)) {
              const index = tempRight.indexOf(char);
              tempRight = relaplaceNumber(tempRight, index);
              tempFinal.push(1);
              if (keypadColors[parseInt(char)] !== 0)
                keypadColors[parseInt(char)] = 1;
            } else {
              tempFinal.push(2);
              if (keypadColors[parseInt(char)] !== 1 && keypadColors[parseInt(char)] !== 0)
                keypadColors[parseInt(char)] = 3;
            }
          });
          final = [...final, ...tempFinal];
          if (tempFinal.reduce((a, b) => a + b, 0) === 0 && test)
            endGame(true);
        });
        if (pg.length >= lines && !guessed) {
          endGame(false);
        }
        [...cg].forEach((char, i2) => {
          final.push(3);
        });
        return final;
      };
      const endGame = (win) => {
        guessed = true;
        const temp_stats = $stats;
        if (daysIntoYear(new Date()) !== temp_stats.lastDayAdded) {
          temp_stats.played++;
          temp_stats.lastDayAdded = daysIntoYear(new Date());
          if (win) {
            temp_stats.wins++;
            temp_stats.streak++;
            if (temp_stats.streak > temp_stats.maxStreak)
              temp_stats.maxStreak = temp_stats.streak;
            temp_stats.guesses[pastGuesses.length.toString()]++;
          } else {
            temp_stats.streak = 0;
            temp_stats.guesses.fail++;
          }
          localStorage.setItem("board-stats", JSON.stringify(temp_stats));
          set_store_value(stats, $stats = temp_stats, $stats);
        }
        setTimeout(() => {
          set_store_value(show, $show = true, $show);
        }, 1e3);
        if (win) {
          switch (pastGuesses.length) {
            case 1:
              set_store_value(infos, $infos = [...$infos, "Prime form"], $infos);
              setTimeout(() => {
                set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
              }, 5e3);
              break;
            case 2:
              set_store_value(infos, $infos = [...$infos, "Magnificent"], $infos);
              setTimeout(() => {
                set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
              }, 5e3);
              break;
            case 3:
              set_store_value(infos, $infos = [...$infos, "Impressive"], $infos);
              setTimeout(() => {
                set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
              }, 5e3);
              break;
            case 4:
              set_store_value(infos, $infos = [...$infos, "Splendid"], $infos);
              setTimeout(() => {
                set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
              }, 5e3);
              break;
            case 5:
              set_store_value(infos, $infos = [...$infos, "Great"], $infos);
              setTimeout(() => {
                set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
              }, 5e3);
              break;
            case 6:
              set_store_value(infos, $infos = [...$infos, "Phew"], $infos);
              setTimeout(() => {
                set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
              }, 5e3);
              break;
            case 7:
              set_store_value(infos, $infos = [...$infos, "Ouch"], $infos);
              setTimeout(() => {
                set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
              }, 5e3);
              break;
          }
        } else {
          set_store_value(infos, $infos = [...$infos, rightGuess], $infos);
          setTimeout(() => {
            set_store_value(infos, $infos = [...$infos.slice(1, $infos.length)], $infos);
          }, 5e3);
        }
      };
      const sleep = (ms) => {
        return new Promise((res, rej) => {
          setTimeout(() => {
            res("");
          }, ms);
        });
      };
      const updateCurBoard = (pg, cg, g) => {
        if ($curBoard) {
          console.log($curBoard);
          set_store_value(curBoard, $curBoard.hasGuessed = g, $curBoard);
          set_store_value(curBoard, $curBoard.boardState = pg, $curBoard);
          set_store_value(curBoard, $curBoard.colors = colors, $curBoard);
          set_store_value(curBoard, $curBoard.expertStrikes = expertStrikes, $curBoard);
          set_store_value(curBoard, $curBoard.lines = lines, $curBoard);
          localStorage.setItem("cur-board", JSON.stringify($curBoard));
        }
      };
      const daysIntoYear = (date) => {
        return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1e3;
      };
      const deleteFunc = () => {
        curGuess = curGuess.substring(0, curGuess.length - 1);
      };
      $$result.css.add(css3);
      values = getValues(pastGuesses, curGuess);
      colors = getColors(pastGuesses, curGuess, true);
      {
        {
          updateCurBoard(pastGuesses, curGuess, guessed);
          updateExpert($expertMode);
        }
      }
      $$unsubscribe_curBoard();
      $$unsubscribe_infos();
      $$unsubscribe_show();
      $$unsubscribe_stats();
      $$unsubscribe_expertMode();
      return `

<div class="${"w-screen h-full bg-[#121213] flex flex-col justify-center items-center text-white"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
  <main class="${"w-full grow"}"><div class="${"small:w-[320px] w-[240px] w-[calc(75vw+16px)] h-full mx-auto flex items-center justify-center"}"><div class="${"grid grid-cols-1 grid-rows-7 small:w-[320px] w-[calc(75vw+16px)] small:h-[448px] h-[calc(105vw+28px)] text-center"}">${each(x_s, (_, x2) => {
        return `<div class="${escape(null_to_empty(`grid grid-cols-5 grid-rows-1 small:w-[320px] w-[calc(75vw+16px)] small:h-[64px] h-[calc(15vw+4px)] text-center ${_animate[x2] ? "animate-shake" : ""}`)) + " svelte-17detw2"}">${each(y_s, (_2, y) => {
          return `<div class="${"tile svelte-17detw2"}"${add_attribute("data-state", colorStates[x2 * 5 + y] ?? "empty", 0)}${add_attribute("data-animation", states[x2 * 5 + y], 0)}${add_attribute("data-reveal", (initialGuesses[x2] || x2 >= initialLines) && revealed[y] && states[x2 * 5 + y] === "idle" ? "yes" : "no", 0)}>${escape(values[x2 * 5 + y] ?? "")}
                </div>`;
        })}
            </div>`;
      })}</div></div></main>
  ${validate_component(Footer, "Footer").$$render($$result, {
        addToGuess,
        deleteFunc,
        keypadColors,
        submitGuess
      }, {}, {})}
</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  css: () => css4,
  entry: () => entry3,
  js: () => js3,
  module: () => index_svelte_exports
});
var entry3, js3, css4;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    init_index_svelte();
    entry3 = "pages/index.svelte-ee7cda94.js";
    js3 = ["pages/index.svelte-ee7cda94.js", "chunks/vendor-ec4cd4ef.js", "chunks/store-9f9ddc16.js"];
    css4 = ["assets/pages/index.svelte-b68f14cc.css"];
  }
});

// .svelte-kit/vercel-tmp/entry.js
var entry_exports = {};
__export(entry_exports, {
  default: () => entry_default
});

// .svelte-kit/vercel-tmp/shims.js
init_install_fetch();
installFetch();

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.288_svelte@3.46.4/node_modules/@sveltejs/kit/dist/node.js
var import_stream = require("stream");
function get_raw_body(req) {
  return new Promise((fulfil, reject) => {
    const h2 = req.headers;
    if (!h2["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h2["content-length"]);
    if (isNaN(length) && h2["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}
async function getRequest(base2, req) {
  let headers = req.headers;
  if (req.httpVersionMajor === 2) {
    headers = Object.assign({}, headers);
    delete headers[":method"];
    delete headers[":path"];
    delete headers[":authority"];
    delete headers[":scheme"];
  }
  return new Request(base2 + req.url, {
    method: req.method,
    headers,
    body: await get_raw_body(req)
  });
}
async function setResponse(res, response) {
  const headers = Object.fromEntries(response.headers);
  if (response.headers.has("set-cookie")) {
    headers["set-cookie"] = response.headers.raw()["set-cookie"];
  }
  res.writeHead(response.status, headers);
  if (response.body instanceof import_stream.Readable) {
    response.body.pipe(res);
  } else {
    if (response.body) {
      res.write(await response.arrayBuffer());
    }
    res.end();
  }
}

// .svelte-kit/output/server/index.js
init_index_b5d175dd();
var __accessCheck2 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet2 = (obj, member, getter) => {
  __accessCheck2(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd2 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet2 = (obj, member, value, setter) => {
  __accessCheck2(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _use_hashes;
var _dev;
var _script_needs_csp;
var _style_needs_csp;
var _directives;
var _script_src;
var _style_src;
function afterUpdate() {
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  {
    stores.page.set(page);
  }
  return `


${components[1] ? `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => {
      return `${components[2] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
        default: () => {
          return `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
        }
      })}` : `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
    }
  })}` : `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
});
function to_headers(object) {
  const headers = new Headers();
  if (object) {
    for (const key2 in object) {
      const value = object[key2];
      if (!value)
        continue;
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          headers.append(key2, value2);
        });
      } else {
        headers.set(key2, value);
      }
    }
  }
  return headers;
}
function hash(value) {
  let hash2 = 5381;
  let i2 = value.length;
  if (typeof value === "string") {
    while (i2)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
  } else {
    while (i2)
      hash2 = hash2 * 33 ^ value[--i2];
  }
  return (hash2 >>> 0).toString(36);
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key2 in obj) {
    clone2[key2.toLowerCase()] = obj[key2];
  }
  return clone2;
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
  }
  return params;
}
function is_pojo(body) {
  if (typeof body !== "object")
    return false;
  if (body) {
    if (body instanceof Uint8Array)
      return false;
    if (body._readableState && typeof body.pipe === "function")
      return false;
    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
      return false;
  }
  return true;
}
function normalize_request_method(event) {
  const method = event.request.method.toLowerCase();
  return method === "delete" ? "del" : method;
}
function error(body) {
  return new Response(body, {
    status: 500
  });
}
function is_string(s22) {
  return typeof s22 === "string" || s22 instanceof String;
}
var text_types = /* @__PURE__ */ new Set([
  "application/xml",
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data"
]);
function is_text(content_type) {
  if (!content_type)
    return true;
  const type = content_type.split(";")[0].toLowerCase();
  return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
}
async function render_endpoint(event, mod) {
  const method = normalize_request_method(event);
  let handler = mod[method];
  if (!handler && method === "head") {
    handler = mod.get;
  }
  if (!handler) {
    return;
  }
  const response = await handler(event);
  const preface = `Invalid response from route ${event.url.pathname}`;
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  if (response.fallthrough) {
    return;
  }
  const { status = 200, body = {} } = response;
  const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
  const type = headers.get("content-type");
  if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
    headers.set("content-type", "application/json; charset=utf-8");
    normalized_body = JSON.stringify(body);
  } else {
    normalized_body = body;
  }
  if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
    const cache_control = headers.get("cache-control");
    if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
      headers.set("etag", `"${hash(normalized_body)}"`);
    }
  }
  return new Response(method !== "head" ? normalized_body : void 0, {
    status,
    headers
  });
}
var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key2) {
            return walk(thing[key2]);
          });
      }
    }
  }
  walk(value);
  var names = /* @__PURE__ */ new Map();
  Array.from(counts).filter(function(entry4) {
    return entry4[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry4, i2) {
    names.set(entry4[0], getName(i2));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i2) {
          return i2 in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key2) {
          return safeKey(key2) + ":" + stringify(thing[key2]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i2) {
            statements_1.push(name + "[" + i2 + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a4) {
            var k = _a4[0], v = _a4[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key2) {
            statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars$1[num % chars$1.length] + name;
    num = ~~(num / chars$1.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped2[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
}
function safeProp(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i2 = 0; i2 < str.length; i2 += 1) {
    var char = str.charAt(i2);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped2) {
      result += escaped2[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i2];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop3() {
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop3) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop3) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop3;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
var render_json_payload_script_dict = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var render_json_payload_script_regex = new RegExp(`[${Object.keys(render_json_payload_script_dict).join("")}]`, "g");
function render_json_payload_script(attrs, payload) {
  const safe_payload = JSON.stringify(payload).replace(render_json_payload_script_regex, (match) => render_json_payload_script_dict[match]);
  let safe_attrs = "";
  for (const [key2, value] of Object.entries(attrs)) {
    if (value === void 0)
      continue;
    safe_attrs += ` sveltekit:data-${key2}=${escape_html_attr(value)}`;
  }
  return `<script type="application/json"${safe_attrs}>${safe_payload}<\/script>`;
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var s2 = JSON.stringify;
function create_prerendering_url_proxy(url) {
  return new Proxy(url, {
    get: (target, prop, receiver) => {
      if (prop === "search" || prop === "searchParams") {
        throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
var encoder = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array = encode(data);
  for (let i2 = 0; i2 < array.length; i2 += 16) {
    const w = array.subarray(i2, i2 + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w[i22];
      } else {
        a = w[i22 + 1 & 15];
        b = w[i22 + 14 & 15];
        tmp = w[i22 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i22 & 15] + w[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x2) {
    return (x2 - Math.floor(x2)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a = bytes[i2 + 0];
    const b = bytes[i2 + 1];
    const c = bytes[i2 + 2];
    const d = bytes[i2 + 3];
    bytes[i2 + 0] = d;
    bytes[i2 + 1] = c;
    bytes[i2 + 2] = b;
    bytes[i2 + 3] = a;
  }
}
function encode(str) {
  const encoded = encoder.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i2;
  for (i2 = 2; i2 < l; i2 += 3) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2 | bytes[i2] >> 6];
    result += chars[bytes[i2] & 63];
  }
  if (i2 === l + 1) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4];
    result += "==";
  }
  if (i2 === l) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var csp_ready;
var generate_nonce;
var generate_hash;
if (typeof crypto !== "undefined") {
  const array = new Uint8Array(16);
  generate_nonce = () => {
    crypto.getRandomValues(array);
    return base64(array);
  };
  generate_hash = sha256;
} else {
  const name = "crypto";
  csp_ready = import(name).then((crypto2) => {
    generate_nonce = () => {
      return crypto2.randomBytes(16).toString("base64");
    };
    generate_hash = (input) => {
      return crypto2.createHash("sha256").update(input, "utf-8").digest().toString("base64");
    };
  });
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var Csp = class {
  constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
    __privateAdd2(this, _use_hashes, void 0);
    __privateAdd2(this, _dev, void 0);
    __privateAdd2(this, _script_needs_csp, void 0);
    __privateAdd2(this, _style_needs_csp, void 0);
    __privateAdd2(this, _directives, void 0);
    __privateAdd2(this, _script_src, void 0);
    __privateAdd2(this, _style_src, void 0);
    __privateSet2(this, _use_hashes, mode === "hash" || mode === "auto" && prerender);
    __privateSet2(this, _directives, dev ? __spreadValues({}, directives) : directives);
    __privateSet2(this, _dev, dev);
    const d = __privateGet2(this, _directives);
    if (dev) {
      const effective_style_src2 = d["style-src"] || d["default-src"];
      if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
        d["style-src"] = [...effective_style_src2, "unsafe-inline"];
      }
    }
    __privateSet2(this, _script_src, []);
    __privateSet2(this, _style_src, []);
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    __privateSet2(this, _script_needs_csp, !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0);
    __privateSet2(this, _style_needs_csp, !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0);
    this.script_needs_nonce = __privateGet2(this, _script_needs_csp) && !__privateGet2(this, _use_hashes);
    this.style_needs_nonce = __privateGet2(this, _style_needs_csp) && !__privateGet2(this, _use_hashes);
    if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
      this.nonce = generate_nonce();
    }
  }
  add_script(content) {
    if (__privateGet2(this, _script_needs_csp)) {
      if (__privateGet2(this, _use_hashes)) {
        __privateGet2(this, _script_src).push(`sha256-${generate_hash(content)}`);
      } else if (__privateGet2(this, _script_src).length === 0) {
        __privateGet2(this, _script_src).push(`nonce-${this.nonce}`);
      }
    }
  }
  add_style(content) {
    if (__privateGet2(this, _style_needs_csp)) {
      if (__privateGet2(this, _use_hashes)) {
        __privateGet2(this, _style_src).push(`sha256-${generate_hash(content)}`);
      } else if (__privateGet2(this, _style_src).length === 0) {
        __privateGet2(this, _style_src).push(`nonce-${this.nonce}`);
      }
    }
  }
  get_header(is_meta = false) {
    const header = [];
    const directives = __spreadValues({}, __privateGet2(this, _directives));
    if (__privateGet2(this, _style_src).length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...__privateGet2(this, _style_src)
      ];
    }
    if (__privateGet2(this, _script_src).length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...__privateGet2(this, _script_src)
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = directives[key2];
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
  get_meta() {
    const content = escape_html_attr(this.get_header(true));
    return `<meta http-equiv="content-security-policy" content=${content}>`;
  }
};
_use_hashes = /* @__PURE__ */ new WeakMap();
_dev = /* @__PURE__ */ new WeakMap();
_script_needs_csp = /* @__PURE__ */ new WeakMap();
_style_needs_csp = /* @__PURE__ */ new WeakMap();
_directives = /* @__PURE__ */ new WeakMap();
_script_src = /* @__PURE__ */ new WeakMap();
_style_src = /* @__PURE__ */ new WeakMap();
var updated = __spreadProps(__spreadValues({}, readable(false)), {
  check: () => false
});
async function render_response({
  branch,
  options,
  state,
  $session,
  page_config,
  status,
  error: error2,
  url,
  params,
  resolve_opts,
  stuff
}) {
  if (state.prerender) {
    if (options.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options.template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %svelte.nonce%");
    }
  }
  const stylesheets = new Set(options.manifest._.entry.css);
  const modulepreloads = new Set(options.manifest._.entry.js);
  const styles = /* @__PURE__ */ new Map();
  const serialized_data = [];
  let shadow_props;
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options.get_stack(error2);
  }
  if (resolve_opts.ssr) {
    branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url2) => stylesheets.add(url2));
      if (node.js)
        node.js.forEach((url2) => modulepreloads.add(url2));
      if (node.styles)
        Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (props2)
        shadow_props = props2;
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session,
        updated
      },
      page: {
        url: state.prerender ? create_prerendering_url_proxy(url) : url,
        params,
        status,
        error: error2,
        stuff
      },
      components: branch.map(({ node }) => node.module.default)
    };
    const print_error = (property, replacement) => {
      Object.defineProperty(props.page, property, {
        get: () => {
          throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
        }
      });
    };
    print_error("origin", "origin");
    print_error("path", "pathname");
    print_error("query", "searchParams");
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      props[`props_${i2}`] = await branch[i2].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let { head, html: body } = rendered;
  const inlined_style = Array.from(styles.values()).join("\n");
  await csp_ready;
  const csp = new Csp(options.csp, {
    dev: options.dev,
    prerender: !!state.prerender,
    needs_nonce: options.template_contains_nonce
  });
  const target = hash(body);
  const init_app = `
		import { start } from ${s2(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-hydrate="${target}"]').parentNode,
			paths: ${s2(options.paths)},
			session: ${try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  })},
			route: ${!!page_config.router},
			spa: ${!resolve_opts.ssr},
			trailing_slash: ${s2(options.trailing_slash)},
			hydrate: ${resolve_opts.ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [
					${(branch || []).map(({ node }) => `import(${s2(options.prefix + node.entry)})`).join(",\n						")}
				],
				params: ${devalue(params)}
			}` : "null"}
		});
	`;
  const init_service_worker = `
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('${options.service_worker}');
		}
	`;
  if (options.amp) {
    const styles2 = `${inlined_style}
${rendered.css.code}`;
    head += `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>

		<style amp-custom>${styles2}</style>`;
    if (options.service_worker) {
      head += '<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"><\/script>';
      body += `<amp-install-serviceworker src="${options.service_worker}" layout="nodisplay"></amp-install-serviceworker>`;
    }
  } else {
    if (inlined_style) {
      const attributes = [];
      if (options.dev)
        attributes.push(" data-svelte");
      if (csp.style_needs_nonce)
        attributes.push(` nonce="${csp.nonce}"`);
      csp.add_style(inlined_style);
      head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
    }
    head += Array.from(stylesheets).map((dep) => {
      const attributes = [
        'rel="stylesheet"',
        `href="${options.prefix + dep}"`
      ];
      if (csp.style_needs_nonce) {
        attributes.push(`nonce="${csp.nonce}"`);
      }
      if (styles.has(dep)) {
        attributes.push("disabled", 'media="(max-width: 0)"');
      }
      return `
	<link ${attributes.join(" ")}>`;
    }).join("");
    if (page_config.router || page_config.hydrate) {
      head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
      const attributes = ['type="module"', `data-hydrate="${target}"`];
      csp.add_script(init_app);
      if (csp.script_needs_nonce) {
        attributes.push(`nonce="${csp.nonce}"`);
      }
      body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
      body += serialized_data.map(({ url: url2, body: body2, response }) => render_json_payload_script({ type: "data", url: url2, body: typeof body2 === "string" ? hash(body2) : void 0 }, response)).join("\n	");
      if (shadow_props) {
        body += render_json_payload_script({ type: "props" }, shadow_props);
      }
    }
    if (options.service_worker) {
      csp.add_script(init_service_worker);
      head += `
				<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
    }
  }
  if (state.prerender && !options.amp) {
    const http_equiv = [];
    const csp_headers = csp.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (maxage) {
      http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${maxage}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  }
  const segments = url.pathname.slice(options.paths.base.length).split("/").slice(2);
  const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
  const html = await resolve_opts.transformPage({
    html: options.template({ head, body, assets: assets2, nonce: csp.nonce })
  });
  const headers = new Headers({
    "content-type": "text/html",
    etag: `"${hash(html)}"`
  });
  if (maxage) {
    headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${maxage}`);
  }
  if (!options.floc) {
    headers.set("permissions-policy", "interest-cohort=()");
  }
  if (!state.prerender) {
    const csp_header = csp.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
  }
  return new Response(html, {
    status,
    headers
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize(__spreadProps(__spreadValues({}, error2), { name, message, stack }));
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var absolute = /^([a-z]+:)?\/?\//;
var scheme = /^[a-z]+:/;
function resolve(base2, path) {
  if (scheme.test(path))
    return path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function is_root_relative(path) {
  return path[0] === "/" && path[1] !== "/";
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && /\/[^./]+$/.test(path)) {
    return path + "/";
  }
  return path;
}
async function load_node({
  event,
  options,
  state,
  route,
  url,
  params,
  node,
  $session,
  stuff,
  is_error,
  is_leaf,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const shadow = is_leaf ? await load_shadow_data(route, event, options, !!state.prerender) : {};
  if (shadow.fallthrough)
    return;
  if (shadow.cookies) {
    set_cookie_headers.push(...shadow.cookies);
  }
  if (shadow.error) {
    loaded = {
      status: shadow.status,
      error: shadow.error
    };
  } else if (shadow.redirect) {
    loaded = {
      status: shadow.status,
      redirect: shadow.redirect
    };
  } else if (module2.load) {
    const load_input = {
      url: state.prerender ? create_prerendering_url_proxy(url) : url,
      params,
      props: shadow.body || {},
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let requested;
        if (typeof resource === "string") {
          requested = resource;
        } else {
          requested = resource.url;
          opts = __spreadValues({
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity
          }, opts);
        }
        opts.headers = new Headers(opts.headers);
        for (const [key2, value] of event.request.headers) {
          if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
            opts.headers.set(key2, value);
          }
        }
        const resolved = resolve(event.url.pathname, requested.split("?")[0]);
        let response;
        let dependency;
        const prefix = options.paths.assets || options.paths.base;
        const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = options.manifest.assets.has(filename);
        const is_asset_html = options.manifest.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (options.read) {
            const type = is_asset ? options.manifest._.mime[filename.slice(filename.lastIndexOf("."))] : "text/html";
            response = new Response(options.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else {
            response = await fetch(`${url.origin}/${file}`, opts);
          }
        } else if (is_root_relative(resolved)) {
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            const authorization = event.request.headers.get("authorization");
            if (cookie) {
              opts.headers.set("cookie", cookie);
            }
            if (authorization && !opts.headers.has("authorization")) {
              opts.headers.set("authorization", authorization);
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          response = await respond(new Request(new URL(requested, event.url).href, opts), options, {
            fetched: requested,
            initiator: route
          });
          if (state.prerender) {
            dependency = { response, body: null };
            state.prerender.dependencies.set(resolved, dependency);
          }
        } else {
          if (resolved.startsWith("//")) {
            requested = event.url.protocol + requested;
          }
          if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            if (cookie)
              opts.headers.set("cookie", cookie);
          }
          const external_request = new Request(requested, opts);
          response = await options.hooks.externalFetch.call(null, external_request);
        }
        const proxy = new Proxy(response, {
          get(response2, key2, _receiver) {
            async function text() {
              const body = await response2.text();
              const headers = {};
              for (const [key3, value] of response2.headers) {
                if (key3 === "set-cookie") {
                  set_cookie_headers = set_cookie_headers.concat(value);
                } else if (key3 !== "etag") {
                  headers[key3] = value;
                }
              }
              if (!opts.body || typeof opts.body === "string") {
                const status_number = Number(response2.status);
                if (isNaN(status_number)) {
                  throw new Error(`response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`);
                }
                fetched.push({
                  url: requested,
                  body: opts.body,
                  response: {
                    status: status_number,
                    statusText: response2.statusText,
                    headers,
                    body
                  }
                });
              }
              if (dependency) {
                dependency.body = body;
              }
              return body;
            }
            if (key2 === "arrayBuffer") {
              return async () => {
                const buffer = await response2.arrayBuffer();
                if (dependency) {
                  dependency.body = new Uint8Array(buffer);
                }
                return buffer;
              };
            }
            if (key2 === "text") {
              return text;
            }
            if (key2 === "json") {
              return async () => {
                return JSON.parse(await text());
              };
            }
            return Reflect.get(response2, key2, response2);
          }
        });
        return proxy;
      },
      stuff: __spreadValues({}, stuff)
    };
    if (options.dev) {
      Object.defineProperty(load_input, "page", {
        get: () => {
          throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
        }
      });
    }
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
    if (!loaded) {
      throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
    }
  } else if (shadow.body) {
    loaded = {
      props: shadow.body
    };
  } else {
    loaded = {};
  }
  if (loaded.fallthrough && !is_error) {
    return;
  }
  if (shadow.body && state.prerender) {
    const pathname = `${event.url.pathname.replace(/\/$/, "")}/__data.json`;
    const dependency = {
      response: new Response(void 0),
      body: JSON.stringify(shadow.body)
    };
    state.prerender.dependencies.set(pathname, dependency);
  }
  return {
    node,
    props: shadow.body,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
async function load_shadow_data(route, event, options, prerender) {
  if (!route.shadow)
    return {};
  try {
    const mod = await route.shadow();
    if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
      throw new Error("Cannot prerender pages that have endpoints with mutative methods");
    }
    const method = normalize_request_method(event);
    const is_get = method === "head" || method === "get";
    const handler = method === "head" ? mod.head || mod.get : mod[method];
    if (!handler && !is_get) {
      return {
        status: 405,
        error: new Error(`${method} method not allowed`)
      };
    }
    const data = {
      status: 200,
      cookies: [],
      body: {}
    };
    if (!is_get) {
      const result = await handler(event);
      if (result.fallthrough)
        return result;
      const { status, headers, body } = validate_shadow_output(result);
      data.status = status;
      add_cookies(data.cookies, headers);
      if (status >= 300 && status < 400) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = body;
    }
    const get = method === "head" && mod.head || mod.get;
    if (get) {
      const result = await get(event);
      if (result.fallthrough)
        return result;
      const { status, headers, body } = validate_shadow_output(result);
      add_cookies(data.cookies, headers);
      data.status = status;
      if (status >= 400) {
        data.error = new Error("Failed to load data");
        return data;
      }
      if (status >= 300) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = __spreadValues(__spreadValues({}, body), data.body);
    }
    return data;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    return {
      status: 500,
      error: error2
    };
  }
}
function add_cookies(target, headers) {
  const cookies = headers["set-cookie"];
  if (cookies) {
    if (Array.isArray(cookies)) {
      target.push(...cookies);
    } else {
      target.push(cookies);
    }
  }
}
function validate_shadow_output(result) {
  const { status = 200, body = {} } = result;
  let headers = result.headers || {};
  if (headers instanceof Headers) {
    if (headers.has("set-cookie")) {
      throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers");
    }
  } else {
    headers = lowercase_keys(headers);
  }
  if (!is_pojo(body)) {
    throw new Error("Body returned from endpoint request handler must be a plain object");
  }
  return { status, headers, body };
}
async function respond_with_error({
  event,
  options,
  state,
  $session,
  status,
  error: error2,
  resolve_opts
}) {
  try {
    const default_layout = await options.manifest._.nodes[0]();
    const default_error = await options.manifest._.nodes[1]();
    const params = {};
    const layout_loaded = await load_node({
      event,
      options,
      state,
      route: null,
      url: event.url,
      params,
      node: default_layout,
      $session,
      stuff: {},
      is_error: false,
      is_leaf: false
    });
    const error_loaded = await load_node({
      event,
      options,
      state,
      route: null,
      url: event.url,
      params,
      node: default_error,
      $session,
      stuff: layout_loaded ? layout_loaded.stuff : {},
      is_error: true,
      is_leaf: false,
      status,
      error: error2
    });
    return await render_response({
      options,
      state,
      $session,
      page_config: {
        hydrate: options.hydrate,
        router: options.router
      },
      stuff: error_loaded.stuff,
      status,
      error: error2,
      branch: [layout_loaded, error_loaded],
      url: event.url,
      params,
      resolve_opts
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return new Response(error3.stack, {
      status: 500
    });
  }
}
async function respond$1(opts) {
  const { event, options, state, $session, route, resolve_opts } = opts;
  let nodes;
  if (!resolve_opts.ssr) {
    return await render_response(__spreadProps(__spreadValues({}, opts), {
      branch: [],
      page_config: {
        hydrate: true,
        router: true
      },
      status: 200,
      url: event.url,
      stuff: {}
    }));
  }
  try {
    nodes = await Promise.all(route.a.map((n) => options.manifest._.nodes[n] && options.manifest._.nodes[n]()));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return await respond_with_error({
      event,
      options,
      state,
      $session,
      status: 500,
      error: error3,
      resolve_opts
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return new Response(void 0, {
      status: 204
    });
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  let stuff = {};
  ssr:
    if (resolve_opts.ssr) {
      for (let i2 = 0; i2 < nodes.length; i2 += 1) {
        const node = nodes[i2];
        let loaded;
        if (node) {
          try {
            loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
              url: event.url,
              node,
              stuff,
              is_error: false,
              is_leaf: i2 === nodes.length - 1
            }));
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies(new Response(void 0, {
                status: loaded.loaded.status,
                headers: {
                  location: loaded.loaded.redirect
                }
              }), set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e2 = coalesce_to_error(err);
            options.handle_error(e2, event);
            status = 500;
            error2 = e2;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i2--) {
              if (route.b[i2]) {
                const error_node = await options.manifest._.nodes[route.b[i2]]();
                let node_loaded;
                let j = i2;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node(__spreadProps(__spreadValues({}, opts), {
                    url: event.url,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    is_error: true,
                    is_leaf: false,
                    status,
                    error: error2
                  }));
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  stuff = __spreadValues(__spreadValues({}, node_loaded.stuff), error_loaded.stuff);
                  break ssr;
                } catch (err) {
                  const e2 = coalesce_to_error(err);
                  options.handle_error(e2, event);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              event,
              options,
              state,
              $session,
              status,
              error: error2,
              resolve_opts
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = __spreadValues(__spreadValues({}, stuff), loaded.loaded.stuff);
        }
      }
    }
  try {
    return with_cookies(await render_response(__spreadProps(__spreadValues({}, opts), {
      stuff,
      url: event.url,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    })), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return with_cookies(await respond_with_error(__spreadProps(__spreadValues({}, opts), {
      status: 500,
      error: error3
    })), set_cookie_headers);
  }
}
function get_page_config(leaf, options) {
  if ("ssr" in leaf) {
    throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
  }
  return {
    router: "router" in leaf ? !!leaf.router : options.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    set_cookie_headers.forEach((value) => {
      response.headers.append("set-cookie", value);
    });
  }
  return response;
}
async function render_page(event, route, options, state, resolve_opts) {
  if (state.initiator === route) {
    return new Response(`Not found: ${event.url.pathname}`, {
      status: 404
    });
  }
  if (route.shadow) {
    const type = negotiate(event.request.headers.get("accept") || "text/html", [
      "text/html",
      "application/json"
    ]);
    if (type === "application/json") {
      return render_endpoint(event, await route.shadow());
    }
  }
  const $session = await options.hooks.getSession(event);
  const response = await respond$1({
    event,
    options,
    state,
    $session,
    resolve_opts,
    route,
    params: event.params
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return new Response(`Bad request in load function: failed to fetch ${state.fetched}`, {
      status: 500
    });
  }
}
function negotiate(accept, types2) {
  const parts = accept.split(",").map((str, i2) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      return { type, subtype, q: +q, i: i2 };
    }
    throw new Error(`Invalid Accept header: ${accept}`);
  }).sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types2) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
var DATA_SUFFIX = "/__data.json";
var default_transform = ({ html }) => html;
async function respond(request, options, state = {}) {
  var _a4;
  const url = new URL(request.url);
  const normalized = normalize_path(url.pathname, options.trailing_slash);
  if (normalized !== url.pathname) {
    return new Response(void 0, {
      status: 301,
      headers: {
        location: normalized + (url.search === "?" ? "" : url.search)
      }
    });
  }
  const { parameter, allowed } = options.method_override;
  const method_override = (_a4 = url.searchParams.get(parameter)) == null ? void 0 : _a4.toUpperCase();
  if (method_override) {
    if (request.method === "POST") {
      if (allowed.includes(method_override)) {
        request = new Proxy(request, {
          get: (target, property, _receiver) => {
            if (property === "method")
              return method_override;
            return Reflect.get(target, property, target);
          }
        });
      } else {
        const verb = allowed.length === 0 ? "enabled" : "allowed";
        const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
        return new Response(body, {
          status: 400
        });
      }
    } else {
      throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
    }
  }
  const event = {
    request,
    url,
    params: {},
    locals: {},
    platform: state.platform
  };
  const removed = (property, replacement, suffix = "") => ({
    get: () => {
      throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
    }
  });
  const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
  const body_getter = {
    get: () => {
      throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
    }
  };
  Object.defineProperties(event, {
    method: removed("method", "request.method", details),
    headers: removed("headers", "request.headers", details),
    origin: removed("origin", "url.origin"),
    path: removed("path", "url.pathname"),
    query: removed("query", "url.searchParams"),
    body: body_getter,
    rawBody: body_getter
  });
  let resolve_opts = {
    ssr: true,
    transformPage: default_transform
  };
  try {
    const response = await options.hooks.handle({
      event,
      resolve: async (event2, opts) => {
        if (opts) {
          resolve_opts = {
            ssr: opts.ssr !== false,
            transformPage: opts.transformPage || default_transform
          };
        }
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            url: event2.url,
            params: event2.params,
            options,
            state,
            $session: await options.hooks.getSession(event2),
            page_config: { router: true, hydrate: true },
            stuff: {},
            status: 200,
            branch: [],
            resolve_opts: __spreadProps(__spreadValues({}, resolve_opts), {
              ssr: false
            })
          });
        }
        let decoded = decodeURI(event2.url.pathname);
        if (options.paths.base) {
          if (!decoded.startsWith(options.paths.base)) {
            return new Response(void 0, { status: 404 });
          }
          decoded = decoded.slice(options.paths.base.length) || "/";
        }
        const is_data_request = decoded.endsWith(DATA_SUFFIX);
        if (is_data_request) {
          decoded = decoded.slice(0, -DATA_SUFFIX.length) || "/";
          const normalized2 = normalize_path(url.pathname.slice(0, -DATA_SUFFIX.length), options.trailing_slash);
          event2.url = new URL(event2.url.origin + normalized2 + event2.url.search);
        }
        for (const route of options.manifest._.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          event2.params = route.params ? decode_params(route.params(match)) : {};
          let response2;
          if (is_data_request && route.type === "page" && route.shadow) {
            response2 = await render_endpoint(event2, await route.shadow());
            if (request.headers.get("x-sveltekit-load") === "true") {
              if (response2) {
                if (response2.status >= 300 && response2.status < 400) {
                  const location = response2.headers.get("location");
                  if (location) {
                    const headers = new Headers(response2.headers);
                    headers.set("x-sveltekit-location", location);
                    response2 = new Response(void 0, {
                      status: 204,
                      headers
                    });
                  }
                }
              } else {
                response2 = new Response("{}", {
                  headers: {
                    "content-type": "application/json"
                  }
                });
              }
            }
          } else {
            response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, resolve_opts);
          }
          if (response2) {
            if (response2.status === 200 && response2.headers.has("etag")) {
              let if_none_match_value = request.headers.get("if-none-match");
              if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                if_none_match_value = if_none_match_value.substring(2);
              }
              const etag = response2.headers.get("etag");
              if (if_none_match_value === etag) {
                const headers = new Headers({ etag });
                for (const key2 of [
                  "cache-control",
                  "content-location",
                  "date",
                  "expires",
                  "vary"
                ]) {
                  const value = response2.headers.get(key2);
                  if (value)
                    headers.set(key2, value);
                }
                return new Response(void 0, {
                  status: 304,
                  headers
                });
              }
            }
            return response2;
          }
        }
        if (!state.initiator) {
          const $session = await options.hooks.getSession(event2);
          return await respond_with_error({
            event: event2,
            options,
            state,
            $session,
            status: 404,
            error: new Error(`Not found: ${event2.url.pathname}`),
            resolve_opts
          });
        }
        return await fetch(request);
      },
      get request() {
        throw new Error("request in handle has been replaced with event" + details);
      }
    });
    if (response && !(response instanceof Response)) {
      throw new Error("handle must return a Response object" + details);
    }
    return response;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    try {
      const $session = await options.hooks.getSession(event);
      return await respond_with_error({
        event,
        options,
        state,
        $session,
        status: 500,
        error: error2,
        resolve_opts
      });
    } catch (e22) {
      const error3 = coalesce_to_error(e22);
      return new Response(options.dev ? error3.stack : error3.message, {
        status: 500
      });
    }
  }
}
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body, assets: assets2, nonce }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<meta name="description" content="" />\n		<link rel="icon" href="' + assets2 + `/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel='manifest' href='manifest.webmanifest'>
		` + head + "\n	</head>\n	<body>\n		" + body + "\n	</body>\n</html>\n";
var read = null;
set_paths({ "base": "", "assets": "" });
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var Server = class {
  constructor(manifest2) {
    const hooks = get_hooks(user_hooks);
    this.options = {
      amp: false,
      csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
      dev: false,
      floc: false,
      get_stack: (error2) => String(error2),
      handle_error: (error2, event) => {
        hooks.handleError({
          error: error2,
          event,
          get request() {
            throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
          }
        });
        error2.stack = this.options.get_stack(error2);
      },
      hooks,
      hydrate: true,
      manifest: manifest2,
      method_override: { "parameter": "_method", "allowed": [] },
      paths: { base, assets },
      prefix: assets + "/_app/",
      prerender: true,
      read,
      root: Root,
      service_worker: base + "/service-worker.js",
      router: true,
      template,
      template_contains_nonce: false,
      trailing_slash: "never"
    };
  }
  respond(request, options = {}) {
    if (!(request instanceof Request)) {
      throw new Error("The first argument to app.render must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
    }
    return respond(request, this.options, options);
  }
};

// .svelte-kit/vercel-tmp/manifest.js
var manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["favicon.png", "icon-192x192.png", "icon-256x256.png", "icon-384x384.png", "icon-512x512.png", "manifest.webmanifest", "primes.txt", "service-worker.js"]),
  _: {
    mime: { ".png": "image/png", ".webmanifest": "application/manifest+json", ".txt": "text/plain" },
    entry: { "file": "start-ebb36e3d.js", "js": ["start-ebb36e3d.js", "chunks/vendor-ec4cd4ef.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => (init__(), __exports)),
      () => Promise.resolve().then(() => (init__2(), __exports2)),
      () => Promise.resolve().then(() => (init__3(), __exports3))
    ],
    routes: [
      {
        type: "page",
        pattern: /^\/$/,
        params: null,
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      }
    ]
  }
};

// .svelte-kit/vercel-tmp/entry.js
var server = new Server(manifest);
var entry_default = async (req, res) => {
  let request;
  try {
    request = await getRequest(`https://${req.headers.host}`, req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  setResponse(res, await server.respond(request));
};
module.exports = __toCommonJS(entry_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
