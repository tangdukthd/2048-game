export class InputHandler {
    constructor() {
        this.keys = []
        window.addEventListener('keydown', e => {
            if(
                (e.key === 'ArrowUp' || e.key === 'w') && 
                this.keys.indexOf(e.key) === -1) {
                this.keys.push('up')
            } else if(
                (e.key === 'ArrowDown' || e.key === 's') && 
                this.keys.indexOf(e.key) === -1) {
                this.keys.push('down')
            } else if(
                (e.key === 'ArrowLeft' || e.key === 'a') && 
                this.keys.indexOf(e.key) === -1) {
                this.keys.push('left')
            } else if(
                (e.key === 'ArrowRight' || e.key === 'd') && 
                this.keys.indexOf(e.key) === -1) {
                this.keys.push('right')
            }
        })
        window.addEventListener('keyup', e => {
            if(e.key === 'ArrowUp' || e.key === 'w') {
                this.keys.splice(this.keys.indexOf('up'), 1)
            } else if(e.key === 'ArrowDown' || e.key === 's') {
                this.keys.splice(this.keys.indexOf('down'), 1)
            } else if(e.key === 'ArrowLeft' || e.key === 'a') {
                this.keys.splice(this.keys.indexOf('left'), 1)
            } else if(e.key === 'ArrowRight' || e.key === 'd') {
                this.keys.splice(this.keys.indexOf('right'), 1)
            }
        })

        window.addEventListener('touchstart', e => {
            this.touchY = e.changedTouches[0].pageY
            this.touchX = e.changedTouches[0].pageX
        })
        window.addEventListener('touchmove', e => {
            if(e.changedTouches[0].pageY - this.touchY > 50) {
                this.keys.push('up')
            } else if (e.changedTouches[0].pageY - this.touchY < -50) {
                this.keys.push('down')
            }
            if(e.changedTouches[0].pageX - this.touchX > 50) {
                this.keys.push('right')
            } else if (e.changedTouches[0].pageX - this.touchX < -50) {
                this.keys.push('left')
            }
        })
        window.addEventListener('touchend', e => {
            this.keys.splice(this.keys.indexOf('up'), 1)
            this.keys.splice(this.keys.indexOf('down'), 1)
            this.keys.splice(this.keys.indexOf('left'), 1)
            this.keys.splice(this.keys.indexOf('right'), 1)
        })
    }
}