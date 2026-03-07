function showMenu(btnId, menuId) {
    const btn = document.getElementById(btnId)
    const menu = document.getElementById(menuId)

    btn.addEventListener('click', () => {
        console.log('hello')
        menu.classList.toggle('show-menu')
        btn.classList.toggle('show-icon')
    })
}

showMenu('card-btn', 'card-menu')
