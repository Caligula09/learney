const menuHTML = document.getElementById('menuHTML');

const openMenu = () => {
    document.getElementById('menuHTML').classList.add('open');
    document.getElementById('menuBg').classList.remove('closed');
};

const closeMenu = () => {
    document.getElementById('menuHTML').classList.remove('open');
    document.getElementById('menuBg').classList.add('closed');
};

const openSettings = () => {
     document.getElementById('settingsSection').classList.remove('closed');
     document.getElementById('settingsBg').classList.remove('closed');
};

const closeSettings = () => {
     document.getElementById('settingsSection').classList.add('closed');
     document.getElementById('settingsBg').classList.add('closed');
};


// Menü laden
document.addEventListener("DOMContentLoaded", () => {
    fetch("./resources/html/menu.html")
        .then(res => res.text())
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
            initMenuEvents();
            applyTranslations();
        });
});

function initMenuEvents() {
    const menuIcon = document.getElementById("menuIconImg");
    if (menuIcon) menuIcon.addEventListener("click", openMenu);


    ["menuHeadH1", "menuHeadImg"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", closeMenu);
    });
    const settingsLi = document.getElementById("settingsLi");
    if (settingsLi) settingsLi.addEventListener("click", openSettings);
    
    const closeSettingsIcon = document.getElementById("closeSettingsIcon");
    const menuBg = document.getElementById("menuBg");
    if (closeSettingsIcon) closeSettingsIcon.addEventListener("click", closeSettings);
    if (menuBg) menuBg.addEventListener("click", closeMenu);

    const settingsBg = document.getElementById("settingsBg");
    if (settingsBg) settingsBg.addEventListener("click", closeSettings);

    const en = document.querySelector('#en');
    if (en) {
        en.addEventListener('change', (event) => {
            if (event.target.checked) {
                setLanguage('en');
            }
        });
    }

    const de = document.querySelector('#de');
    if (de) {
        de.addEventListener('change', (event) => {
            if (event.target.checked) {
                setLanguage('de');
            }
        });
    }

    const lightRadio = document.getElementById('light_mode');
    if (lightRadio) {
        lightRadio.addEventListener("change", (event) => {
            if (event.target.checked) {
                setTheme("light");
                console.log(localStorage.getItem("theme"));
            }
        });
    }

    const darkRadio = document.getElementById('dark_mode');
    if (darkRadio) {
        darkRadio.addEventListener("change", (event) => {
            if (event.target.checked) {
                setTheme("dark");
                console.log(localStorage.getItem("theme"));
            }
        });
    }

    const mosaikRadio = document.getElementById('mosaik_mode');
    if (mosaikRadio) {
        mosaikRadio.addEventListener("change", (event) => {
            if (event.target.checked) {
                setTheme("mosaik");
                console.log(localStorage.getItem("theme"));
            }
        });
    }

    const defaultRadio = document.getElementById('default_mode');
    if (defaultRadio) {
        defaultRadio.addEventListener("change", (event) => {
            if (event.target.checked) {
                setTheme("default");
                console.log(localStorage.getItem("theme"));
            }
        });
    }

    const noneRadio = document.getElementById('none_mode');
    if (noneRadio) {
        noneRadio.addEventListener("change", (event) => {
            if (event.target.checked) {
                setTheme('none');
                console.log(localStorage.getItem("theme"));
            }
        });
    }

    const newRadio = document.getElementById('new_mode');
    if (newRadio) {
        newRadio.addEventListener("change", (event) => {
            if (event.target.checked) {
                setTheme('new');
                console.log(localStorage.getItem("theme"));
            }
        });
    }
    
}

