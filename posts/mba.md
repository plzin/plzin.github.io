---
title: 'Mixed Boolean-Arithmetic (Part 1): Introduction'
date: '2023-04-24'
macros:
  - Z: \mathbb{Z}
summary: 'Introduction to Mixed Boolean-Arithmetic'
---

What does the following function do?

```cpp
int hmm(int x, int y) {
    return (x ^ y) + 2 * (x & y);
}
```

Maybe, if you computed some examples, you could figure it out,
because what the function computes is fairly simple.
You could also try to decipher what happens on the bit level,
although it probably isn't that easy.
This function is an example of what is called **Mixed Boolean-Arithmetic** (MBA).
It combines arithmetic operations (+, -, *, /) with boolean operations (&, |, ^, ~).

I will tell you what that function does though.
The function adds `x` and `y`.
You can see this by considering what the two terms (`x ^ y` and `x & y`) represent:

`x ^ y` is the sum of `x` and `y` without carries.
E.g. `11 ^ 01 = 10`, because we add the 1's in the least significant bit which gives us 0 and a carry of 1 but we just ignore the carry
and continue with the next bit.

`x & y` has bits set to 1 in positions where a carry is 'generated', i.e. when the two bits are 1.
Multiplying that by 2 shifts those bits to the left by one.
(Remember multiplication by $2^n$ is just a shift by $n$).
These bits are now in the correct position to be added to the result of the carry-less addition.
(When a carry happens you add the carry to the result of the next digit/bit.)

That's pretty cool! Can we automate it, i.e. automatically generate MBA expressions?
Yes we can, look at the following function:

```cpp
int what(int x, int y, int z, int w) {
	return 4071272 * w + 3590309086 * (w | z & z & (y |
		w)) + 3690425492 * (w & x ^ ~z ^ ~y) + 3735539420 *
		(y ^ (w & z | y)) + 3176111544 * ((x & y | x ^ z) ^
		~y) + 90227856 * (y & x & x & (x & w | ~w)) +
		2231609705 * (~z ^ w & x | z ^ x | x | w) +
		263864489 * (w ^ z | x | w | z) + 17029904 *
		(~w ^ w ^ (x | z) ^ ~x) + 2987805917 * (z & x) +
		1280785607 * z + 2092481170 * (y & (w & y | ~z)) +
		637019375 * (~w | w & z & ~x) + 3221225472 * ((x |
		w) ^ x ^ x ^ y) + 3985988880 * x + 263864489 * (~~w &
		x) + 469200020 * ((z ^ w & w) & ~(x ^ y)) +
		1774328762 * ((w | x) & (x ^ z) & z) + 3645311564 *
		(~(z | w) | w) + 3194849700 * ~((y | y) ^ y ^ z)
		+ 1678283628 * ~(~y & ~w) + 1083630375 * y;
}
```

It again computes `x + y`.
The values of `z` and `w` do not matter.

This post is Part 1 in a 4.5 Part series and will go over the basics
of how MBA expressions are generated.
Part [1.5](/posts/mba-theorem) will prove the "Fundamental Theorem of Mixed Boolean-Arithmetic"
and make things rigorous.
Parts [2](/posts/linear-systems-mod-n) and [3](/posts/perm-poly)
deal with specific problems that arise when generating MBA,
which I will introduce in the rest of this post.
Part [4](/posts/mba-deobf) is be about deobfuscation.

