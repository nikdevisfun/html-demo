const showMenu = (navId, toggleId) => {
    const nav = document.getElementById(navId),
        toggle = document.getElementById(toggleId)
    toggle.addEventListener('click', () => {
        nav.classList.toggle('show-menu')
        toggle.classList.toggle('show-icon')
    })
}

showMenu('nav-menu', 'nav-toggle')

const navEmail = document.getElementById('nav-email')
const navCopy = document.getElementById('nav-copy').textContent
const navText = document.getElementById('nav-text')

navEmail.addEventListener('click', () => {
    console.log('click..')
    navigator.clipboard.writeText(navCopy).then(() => {
        navText.innerHTML = 'Copied ✅'
    })

    setTimeout(() => {
        navText.innerHTML = 'Copy email'
    }, 2000)
})
