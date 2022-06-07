---
title: 'Mixed boolean-arithmetic: Introduction (Part 1)'
date: '2022-06-07'
---

What does the following function do?

```cpp
int hmm(int x, int y) {
    return (x ^ y) + 2 * (x & y);
}
```

Maybe if you computed some examples you could figure it out, because what the function computes is fairly simple.
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

It again computer `x + y`. The value of `z` does not matter.
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
To me personally this seems like it should be the harder of the two problems.
It seems like there should just be some neat formula to find the inverse of a permutation polynomial,
but historically this problem was solved first.

How would you go about automatically creating (linear) MBA identities?
In the first code example there was this neat explanation that `x & y` are the carry bits which are shifted by multiplying it by 2 and `x ^ y` is addition without carry.
Obviously such nice explanations won't always exist or be automatically derivable.

Let's still use that as an example:
We want to rewrite `x + y` using `x ^ y` and `x & y`.
What you can do is make a table of all possible input combinations and the value of the boolean expressions (`x & y`, `x ^ y`) and expression you want to rewrite (`x + y`).
We will assume `x` and `y` are 2-bit numbers.

| x | y | x ^ y | x & y | x + y |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 0 | 2 | 2 | 0 | 2 |
| 0 | 3 | 3 | 0 | 3 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 1 | 2 |
| .. | .. | .. | .. | .. |
| 3 | 3 | 0 | 3 | 6 |

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
In the example above we would only have the following table with 4 rows instead of 16 or in general $2^m$ instead of $2^{mn}$.

| x | y | x ^ y | x & y | x + y |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 1 | 2 |

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

The problem then is finding the inverse to such a polynomial.
As mentioned this is not trivial in general, but we can quickly take a look at a simple example where $d = \deg p = 1$: $p(x) = a_1x + a_0$.
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
Of course there are many ways to combine these primitives.
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
For some bits it's the constant 0 function and for some the constant 1.
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
If you want to try this you can check out my implementation in rust [here](https://github.com/plzin/mba).
Eventually I'd like to compile it to WASM and have a demo here but that is future work.
The next post will be about solving linear systems over $\mathbb{Z}/n\mathbb{Z}$ and should hopefully come soon 😅.