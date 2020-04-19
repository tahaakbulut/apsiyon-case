export class Request {
    constructor(url) {
        this.url = url
    }
    async getMovies() {
        const response = await fetch(this.url)
        const responseJson = await response.json();
        return responseJson;
    }
    async postMovies(data) {
        const response = await fetch(this.url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const responseJson = await response.json();
        return responseJson;
    }
    async updateMovies(id, data) {
        const response = await fetch(this.url + '/' + id, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const responseJson = await response.json();
        return responseJson;
    }
    async deleteMovies(id) {
        const response = await fetch(this.url + '/' + id, {
            method: "DELETE"
        })
        return "delete"
    }
}