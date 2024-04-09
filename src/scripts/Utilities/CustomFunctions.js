
const SetMultipleAttributes =
    HTMLElement.prototype.SetMultipleAttributes =
    /**
     * 
     * @param {object} attributes 
     */
    function (attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            this.setAttribute(key, value);
        }
    };

export { SetMultipleAttributes };




