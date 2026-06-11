module.exports = [{
    key: 'sampleWidth',
    type: 'number',
    category: '动画编辑器',
    label: '采样帧率输入框宽度',
    css: '.foot .right ui-num-input[name="sample"]{width:{value}px!important;min-width:{value}px!important;}',
    min: 20, max: 200, step: 1,
}, {
    key: 'speedWidth',
    type: 'number',
    category: '动画编辑器',
    label: '播放速度输入框宽度',
    css: '.foot .right ui-num-input[name="speed"]{width:{value}px!important;min-width:{value}px!important;}',
    min: 20, max: 200, step: 1,
}];
