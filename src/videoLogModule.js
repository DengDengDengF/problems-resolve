import { h } from 'snabbdom'
import { Boot } from '@wangeditor/editor'

export const videoLogModule = {
    editorPlugin(editor) {
        const { isVoid,isInline } = editor
        const newEditor = editor
        newEditor.isInline = (elem) => {
            if (elem.type === 'video-log') return true
            return isInline(elem)
        }
        newEditor.isVoid = (elem) => {
            if (elem.type === 'video-log') return true
            return isVoid(elem)
        }
        return newEditor
    },

    renderElems: [
        {
            type: 'video-log',
            renderElem: (elem, children, editor) => {
                const { time = '', user = '', videoTime = '' } = elem.data || {}

                console.log('=== renderElems 被成功调用了！===', { time, user, videoTime })

                return h(
                    'span',
                    {
                        props: { contentEditable: false },
                        style: {
                            display: 'inline-block',
                            padding: '6px 12px',
                            margin: '4px 2px',
                            border: '1px solid #409EFF',
                            borderRadius: '6px',
                            backgroundColor: '#f0f8ff',
                            userSelect: 'none',
                            cursor: 'pointer'
                        },
                        // 核心修正：这里必须用驼峰命名
                        dataset: {
                            wEType: 'video-log',    // 对应 data-w-e-type
                            videoTime: videoTime,   // 对应 data-video-time
                            user: user,             // 对应 data-user
                            logTime: time           // 对应 data-log-time
                        },
                        on: {
                            click: (e) => {
                                e.stopPropagation()
                                alert(`跳转视频到时间：${videoTime}`)
                            }
                        }
                    },
                    [
                        `${time}时 `,
                        h('b', { style: { color: '#409EFF' } }, user),
                        ' 在 ',
                        h('span', { style: { color: '#409EFF', textDecoration: 'underline' } }, videoTime),
                        ' 的批注 ：'
                    ]
                )
            }
        }
    ],

    elemsToHtml: [
        {
            type: 'video-log',
            elemToHtml: (elem) => {
                const { time, user, videoTime } = elem.data || {}
                // HTML 字符串里依然使用带连字符的属性
                return `<span data-w-e-type="video-log" data-video-time="${videoTime}" data-user="${user}" data-log-time="${time}">${user}的批注</span>`
            }
        }
    ],

    parseElems: [
        {
            selector: 'span[data-w-e-type="video-log"]',
            parseElemHtml: (domElem) => {
                return {
                    type: 'video-log',
                    data: {
                        time: domElem.getAttribute('data-log-time') || '',
                        user: domElem.getAttribute('data-user') || '',
                        videoTime: domElem.getAttribute('data-video-time') || ''
                    },
                    children: [{ text: '' }]
                }
            }
        }
    ]
}

Boot.registerModule(videoLogModule)