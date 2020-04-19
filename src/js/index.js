require("../scss/style.scss");
require("../index.html");
import { Request } from "./request";
import { UI } from "./ui";
import { MDCTextField } from '@material/textfield';
import { MDCDialog } from '@material/dialog';
import { MDCMenuSurface } from '@material/menu-surface';
import { MDCList } from '@material/list';

const categoryMenu = document.getElementById('dropdownCategory');
const shortMenu = document.getElementById('dropdownShort');
let categorySelect = 'all';
let sortSelect = 'high';

const request = new Request("http://localhost:3000/movies");
const ui = new UI();
const categoryMenuList = new MDCList(document.querySelector('#dropdownCategory .mdc-list'));
const shortMenuList = new MDCList(document.querySelector('#dropdownShort .mdc-list'));
const alertDialog = new MDCDialog(document.getElementById('alertDialog'));
const newDialog = new MDCDialog(document.getElementById('newDialog'));
const newDialogButton = document.querySelector('[data-dialog="newDialog"]');
const getList = (...args) => {
    args.forEach(arg => {
        if (arg == "movie" || arg == "series" || arg == "all") categorySelect = arg;
        if (arg == "low" || "high") sortSelect = arg
    });
    request.getMovies()
        .then(movies => {
            ui.createMovieList(movies, categorySelect, sortSelect);
        })
        .catch(error => console.error(error));
}
const addMovie = (e) => {
    e.preventDefault();
    const newCategory = document.querySelector('[name="newCategory"]:checked')
    request.postMovies({
        title: ui.newName.value.trim(),
        star: parseInt(ui.newStar.value),
        category: newCategory.value,
        year: parseInt(ui.newYear.value),
    }).then(async movie => {
        getList()
        ui.clearInput();
        newDialog.close()
        await ui.addAlertDialog('success');
        alertDialog.open();
    }).catch(error => console.error(error));
}
const deleteMovie = (e) => {
    const id = document.getElementById('alert-dialog-content').dataset.id
    id && e.detail.action == 'yes' &&
        request.deleteMovies(id)
            .then(message => {
                ui.deleteMovie(id)
            })
            .catch(error => console.error(error));
}
const showDeleteDialogOrUpdateMovie = async (e) => {
    const movieCard = e.target.classList.contains("card") ? e.target : e.target.closest('.card');
    if (e.target.classList.contains("trash")) {
        await ui.addAlertDialog('warning', movieCard.id);
        alertDialog.open();
    }
    if (e.target.classList.contains("re-star")) {
        const movieData = ui.result.find(obj => obj.id == movieCard.id);
        const up = movieData.star < 10 && e.target.classList.contains("arrow_drop_up");
        const down = movieData.star > 0 && e.target.classList.contains("arrow_drop_down");
        if (up || down) {
            movieData.star += up ? 1 : - 1
            request.updateMovies(movieCard.id, movieData)
                .then(movie => {
                    ui.updateMovie(movie)
                })
                .catch(error => console.error(error));
        }
    }
}
const changeColor = (e) => {
    if (e.target.tagName == "INPUT") {
        document.body.dataset.color = e.target.value
        localStorage.setItem("selectedColor", e.target.value)
    }
}
const ready = () => {
    document.body.dataset.color = localStorage.getItem("selectedColor");
    if (localStorage.getItem("selectedColor")) {
        document.querySelector('[value="' + localStorage.getItem("selectedColor") + '"]').checked = true;
    }
    getList();
}
// Event Listener
(() => {
    document.addEventListener('DOMContentLoaded', ready)
    ui.newform.addEventListener('submit', addMovie)
    ui.movieList.addEventListener('click', showDeleteDialogOrUpdateMovie)
    alertDialog.listen('MDCDialog:closing', deleteMovie);
    categoryMenu.addEventListener('click', (e) => {
        const checkedValue = categoryMenuList.listElements[categoryMenuList.selectedIndex].querySelector('[name="category-list-group"]').value
        getList(checkedValue)
    })
    shortMenu.addEventListener('click', function (e) {
        getList(this.querySelector('[tabindex="0"]').dataset.type)
    })
    document.querySelector('.colorpicker').addEventListener('click', changeColor)
    document.body.addEventListener('click', (e) => {
        e.target.dataset.menu && new MDCMenuSurface(document.getElementById(e.target.dataset.menu)).open()
    })
    newDialogButton.addEventListener('click', () => { newDialog.open() });
    document.querySelectorAll('.mdc-text-field').forEach(field => {
        const textField = new MDCTextField(field);
    });
})();
