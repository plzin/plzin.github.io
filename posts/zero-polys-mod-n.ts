import rough from 'roughjs';
import { Drawable } from 'roughjs/bin/core';

interface SVG {
  str: string;
}

const max = 5;

const generator = rough.generator();

function append(svg: SVG, drawable: Drawable) {
  for (const p of generator.toPaths(drawable)) {
    svg.str += `<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill ?? 'none'}"></path>`;
  }
}

function cross(svg: SVG, i: number, j: number, color: string) {
  const x = 60 + i * 80;
  const y = 440 - j * 80;
  const opts = {
    stroke: color,
    strokeWidth: 2,
  };
  append(svg, generator.line(x - 10, y - 10, x + 10, y + 10, opts));
  append(svg, generator.line(x - 10, y + 10, x + 10, y - 10, opts));
}

function drawDiagram(clr_fn: (x: number, y: number) => string) {
  const svg: SVG = { str: '<svg viewBox="0 0 500 500" style="display:block;margin:auto;width:500px;max-width:100%">' };
  const opts = {
    stroke: 'var(--color-base-content)',
    strokeWidth: 2,
  };
  append(svg, generator.line(10, 490, 450, 490, opts));
  append(svg, generator.line(10, 490, 10, 50, opts));
  append(svg, generator.line(0, 60, 10, 50, opts));
  append(svg, generator.line(10, 50, 20, 60, opts));
  append(svg, generator.line(440, 480, 450, 490, opts));
  append(svg, generator.line(450, 490, 440, 500, opts));
  for (let x = 0; x < max; x += 1) {
    for (let y = 0; y < max; y += 1) {
      cross(svg, x, y, clr_fn(x, y));
    }
  }
  svg.str += '</svg>';
  return svg.str;
}

export const svg1 = drawDiagram((x, y) => {
  const a = 2;
  const b = 2;
  if (x == a && y == b) {
    return 'gold';
  } else if (x <= a && y <= b) {
    return 'red';
  } else {
    return 'dodgerblue';
  }
});

export const svg2 = drawDiagram((x, y) => {
  const k = 3;
  const sum = x + y;
  if (sum < k) {
    return 'red';
  } else if (sum == k) {
    return 'gold';
  } else {
    return 'dodgerblue';
  }
});