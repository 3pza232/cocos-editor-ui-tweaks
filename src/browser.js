'use strict';

const fs = require('fs');
const path = require('path');

const { runAll, hasWindows } = require('./injector');
const TWEAKS = require('./registry');

const NS = 'cocos-editor-ui-tweaks';

const CSS_MAP = {};
TWEAKS.forEach(t => {
    CSS_MAP[t.key] = t.type === 'number' ? (v) => t.css.replace('{value}', v) : t.css;
});

function cfgPath() {
    return path.join(Editor.Project.path, 'settings', `${NS}-config.json`);
}

function read() {
    try { return JSON.parse(fs.readFileSync(cfgPath(), 'utf8')); }
    catch { return {}; }
}

function save(c) {
    const dir = path.dirname(cfgPath());
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(cfgPath(), JSON.stringify(c, null, 2), 'utf8');
}

function genCSS(key, val) {
    const rule = CSS_MAP[key];
    return rule ? (typeof rule === 'function' ? rule(val) : rule) : null;
}

exports.load = function () {
    const cfg = read();
    (function boot() {
        if (!hasWindows()) { setTimeout(boot, 500); return; }
        for (const [key, val] of Object.entries(cfg)) {
            if (val === false || val === null || val === undefined) continue;
            const css = genCSS(key, val);
            if (css) runAll(key, css);
        }
    })();
};

exports.methods = {
    open() { Editor.Panel.open(NS); },
    getConfig() { return read(); },
    setConfig(key, value) { const c = read(); c[key] = value; save(c); return true; },
    injectCSS(id, css) { runAll(id, css); return true; },
    removeCSS(id) {
        const rule = CSS_MAP[id];
        const fallback = rule ? (typeof rule === 'function' ? rule(0) : rule) : '';
        runAll(id, fallback, true);
        return true;
    },
};