# Basics
There are two primitives used in MBA expressions, which were presented in the [original paper](https://link.springer.com/chapter/10.1007/978-3-540-77535-5_5):
- Linear MBA identities
- Permutation polynomials

The two examples you just saw are just linear MBA identities.
The first one was $x+y = (x \oplus y) + 2\cdot (x \land y)$.
This particular one works for numbers of any width (number of bits),
but in general they can be specific to a certain width.
Linear means that the expression is a
[linear combination](https://en.wikipedia.org/wiki/Linear_combination) of boolean expressions.
So these will always have the form of a constant (coefficient) times
a boolean expression (e.g. $\lnot x \land (y \lor z)$) plus a constant times
a boolean expression, and so on.

Permutation polynomials permute the $w$-bit integers.
The inverse permutation is also a polynomial.
Here is an example for the 8-bit integers:
$$p(x) = 196x^3 + 48x^2 + 75x + 116$$
$$q(x) = 16x^5 + 124x^3 + 96x^2 + 35x + 36$$
$q$ and $p$ are inverses of each other ($p(q(x)) = q(p(x)) = x$).

As permutation polynomials are purely arithmetical,
their connection to MBA is rooted in history more than anything else.
The original paper presents them as a way to turn linear MBA expressions
into polynomial ones, but there are other ways, as we will see in a bit.
Nevertheless, I really like permutation polynomials for the fun
challenges they pose in trying to understand them which are not wholly unrelated
to linear MBA as we will see at the end of Part 3 of this series.
And you can easily turn them into MBA expressions by (e.g.) choosing
coefficients of one polynomial that have small
[Hamming weight](https://en.wikipedia.org/wiki/Hamming_weight)
so that the multiplication can be efficiently rewritten
as additions and shifts, or rewriting the multiplications by constants with linear MBA.

Anyways, our current problem with linear MBA as well as permutation polynomials
is how to generate them automatically.

### Small history of MBA
The [original paper](https://link.springer.com/chapter/10.1007/978-3-540-77535-5_5) on mixed boolean arithmetic, which – as far as I know – also introduced the term, was published in 2007.
But even before that in 2001, Rivest (of **R**SA fame) published a [characterization of permutation polynomials](https://www.sciencedirect.com/science/article/pii/S107157970090282X?via%3Dihub), but without a way of inverting them.
The 2007 paper included a formula for inverting a subset of permutation polynomials.
A method of [computing the inverse of any permutation polynomial](https://dl.acm.org/doi/10.1145/2995306.2995310) was only published in 2016.

# Linear MBA
To me personally, this seems like it should be the more difficult problem of the two.
It seems like there should just be some neat formula to find the inverse of a permutation polynomial,
but historically this problem was solved first.

How would you go about automatically creating linear MBA identities?
In the first code example there was this neat explanation that `x & y` are the carry bits
which are shifted by multiplying it by 2 and `x ^ y` is addition without carry.
Obviously, such explanations won't always exist or be automatically derivable.

Let's still use that as an example:
We want to rewrite `x + y` using `x ^ y` and `x & y`.
What you can do (for any function whatsoever), is make a table of the outputs
for both the rewritten expression (`x + y`) as well as
the expressions used for rewriting (`x & y`, `x ^ y`)
for all possible inputs.
We will assume `x` and `y` are 2-bit numbers.

<code>
<table style="width: 50%">
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
  </colgroup>
  <thead style>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x ^ y</th>
      <th>x & y</th>
      <th>x + y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>2</td>
      <td>2</td>
      <td>0</td>
      <td>2</td>
    </tr>
    <tr>
      <td>0</td>
      <td>3</td>
      <td>3</td>
      <td>0</td>
      <td>3</td>
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
      <td>2</td>
    </tr>
    <tr>
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
      <td>3</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
</code>

By adding the corresponding columns (and multiplying the `x & y` column by 2),
you can verify that indeed `(x ^ y) + 2 * (x & y)` equals `x + y` (mod 4).

We can write this in matrix form as:
$$
\underbrace{\left[\begin{array}{cc}
  0 & 0 \\
  1 & 0 \\
  2 & 0 \\
  3 & 0 \\
  1 & 0 \\
  0 & 1 \\
  .. & .. \\
  0 & 3 \\
\end{array} \right]}_{\mathbf{A}}
\underbrace{\left[\begin{array}{c} 1 \\ 2 \end{array} \right]}_{\mathbf{x}} 
= \underbrace{\left[\begin{array}{c}
  0 \\ 1 \\ 2 \\ 3 \\ 1 \\ 2 \\ .. \\ 2 \\
\end{array} \right]}_{\mathbf{b}}
$$

The columns of the matrix $\mathbf{A}$ are the `x ^ y` and `x & y` columns from the table.
The entries of the vector $\mathbf{x}$ are the coefficients of the linear combination.
The vector $\mathbf{b}$ is the `x + y` column from the table.
Maybe you can see where this is going.
We construct the matrix $\mathbf{A}$ and the vector $\mathbf{b}$
and solve the linear system of equations $\mathbf{A}\mathbf{x}=\mathbf{b}$.

There are just two problems with this:
1. The full table would be 16 rows, or $2^{wn}$ where $w$ is the integer width and $n$ is the number of variables. This will be way too big for realistic $w$.
2. We are looking for integer solutions and the equations are modulo $2^w$. You could say we are solving the system over $\Z_{2^w}$ which are the integers mod $2^w$. Unfortunately this is not a [field](https://en.wikipedia.org/wiki/Field_(mathematics)), meaning usual linear algebra won't work, i.e. standard gaussian elimination can't solve this.

The second problem will be the topic of the second post in this series.
The first one we can address right here.
There is one crucial property we haven't used yet.
In the above construction we can use any function for rewriting,
it doesn't have to be a boolean expression, which is nice,
but only in restricting the class of functions does this actually become practical.
Because unlike general functions, boolean expressions are just applied bitwise,
meaning the value of bit i of the output only depends on bits i of the inputs.
I will refer to functions with this property as **bitwise functions**.
Basically any function $f: \{0, 1\}^n \to \{0, 1\}$ that is applied to each bit separately
is a bitwise function.
(There are 16 such functions with 2 inputs or $2^{2^n}$ in general).
For example bit i of `x * y` depends on a lot of bits and not just bit i of `x` and bit i of `y`,
so it is not a bitwise function whereas `x & y` is.

It is this property of bitwise functions that makes it possible
to restrict the inputs we have to consider to just 0 and 1 for each input.
This is what I call the "Fundamental Theorem of Mixed Boolean-Arithmetic".
It will be proved in Part 1.5.
In the example above, we would only have the following table with 4 rows instead of 16 or in general $2^n$ instead of $2^{wn}$.

<code>
<table style="width: 50%">
  <colgroup>
    <col style="width: 3em">
    <col style="border-right: 2px solid var(--border-2); width: 3em">
  </colgroup>
  <thead>
    <tr>
      <th>x</th>
      <th>y</th>
      <th>x ^ y</th>
      <th>x & y</th>
      <th>x + y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
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
      <td>2</td>
    </tr>
  </tbody>
</table>
</code>

`x + y` is not bitwise, why is it still allowed?
That's because the set of functions allowed is actually slightly bigger.
Linear combinations of bitwise functions are also allowed.
Supplying a linear combination of bitwise function instead of supplying the bitwise functions separately amounts to limiting the coefficients that are allowed in the linear combination.
`x + y` is just a linear combination (with coefficients 1) of the identity functions on `x` and `y`.
Solving these linear systems will be the subject of the [second post](/posts/linear-systems-mod-n).

<!--I am ignoring some details here that will be explained in the proof of (what I call)
the "Fundamental Theorem of Mixed Boolean Arithmetic" in the appendix of this post.
For example, what happens when the bitwise function $\neg x$ is evaluated at $x=0$?
Should the result be 1 or 3 (for 2-bit integers)?
That is, do we consider the operations to be applied to all bits or just the one bit?
I can tell you the answer is 3 or "all bits", but this will be clear from the discussion of the proof.
For that reason it is also conceptually clearer to use the inputs 0 and -1,
i.e. all bits 0 and all bits 1.-->

# Permutation Polynomials
There is a simple characterization of permutation polynomials which allows us to generate them very easily.
This characterization is due to [Rivest](https://www.sciencedirect.com/science/article/pii/S107157970090282X?via%3Dihub):

A polynomial $p(x) = a_0 + \dots + a_dx^d$ over $\Z_n$ is a permutation polynomial if and only if
- $a_1$ is odd
- $a_2 + a_4 + a_6 + \dots$ is even
- $a_3 + a_5 + a_7 + \dots$ is even

The problem then, is finding the inverse to such a polynomial.
As mentioned, this is not trivial in general, but we can quickly take a look at a simple example where $d = \deg p = 1$: $p(x) = a_1x + a_0$.
These are used as [Linear Congruential Generators](https://en.wikipedia.org/wiki/Linear_congruential_generator) (although the modulus need not be a power of two) that are used as very simple (and definitely not cryptographically secure) random number generators.

The following discussion is not strictly necessary to understand the rest of this post. It is more for the fun of it.

It is fairly easy to see that the value of $a_0$ neither makes nor breaks a permutation polynomial and can be chosen freely.
Let's set $a_0 = 0$.
What values can $a_1$ take?
It is pretty clear that $a_1$ can't be even, otherwise $a_1x$ can only be equal to an even number mod $2^n$.
But it can actually equal any odd number.
The reason is that any odd number has a multiplicative inverse in $\Z_{2^n}$, since $2^n$ has only the prime factor 2 and thus the greatest common divisor of an odd number and $2^n$ is 1.
The inverse $a_1^{-1}$ can be computed with the [extended euclidean algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Modular_integers).
$a_1x$ maps to $y$ for $x=a_1^{-1}y$.

We can also easily compute the inverse $q(x) = b_1x + b_0$.
$$q(p(x)) = b_1(a_1x + a_0) + b_0 = b_1a_1x + b_1a_0 + b_0 \stackrel!= x$$
By equating coefficients, we get:
$$b_1a_1 = 1 \implies b_1 = a_1^{-1}$$
$$b_1a_0 + b_0 = a_1^{-1}a_0 + b_0 = 0 \implies b_0 = -a_1^{-1}a_0$$
So in general the inverse is given by
$$q(x) = a_1^{-1}x - a_1^{-1}a_0$$

For higher degree polynomials this becomes much more difficult and (as far as I know) no easy formula for the inverse of a permutation polynomial exists.
But there are algorithms for this, which we will explore in [Part 3](/posts/perm-poly),
in addition to many other details concerning polynomials mod n.

# Obfuscating Constants
Of course, there are many ways to combine these primitives.
One application I particularly like is obfuscating constants.
Let's fix the number of variables $n=2$ and integer width $w=8$ for simplicity.
I will be using the following shorthand for bitwise functions $f\colon\Z_{256}^2\to\Z_{256}$:
$$
\langle f \rangle = \left[\begin{array}{c}
  f(0, 0) \\ f(0, 1) \\ f(1, 0) \\ f(1, 1) \\
\end{array}\right], \hspace{1cm}\text{e.g. }
\langle x \oplus y \rangle = \left[\begin{array}{c}
  0 \\ 1 \\ 1 \\ 0 \\
\end{array}\right]
$$
which is basically a column of the matrix we constructed before.

Let's also fix the operations used for rewriting as
$x\oplus y$, $x\land y$ and $\lnot (x \lor y)$ and the constant to obfuscate as $42$.
These are sufficient to obfuscate any constant
(but they will always result in the same linear combination, so you should provide more if possible).

You might just try to construct the linear system like this:
$$\left[\begin{array}{ccc}
  \langle x\oplus y \rangle & \langle x \land y \rangle & \langle \lnot(x \lor y) \rangle\\
\end{array}\right]\cdot\textbf{x} = \langle 42 \rangle$$

This is sort of correct, but there are some misconceptions at play here.
The constant $42$ is not a bitwise function, because there is a different function for bits in different positions:
For some bits, it is the constant 0 function, and for the others, the constant 1 function.
We know, though, that the rewrite/rewritten operation(s) are allowed to be
linear combinations of bitwise functions, so maybe this would work:

$$\left[\begin{array}{ccc}
  \langle x\oplus y \rangle & \langle x \land y \rangle & \langle \lnot(x \lor y) \rangle\\
\end{array}\right]\cdot\textbf{x} = 42\cdot \langle 1 \rangle
$$

This is at least clearly defined, but also wrong.
Suppose we initialize an 8-bit number with the constant $1$ function.
What value would be stored in that number?
Every bit would be a one, so the number would be `0xff = 255` or `-1` if the number was signed (interpreted in [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement)).
And this will be the clue to getting it right.
The constant $1$ function represents the number -1 and the coefficient we want is thus -42.
The correct equation is

$$\left[\begin{array}{ccc}
  \langle x\oplus y \rangle & \langle x \land y \rangle & \langle \lnot(x \lor y) \rangle\\
\end{array}\right]\cdot\textbf{x} = -42\cdot \langle 1 \rangle$$

If you wanted to be more suggestive, you could call the constant one function -1,
i.e. write $\langle -1\rangle$.
If you are confused and care, you should read [Part 1.5](/posts/mba-theorem) of this series,
where I discuss this in more detail at the end.

Here is an example with a few more rewrite operations.

```cpp
uint8_t constant(uint8_t x, uint8_t y, uint8_t z) {
    return -115 * (x ^ y) - 41 * (x & y) - 189 * ~(x | y)
        - 203 * ~x + 74 * ~y + 20 * z - 20 * (y & z)
        - 21 * (x | z) + 21 * (~x & z) + 20 * (y | ~z);
}
```

Since we're dealing with 3 8-bit inputs, brute-forcing the equivalence is quick and easy.
It took my CPU 28ms, which is insanely fast
(even when considering that everything fits into register).
This is one of these occasions where I realize how fast modern CPUs are.
That being said, we can easily generate an expression with more variables,
which would quickly make brute-force infeasible.
If we were dealing with 32-bits, this would already be prohibitively expensive with just 3 inputs.
I also asked Z3 to prove the equivalence, which took about 4 minutes,
so I am pretty sure it just brute-forced it indirectly.

Nevertheless, we can deobfuscate any such expression rather quickly,
using what we know about MBA, which I will explain in [Part 4](/posts/mba-deobf).
(Maybe you can already see how that works.)
In order to make these expression more resilient to deobfuscation,
we will now go over a few ways of turning linear MBA into non-linear MBA.

# Non-Linear MBA
Continuing with the example of obfuscating 42,
we can transform the given linear MBA expression to a non-linear one,
by just rewriting the constant factors of the linear combination with linear MBA.
We will use the same rewrite operations for the constants
but exclude the operation whose factor we are obfuscating.
For example, we will rewrite the `-115` with the same operations except for `x ^ y`.
When we expand the resulting product in each term in the linear combination,
we get a linear combination of products of bitwise functions.
(Each product appears twice, so we can add the corresponding coefficients).
The result is this:

```cpp
uint8_t constant(uint8_t x, uint8_t y, uint8_t z) {
    return 141 * (x & y) * (x ^ y) + 120 * (x ^ y) * ~(x | y)
        + 71 * (x ^ y) * ~x + 27 * (x ^ y) * ~y + 65 * z * (x ^ y)
        + 15 * (y & z) * (x ^ y) + 126 * (x | z) * (x ^ y) + 236
        * (~x & z) * (x ^ y) + 187 * (y | ~z) * (x ^ y) + 10
        * (x & y) * ~(x | y) + 90 * (x & y) * ~x + 142 * (x & y)
        * ~y + 163 * z * (x & y) + 41 * (x & y) * (y & z) + 38
        * (x & y) * (x | z) + 148 * (x & y) * (~x & z) + 162
        * (x & y) * (y | ~z) + 162 * ~x * ~(x | y) + 147 * ~y
        * ~(x | y) + 108 * z * ~(x | y) + 104 * (y & z) * ~(x | y)
        + 89 * (x | z) * ~(x | y) + 193 * (~x & z) * ~(x | y) + 97
        * (y | ~z) * ~(x | y) + 106 * ~x * ~y + 162 * z * ~x + 14
        * (y & z) * ~x + 8 * (x | z) * ~x + 72 * (~x & z) * ~x + 40
        * (y | ~z) * ~x + 125 * z * ~y + 255 * (y & z) * ~y + 114
        * (x | z) * ~y + 222 * (~x & z) * ~y + 2 * (y | ~z) * ~y
        + 97 * z * (x | z) + 229 * z * (~x & z) + 211 * (y & z)
        * (x | z) + 231 * (y & z) * (~x & z) + 98 * (x | z)
        * (y | ~z) + 228 * (~x & z) * (y | ~z);
}
```

Verifying the equivalence took Z3 100 minutes,
so we can assume it is again (indirectly) brute-forcing.
(It would be weird if it had to brute-force linear but not non-linear).
Again, we could brute-force this faster in C,
but this would be impractical for more variables or larger integers.

Another way of generating non-linear MBA is to rewrite the constant 1 with linear MBA,
and multiply the result with any linear MBA expression.
Expanding this out also gives us a linear combination of products of bitwise functions.

Lastly, we can use permutation polynomials.
Given a linear MBA expression, we can plug it into a permutation polynomial
and expand the definition of the polynomial.
We can then afterwards compute the inverse permutation via the inverse polynomial.

I'm sure you can come up with many ways to combine these primitives,
including with other obfuscation techniques.

# What's next?
If you want to try this for yourself, check out my web interface [here](https://plzin.github.io/mba-wasm/).
My initial implementation using arbitrary precision integers can be found [here](https://github.com/plzin/mba).
This is the first post in a 4.5 part series.
There is a [Part 1.5](/posts/mba-theorem) where we prove the the
"Fundamental Theorem of Mixed Boolean-Arithmetic" and discuss things more formally,
so if you actually want to understand the details then check it out.
The [second post](/posts/linear-systems-mod-n) is about solving linear systems in $\Z_n$.
The [third post](/posts/perm-poly) is about permutation polynomials.
And the [last post](/posts/mba-deobf) is about deobfuscation.