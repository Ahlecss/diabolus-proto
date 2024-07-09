import gsap from "gsap";

export function lerp(a, b, alpha) {
    return a + alpha * (b - a)
}