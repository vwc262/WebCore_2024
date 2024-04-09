class Row {
    constructor(site) {
        this.site = site;
        this.create();
    }

    create() {
        let row = document.createElement('div');
        row.innerText = `row ${site}`;
    }

    destroy() {
        // console.log(`${this.name} is destroyed.`);
        // delete this.name;
        // delete this.age;
    }
}

export { Row };