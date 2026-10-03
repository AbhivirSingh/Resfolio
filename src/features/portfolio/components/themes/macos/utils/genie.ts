/**
 * Core genie effect rendering logic.
 */

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eioC = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eIn2 = (t: number) => t * t;
export const eOut2 = (t: number) => 1 - (1 - t) * (1 - t);

export const GENIE_DURATION = 480; // ms

export function renderGenieFrame(
    ctx: CanvasRenderingContext2D,
    off: HTMLCanvasElement | HTMLImageElement,
    canvasW: number,
    canvasH: number,
    rawT: number,
    dir: "minimize" | "restore",
    dock: { x: number; y: number },
    win: { x: number; y: number; width: number; height: number }
) {
    ctx.clearRect(0, 0, canvasW, canvasH);

    const winW = win.width;
    const winH = win.height;

    for (let y = 0; y < winH; y++) {
        const r = y / winH;

        const rowXStart = dir === "minimize" ? (1 - r) * 0.65 : r * 0.65;
        const xP = clamp((rawT - rowXStart) / (1 - rowXStart), 0, 1);
        const xE = eioC(xP);

        const rowYStart = dir === "minimize" ? (1 - r) * 0.2 : r * 0.2;
        const yP = clamp((rawT - rowYStart) / (1 - rowYStart), 0, 1);
        const yE = eIn2(yP);

        let left: number, right: number, destY: number;
        if (dir === "minimize") {
            left = lerp(win.x, dock.x, xE);
            right = lerp(win.x + winW, dock.x, xE);
            destY = lerp(win.y + y, dock.y, yE);
        } else {
            left = lerp(dock.x, win.x, xE);
            right = lerp(dock.x, win.x + winW, xE);
            destY = lerp(dock.y, win.y + y, yE);
        }

        const rowW = right - left;
        if (rowW < 0.8) continue;

        ctx.drawImage(off, 0, y, winW, 1, left, destY, rowW, 1);
    }

    const glowRaw = dir === "minimize" ? rawT : 1 - rawT;
    if (glowRaw > 0.75) {
        const a = eOut2((glowRaw - 0.75) / 0.25) * 0.3;
        const hex = Math.round(a * 255).toString(16).padStart(2, "0");
        const g = ctx.createRadialGradient(dock.x, dock.y, 0, dock.x, dock.y, 55);
        g.addColorStop(0, "#ffffff" + hex);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvasW, canvasH);
    }
}
