/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    "use strict";

    // Vars
    var exp = module.exports,
        fs  = require('graceful-fs'),
        XP  = require('expandjs');

    /*********************************************************************/

    /**
     * Exports an entire folder.
     *
     * @param {string} dir
     * @param {Function} callback
     */
    exp.export = function (dir, callback) {

        // Asserting
        XP.assertArgument(XP.isString(dir, true), 1, 'string');
        XP.assertArgument(XP.isFunction(callback), 2, 'Function');

        // Vars
        var result = {};

        // Reading
        fs.readdir(dir, function (files) {

            // Exporting
            files.forEach(function (file) {
                if (file === 'index.js') { return; }
                result[XP.fileName(file) || file] = require(dir + '/' + file);
            });

            // Callback
            callback(null, result);
        });
    };

    /**
     * Sync version of export.
     *
     * @param {string} dir
     * @returns {Object}
     */
    exp.exportSync = function (dir) {

        // Asserting
        XP.assertArgument(XP.isString(dir, true), 1, 'string');

        // Vars
        var files  = fs.readdirSync(dir),
            result = {};

        // Exporting
        files.forEach(function (file) {
            if (file === 'index.js') { return; }
            result[XP.fileName(file) || file] = require(dir + '/' + file);
        });

        return result;
    };

    /**
     * Passes target through each file in dir.
     *
     * @param {string} dir
     * @param {*} target
     * @param {Function} callback
     */
    exp.pass = function (dir, target, callback) {

        // Asserting
        XP.assertArgument(XP.isString(dir, true), 1, 'string');
        XP.assertArgument(XP.isFunction(callback), 3, 'Function');

        // Reading
        fs.readdir(dir, function (files) {

            // Passing
            files.forEach(function (file) {
                if (file === 'index.js') { return; }
                target = require(dir + '/' + file)(target);
            });

            // Callback
            callback(null, target);
        });
    };

    /**
     * Sync version of pass.
     *
     * @param {string} dir
     * @param {*} target
     * @returns {*}
     */
    exp.passSync = function (dir, target) {

        // Asserting
        XP.assertArgument(XP.isString(dir, true), 1, 'string');

        // Vars
        var files = fs.readdirSync(dir);

        // Passing
        files.forEach(function (file) {
            if (file === 'index.js') { return; }
            target = require(dir + '/' + file)(target);
        });

        return target;
    };

    /**
     * Reads json from a file.
     *
     * @param {string} file
     * @param {Function} callback
     */
    exp.readJson = function (file, callback) {

        // Asserting
        XP.assertArgument(XP.isString(file, true), 1, 'string');
        XP.assertArgument(XP.isFunction(callback), 2, 'Function');

        // Reading
        fs.readFile(file, {encoding: 'utf-8'}, function (error, data) {
            callback(error, data ? XP.parseJSON(data) : data);
        });
    };

    /**
     * Sync version of readJson.
     *
     * @param {string} file
     * @returns {Object}
     */
    exp.readJsonSync = function (file) {

        // Asserting
        XP.assertArgument(XP.isString(file, true), 1, 'string');

        // Reading
        return XP.parseJSON(fs.readFileSync(file, {encoding: 'utf-8'}));
    };

    /**
     * Writes json on a file.
     *
     * @param {string} file
     * @param {Object} json
     * @param {Function} [callback]
     */
    exp.writeJson = function (file, json, callback) {

        // Asserting
        XP.assertArgument(XP.isString(file, true), 1, 'string');
        XP.assertArgument(XP.isObject(json), 2, 'Object');
        XP.assertArgument(XP.isVoid(callback) || XP.isFunction(callback), 3, 'Function');

        // Writing
        fs.writeFile(file, XP.toJSON(json, false, true), {encoding: 'utf-8'}, callback);
    };

    /**
     * Sync version of writeJson.
     *
     * @param {string} file
     * @param {Object} json
     */
    exp.writeJsonSync = function (file, json) {

        // Asserting
        XP.assertArgument(XP.isString(file, true), 1, 'string');
        XP.assertArgument(XP.isObject(json), 2, 'Object');

        // Writing
        fs.writeFileSync(file, XP.toJSON(json, false, true), {encoding: 'utf-8'});
    };

    /*********************************************************************/

    // Assigning
    XP.assign(exp, fs);

}());