"use strict";

// Transparent navbar
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
    if (window.scrollY > navbarHeight) {
        navbar.classList.add("navbar--grey");
    } else {
        navbar.classList.remove("navbar--grey");
    }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
    const target = event.target;
    const link = target.dataset.link;
    if (link == null) {
        return;
    }
    navbarMenu.classList.remove("open");
    scrollIntoView(link);
    selectNavItem(target);
});

//Navnar toggle button on mobile
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
    navbarMenu.classList.toggle("open");
});

// contact btn on home
const homeContactBtn = document.querySelector(".home__contact");
homeContactBtn.addEventListener("click", () => {
    scrollIntoView("#contact");
});

// 이동시 home 화면 투명하게
const home = document.querySelector(".home__container");
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

// 하단 이동 버튼
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener("scroll", () => {
    if (window.scrollY > homeHeight / 2) {
        arrowUp.classList.add("visible");
    } else {
        arrowUp.classList.remove("visible");
    }
});

arrowUp.addEventListener("click", () => {
    scrollIntoView("#home");
});

// 프로젝트
const workBtnContainer = document.querySelector(".work__categories");
const projefctContainer = document.querySelector(".work_projects");
const projects = document.querySelectorAll(".project");
workBtnContainer.addEventListener("click", (e) => {
    const filter =
        e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if (filter == null) {
        return;
    }

    //Remove selection from the previous item and select the new one
    const active = document.querySelector(".category__btn.selected");
    active.classList.remove("selected");
    const target =
        e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
    target.classList.add("selected");

    projefctContainer.classList.add("anim-out");
    setTimeout(() => {
        projects.forEach((project) => {
            if (filter === "*" || filter === project.dataset.type) {
                project.classList.remove("invisible");
            } else {
                project.classList.add("invisible");
            }
        });
        projefctContainer.classList.remove("anim-out");
    }, 300);

    console.log(filter);
});

// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다
const sectionIds = ["#home", "#about", "#skills", "#work", "#contact"];
const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
    document.querySelector(`[data-link="${id}"]`)
);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
    selectedNavItem.classList.remove("active");
    selectedNavItem = selected;
    selectedNavItem.classList.add("active");
}

//이동 function
function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: "smooth" });
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
};

const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.intersectionRatio > 0) {
            console.log("y");
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            // 스크롤링이 아래로 되어서 페이지가 올라옴
            if (entry.boundingClientRect.y < 0) {
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

window.addEventListener("wheel", () => {
    if (window.scrollY === 0) {
        selectedNavIndex = 0;
    } else if (
        window.scrollY + window.innerHeight ===
        document.body.clientHeight
    ) {
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);
});
