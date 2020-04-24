module.exports = {
    paginate: (collection, page_number = 1, page_size = 10) => {
        const currentPage = parseInt(page_number);
        const perPage = parseInt(page_size);

        if(!Array.isArray(collection) ) {
            throw new TypeError(`Expect array and got ${typeof collection}`);
        }
        if (isNaN(currentPage)) {
            throw new TypeError('currentPage must be a number');
        }
        if (isNaN(perPage)) {
            throw new TypeError('perPage must be a number');
        }

        const offset = (page_number - 1) * perPage;
        const paginatedItems = collection.slice(offset, offset + perPage);
    
        return {
            currentPage,
            perPage,
            total: collection.length,
            totalPages: Math.ceil(collection.length / perPage),
            data: paginatedItems
        };
    }
}
