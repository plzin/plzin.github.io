type Expr = string | {
  expr: string;
  label: string;
};

// Use the rust negation instead of the C one.
function makeLabel(label: string): string {
  return label.replace('~', '!');
}

function labels(exprs: Expr[]): string[] {
  return exprs.map(expr => `\`${typeof expr === 'string' ? makeLabel(expr) : expr.label}\``);
}

function exprs(exprs: Expr[]): string[] {
  return exprs.map(expr => typeof expr === 'string' ? expr : expr.expr);
}

interface Column {
  span: number;
  style: string;
}

interface Table {
  head: string[];
  cols: Column[];
  body: string[][];
}

function tableToHtml(table: Table): string {
  const head = table.head.map(cell => `<th>${cell}</th>`).join('');
  const body = table.body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
  const colgroup = table.cols.map(col => `<col style="${col.style}" span="${col.span}">`).join('');
  return `<div class="max-w-full overflow-x-scroll"><table><colgroup>${colgroup}</colgroup><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function tableFromRows(rows: string[][], e: Expr[]): string {
  const tableHead = ['`x`', '`y`', ...labels(e)];
  const cols: Column[] = [{
    span: 1,
    style: '',
  }, {
    span: 1,
    style: 'border-right: 1px solid var(--color-primary);'
  }, {
    span: e.length,
    style: 'width: 6rem;',
  }];
  return tableToHtml({
    head: tableHead,
    cols,
    body: rows,
  });
}

// Assumes `b > 0`.
function modRounded(a: bigint, b: bigint): bigint {
  const r = a % b;
  const half = b / 2n;
  return r > half ? r - b : r < -half ? r + b : r;
}

// Assumes `b > 0`.
function modEuclid(a: bigint, b: bigint): bigint {
  const r = a % b;
  return r < 0n ? r + b : r;
}

export function makeUniformTable(e: Expr[], n: bigint): string {
  const rows: string[][] = [];
  const vals = [0n, -1n];
  for (const x of vals) {
    for (const y of vals) {
      const row = [x.toString(), y.toString()];
      for (const expr of exprs(e)) {
        const result = modRounded(BigInt(eval(expr)), n);
        row.push(result.toString());
      }
      rows.push(row);
    }
  }
  return tableFromRows(rows, e);
}

export function makeTruthTable(e: Expr[], n: bigint): string {
  const rows: string[][] = [];
  const vals = [0n, -1n];
  for (const x of vals) {
    for (const y of vals) {
      const row = [(-x).toString(), (-y).toString()];
      for (const expr of exprs(e)) {
        const result = modRounded(-BigInt(eval(expr)), n);
        row.push(result.toString());
      }
      rows.push(row);
    }
  }
  return tableFromRows(rows, e);
}

export function makeTruncatedFullTable(e: Expr[], n: bigint, numVals: number): string {
  const rows: string[][] = [];

  // This doesn't handle `numVals == 1`, but that doesn't matter.
  const vals: [bigint, bigint][] = [];
  outer: for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      vals.push([BigInt(x), BigInt(y)]);
      if (vals.length >= numVals) {
        break outer;
      }
    }
  }

  if (vals.length + 1 < n * n) {
    vals.push([-1n, -1n]);
    vals.push([n - 1n, n - 1n]);
  }

  for (const [x, y] of vals) {
    if (x === -1n && y === -1n) {
      rows.push(rows[0].map(() => '..'));
      continue;
    }

    const row = [x.toString(), y.toString()];
    for (const expr of exprs(e)) {
      const result = modEuclid(BigInt(eval(expr)), n);
      row.push(result.toString());
    }
    rows.push(row);
  }
  return tableFromRows(rows, e);
}

export function make01Table(e: Expr[], n: bigint): string {
  const rows: string[][] = [];
  const vals = [0n, 1n];
  for (const x of vals) {
    for (const y of vals) {
      const row = [x.toString(), y.toString()];
      for (const expr of exprs(e)) {
        const result = modEuclid(BigInt(eval(expr)), n);
        row.push(result.toString());
      }
      rows.push(row);
    }
  }
  return tableFromRows(rows, e);
}

export function navbar(cur: number): string {
  const parts = [
    ['mba', '1'],
    ['mba-theorem', '1.5'],
    ['linear-systems-mod-n', '2'],
    ['perm-poly', '3'],
    ['mba-deobf', '4'],
  ];

  const links = parts.map(([id, name], idx) => {
    if (idx === cur) {
      return `<span class="text-base-content/60 w-10 text-center">${name}</span>`;
    } else {
      return `<a href="/posts/${id}" class="w-10 text-center hover:underline no-underline">${name}</a>`;
    }
  }).join(' / ');
  return `<div class="w-fit dashed-card border-base-content/20 flex gap-2 mx-auto mt-4">${links}</div>`;
}