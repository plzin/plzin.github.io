---
title: 'Mixed Boolean-Arithmetic (Part 1.5): The Fundamental Theorem of Mixed Boolean-Arithmetic'
date: '2023-04-24'
macros:
  - Z: \mathbb{Z}
---

This part was originally an appendix to Part 1.
We will treat MBA very formally and prove the "Fundamental Theorem".
I don't recommend reading this part, unless you
- want to see the proof
- are trying to implement this and are confused about details (though you could just read [my implementation](https://github.com/plzin/mba-wasm))

It is totally expected for you to not understand all the details from Part 1
and I didn't even show the details as they require formality (in my opinion).
If all you took away from last part is that we can find a linear combination of bitwise functions,
that equal some given bitwise function, exponentially faster than with general functions,
then I did my job and you can skip this part.

In my opinion, this is one of those times where being formal really pays off
and helps organize everything.
It also allows us to clarify some things that confused me when I first learned about MBA,
which I will talk about at the end.

# Definitions
Let $\Z_2=\{0, 1\}$ be the ring of integers mod 2.
Let $w\in\mathbb{N}$ be the integer width, i.e. the number of bits in an integer.
Let $\Z_{2^w}=\{0,\dots,2^w-1\}$ be the ring of integers mod $2^w$, i.e. the $w$-bit integers.
To be completely formally correct, we will define the function
$$
\begin{align*}
  \beta\colon\Z_2 &\to\Z_{2^w}\\
  0&\mapsto 0\\
  1&\mapsto 1
\end{align*}
$$
which basically lets us interpret an element of $\Z_2$ as an element of $\Z_{2^w}$.
This helps to avoid some confusion, e.g. $\beta(-1)\neq -\beta(1)$ (for $w>1$).

Let $\Z_2^w=\Z_2\times\dots\times\Z_2$ be the ring of $\Z_2$-sequences of length $w$,
i.e. vectors/lists of $w$ bits.
Note that although $\Z_{2^w}$ and $\Z_2^w$ have the same number of elements, they are not isomorphic (for $w>1$),
since their additive groups (and multiplicative monoids) are not isomorphic.
Addition in $\Z_{2^w}$ is just integer addition mod $2^w$,
whereas in $\Z_2^w$ addition is the XOR operation.
(Multiplication in $\Z_2^w$ is the logical AND).
However, we can define the obvious bijection between them:
$$
\begin{align*}
  \varphi\colon\Z_2^w &\to\Z_{2^w}\\
  (b_w,\dots,b_1)&\mapsto\sum_{i=1}^w\beta(b_i)2^{i-1}
\end{align*}
$$
This is just interpreting the sequence of bits as the binary representation of an integer,
e.g. for $w=4$, $\varphi (0, 0, 1, 1) = 3$ or $\varphi^{-1}(6)=(0, 1, 1, 0)$.
It is not a ring homomorphism.

### Extending Boolean Functions to the Integers
$\varphi$ allows us to extend an $n$-ary function $f: \Z_2^n\to\Z_2$
to a function $f_*: \Z_{2^w}^n\to\Z_{2^w}$.
The notation is slightly confusing here (though it is completely consistent).
A function $\Z_2^n\to\Z_2$ should be thought of as taking $n$ inputs
in $\Z_2$ and mapping them to a value in $\Z_2$, instead of a function
taking a single sequence of $n$ bits, although both views are of course equivalent.
The idea of this extension is that the function will be separately applied to each bit.
These are the *bitwise* functions that were informally introduced in the post.
For example the logical and $\land$ is a binary (2-ary, i.e. it takes two inputs) function on bits (i.e. elements of $\Z_2$).
E.g. $1\land 0=0$.
We want to extend this to a function on $w$-bit integers, e.g. $3\land_* 2 = 2$.
The extension will be in two steps.

The extension to $\Z_2^w$ is defined as
$$
\begin{align*}
  f'\colon(\Z_2^w)^n &\to\Z_2^w\\
  (b_{1,w},\dots,b_{1,1}),\dots,(b_{n,w},\dots,b_{n,1})
  &\mapsto(f(b_{1,w},\dots,b_{n,w}),\dots, f(b_{1,1}, \dots, b_{n, 1}))
\end{align*}
$$
This definition looks more confusing than it actually is.
It just means we apply $f$ to the first bit of each input
and the result will be the first bit of the output and so on.
The extension to $\Z_{2^w}$ is then defined as
$$
\begin{align*}
  f_*\colon(\Z_{2^w})^n &\to\Z_{2^w}\\
  x_1, \dots, x_n&\mapsto\varphi(f'(\varphi^{-1}(x_1), \dots, \varphi^{-1}(x_n)))
\end{align*}
$$
Again, this simply means converting each integer into its binary representation,
applying $f'$ to the sequence, which means applying $f$ to each bit,
and converting the resulting sequence to an integer again.
Using our $\land$ example on 2-bit integers:
$$3\land_* 2 = \varphi((1, 1)\land' (1, 0)) = \varphi(1\land 1, 1\land 0) = \varphi(1, 0) = 2$$
We can now formally define the meaning of bitwise functions.
A function $g: \Z_{2^w}^n\to\Z_{2^w}$ is called a bitwise function,
if there exists an $f: \Z_2^n\to\Z_2$ such that $g=f_*$.

More importantly, we are now ready to formally define linear MBA functions.
<div class="theorem">
<div>Definition: Linear Mixed Boolean-Arithmetic Function</div>
A function $g: \Z_{2^w}^n\to\Z_{2^w}$ is called a linear mixed boolean-arithmetic function,
if it can written in the form
$$g(x_1,\dots,x_n)=\sum_{i=1}^m c_if_{i*}(x_1,\dots,x_n)$$
for some constants $c_i\in\Z_{2^w}$ and some functions $f_i: \Z_2^n\to\Z_2$ and $m\in\mathbb{N}$.
In other words, it is a linear combination of bitwise functions.
</div>

It is time for the most important theorem.

# Proof of the "Fundamental Theorem"
<div class="theorem">
<div>Theorem: The Fundamental Theorem of Mixed Boolean-Arithmetic</div>
A linear MBA function $g:\Z_{2^w}^n\to\Z_{2^w}$ is uniquely determined by its values
on $\{0, -1\}^n$ (or $\{0, 1\}^n$).
In other words, if we know the values of $g$ on $\{0, -1\}^n$, then we know the value of $g$ everywhere.
</div>

To give a concrete example of how this is useful.
Suppose we are given two linear MBA functions $f, g: \Z_{2^{32}}\times\Z_{2^{32}}\to\Z_{2^{32}}$.
We only have to check the following equalities to conclude they are equal everywhere:
$f(0, 0)=g(0, 0)$, $f(0, -1)=g(0, -1)$, $f(-1, 0)=g(-1, 0)$, $f(-1, -1)=g(-1, -1)$.
A priori, we have to compare the values for all $2^{64}$ inputs.
This is what allows us to reduce the size of the linear system when generating linear MBA expressions.

Proof:
Note that 0 and -1 are the numbers that only have 0 or 1 in their binary representation.
Thus an input $\mathbf{x}\in\{0, -1\}^n$ has the form that $x_i=\varphi(b_i, b_i, \dots, b_i)$,
i.e. each input number $x_i$ consists only of the same bit $b_i$.
We will define $b^w=\varphi(b, \dots, b)=-\beta(b)$ to be the $w$-bit integer
whose binary representation is just $b$s.
The notation is sort of overloaded because $b^w$ could also be interpreted as $b\cdot\ldots\cdot b$,
but we will need it just for this proof and we will never use the other interpretation.

$$
\begin{align*}
g(b_1^w, \dots, b_n^w)&=\sum_{i=1}^m c_if_{i*}(b_1^w, \dots, b_n^w)\\
&=\sum_{i=1}^m c_i\varphi(f'_i((b_1, \dots, b_1), \dots, (b_n, \dots, b_n)))\\
&=\sum_{i=1}^m c_i\varphi((f_i(b_1, \dots, b_n)), \dots, (f_i(b_1, \dots, b_n)))\\
&=\sum_{i=1}^m c_i\sum_{j=1}^w2^{j-1}\beta(f_i(b_1, \dots, b_n))\\
&=\sum_{i=1}^m c_i\beta(f_i(b_1, \dots, b_n))\sum_{j=1}^w2^{j-1}\\
&=\sum_{i=1}^m c_i\beta(f_i(b_1, \dots, b_n))(-1)\\
&=-\sum_{i=1}^m c_i\beta(f_i(b_1, \dots, b_n))\\
\end{align*}
$$
So for inputs of that form, the result is just minus one times the sum of those $c_i$
where $f_i(b_1,\dots, b_n)=1$. We will need this result in a second.

We will now consider an arbitrary input, i.e. $\varphi(x_i)=(b_{i, 1},\dots,b_{i, w})$.
$$
\begin{align*}
g(x_1, \dots, x_n)&=\sum_{i=1}^m c_if_{i*}(x_1, \dots, x_n)\\
&=\sum_{i=1}^m c_i\varphi(f'_i((b_{1, w}, \dots, b_{1, 1}), \dots, (b_{n,w}, \dots, b_{n,1})))\\
&=\sum_{i=1}^m c_i\varphi((f_i(b_{1, w}, \dots, b_{n, w})), \dots, (f_i(b_{1, 1}, \dots, b_{n, 1})))\\
&=\sum_{i=1}^m c_i\sum_{j=1}^w2^{j-1}\beta(f_i(b_{1, j}, \dots, b_{n, j}))\\
&=\sum_{j=1}^w2^{j-1}\sum_{i=1}^m c_i\beta(f_i(b_{1, j}, \dots, b_{n, j}))\\
&=-\sum_{j=1}^w2^{j-1}g(b_{1,j}^w,\dots,b_{n,j}^w)\\
\end{align*}
$$

The last equality is the previous result.
This means that the value of $g$ on any input depends only on the value of $g$
at inputs of the form discussed before.
<div class="qed-line"></div>

In the original paper on MBA, the set $\{0, 1\}^n$ was used.
(Kinda, we will discuss this in a bit).
Let us quickly prove that the values of the function on this set also uniquely determine
the function.
This idea is the same, the algebra only slightly more annoying.
The inputs now have the form $x_i = \varphi (0, \dots, 0, b_i) = \beta(b_i)$.
The last equality stems from the fact that we view $\Z_2$ as a subset of $\Z_{2^w}$.

$$
\begin{align*}
g(\beta(b_1), \dots, \beta(b_n))&=\sum_{i=1}^m c_if_{i*}(\beta(b_1), \dots, \beta(b_n))\\
&=\sum_{i=1}^m c_i\varphi(f'_i((0, \dots, b_1), \dots, (0, \dots, b_n)))\\
&=\sum_{i=1}^m c_i\varphi((f_i(0, \dots, 0)), \dots, f_i(b_1, \dots, b_n))\\
&=\sum_{i=1}^m c_i\left(f_i(b_1, \dots, b_n) + \sum_{j=2}^w2^{j-1}f_i(0, \dots, 0)\right)\\
&=\sum_{i=1}^m c_i\left(f_i(b_1, \dots, b_n) + f_i(0, \dots, 0)\sum_{j=2}^w2^{j-1}\right)\\
&=\sum_{i=1}^m c_i\left(f_i(b_1, \dots, b_n) - 2f_i(0, \dots, 0)\right)\\
&=-2\sum_{i=1}^m c_if_i(0, \dots, 0) + \sum_{i=1}^m c_if_i(b_1, \dots, b_n)\\
&=2g(0, \dots, 0) + \sum_{i=1}^m c_if_i(b_1, \dots, b_n)\\
\end{align*}
$$
Overall, we have
$$\sum_{i=1}^m c_if_i(b_1, \dots, b_n) = g(b_1,\dots,b_n) - 2g(0,\dots,0)$$

Now we will consider general inputs again, i.e. $x_i=\varphi(b_{i, 1}, \dots, b_{i, w})$.
As we saw before
$$
\begin{align*}
g(x_1, \dots, x_n)
&=\sum_{j=1}^w2^{j-1}\sum_{i=1}^m c_if_i(b_{1, j}, \dots, b_{n, j})\\
&=\sum_{j=1}^w2^{j-1}(g(b_{1, j},\dots,b_{n, j})-2g(0,\dots,0))\\
&=2g(0,\dots,0)+\sum_{j=1}^w2^{j-1}g(b_{1, j},\dots,b_{n, j})\\
\end{align*}
$$
So again, $g$ at any input only depends on the values of $g$ with 0, 1 inputs.
<div class="qed-line"></div>

# Things that confused me
We now have the language to clarify some things that were confusing to me
when I first started learning about MBA.

### The linear system

The first thing is how to construct the matrix/table, because a lot of papers do it differently.
There are basically three different ways, which we will compare with an example.
Let's rewrite `x + y` using `!x`, `!y`, `x & y` and `!(x | y)` on 2-bit numbers.

The way I view the table is as a restriction of the full table,
which just lists the values of all expressions for all inputs.
Even for 2-bit numbers it has 16 rows (for 32-bit numbers it would have $2^{64}$ rows),
so I have omitted some rows, but here is what it would look like.

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="4" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 6em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>!x</th>
      <th>!y</th>
      <th>x & y</th>
      <th>!(x | y)</th>
      <th>x + y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>3</td>
      <td>3</td>
      <td>0</td>
      <td>3</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>3</td>
      <td>2</td>
      <td>0</td>
      <td>2</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>2</td>
      <td>3</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>2</td>
    </tr>
    <tr>
      <td>..</td>
      <td>..</td>
      <td>..</td>
      <td>..</td>
      <td>..</td>
      <td>..</td>
      <td>..</td>
    </tr>
    <tr>
      <td>3</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>3</td>
      <td>0</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
</code>

These tables work for any functions, i.e. also `x * y`,
because all inputs are present.
(That is, if we find a linear combination of some columns that equals another column,
then we made sure that the linear combination always equals the target for all inputs).
It is not easy to see from this table, but I can tell you that
`x + y == !x + !y + 2 * (x & y) - 2 * !(x | y)`.

But if we restrict the operations to be bitwise expressions,
then the fundamental theorem tells us that we only need to consider
the inputs 0/-1 (or 0/1), because equality everywhere is guaranteed.

Restricting the table two the inputs 0/1, we get this:

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="4" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 6em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>!x</th>
      <th>!y</th>
      <th>x & y</th>
      <th>!(x | y)</th>
      <th>x + y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>3</td>
      <td>3</td>
      <td>0</td>
      <td>3</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>3</td>
      <td>2</td>
      <td>0</td>
      <td>2</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>2</td>
      <td>3</td>
      <td>0</td>
      <td>2</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
      <td>1</td>
      <td>2</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
</code>

To me this is a bit ugly, because e.g. $\lnot 1 = -2$, so if we had 8-bit numbers it would be 254.
But this is (of course) correct and ultimately does not matter.
In the example from Part 1, I intentionally chose rewrite operations without negation
so we would not run into this.

I prefer and implement the method using the inputs 0/-1.
The reason this is more beautiful is that all the bits have the same value.
To illustrate, let me write 3 = -1 in the table.

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="4" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 6em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>!x</th>
      <th>!y</th>
      <th>x & y</th>
      <th>!(x | y)</th>
      <th>x + y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>-1</td>
      <td>-1</td>
      <td>0</td>
      <td>-1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>-1</td>
      <td>-1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>-1</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>0</td>
      <td>0</td>
      <td>-1</td>
      <td>0</td>
      <td>0</td>
      <td>-1</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>-1</td>
      <td>0</td>
      <td>0</td>
      <td>-1</td>
      <td>0</td>
      <td>-2</td>
    </tr>
  </tbody>
</table>
</code>

We will call this the uniform table.
This is not the version you will see in most papers (including the original one).
They evaluate all the bitwise expression as if they were 1 bit or boolean expressions.

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="4" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 6em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>!x</th>
      <th>!y</th>
      <th>x & y</th>
      <th>!(x | y)</th>
      <th>x + y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
</code>

We will call this the truth table.
This looks very cool, but it is not immediately clear why this should work.
It is not like the other two, in that we don't just restrict the full table
and prove that the restricted table is enough.
The reason this truth table works is simple if you look at the uniform table.
It is just the negated table, so we are essentially solving $-\mathbf{A}\mathbf{x}=-\mathbf{b}$,
which, of course, has the same solutions.
So while the table looks the best, it is conceptually a bit less clear (in my opinion)
and the implementation perhaps not as nice.

### The Number 1
We already encountered this problem when obfuscating constants in Part 1.
Let's not be unnecessarily general and restrict ourselves to two variables.
We will call the constant 1 function (on 1 bit) $\mathbb{1}$:
$$
\begin{align*}
  \mathbb{1}\colon\Z_2\times\Z_2 &\to\Z_2\\
  x_1,x_2&\mapsto 1
\end{align*}
$$
Extending this function to the $w$-bit integers $\Z_{2^w}$,
we just apply the function at each bit,
so the result will be a 1 in each bit which is the constant $-1=\varphi(1,\dots,1)$ (or $2^w-1$):
$$
\begin{align*}
  \mathbb{1}_*\colon\Z_{2^w}\times\Z_{2^w} &\to\Z_{2^w}\\
  x_1,x_2&\mapsto -1
\end{align*}
$$
If we write $-1$ for the constant function that returns -1, then we get $\mathbb{1}_* = -1$,
which is ultimately the root of all confusion and sign errors.

So suppose we want to obfuscate the constant 1 with the rewrite operations `x ^ y` and `!(x ^ y)`.
We will use the truth table because it looks the cutest.

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="2" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 6em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x ^ y</th>
      <th>!(x ^ y)</th>
      <th>1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</code>

And we read off the solution `(x ^ y) + !(x ^ y) == 1`, right?
This actually isn't correct, can you see why?
We actually have `(x ^ y) + !(x ^ y) == -1`.
The problem is that we found a linear combination such that
$$(x\oplus_* y) + \lnot(x\oplus_* y) = \mathbb{1}_* = -1$$

To avoid confusion, the function $\mathbb{1}_*$ should be called something else.
In my implementation, I called it [`Ones`](https://github.com/plzin/mba-wasm/blob/d4e7824f2e4d01999c3b1919f6ba16a30e101601/src/uniform_expr.rs#L219)
to suggest that there is a 1 in each bit,
but you could also call it -1, because it returns the constant -1 for any integer width.
Then the table would look the same except for the name of the function and produce the correct linear combination (for -1).
(The table before also produced the correct linear combination,
but we made the mistake when reading off the solution.)

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="2" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 6em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x ^ y</th>
      <th>!(x ^ y)</th>
      <th>-1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</code>

Should we want to obfuscate any constant $c$, we just multiply $\mathbb{1}_* = -1$ by $-c$,
e.g. for $c=42$

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="2" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 8em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x ^ y</th>
      <th>!(x ^ y)</th>
      <th>-42 * (-1)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>-42</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>-42</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>-42</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>-42</td>
    </tr>
  </tbody>
</table>
</code>

In my opinion this looks much more natural in the uniform table:

<code>
<table>
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
    <col span="2" style="width: 5em">
    <col style="border-left: 2px solid var(--border-2); width: 8em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x ^ y</th>
      <th>!(x ^ y)</th>
      <th>-42 * (-1)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>-1</td>
      <td>42</td>
    </tr>
    <tr>
      <td>0</td>
      <td>-1</td>
      <td>-1</td>
      <td>0</td>
      <td>42</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>0</td>
      <td>-1</td>
      <td>0</td>
      <td>42</td>
    </tr>
    <tr>
      <td>-1</td>
      <td>-1</td>
      <td>0</td>
      <td>-1</td>
      <td>42</td>
    </tr>
  </tbody>
</table>
</code>

I am repeating myself, but in this table all the columns contain values of the expressions
that would actually be computed during execution.
Since we want the result to be 42, the last column has to be 42.