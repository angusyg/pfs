 /**
  * @ngdoc factory
  * @name base64
  * @memberof frontend.core.services
  * @description Service to encode and decode base 64 string
  */
 (function() {
   'use strict';

   angular
     .module('frontend.core.services')
     .factory('base64', Base64Service);

   Base64Service.$inject = [];

   function Base64Service() {
     const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
     let lookup = null;
     let ie = /MSIE /.test(navigator.userAgent);
     let ieo = /MSIE [67]/.test(navigator.userAgent);

     return {
       encodeBase64: encodeBase64,
       decodeBase64: decodeBase64,
       urlEncodeBase64: urlEncodeBase64,
       urlDecodeBase64: urlDecodeBase64,
     };

     /**
      * Decodes base64 encoded string
      * @memberof base64
      * @param {string} toDecode - string to decode
      * @returns {string} decoded string
      */
     function decodeBase64(toDecode) {
       toDecode = toDecode.replace(/\s/g, '');
       if (toDecode.length % 4) throw new Error('InvalidLengthError: decode failed: The string to be decoded is not the correct length for a base64 encoded string.');
       if (/[^A-Za-z0-9+\/=\s]/g.test(toDecode)) throw new Error('InvalidCharacterError: decode failed: The string contains characters invalid in a base64 encoded string.');

       let buffer = fromUtf8(toDecode);
       let position = 0;
       let result;
       let len = buffer.length;
       if (ieo) {
         result = [];
         while (position < len) {
           if (buffer[position] < 128) result.push(String.fromCharCode(buffer[position++]));
           else if (buffer[position] > 191 && buffer[position] < 224) result.push(String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63)));
           else result.push(String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63)));
         }
         return result.join('');
       } else {
         result = '';
         while (position < len) {
           if (buffer[position] < 128) result += String.fromCharCode(buffer[position++]);
           else if (buffer[position] > 191 && buffer[position] < 224) result += String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63));
           else result += String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63));
         }
         return result;
       }
     }

     /**
      * Encodes string to base64 string
      * @memberof base64
      * @param {string} toEncode - string to encode
      * @returns {string} base64 encoded string
      */
     function encodeBase64(toEncode) {
       let buffer = toUtf8(toEncode);
       let position = -1;
       let result;
       let len = buffer.length;
       let nan0, nan1, nan2, enc = [, , , ];
       if (ie) {
         result = [];
         while (++position < len) {
           nan0 = buffer[position];
           nan1 = buffer[++position];
           enc[0] = nan0 >> 2;
           enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
           if (isNaN(nan1))
             enc[2] = enc[3] = 64;
           else {
             nan2 = buffer[++position];
             enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
             enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
           }
           result.push(alphabet.charAt(enc[0]), alphabet.charAt(enc[1]), alphabet.charAt(enc[2]), alphabet.charAt(enc[3]));
         }
         return result.join('');
       } else {
         result = '';
         while (++position < len) {
           nan0 = buffer[position];
           nan1 = buffer[++position];
           enc[0] = nan0 >> 2;
           enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
           if (isNaN(nan1))
             enc[2] = enc[3] = 64;
           else {
             nan2 = buffer[++position];
             enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
             enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
           }
           result += alphabet[enc[0]] + alphabet[enc[1]] + alphabet[enc[2]] + alphabet[enc[3]];
         }
         return result;
       }
     }

     /**
      * Converts UTF-8 string to buffer
      * @param {string} s - UTF-8 string
      * @returns {string} buffer from UTF-8 string
      */
     function fromUtf8(s) {
       let position = -1;
       let len, buffer = [];
       let enc = [, , , ];
       if (!lookup) {
         len = alphabet.length;
         lookup = {};
         while (++position < len) lookup[alphabet.charAt(position)] = position;
         position = -1;
       }
       len = s.length;
       while (++position < len) {
         enc[0] = lookup[s.charAt(position)];
         enc[1] = lookup[s.charAt(++position)];
         buffer.push((enc[0] << 2) | (enc[1] >> 4));
         enc[2] = lookup[s.charAt(++position)];
         if (enc[2] === 64) break;
         buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2));
         enc[3] = lookup[s.charAt(++position)];
         if (enc[3] === 64) break;
         buffer.push(((enc[2] & 3) << 6) | enc[3]);
       }
       return buffer;
     }

     /**
      * Converts string to UTF-8
      * @param {string} s - string to convert
      * @returns {string} string converted to UTF-8 string
      */
     function toUtf8(s) {
       let position = -1;
       let len = s.length;
       let chr, buffer = [];
       if (/^[\x00-\x7f]*$/.test(s))
         while (++position < len) buffer.push(s.charCodeAt(position));
       else
         while (++position < len) {
           chr = s.charCodeAt(position);
           if (chr < 128) buffer.push(chr);
           else if (chr < 2048) buffer.push((chr >> 6) | 192, (chr & 63) | 128);
           else buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128);
         }
       return buffer;
     }

     /**
      * Decodes url compatible base64 string
      * @memberof base64
      * @param {string} toDecode - string to decode
      * @returns {string} decode string
      */
     function urlDecodeBase64(toDecode) {
       let input = toDecode;
       input = input
         .replace(/-/g, '+')
         .replace(/_/g, '/');
       let pad = input.length % 4;
       if (pad) {
         if (pad === 1) {
           throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
         }
         input += new Array(5 - pad).join('=');
       }
       return decodeBase64(input);
     }

     /**
      * Encodes string to url compatible base64 string
      * @memberof base64
      * @param {string} toEncode - string to encode
      * @returns {string} url compatible base64 encoded string
      */
     function urlEncodeBase64(toEncode) {
       let output = encodeBase64(toEncode);
       return output
         .replace(/\+/g, '-')
         .replace(/\//g, '_')
         .split('=', 1)[0];
     }
   }
 })();
