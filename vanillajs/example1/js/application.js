class AuthorModel {
    constructor(obj) {
        this.updateProperties(obj);
    }

    updateProperties(obj) {
        this.id = obj.id;
        if (obj.name) {
            this.name = obj.name;
        }
    }
}

class BookModel {
    constructor(obj) {
        this.updateProperties(obj);
    }

    updateProperties(obj) {
        this.id = obj.id;
        if (obj.author) this.author = obj.author;
        if (obj.title) this.title = obj.title;
        if (obj.isbn) this.isbn = obj.isbn;
    }

    static getFields() {
        return ['id', 'title', 'isbn', 'author'];
    }
}

class BookTableComponent {
    constructor(obj) {
        this.containerElement = obj.containerElement;
        this.fields = BookModel.getFields();
        this.updateProperties(obj);
        this.buildDOMElements();
        this.render();
    }

    updateProperties(obj) {
        this.books = obj.books;
    }

    buildDOMElements() {
        this.tableElement = document.createElement('TABLE');
        this.tableHeadElement = this.tableElement.createTHead();
        this.tablebodyElement = document.createElement('TBODY');
        this.tableElement.appendChild(this.tablebodyElement);
    }

    renderHead() {
        this.tableHeadElement.innerHTML = `
        <tr>
            ${this.fields.map((item) => `<th>${item}</th>`).join('')}
        </tr>
        `;
    }

    renderBody() {
        this.tablebodyElement.innerHTML = `
            ${this.books
                .map((book) => {
                    return `
                    <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.isbn}</td>
                        <td>${book.author.name}</td>
                    </tr>
                    `;
                })
                .join('')}
        `;
    }

    render() {
        this.renderHead();
        this.renderBody();
        this.containerElement.innerHTML = '';
        this.containerElement.appendChild(this.tableElement);
    }
}
