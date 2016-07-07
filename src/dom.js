export function query(el) {
    if (typeof el === "string") {
        el = document.querySelector(el);
    }
    return el;
}

export function attr(el, name) {
    return el.getAttribute(name);
}
