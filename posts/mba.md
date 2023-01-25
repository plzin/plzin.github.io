---
title: 'Mixed Boolean-Arithmetic (Part 1): Introduction'
date: '2022-06-07'
macros:
  - Z: \mathbb{Z}
---

What does the following function do?

```cpp
int hmm(int x, int y) {
    return (x ^ y) + 2 * (x & y);
}
```

Maybe, if you computed some examples, you could figure it out, because what the function computes is fairly simple.
You could also try to decipher what happens on the bit level without computing any examples, although it probably isn't that easy.
What the function uses is called **Mixed boolean-arithmetic** (MBA): It combines arithmetic operations (+, -, *, /) with boolean operations (&, |, ^, ~).

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
int what(int x, int y, int z) {
    int d = 3114439982 * (y & y) + 1557219991 * (y ^ y)
        + -2147483648 * ~(y ^ y ^ z) + 302211727 * ~y
        + 582187895 * ~y + -3122515744 * y + 3410567674 * z
        + 3031883270 * (y & z) + -3402491911 * (y | z)
        + 3402491911 * (~y & z) + 1263084026 * (y | ~z);

    int c = 968665204 + d * (1490187595 + d * (2190486832 + d * 1984426948));

    int b = 1638991652 + c * (3509105699 + c * (2567890784 + c *
        (218661116 + c * (3837987200 + c * (3840643600 + c *
        (4291667968 + c * (123786496 + c * (4294891520 + c *
        (27030784 + c * (4291321856 + c * (11271168 + c *
        (4293525504 + c * (114688 + c * (4293918720 + c *
        (1441792 + c * (0 + c * 65536))))))))))))))));

    int a = -916623562 * (x & b) + -3679537253 * (x ^ b)
        + 3221225472 * ~(x ^ b ^ z) + -3983377 * ~x
        + 2410021085 * ~b + -3574118078 * b + -258554060 * z
        + -815187764 * (b & z) + 2601812053 * (x | z)
        + 3840638891 * (~x & z) + 2962671412 * (b | ~z);

    return -1253380852 * (a & b) + -1700432250 * (a ^ b)
        + -3221225472 * ~(a ^ b ^ z) + 1975477278 * ~a
        + 1536970157 * ~b + -4278790360 * b + -1364963787 * z
        + 2438705611 * (b & z) + 454684057 * (a | z)
        + 1692799591 * (~a & z) + 4003745333 * (b | ~z);
}
```

It again computes `x + y`. The value of `z` does not matter.
In this series of posts I will explain how you can do that (obfuscation) and possibly also how you can go undo (deobfuscate) them.
This post will go over the basics and explain how these expressions are generated.
There will be two problems whose solution will be presented in the following two blog posts and they will use some algebra ([rings](https://en.wikipedia.org/wiki/Ring_(mathematics)), [ideals](https://en.wikipedia.org/wiki/Ideal_(ring_theory))).

# Basics
There are two primitives used by used in MBA expressions, which were presented in the [original paper](https://link.springer.com/chapter/10.1007/978-3-540-77535-5_5):
- (Linear) MBA identities
- Permutation polynomials
<!-- Split multiplications into shift and add -->
<!-- Implement division by constant as multiplication of the inverse -->

(Linear) MBA identities are things like $x+y = (x \oplus y) + 2\cdot (x \land y)$.
This particular one works for numbers of any size (number of bits), but in general they can be specific to a certain bitness.
Linear means that the expression is a linear combination of boolean expressions.

Permutation polynomials permute the $n$-bit numbers.
And the inverse function is also a (permutation) polynomial.
An example for 8 bits looks like this:
$$p(x) = 196x^3 + 48x^2 + 75x + 116$$
$$q(x) = 16x^5 + 124x^3 + 96x^2 + 35x + 36$$

$q$ and $p$ are inverses of each other ($p(q(x)) = q(p(x)) = x$).

The problem in both cases is how to automatically generate these.

### Small history of MBA
The [original paper](https://link.springer.com/chapter/10.1007/978-3-540-77535-5_5) on mixed boolean arithmetic, which – as far as I know – also introduced the term, was published in 2007.
But even before that in 2001 Rivest (of **R**SA fame) published a [characterization of permutation polynomials](https://www.sciencedirect.com/science/article/pii/S107157970090282X?via%3Dihub), but without a way to find their inverses.
The 2007 paper included a subset of permutation polynomials and a formula for their inverses.
A way to [compute the inverse of a general permutation polynomials](https://dl.acm.org/doi/10.1145/2995306.2995310) was only published in 2016.

# MBA Identities
To me personally, this seems like it should be the harder of the two problems.
It seems like there should just be some neat formula to find the inverse of a permutation polynomial,
but historically this problem was solved first.

How would you go about automatically creating (linear) MBA identities?
In the first code example there was this neat explanation that `x & y` are the carry bits which are shifted by multiplying it by 2 and `x ^ y` is addition without carry.
Obviously such nice explanations won't always exist or be automatically derivable.

Let's still use that as an example:
We want to rewrite `x + y` using `x ^ y` and `x & y`.
What you can do is make a table of all possible input combinations and the value of the boolean expressions (`x & y`, `x ^ y`) and expression you want to rewrite (`x + y`).
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
      <td>6</td>
    </tr>
  </tbody>
</table>
</code>

You can verify that indeed `(x ^ y) + 2 * (x & y)` equals `x + y`.

We can write this in matrix form as:

$$\left[ \begin{array}{cc} 0 & 0 \\ 1 & 0 \\ 2 & 0 \\ 3 & 0 \\ 1 & 0 \\ 0 & 1 \\ .. & .. \\ 0 & 3 \\ \end{array} \right] \left[\begin{array}{c} 1 \\ 2 \end{array} \right]  = \left[ \begin{array}{c} 0 \\ 1 \\ 2 \\ 3 \\ 1 \\ 2 \\ .. \\ 6 \\ \end{array} \right]$$

The first matrix contains the `x ^ y` and `x & y` columns from the table.
The vector contains the coefficients of the linear combination.
The last vector contains the `x + y` row from the table.
Maybe you can see where this is going.
We construct the matrix and the last vector and solve the linear system of equations.

There are just two problems with this:
1. The full table would be 16 rows, or $2^{nm}$ where $n$ is the bitness and $m$ the number of variables. This will be way too big for realistic $n$.
2. We are looking for integer solutions and the equations are modulo $2^n$. You could say we are solving the system over $\mathbb Z/2^n\mathbb Z$ which are the integers mod $2^n$. Unfortunately this is not a [field](https://en.wikipedia.org/wiki/Field_(mathematics)), meaning usual linear algebra won't work, i.e. standard gaussian elimination can't solve this.

The second problem will be the topic of the second post in this series.
The first one we can address right here.
There is one crucial property we haven't used yet.
In the above construction we can use any function for rewriting, it doesn't have to be a boolean operation, which is nice, but only in restricting the class of functions does this actually become practical.
Because unlike general functions, boolean operations are just applied bitwise, meaning the value of bit i of the output only depends on bits i of the inputs.
I will refer to functions with this property as bitwise functions.
Basically any function $f: \{0, 1\}^m \to \{0, 1\}$ that is applied to each bit separately is a bitwise function. (There are only 16 such functions).
For example bit i of `x * y` depends on a lot of bits and not just bit i of `x` and bit i of `y`, so `*` is not a bitwise function whereas `&` is.

This property of boolean operations makes it possible to restrict the inputs we have to consider to just 0 and 1 for each input (I won't prove this here).
In the example above, we would only have the following table with 4 rows instead of 16 or in general $2^m$ instead of $2^{mn}$.

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
(Supplying a linear combination of bitwise function instead of supplying the bitwise functions separately amounts to limiting the coefficients that are allowed in the linear combination.)
`x + y` is just a linear combination with coefficients 1 of the identity function on `x` and `y`.

Solving these linear systems will be the subject of the second post.

# Permutation polynomials
There is a simple characterization of permutation polynomials which allows us to generate them very easily.
This characterization is due to [Rivest](https://www.sciencedirect.com/science/article/pii/S107157970090282X?via%3Dihub):

A polynomial $p(x) = a_0 + \dots + a_dx^d$ over $\mathbb Z/2^n\mathbb Z$ is a permutation polynomial if and only if
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
The reason is that any odd number has a multiplicative inverse in $\mathbb Z/2^n\mathbb Z$, since $2^n$ has only the prime factor 2 and thus the greatest common divisor of an odd number and $2^n$ is 1.
The inverse $a_1^{-1}$ can be computed with the [extended euclidean algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Modular_integers).
$a_1x$ maps to $y$ for $x=a_1^{-1}y$.

We can also easily compute the inverse $q(x) = b_1x + b_0$.
$$q(p(x)) = b_1(a_1x + a_0) + b_0 = b_1a_1x + b_1a_0 + b_0 \stackrel!= x$$
By equating coefficients, we get:
$$b_1a_1 = 1 \implies b_1 = a_1^{-1}$$
$$b_1a_0 + b_0 = a_1^{-1}a_0 + b_0 = 0 \implies b_0 = -a_1^{-1}a_0$$
So in general the inverse is given by
$$q(x) = a_1^{-1}x - a_1^{-1}a_0$$

For higher degree polynomials this becomes much more difficult and, as far as I know, no general formula for the inverse of a permutation polynomial exists.
Though there is an algorithm that seems to work, but there isn't really a proof of correctness.

<!--$x^{10} + 211x^9 + 102x^8 + 22x^7 + 41x^6 + 243x^5 + 224x^4 + 36x^3 + 16x^2 + 128x$-->

# Obfuscating integers
Of course, there are many ways to combine these primitives.
The example at the beginning was just some combination of the two.
One application I particularly like is obfuscating integers.

Let us fix the number of variables $m=2$ for simplicity.
I will be using the shorthand
$$\langle f \rangle = \left[\begin{array}{c} f(0, 0) \\ f(0, 1) \\ f(1, 0) \\ f(1, 1) \\ \end{array}\right], \hspace{1cm}\text{e.g. } \langle x \oplus y \rangle = \left[\begin{array}{c} 0 \\ 1 \\ 1 \\ 0 \\ \end{array}\right]$$

Let's fix the operations used for rewriting as $x\oplus y$, $x\land y$ and $\lnot (x \lor y)$ and the constant to obfuscate as $1312$.
These are sufficient to obfuscate any constant (but they will always result in the same linear combination, so you should provide more if possible).

You might just try to do this:
$$\left[\begin{array}{ccc}\langle x\oplus y \rangle & \langle x \land y \rangle & \langle \lnot(x \lor y) \rangle \\ \end{array}\right]\cdot\textbf{a} = \langle 1312 \rangle$$

If you tried this, you would find that the expression would evaluate to the constant -1312.
This is very close to the real solution, but there are some misconceptions at play here.
The constant $1312$ is not a bitwise function, because there is a different function for bits in different positions.
For some bits it is the constant 0 function and for the others the constant 1.
We know though, that these functions are allowed to be linear combinations of bitwise functions, so maybe this would work:

$$\left[\begin{array}{ccc}\langle x\oplus y \rangle & \langle x \land y \rangle & \langle \lnot(x \lor y) \rangle \\ \end{array}\right]\cdot\textbf{a} = 1312\cdot \langle 1 \rangle$$

This is still exactly the same system of equations as above. So while it is conceptually clearer, it is still incorrect.
Suppose we initialize an 8-bit number with the constant $1$ function.
What value would be stored in that number?
Would the number represent the value 1?
What would its bits look like?
Every bit would be a one, so the number would be `0xff = 255` or `-1` if the number was signed (interpreted in [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement)).
And this will be the clue to getting it right.
I won't prove this here, but we can just interpret the number in two's complement, so the constant one function represents the number -1 and the coefficient we want is then -1312.
The correct equation is

$$\left[\begin{array}{ccc}\langle x\oplus y \rangle & \langle x \land y \rangle & \langle \lnot(x \lor y) \rangle \\ \end{array}\right]\cdot\textbf{a} = -1312\cdot \langle 1 \rangle$$

Here is an example with a few more input operations.

```cpp
int c(int x, int y) {
    // Rewrite `x & y` using a permutation polynomial.
    int a = x & y;

    // Use Horner's method to evaluate the degree 8 polynomial.
    int b = (((((((18874368*a + 263192576)*a + 127991808)*a
        + 3775242240)*a + 3978920448)*a + 3595255168)*a
        + 826953192)*a + 2187683531)*a + 3537295417;

    // Use an MBA identity that evaluates to b.
    int c = -2939841818 * (b & y) + -396179085 * (b ^ y)
        + 1073741824 * ~(b ^ y ^ a) + -2650142651 * ~b
        + 2049622064 * ~y + -775424323 * y + -1546963061 * a
        + -1674262411 * (y & a) + 3114745555 * (b | a)
        + 3327705389 * (~b & a) + 3821746059 * (y | ~a);

    // Evaluate the inverse.
    int d = 2025852808*c*c + 2628772947*c + 2801763453;

    // Use the MBA identity that evaluates to 1312.
    return -3051142224 * d + -2599312936 * (x ^ y)
        + 3221225472 * ~(x ^ y ^ b) + -1555555228 * ~x
        + 2395047580 * ~y + -374348604 * y + 1307989984 * b
        + 1913235488 * (y & b) + 4264983180 * (x | b)
        + 2177467764 * (~x & b) + 234248160 * (y | ~b);
}
```

# What's next?
If you want to try this for yourself, check out my web interface [here](https://plzin.github.io/mba-wasm/).
My initial implementation using arbitrary precision integers can be found [here](https://github.com/plzin/mba).
The [next post](/posts/linear-systems-mod-n) is about solving linear systems over $\mathbb{Z}/n\mathbb{Z}$.

<hr>

# The Fundamental Theorem of Mixed Boolean-Arithmetic
This section will be a lot more formal and require some algebra.

Let $\Z_2=\{0, 1\}$ be the ring of integers mod 2.
Let $w\in\mathbb{N}$ be the integer width, i.e. the number of bits in an integer.
Let $\Z_{2^w}=\{0,\dots,2^w-1\}$ be the ring of integers mod $2^w$, i.e. the $w$-bit integers.
To be completely formally correct, we will define the function
$$
\begin{align}
  \beta\colon\Z_2 &\to\Z_{2^w}\\
  0&\mapsto 0\\
  1&\mapsto 1
\end{align}
$$
which basically lets us interpret an element of $\Z_2$ as an element of $\Z_{2^w}$.
This helps to avoid some confusion, e.g. $\beta(-1)\neq -\beta(1)$ (for $w>1$).

Let $\Z_2^w=\Z_2\times\dots\times\Z_2$ be the ring of $\Z_2$-sequences of length $w$,
i.e. vectors/lists of $w$ bits.
Note that although $\Z_{2^w}$ and $\Z_2^w$ have the same number of elements, they are not isomorphic (for $w>1$),
since their additive (and multiplicative) groups are not isomorphic.
Addition in $\Z_{2^w}$ is just integer addition mod $2^w$,
whereas in $\Z_2^w$ addition is the XOR operation.
(Multiplication in $\Z_2^w$ is the logical AND).
However, we can define the obvious bijection between them:
$$
\begin{align}
  \varphi\colon\Z_2^w &\to\Z_{2^w}\\
  (b_w,\dots,b_1)&\mapsto\sum_{i=1}^w\beta(b_i)2^{i-1}
\end{align}
$$
This is just interpreting the sequence of bits as the binary representation of an integer,
e.g. for $w=4$, $\varphi (0, 0, 1, 1) = 3$ or $\varphi^{-1}(6)=(0, 1, 1, 0)$.
It is not a ring homomorphism.

This function allows us to extend an $n$-ary function $f: \Z_2^n\to\Z_2$
to a function $f_*: \Z_{2^w}^n\to\Z_{2^w}$.
The notation is slightly confusing here (though it is completely consistent).
A function $\Z_2^n\to\Z_2$ should be thought of as taking $n$ inputs
in $\Z_2$ and mapping them to a value in $\Z_2$, instead of a function
taking a single sequence of $n$ bits, although both views are of course equivalent.
The idea of this extension is that the function will be separately applied to each bit.
These are the *bitwise* functions that were informally introduced in the post.
For example the logical and $\land$ is a binary (2-ary, i.e. it takes two inputs) function on bits (i.e. elements of $\Z_2$).
E.g. $1\land 0=0$.
We want to extend this to a function on $w$-bit integers, e.g. $3\land 2 = 2$.
The extension will be in two steps.

The extension to $\Z_2^w$ is defined as
$$
\begin{align}
  f'\colon(\Z_2^w)^n &\to\Z_2^w\\
  (b_{1,w},\dots,b_{1,1}),\dots,(b_{n,w},\dots,b_{n,1})
  &\mapsto(f(b_{1,w},\dots,b_{n,w}),\dots, f(b_{1,1}, \dots, b_{n, 1}))
\end{align}
$$
This definition looks more confusing than it actually is.
It just means we apply $f$ to the first bit of each input
and the result will be the first bit of the output and so on.
The extension to $\Z_{2^w}$ is then defined as
$$
\begin{align}
  f_*\colon(\Z_{2^w})^n &\to\Z_{2^w}\\
  x_1, \dots, x_n&\mapsto\varphi(f'(\varphi^{-1}(x_1), \dots, \varphi^{-1}(x_n)))
\end{align}
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
$$f(x_1,\dots,x_n)=\sum_{i=1}^m c_if_{i*}(x_1,\dots,x_n)$$
for some constants $c_i\in\Z_{2^w}$ and some functions $f_i: \Z_2^n\to\Z_2$ and $m\in\mathbb{N}$.
In other words, it is a linear combination of bitwise functions.
</div>

It is time for the most important theorem.

<div class="theorem">
<div>Theorem: The Fundamental Theorem of (Linear) Mixed Boolean-Arithmetic</div>
A linear MBA function $g:\Z_{2^w}^n\to\Z_{2^w}$ is uniquely determined by its values
on $\{0, -1(=2^w-1)\}^n$ (or $\{0, 1\}^n$).
</div>

To give a concrete example of how this is useful.
Suppose we are given two linear MBA functions $f, g: \Z_{2^{32}}\times\Z_{2^{32}}\to\Z_{2^{32}}$.
We only have to check the following equalities to conclude they are equal everywhere:
$f(0, 0)=g(0, 0), f(0, -1)=g(0, -1), f(-1, 0)=g(-1, 0), f(-1, -1)=g(-1, -1)$.
A priori, we have to compare the values for all $2^{64}$ inputs.

Proof:
Note that 0 and -1 are the numbers that only have 0 or 1 in their binary representation.
Thus an input $\mathbf{x}\in\{0, -1\}^n$ has the form that $x_i=\varphi(b_i, b_i, \dots, b_i)$,
i.e. each input number $x_i$ consists only of the same bit $b_i$.
We will define $b^w=\varphi(b, \dots, b)=-\beta(b)$ to be the $w$-bit integer
whose binary representation is just $b$s.
The notation is sort of overloaded because $b^w$ could also be interpreted as $b\cdot\ldots\cdot b$,
but we will need it just for this proof and we will never use the this interpretation.

$$
\begin{align}
g(b_1^w, \dots, b_n^w)&=\sum_{i=1}^m c_if_{i*}(b_1^w, \dots, b_n^w)\\
&=\sum_{i=1}^m c_i\varphi(f'_i((b_1, \dots, b_1), \dots, (b_n, \dots, b_n)))\\
&=\sum_{i=1}^m c_i\varphi((f_i(b_1, \dots, b_n)), \dots, (f_i(b_1, \dots, b_n)))\\
&=\sum_{i=1}^m c_i\sum_{j=1}^w2^{j-1}\beta(f_i(b_1, \dots, b_n))\\
&=\sum_{i=1}^m c_i\beta(f_i(b_1, \dots, b_n))\sum_{j=1}^w2^{j-1}\\
&=\sum_{i=1}^m c_i\beta(f_i(b_1, \dots, b_n))(-1)\\
&=-\sum_{i=1}^m c_i\beta(f_i(b_1, \dots, b_n))\\
\end{align}
$$
So for inputs of that form, the result is just minus one times the sum of those $c_i$
where $f_i(b_1,\dots, b_n)=1$. We will need this result in a second.

We will now consider an arbitrary input, i.e. $\varphi(x_i)=(b_{i, 1},\dots,b_{i, w})$.
$$
\begin{align}
g(x_1, \dots, x_n)&=\sum_{i=1}^m c_if_{i*}(x_1, \dots, x_n)\\
&=\sum_{i=1}^m c_i\varphi(f'_i((b_{1, w}, \dots, b_{1, 1}), \dots, (b_{n,w}, \dots, b_{n,1})))\\
&=\sum_{i=1}^m c_i\varphi((f_i(b_{1, w}, \dots, b_{n, w})), \dots, (f_i(b_{1, 1}, \dots, b_{n, 1})))\\
&=\sum_{i=1}^m c_i\sum_{j=1}^w2^{j-1}\beta(f_i(b_{1, j}, \dots, b_{n, j}))\\
&=\sum_{j=1}^w2^{j-1}\sum_{i=1}^m c_i\beta(f_i(b_{1, j}, \dots, b_{n, j}))\\
&=-\sum_{j=1}^w2^{j-1}g(b_{1,j}^w,\dots,b_{n,j}^w)\\
\end{align}
$$

The last equality is the previous result.
This means that the value of $g$ on any input depends only on the value of $g$
at inputs of the form discussed before.
<div class="qed-line"></div>

In the original paper on MBA, the set $\{0, 1\}^n$ was used.
Let us quickly prove that the values of the function on this set also uniquely determine
the function.
This idea is the same, the algebra only slightly more annoying.
The inputs now have the form $x_i = \varphi (0, \dots, 0, b_i) = \beta(b_i)$.
The last equality stems from the fact that we view $\Z_2$ as a subset of $\Z_{2^w}$.

$$
\begin{align}
g(\beta(b_1), \dots, \beta(b_n))&=\sum_{i=1}^m c_if_{i*}(\beta(b_1), \dots, \beta(b_n))\\
&=\sum_{i=1}^m c_i\varphi(f'_i((0, \dots, b_1), \dots, (0, \dots, b_n)))\\
&=\sum_{i=1}^m c_i\varphi((f_i(0, \dots, 0)), \dots, f_i(b_1, \dots, b_n))\\
&=\sum_{i=1}^m c_i\left(f_i(b_1, \dots, b_n) + \sum_{j=2}^w2^{j-1}f_i(0, \dots, 0)\right)\\
&=\sum_{i=1}^m c_i\left(f_i(b_1, \dots, b_n) + f_i(0, \dots, 0)\sum_{j=2}^w2^{j-1}\right)\\
&=\sum_{i=1}^m c_i\left(f_i(b_1, \dots, b_n) - 2f_i(0, \dots, 0)\right)\\
&=-2\sum_{i=1}^m c_if_i(0, \dots, 0) + \sum_{i=1}^m c_if_i(b_1, \dots, b_n)\\
&=2g(0, \dots, 0) + \sum_{i=1}^m c_if_i(b_1, \dots, b_n)\\
\end{align}
$$
Overall, we have
$$\sum_{i=1}^m c_if_i(b_1, \dots, b_n) = g(b_1,\dots,b_n) - 2g(0,\dots,0)$$

Now we will consider general inputs again, i.e. $x_i=\varphi(b_{i, 1}, \dots, b_{i, w})$.
As we saw before
$$
\begin{align}
g(x_1, \dots, x_n)
&=\sum_{j=1}^w2^{j-1}\sum_{i=1}^m c_if_i(b_{1, j}, \dots, b_{n, j})\\
&=\sum_{j=1}^w2^{j-1}(g(b_{1, j},\dots,b_{n, j})-2g(0,\dots,0))\\
&=2g(0,\dots,0)+\sum_{j=1}^w2^{j-1}g(b_{1, j},\dots,b_{n, j})\\
\end{align}
$$
So again, $g$ at any input only depends on the values of $g$ with 0, 1 inputs.