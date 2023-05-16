export default class Alert {
    #alertBlock; #size; #onclose;

    constructor(message, size = null, additionalContent = '') {
        this.message = message;
        this.additionalContent = additionalContent;
        this.#alertBlock = document.querySelector('.modal');

        if (!this.#alertBlock)
            this.#alertBlock = document.createElement('div');

        this.#size = size;
        this.#onclose = () => {};
        this.#init();

        document.querySelector('.close').addEventListener('click', () => this.close());
    }

    #init() {
        this.#alertBlock.classList.add('modal');
        this.#alertBlock.innerHTML = `<div class="modal-content" style="border-radius: 10px;">
                                          <span class="close">&times;</span>
                                          <h3>${this.message}</h3>
                                          ${this.additionalContent}
                                      </div>`;

        let content = this.#alertBlock.querySelector('.modal-content');

        if (this.#size != null) {
            content.style.width = this.#size[0] + 'px';
            content.style.height = this.#size[1] + 'px';
        }

        document.body.appendChild(this.#alertBlock);
    }

    show() {
        for (const modal of document.querySelectorAll('.modal')) {
            if (modal.style.display == 'flex')
                return false;
        }

        this.#alertBlock.style.display = 'flex';
        return true;
    }

    close() {
        this.#alertBlock.style.display = 'none';
        this.#onclose();
        this.#alertBlock.remove();
    }

    onclose(callback) {
        this.#onclose = callback;
    }

    get size() {
        return this.#size;
    }

    set size(newSize) {
        this.#size = newSize;
        this.#init();
    }
}
