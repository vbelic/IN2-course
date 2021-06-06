import * as _ from "lodash";

export class AppUtils {
    /**
     * Validates if input value is object
     * @param obj input value
     */
    public static IsObject(obj: any) {
        return obj === Object(obj);
    }

    /**
     * Validates if input value is string
     * @param s input value
     */
    public static IsString(s: any) {
        return typeof (s) === 'string' || s instanceof String;
    }

    /**
     * Validates if input value is primitive type
     * @param arg input value
     */
    public static IsPrimitive(arg: any) {
        const type = typeof arg;

        return arg == null || (type !== "object" && type !== "function");
    }

    /**
     * Validates if input value is array
     * @param arr input value
     */
    public static IsArray(arr: any) {
        return Array.isArray ? Array.isArray(arr) : arr instanceof Array;
    }

    /**
     * Validates if input value is numeric (number or string)
     * @param input value
     */
    public static IsNumeric(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Validates if input value is function
     * @param f input value
     */
    public static IsFunction(f: any): boolean {
        return typeof (f) === 'function';
    }

    /**
     * Checks if string is null or empty
     * @param value string to check
     */
    public static isStringNullOrEmpty(value: string): boolean {
        if (!value || value === "") {
            return true;
        }

        return false;
    }

    /**
     * Checks if string is null or empty or whitespace
     * @param value string to check
     */
    public static isStringNullOrWhitespace(value: string): boolean {
        if (!value || value === "" || value.trim() === "") {
            return true;
        }

        return false;
    }

    /**
     * Serializes date to ISO format without zone
     * @param date input value
     */
    public static SerializeDate(date: Date): string {
        const builder = [1 + date.getMonth(), '/', date.getDate(), '/', date.getFullYear()],
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds(),
            f = date.getMilliseconds();

        if (h + m + s + f > 0) {
            builder.push(' ', this.ZeroPad(h, 2), ':', this.ZeroPad(m, 2), ':', this.ZeroPad(s, 2), '.', this.ZeroPad(f, 3));
        }

        return builder.join('');
    }

    /**
     * Ads leading zeros if needed
     * @param value input value
     * @param len output string length
     */
    public static ZeroPad(value: number, len: number): string {
        let text = String(value);

        while (text.length < len) {
            text = '0' + text;
        }

        return text;
    }

    /**
     * Copy the values of all enumerable properties from one or more source
     * objects to a target object. It will return the target object.
     * @param target Target object
     * @param source Source objects
     */
    public static Clone<TObject extends object>(target: TObject, ...sources: any[]): TObject {
        return Object.assign(target, ...sources);
    }

    /**
     * Deep copy the values of all enumerable properties from input
     * objects to a target object. It will return the target object.
     * @param value Target object
     */
    public static DeepClone<TObject extends object>(value: TObject): TObject {
        return _.cloneDeep(value);
    }

    /** Search max value of numeric array, or array of objects
     * @param arr Source array
     * @param fieldName field in object on which comparison is made or null if simple array
     */
    public static arrayMax<TModel>(arr: Array<TModel>, fieldName: string = null): TModel {
        if (!arr || arr.length === 0) { return null; }
        if (fieldName === null) {
            return arr.reduce((prev, curr) => {
                return (prev > curr ? prev : curr);
            });
        } else {
            return arr.reduce((prev, curr) => {
                return (prev[fieldName] > curr[fieldName] ? prev : curr);
            });
        }
    }

    /**
      Search min value of numeric array, or array of objects
     * @param arr Source array
     * @param fieldName field in object on which comparison is made or null if simple array
     */
    public static arrayMin<TModel>(arr: Array<TModel>, fieldName: string = null): TModel {
        if (!arr || arr.length === 0) { return null; }
        if (fieldName === null) {
            return arr.reduce((prev, curr) => {
                return (prev < curr ? prev : curr);
            });
        } else {
            return arr.reduce((prev, curr) => {
                return (prev[fieldName] < curr[fieldName] ? prev : curr);
            });
        }
    }

    /**
      Sorts numeric array, or array of objects
     * @param arr Source array
     * @param fieldName field in object on which comparison is made or null if simple array
     * @param desc descending
     */
    public static arraySort<TModel>(arr: Array<TModel>, fieldName: string = null, desc = false): Array<TModel> {
        if (fieldName === null) {
            return arr.sort((a, b) => {
                return a < b ? (desc ? 1 : -1) : a === b ? 0 : (desc ? -1 : 1);
            });
        } else {
            return arr.sort((a, b) => {
                return a[fieldName] < b[fieldName] ? (desc ? 1 : -1) : a[fieldName] === b[fieldName] ? 0 : (desc ? -1 : 1);
            });
        }
    }

    /**
      Copies input object, if input is primitive returns src
     * @param src Source object
     */
    public static copyObject<TObject extends object>(src: TObject): TObject {
        if (this.IsPrimitive(src)) { return src; }
        const dest = {} as TObject;
        Object.keys(src).forEach(o => {
            dest[o] = src[o];
        });
        return dest;
    }

    /**
      Deep copies input object (all child objects are copied), if input is primitive returns src
     * @param src Source object
     */
    public static deepCopyObject<TObject extends object>(src: TObject): TObject {
        if (this.IsPrimitive(src)) { return src; }
        const dest = {} as TObject;
        Object.keys(src).forEach(o => {
            if (this.IsArray(src[o])) {
                dest[o] = this.deepCopyArray(src[o]);
            } else if (src[o] instanceof Date) {
                dest[o] = this.copyDate(src[o]);
            } else {
                dest[o] = this.deepCopyObject(src[o]);
            }
        });
        return dest;
    }

    /**
      Copies input array, if input is not array returns src
     * @param src Source object
     */
    public static copyArray<TObject extends object>(src: Array<TObject>): Array<TObject> {
        if (!this.IsArray(src)) { return src; }
        const dest = new Array<TObject>();
        src.forEach(x => {
            dest.push(this.copyObject(x));
        });
        return dest;
    }

    /**
      Deep copies input array (all child objects are copied), if input is not array returns src
     * @param src Source object
     */
    public static deepCopyArray<TObject extends object>(src: Array<TObject>): Array<TObject> {
        if (!this.IsArray(src)) { return src as Array<TObject>; }
        const dest = new Array<TObject | Array<TObject>>();
        src.forEach(x => {
            if (AppUtils.IsArray(x)) {
                dest.push(this.deepCopyArray(<Array<any>>x));
            } else {
                dest.push(this.deepCopyObject(x));
            }
        });
        return dest as Array<TObject>;
    }

    /**
      Merges all common field values of two objects and returns desination object
     * @param src Source object
     * @param dst Destination object
     */
    public static mergeObjectValues<SObject extends object, DObject extends object>(src: SObject, dst: DObject): DObject {
        if (this.IsPrimitive(src)) { return dst; }
        Object.keys(src).forEach(o => {
            if (dst[o] !== undefined) {
                dst[o] = src[o];
            }
        });
        return dst;
    }

    /**
      Deep merges all common field values of two objects and returns desination object
     * @param src Source object
     * @param dst Destination object
     */
    public static deepMergeObjectValues<SObject extends object, DObject extends object>(src: SObject, dst: DObject): DObject {
        if (this.IsPrimitive(src)) { return dst; }

        Object.keys(src).forEach(o => {
            if (dst !== null && dst[o] !== undefined) {
                if (this.IsPrimitive(src[o])) {
                    dst[o] = src[o];
                } else {
                    dst[o] = this.deepMergeObjectValues(src[o], dst[o]);
                }
            }
        });

        return dst;
    }

    /**
     * Merges fields of two objects, returns dst
     * @param src Source object
     * @param dst Destination object
     */
    public static mergeObjects<SObject extends object, DObject extends object>(src: SObject, dst: DObject): DObject {
        if (this.IsPrimitive(src)) { return dst; }
        Object.keys(src).forEach(o => {
            dst[o] = src[o];
        });
        return dst;
    }

    /**
      Detects difference beetwen values in object
     * @param obj1 first object
     * @param obj2 second object
     */
    public static areObjectsEqual<SObject extends object, DObject extends object>(obj1: SObject, obj2: DObject, maxDecimals = 4): boolean {
        if (this.IsPrimitive(obj1)) { return (obj2 as any) === (obj1 as any); }
        const keys = Object.keys(obj1);
        for (let i = 0; i < keys.length; i++) {
            const o = keys[i];
            // do not compare guids
            if (o !== 'guid') {
                if (obj2 === null || obj2[o] === undefined) { return false; }
                if (this.IsPrimitive(obj1[o])) {
                    // compare numerics to 4 decimale
                    if (this.IsNumeric(obj1[o])) {
                        const s = this.roundNumber(obj1[o], maxDecimals);
                        if (this.IsNumeric(obj2[o])) {
                            const d = this.roundNumber(obj2[o], maxDecimals);
                            if (s !== d) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        if (obj2[o] !== obj1[o]) {
                            return false;
                        }
                    }
                } else {
                    if (this.areObjectsEqual(obj1[o], obj2[o]) === false) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
      Returns numerical representation of string
     * @param input Source string
     */
    public static getStringHashCode(input: string): number {
        let hash = 0;
        let chr = 0;
        if (input.length === 0) return hash;
        for (let i = 0; i < input.length; i++) {
            chr = input.charCodeAt(i);
            // tslint:disable-next-line:no-bitwise
            hash = ((hash << 5) - hash) + chr;
            // tslint:disable-next-line:no-bitwise
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    /**
      Returns numeric representation of object
     * @param obj object
     */
    public static getObjectHashCode<SObject extends object>(
        obj: SObject, excludeFields: Array<string> = ['guid'], maxDecimals = 4
    ): number {
        let ret = 0;
        if (this.IsPrimitive(obj)) {
            return this.getStringHashCode(obj + '');
        }
        if (obj instanceof Date) {
            return this.getStringHashCode((obj as Date).toString());
        }
        if (this.IsArray(obj)) {
            (obj as Array<any>).forEach(x => {
                ret += this.getObjectHashCode(x, excludeFields);
            });
            return ret;
        }
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const o = keys[i];
            // do not calculate guids
            if (!excludeFields.includes(o)) {
                if (this.IsPrimitive(obj[o])) {
                    if (this.IsNumeric(obj[o])) {
                        const s = this.roundNumber(obj[o], maxDecimals);
                        ret += this.getStringHashCode(o + '') + this.getStringHashCode(s + '');
                    } else {
                        ret += this.getStringHashCode(o + '') + this.getStringHashCode(obj[o] + '');
                    }
                } else if (obj instanceof Date) {
                    ret += this.getStringHashCode(o + '') + this.getStringHashCode((obj as Date).toString());
                } else {
                    ret += this.getObjectHashCode(obj[o], excludeFields);
                }
            }
        }

        return ret;
    }

    /**
     * Deeps scan object and sets specified property to specified value
     * @param obj Object to scan
     * @param propertName property name
     * @param value new value
     */
    public static deepSetObjectProperty<T extends object>(obj: T, propertyName: string, value: any): void {
        if (!obj) {
            return;
        }

        Object.keys(obj).forEach(key => {
            const o = obj[key];

            if (o) {
                if (AppUtils.IsArray(o)) {
                    (o as Array<any>).forEach(el => {
                        this.deepSetObjectProperty(el, propertyName, value);
                    });
                } else {
                    if (Object.prototype.hasOwnProperty.call(o, propertyName)) {
                        o[propertyName] = value;
                    } else if (!AppUtils.IsPrimitive(o) && !AppUtils.IsFunction(o)) {
                        this.deepSetObjectProperty(o, propertyName, value);
                    } else if (key === propertyName) {
                        obj[key] = value;
                    }
                }
            }
        });
    }

    /**
      Copies date object, returns new date
     * @param input Source date or string in date format
     */
    public static copyDate = (input: string | Date): Date => {
        let tmp: Date = <Date>input;
        if (!input) {
            return null;
        }
        if (!(input instanceof Date)) {
            tmp = new Date(input);
        }
        const hours = tmp.getHours();
        const minutes = tmp.getMinutes();
        const miliseconds = tmp.getMilliseconds();
        const seconds = tmp.getSeconds();
        const year = tmp.getFullYear();
        const month = tmp.getMonth();
        const day = tmp.getDate();
        return new Date(year, month, day, hours, minutes, seconds, miliseconds);
    }

    /**
      Always returns date, except input is null or undefined, then returns null
     * @param input Source date or string in date format
     */
    public static getDate = (input: string | Date): Date => {
        if (!input) {
            return null;
        }
        if (!(input instanceof Date)) {
            return new Date(input);
        }
        return input;
    }

    /**
      Always returns date, except input is null or undefined, then returns null
     * @param input Source date or string in date format
     */
    public static getDateWithTimeSetToZero = (input: string | Date): Date => {
        if (!input) {
            return null;
        }
        if (!(input instanceof Date)) {
            input = new Date(input);
        }
        return new Date(input.getFullYear(), input.getMonth(), input.getDate(), 0, 0, 0, 0);
    }

    /**
      Rounds a number to specific decimal places, if input is null or undefined returns 0
     * @param input - number
     * @param decimalPlaces - decimal places
     * @param return0 - if TRUE and input is null or undefined returns 0 else returns input
     */
    public static roundNumber = (input: number, decimalPlaces: number = 0, return0: boolean = false): number => {
        if (!input) { return return0 ? 0 : input; }
        if (!decimalPlaces) { decimalPlaces = 0; }
        const tmp = Math.pow(10, decimalPlaces);
        return Math.round(input * tmp) / tmp;
    }

    /**
      Create unique ID - integer only - from current timestamp with some randomization
     * @param length - wanted length of ID, default is 15
     */
    public static uniqueIdGenerator = (length: number = 15): number => {
        const _getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const timestamp = +new Date();
        const ts = timestamp.toString();
        const parts = ts.split('').reverse();
        let id = '';

        for (let i = 0; i < length; ++i) {
            const index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return parseInt(id);
    }

    /**
      Create unique fake GUID (in correct format) from random numbers
     */
    public static guid = () => {
        // tslint:disable-next-line:no-bitwise
        return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
            // tslint:disable-next-line:no-bitwise
            (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" +
            // tslint:disable-next-line:no-bitwise
            (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-4" +
            // tslint:disable-next-line:no-bitwise
            (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).substr(0, 3) + "-" +
            // tslint:disable-next-line:no-bitwise
            (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + "-" +
            // tslint:disable-next-line:no-bitwise
            (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
            // tslint:disable-next-line:no-bitwise
            (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
            // tslint:disable-next-line:no-bitwise
            (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)).toLowerCase();
    }

    /**
      Set JSON parser to parse dates to string without region 'Z'
     */
    public static setDateJsonToUTC<TObject extends object>(src: TObject) {
        if (this.IsPrimitive(src)) { return; }
        if (src instanceof Date) {
            const p = Object.getPrototypeOf(src);
            p.jsonParseAsUTC = true;
            return;
        }
        if (this.IsArray(src)) {
            (src as Array<any>).forEach(x => {
                this.setDateJsonToUTC(x);
            });
        }
        Object.keys(src).forEach(o => {
            if (this.IsArray(src[o])) {
                (src[o] as Array<any>).forEach(x => {
                    this.setDateJsonToUTC(x);
                });
            } else {
                this.setDateJsonToUTC(src[o]);
            }
        });
    }

    /**
     * Url Base 64 decode
     * @param str string to decode
     */
    public static urlBase64Decode(str: string): string {
        let res = str.replace(/-/g, '+').replace(/_/g, '/');

        switch (res.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                res += '==';
                break;
            }
            case 3: {
                res += '=';
                break;
            }
            default: {
                throw new Error('Illegal base64url string');
            }
        }

        return AppUtils.b64DecodeUnicode(res);
    }

    /**
     * Base 64 string decoder
     * @param str string to decode
     */
    public static b64decode(str: string): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let res = '';

        str = String(str).replace(/=+$/, '');

        if (str.length % 4 === 1) {
            throw new Error("Not base 64 string.");
        }

        for (let bc = 0, bs = void 0, buffer = void 0, idx = 0;
            (buffer = str.charAt(idx++));
            // tslint:disable-next-line: no-bitwise
            ~buffer &&
                ((bs = bc % 4 ? bs * 64 + buffer : buffer),
                    bc++ % 4)
                // tslint:disable-next-line: no-bitwise
                ? (res += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0) {
            buffer = chars.indexOf(buffer);
        }

        return res;
    }

    /**
     * Unicode Base 64 decoder
     * @param str string to decode
     */
    public static b64DecodeUnicode(str: string): string {
        return decodeURIComponent(Array.prototype.map
            .call(AppUtils.b64decode(str), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''));
    }

    /**
     * Validates Oib value
     * @param oib Oib to check
     */
    public static isOibValid(oib: string): boolean {
        if (!oib) { return false; }

        oib = oib.toString();

        if (oib.length !== 11) { return false; }

        if (isNaN(parseInt(oib, 10))) { return false; }

        let tmp = 10;
        for (let i = 0; i < 10; i++) {
            tmp += parseInt(oib.substr(i, 1), 10);
            tmp = tmp % 10;
            tmp = tmp === 0 ? 10 : tmp;
            tmp *= 2;
            tmp = tmp % 11;
        }
        let cont = 11 - tmp;
        cont = cont === 10 ? 0 : cont;

        return cont === parseInt(oib.substr(10, 1), 10);
    }

    public static toMnemonic(value: string): string {
        if (!value) {
            return value;
        }

        value = value.replace(/[^a-zA-Z0-9_]/gi, '');

        return value ? value.toUpperCase() : value;
    }
}

// Polyfill for Clone
if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            const to = Object(target);

            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];

                if (nextSource != null) {
                    for (const nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}
