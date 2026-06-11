'use strict';

const NS = 'cocos-editor-ui-tweaks';
const TWEAKS = require('../registry');

const cats = [...new Set(TWEAKS.map(t => t.category))];

exports.template = `
<div class="eut">
    <div class="eut-hd">
        <span class="eut-tl">Editor UI Tweaks</span>
        <span class="eut-v">v1.0.1 by pza</span>
    </div>
    <div class="eut-bd">
        ${cats.map(c => `
        <ui-section header="${c}">
            ${TWEAKS.filter(t => t.category === c).map(t => t.type === 'checkbox' ? `
            <ui-prop class="eut-r">
                <ui-label slot="label">${t.label}</ui-label>
                <ui-checkbox slot="content" id="${t.key}"></ui-checkbox>
            </ui-prop>` : `
            <ui-prop class="eut-r">
                <ui-label slot="label">${t.label}</ui-label>
                <ui-num-input class="eut-num" slot="content" id="${t.key}"
                    min="${t.min}" max="${t.max}" step="${t.step}"></ui-num-input>
            </ui-prop>`).join('')}
        </ui-section>
        `).join('')}
    </div>
</div>
`;

exports.style = `
.eut{display:flex;flex-direction:column;height:100%}
.eut-hd{display:flex;justify-content:space-between;align-items:center;
  padding:4px 10px;border-bottom:1px solid var(--color-normal-border);
  font-size:11px;flex:none}
.eut-tl{font-weight:600;color:var(--color-normal-contrast)}
.eut-v{color:var(--color-normal-contrast-weakest);font-size:10px}
.eut-bd{flex:1;overflow-y:auto;padding:4px 0}
.eut-r{min-height:24px}
.eut-r .eut-num{width:80px;flex:none}
`;

exports.$ = {};
TWEAKS.forEach(t => { exports.$[t.key] = `#${t.key}`; });

exports.ready = async function () {
    const cfg = await Editor.Message.request(NS, 'get-config');

    for (const t of TWEAKS) {
        const el = this.$[t.key];
        if (!el) continue;
        const saved = cfg[t.key];

        if (t.type === 'checkbox') {
            if (saved) {
                el.checked = true;
                Editor.Message.request(NS, 'inject-css', t.key, t.css);
            }
            el.addEventListener('change', () => {
                if (el.checked) {
                    Editor.Message.request(NS, 'inject-css', t.key, t.css);
                } else {
                    Editor.Message.request(NS, 'remove-css', t.key);
                }
                Editor.Message.request(NS, 'set-config', t.key, !!el.checked);
            });
        } else {
            if (typeof saved === 'number') {
                el.value = saved;
                Editor.Message.request(NS, 'inject-css', t.key, t.css.replace('{value}', saved));
            }
            el.addEventListener('confirm', () => {
                const v = Number(el.value);
                if (v > 0) {
                    Editor.Message.request(NS, 'inject-css', t.key, t.css.replace('{value}', v));
                } else {
                    Editor.Message.request(NS, 'remove-css', t.key);
                }
                Editor.Message.request(NS, 'set-config', t.key, v > 0 ? v : null);
            });
        }
    }
};
