export class UI {
    constructor() {
        this.newform = document.getElementById('newMovie');
        this.newName = document.getElementById('newName');
        this.newStar = document.getElementById('newStar');
        this.newYear = document.getElementById('newYear');
        this.movieList = document.getElementById('movieList');
        this.result = null;
        this.alertDialog = document.querySelector('#alertDialog .mdc-dialog__surface')
    }
    clearInput() {
        this.newName.value = '';
        this.newStar.value = '';
        this.newYear.value = '';
    }
    createMovieList(movies, category, sort) {
        this.result = movies
        this.movieList.innerHTML = '';
        movies.filter(obj => category == 'all' ? obj : obj.category == category)
            .sort((a, b) => sort == "low" ? a.star - b.star : b.star - a.star)
            .forEach(element => {
                this.movieList.innerHTML += `
                    <div class="card" id="${element.id}">
                        <div class="card-title">
                            ${element.title} (${element.year})
                            <i class="material-icons trash">delete</i>
                        </div>
                        <div class="card-star">
                        <i class="material-icons mdc-button__icon">grade</i><span id="star${element.id}">${element.star}</span>
                        </div>
                        <div class="card-point">
                        <span class="mb-1">Puan Ver</span>
                            <i class="re-star arrow_drop_up"></i>
                            <i class="re-star arrow_drop_down"></i>
                        </div>
                    </div>
                `;
            });
    }
    deleteMovie(movieId) {
        const movieCard = document.getElementById(movieId)
        movieCard.parentElement.removeChild(movieCard);
    }
    updateMovie(movie) {
        document.getElementById('star' + movie.id).innerHTML = movie.star;
    }
    addAlertDialog(type, id) {
        return new Promise(resolve => {
            console.log(this.result)
            this.alertDialog.innerHTML = '';
            const movie = this.result.find(obj => obj.id == id)
            type == 'warning' ?
                this.alertDialog.innerHTML = `
                <div class="mdc-dialog__content" id="alert-dialog-content" data-id="${movie.id}">
                    <i class="material-icons warning">delete</i>
                    <p>${movie.title} (${movie.year}) Silmek istediğine emin misin?</p>
                </div>
                <footer class="mdc-dialog__actions">
                    <button type="button" class="ml-auto mdc-button mdc-dialog__button mdc-button--unelevated" data-mdc-dialog-action="no">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">İptal</span>
                    </button>
                    <button type="button" class="mr-auto mdc-button mdc-dialog__button mdc-button--unelevated" data-mdc-dialog-action="yes" data-mdc-dialog-button-default>
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">Evet</span>
                    </button>
                </footer>
            `:
                this.alertDialog.innerHTML = `
                <div class="mdc-dialog__content" id="alert-dialog-content">
                    <i class="material-icons success">done</i>
                    <p>Kaydedildi</p>
                </div>
                <footer class="mdc-dialog__actions">
                    <button type="button" class="mx-auto mdc-button mdc-dialog__button mdc-button--unelevated" data-mdc-dialog-action="yes">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">TAMAM</span>
                    </button>
                </footer>
            `;
            resolve(true)
        });
    }
}