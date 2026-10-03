import { toCanvas } from "html-to-image";
import { renderGenieFrame, GENIE_DURATION, clamp } from "./genie";

let overlayCanvas: HTMLCanvasElement | null = null;
let rafId = 0;

function getOverlay(): HTMLCanvasElement {
    if (!overlayCanvas && typeof document !== "undefined") {
        overlayCanvas = document.createElement("canvas");
        overlayCanvas.id = "genie-overlay";
        overlayCanvas.style.cssText = `
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(overlayCanvas);
    }
    return overlayCanvas!;
}

function sizeOverlay() {
    const c = getOverlay();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.width = W + "px";
    c.style.height = H + "px";
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, W, H };
}

export async function animateGenie(
    windowEl: HTMLElement,
    dockIconEl: HTMLElement,
    direction: "minimize" | "restore",
    onComplete: () => void
) {
    if (typeof window === "undefined") {
        onComplete();
        return;
    }

    cancelAnimationFrame(rafId);

    const { ctx, W, H } = sizeOverlay();
    const c = getOverlay();
    c.style.zIndex = "9999";

    let snapshot: HTMLCanvasElement;
    try {
        const rectBefore = windowEl.getBoundingClientRect();
        snapshot = await toCanvas(windowEl, {
            pixelRatio: 1,
            cacheBust: false,
            skipFonts: true,
            fontEmbedCSS: "",
            width: rectBefore.width,
            height: rectBefore.height,
            style: {
                transform: "none",
                position: "static",
                margin: "0",
                opacity: "1",
            },
            filter: (node: any) => {
                if (node.style && node.style.cursor && node.style.cursor.includes("resize")) {
                    return false;
                }
                return true;
            },
        });
    } catch {
        onComplete();
        return;
    }

    const winRect = windowEl.getBoundingClientRect();
    const dockRect = dockIconEl.getBoundingClientRect();
    const dockCenter = {
        x: dockRect.left + dockRect.width / 2,
        y: dockRect.top + dockRect.height / 2,
    };
    const win = {
        x: winRect.left,
        y: winRect.top,
        width: winRect.width,
        height: winRect.height,
    };

    if (direction === "minimize") {
        windowEl.style.opacity = "0";
    }

    let startTs: number | null = null;
    function frame(ts: number) {
        if (!startTs) startTs = ts;
        const rawT = clamp((ts - startTs) / GENIE_DURATION, 0, 1);
        renderGenieFrame(ctx, snapshot, W, H, rawT, direction, dockCenter, win);

        if (rawT < 1) {
            rafId = requestAnimationFrame(frame);
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
            onComplete();
        }
    }

    rafId = requestAnimationFrame(frame);
}

export function cancelGenie() {
    if (typeof window !== "undefined") {
        cancelAnimationFrame(rafId);
        if (overlayCanvas) {
            const ctx = overlayCanvas.getContext("2d");
            ctx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
    }
}
