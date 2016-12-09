/**
 * @license
 * Copyright (c) 2015 The expand.js authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */

// Const
const exp = module.exports,
    fs    = require('fs-extra'),
    XP    = require('expandjs');

/*********************************************************************/

/**
 * A recursive dir version of NodeJS's `require`, meant to be used on the application bootstrap.
 *
 * @function export
 * @since 1.0.0
 * @category fs
 * @description A recursive dir version of NodeJS's `require`, meant to be used on the application bootstrap
 * @source https://github.com/expandjs/xp-fs/blob/master/lib/index.js
 *
 * @param {string} dir
 * @param {string | Array} [pick = ["js", "json"]]
 * @param {Function} [customizer]
 * @returns {Object}
 */
exp.export = function (dir, pick, customizer) {

    // Preparing
    if (XP.isFunction(pick)) { customizer = pick; pick = undefined; }

    // Asserting
    XP.assertArgument(XP.isString(dir, true), 1, 'string');
    XP.assertArgument(XP.isVoid(pick) || XP.isString(pick, true) || XP.isArray(pick, true), 2, 'Array or string');
    XP.assertArgument(XP.isVoid(customizer) || XP.isFunction(customizer), 3, 'Function');

    // Preparing
    customizer = customizer || (val => val);
    pick       = pick ? (XP.isString(pick) ? [pick] : pick) : ['js', 'json'];

    // Let
    let code   = pick.filter(ext => ext === 'js' || ext === 'json'),
        files  = exp.readdirSync(dir),
        result = {};

    // Exporting
    files.forEach(file => {
        if (file === `index.js`) { return; }
        if (code.includes(XP.fileExtension(file))) { result[XP.fileBasename(file)] = customizer(require(`${dir}/${file}`)); return; }
        if (pick.includes(XP.fileExtension(file))) { result[XP.fileBasename(file)] = customizer(exp.readFileSync(`${dir}/${file}`, 'utf-8')); return; }
        if (exp.statSync(`${dir}/${file}`).isDirectory()) { result[file] = exp.export(`${dir}/${file}`, pick, customizer); }
    });

    return result;
};

/**
 * Returns `true` if the specified file exists.
 *
 * @function find
 * @since 1.0.0
 * @category fs
 * @description Returns `true` if the specified file exists
 * @source https://github.com/expandjs/xp-fs/blob/master/lib/index.js
 *
 * @param {string} file
 * @returns {boolean}
 */
exp.find = function (file) {

    // Asserting
    XP.assertArgument(XP.isString(file, true), 1, 'string');

    // Checking
    try { fs.accessSync(file, fs.constants.F_OK); return true; } catch (ignore) { return false; }
};

/*********************************************************************/

// Assigning
Object.assign(exp, fs);
