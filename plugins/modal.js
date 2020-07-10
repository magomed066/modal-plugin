Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}

function noop() {}

function _createFooterButtons(buttons = []) {
    if (buttons.length === 0) {
        return document.createElement('div')
    }

    const footer = document.createElement('div')
    footer.classList.add('modal-footer')

    buttons.forEach(btn => {
        const $btn = document.createElement('button');
        $btn.textContent = btn.text
        $btn.classList.add('btn')
        $btn.classList.add(`btn-${btn.type || 'secondary'}`)
        $btn.onclick = btn.handler || noop

        footer.append($btn)
    })

    return footer
}

function _createModal(options) {
    const DEFAULT_WIDTH = '600px'
    const modal = document.createElement('div')
    modal.classList.add('m-modal')

    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close="true">
            <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
                <div class="modal-header">
                    <span class="modal-title">${options.title || 'Окно'}</span>
                    ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''} 
                </div>
                <div class="modal-body" data-content>
                    ${options.content || ''}
                </div>
            </div>
        </div>
    `)

    const footer = _createFooterButtons(options.footerButtons)

    footer.appendAfter(modal.querySelector('[data-content]'))

    document.body.append(modal)
    return modal
}

$.modal = function(options) {
    const ANIMATION_SPEED = 200
    const $modal = _createModal(options)

    let closing = false
    let destroyed = false

    const modal = {
        open() {
            if (destroyed) {
                console.log('Modal is destroyed')
            }
            !closing && $modal.classList.add('open')
        },
        close() {
            closing = true
            $modal.classList.remove('open')
            $modal.classList.add('hide')

            if (typeof options.onClose === 'function') {
                options.onClose()
            }

            setTimeout(() => {
                $modal.classList.remove('hide')
                closing = false
            }, ANIMATION_SPEED)
        },
    }

    const listener = e => {
        if (e.target.dataset.close) {
            modal.close()
        }
    }

    $modal.addEventListener('click', listener)

    return Object.assign(modal, {
        destroy() {
            $modal.remove()
            $modal.removeEventListener('click', listener)
            destroyed = true
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html
        }
    })
}
