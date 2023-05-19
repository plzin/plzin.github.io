---
title: 'Mixed Boolean-Arithmetic (Part 3): Binary Permutation Polynomials'
date: '2023-04-24'
macros:
    - Z: \mathbb{Z}
    - P: \Z_n[X]
    - PF: \mathrm{PF}_n
    - ZI: \mathbb{0}
    - V: \mathbf{V}
    - y: \mathbf{y}
    - x: \mathbf{x}
---

In this post we are going to find polynomials $p, q\in \P$,
such that $p(q(x))=x$, where $n=2^w$ is a power of two.
In particular, this means that $p$ is invertible (bijective) and $q=p^{-1}$ is its inverse,
which makes them permutations of $\Z_n$.

Polynomials modulo a power of two are called **Binary Polynomials**,
and the ones that permute the integers modulo $2^w$ are called **Binary Permutation Polynomials**.

Most of the results in this post can actually be generalized to polynomials modulo a prime power $p^m$
and most of the papers referenced do so.
Before we get into a classification, we will begin with some preparations.

# The ring $\P$
Some of the nice properties of polynomials that we know from $\mathbb{R}[X]$ or $\mathbb{C}[X]$
are no longer true.
Obviously $\P$ is infinite (e.g. $\{1, X, X^2, \dots\}$ is an infinite subset)
but there are only $n^n$ (i.e. finitely many) functions $\Z_n \rightarrow \Z_n$
and only $n!$ permutations of $\Z_n$.

So there exist polynomials $f, g$ with $f\neq g$ but $f(x) = g(x)\ \forall x\in\Z_n$.
To rephrase, there are polynomials that are different as expressions, i.e. have different coefficients, but compute the same function.
Equivalently, there exist $h=f-g$ such that $h\neq 0$ but $h(x)=0\ \forall x\in\Z_n$.
An example of this where $n=16=2^4$ is $h(x)=8x^2+8x$.
We will characterize all such polynomials later.
This can never happen in $\mathbb{C}, \mathbb{R}, \mathbb{Z}$,
or generally in infinite [UFDs](https://en.wikipedia.org/wiki/Unique_factorization_domain)
as a consequence of [Gauss's Lemma](https://en.wikipedia.org/wiki/Gauss%27s_lemma_(polynomials)).
In finite fields, by the same argument as above, this also happens,
but only if $\prod_{c\in\mathbb{F}_q}(x-c)$ divides the polynomial,
whereas it is more subtle in $\Z_n$ which is ultimately a result of the existence of zero divisors.

For now though, we see that it makes sense to differentiate between the polynomial expressions and the functions they induce.
From now on, I will use uppercase letters for the polynomial expressions $P, Q\in\P$
and lowercase letters for the corresponding polynomial functions $p, q\in \PF$ where $\PF$
is the set of all functions $\Z_n \rightarrow \Z_n$ that can be represented by polynomials.
There is also the obvious ring-homomorphism $\varphi: \P \rightarrow \PF: P\mapsto p$.
By definition of $\PF$, $\varphi$ is surjective.
Over $\mathbb{R}$ or $\mathbb{C}$, $\varphi$ is a bijection,
so differentiating between the expressions and function doesn't really matter.

Some immediate questions are:
- Are all functions $\Z_n\rightarrow\Z_n$ in $\PF$, i.e. is every function representable by a polynomial?
- Is every permutation representable by a polynomial?

The answer two both questions is no in general.
We will see that during proof of the characterization of binary permutation polynomials.
Both are true if and only if $n$ is a prime number (or 1).
The next question then is, how many functions are representable by polynomials.
We will find the answer for Binary Polynomials.
You can find a discussion of the general case in [\[1\]](#ref-1) or [\[2\]](#ref-2).

It is often advantageous to consider polynomials $F\in\Z[X]$ instead,
and ask whether $F$ is a permutation polynomial mod $n$,
because we can (for example) talk about different moduli for the same polynomial,
and I will often switch between these points of view without mentioning it,
because it is very natural and shouldn't cause any confusion.
There are however some instances where this makes some minor differences,
e.g. when talking about the polynomials which evaluate to zero.
In $\P$ the only such polynomial of degree less than two is the zero polynomial,
but in $\Z[X]$, for every $k\in\Z$ the constant polynomials $F=kn$ and linear polynomials $F=knX$
are different polynomials which all evaluate to zero mod $n$.

# Structure of the Post
In the next section, we will prove the characterization of binary permutation polynomials,
which also provides an intuition on how restricted polynomials in $\P$ are.
Afterwards, we will try to find all polynomials that evaluate to zero,
but before we can do that, we need to discuss polynomial division.
Finally, we will try to find the inverse of a permutation polynomial,
and see three different algorithms to achieve that.
I came up with one myself and it has (as far as I know) not been published.
It is the slowest (but in my opinion still practical 😉, though you should use one of the other two).

# Characterization of Binary Permutation Polynomials
As I mentioned in the first post in this series,
the first explicit characterization of binary permutation polynomials was given by Rivest in [\[3\]](#ref-3).
It's an elementary proof and easy to read, but he mentions that after the fact
Mullen told him of a more general lemma that is already present in [\[2\]](#ref-2),
which can also be used to derive the same characterization.
We will follow Rivest's proof here (at times word for word),
as we will need some of the results we prove along the way later,
when trying to find a polynomial for the inverse permutation.
I originally was not gonna give a complete proof here,
(were it not for the intermediary results we will need later),
and only used [Hensel's Lemma](https://en.wikipedia.org/wiki/Hensel%27s_lemma)
(from which Mullen's lemma easily follows) to derive the same characterization,
which I didn't want to simply discard, so you can find it [here](#alt-proof-characterization).

We will consider a polynomial $P=a_0+\dots+a_dX^d\in\Z[X]$.
Rivest's proof works by reducing the question of whether $P$ is a permutation polynomial mod $2^w$
to the case $w=1$.
However, there are certain conditions on this, as we will see.
We will start with the base case $n=2$ ($w=1$).
<div class="theorem">
<span>Lemma 1</span>$P$ is a permutation polynomial mod 2 if and only if
$(a_1+a_2+\dots)$ is odd.</div>
Proof: Of course $p(0)=a_0 \pmod 2$.
So we need $p(1)=a_0+a_1+\dots \stackrel!= 1-a_0\pmod 2$.
Adding $a_0$ to both sides (or subtracting it, as they are equivalent mod $2$) we get the Lemma.
<div class="qed-line"></div>

We will now try to find conditions under which a permutation polynomial mod $2$
is also a permutation polynomial mod $2^w$.
This will work inductively by going from $2^w$ to $2^{w+1}$ and the other way around.
We will need some auxiliary Lemmas for it.
<div class="theorem">
<span>Lemma 2</span>If $P$ is a permutation polynomial mod $n=2m=2^w$, then $a_1$ is odd.</div>
Proof: If $a_1$ was even, then $p(0)=p(m)\pmod{n}$, which follows easily by computation.
<div class="qed-line"></div>

The next Lemma will heavily restrict the class of permutations that can be represented by polynomials.
<div class="theorem">
<span>Lemma 3</span>If $P$ is a permutation polynomial mod $n=2m=2^w$,
then it is also a permutation polynomial mod $m$.
</div>
Notice that for general permutations, this absolutely doesn't have to be the case:
Let $w=2$ and consider the permutation $\sigma$ that swaps 0 and 3 and fixes 1 and 2.
$$\begin{aligned}
&\sigma(0)=3&=1&\pmod 2\\
&\sigma(1)&=1&\pmod 2\\
\end{aligned}$$
So $\sigma$ is not a permutation mod 2. Nevertheless, this has to be true for polynomials:

Of course $p(x+m)=p(x)\pmod m$, because $x+m$ and $x$ are just two representatives for $x$ mod $m$.
If $p$ was not a permutation mod $m$, then there are two distinct values $x$ and $x'$
such that $p(x)=p(x')=y\pmod m$.
This means that there are four values $\{x, x+m, x', x'+m\}$ mod $n$
that $p$ maps to a value congruent to $y$ mod $m$.
But there are only two values congruent to $y$ mod $n$.
<div class="qed-line"></div>

<div class="theorem">
<span>Lemma 4</span>If $P$ is a permutation polynomial mod $n=2m=2^w$,
then $P(x+m)=P(x)+m\pmod n$, for all $x\in\Z_n$.
</div>
Proof: As discussed before, $p(x+m)=p(x)\pmod m$.
So if one maps to $c$ mod $n$ the other has to map to $c+m$ mod $n$.
So the difference between them will always be $m$ mod $n$,
which is another way to read the Lemma.
<div class="qed-line"></div>

The next Lemma shows us, under which condition we can lift a permutation polynomial mod $2^w$
to one mod $2^{w+1}$.
<div class="theorem">
<span>Lemma 5</span>Let $n=2m=2^w$ with $w>1$. If $P$ is a permutation polynomial mod $m$,
then it is a permutation polynomial mod $n$ if and only if $(a_3+a_5+a_7+\dots)$ is even.
</div>
Proof: Since $p(x+m)=p(x)\pmod m$ and since $P$ is a permutation polynomial mod $m$,
the only way $P$ could fail to be a permutation polynomial mod $n$ would be if
$p(x+m) = p(m)\pmod n$ for some $x$.
So our next step is evaluating $p(x+m)\pmod n$.
In order to do that, we will have to compute $(x+m)^i$.
Using the binomial theorem, it is easy to see that all terms with $x^{i-j}$ where $j>1$ are zero,
so we are left with
$$(x+m)^i = x^i+imx^{i-1}\pmod n$$
for $i\geq 1$.
Including the coefficient $a_i$ we have
$$a_i(x+m)^i=a_ix^i+a_iimx^{i-1}\pmod n$$
Usually the latter term will vanish and it will just be equal to $a_ix^i\pmod n$,
but when $a_i$ is odd and either

- $i=1$ or
- $i>1$ and both $x$ and $i$ are odd

it will be equal to $a_ix^i+m\pmod n$.

In the case that $i=1$, we know from Lemma 2 that $a_1$ is odd,
so $a_1(x+m)=a_1x+m\pmod n$.
For even $x$, by the above, this is the only $m$ that we get in the evaluation of $p(x+m)$, so $p(x+m)=p(x)+m\pmod n$.
For odd $x$, we get an $m$ from every odd $i$ as well, as long as $a_i$ is odd.
If $a_i$ is even $a_im=0\pmod n$, so we can simply write $p(x+m)=p(x)+(a_1+a_3+a_5+\dots)m\pmod n$.
Since $a_1$ is odd, we have $p(x+m)=p(x)+m\pmod n$ if and only if $(a_3+a_5+\dots)$ is even.
<div class="qed-line"></div>

Now, we can prove the main result.
<div class="theorem">
<div>Theorem: Characterization of Binary Permutation Polynomials</div>
A polynomials $P=a_0+\dots+a_dX^d\in\Z[X]$ is a permutation mod $2^w$ ($w>1$)
if and only if
<ul style="margin-top: 0.2em;margin-bottom: 0">
  <li>$a_1$ is odd
  <li>$a_2+a_4+a_6+\dots$ is even
  <li>$a_3+a_5+a_7+\dots$ is even
</ul>
</div>
Proof:
<br>
$\Rightarrow$
<br>
If $P$ is a permutation polynomial mod $n$, then $a_1$ is odd by Lemma 2.
By Lemma 3, $P$ is also a permutation polynomial mod $n/2$ and by Lemma 5 $(a_3+a_5+a_7+\dots)$ is even.
By repeated application of Lemma 3, $P$ is a permutation polynomial mod 2,
and so $(a_1+a_2+a_3+\dots)$ is odd by Lemma 1.
Subtracting what we know from previous results, $(a_2+a_4+a_6+\dots)$ is even.

$\Leftarrow$
<br>
If $a_1$ is odd, $(a_2+a_4+a_6+\dots)$ is even, and $(a_3+a_5+a_7+\dots)$ is even,
then $P$ is a permutation polynomial mod $n=2^w$, by induction on $w$,
using Lemma 1 for the base case and Lemma 5 for the inductive step.
<div class="qed-line"></div>

We will now concern ourselves with trying to find an inverse.
But before we can do that, we need to find the polynomials that evaluate to zero,
and before we can do that, we need to talk about polynomial division.

# Polynomial Division and Zeros
Usually, polynomial division is only defined when the coefficients are in a field,
but it is possible to define a limited version of polynomial division when the coefficients are in any commutative ring.

<div class="theorem">
<div>Theorem: (Limited) Polynomial Division</div>
Let $C$ be a commutative ring, $F,G\in C[X]$ and let the leading coefficient of $G$ be a unit.
Then there exist unique polynomials $Q,R\in C[X]$, such that
$$F = GQ+R$$
and $\deg R < \deg G$.
</div>
Of note is that the leading coefficient has to be a unit (which is trivially satisfied in a field).
For example, you can't divide $X^2$ by $2X$ in $\Z[X]$.

The proof is straightforward using the usual polynomial division algorithm.
Let $a, b$ be the leading coefficients of $F, G$ respectively.
To eliminate the leading coefficient $a$ of $F$ we multiply $G$ by $b^{-1}a$,
so that the product also has a leading coefficient $a$, and subtract the result from  $F$.
The degree of $F$ is now smaller and we can continue recursively.
<div class="qed-line"></div>

Using polynomial division we can now prove the following.
<div class="theorem">
<span>Theorem</span>Let $C$ be a commutative ring.
$a\in C$ is a root of $F\in C[X]$, i.e. $f(a)=0$, if and only if $(X-a)\mid F$,
i.e. there exists $Q\in C[X]$, such that $F=(X-a)\cdot Q$.
</div>
$\Leftarrow$
<br>
$F=(X-a)\cdot Q$, so obviously $f(a)=(a-a)q(a)=0$.

$\Rightarrow$
<br>
Using polynomial division by $(X-a)$, we can write $F=(X-a)Q+R$, where $Q,R\in C[X]$ and $\deg R < 1$,
so $R$ is a constant.
We know $f(a)=0$, but on the other hand $f(a)=(a-a)Q+R=R$, so $R=0$ and we have $F=(X-a)Q$ or in other words $(X-a)\mid F$.
<div class="qed-line"></div>

This is, of course, what you would expect, but it is good to be aware that polynomial division can't always be done in commutative rings.

# Functional Equivalence in $\P$ 
We will now deal with the problem of deciding when two polynomials represent the same function,
as we will need it for the computation of the inverse.
Equivalently, our problem is to find all polynomials $F$ that evaluate to 0, i.e. $f(x) = 0$ for all $x$.
In the language of homomorphisms, we are searching for $\ker\varphi$ which is an ideal.
Remember that $\varphi$ is the homomorphism mapping polynomial expressions to functions.
We will call this ideal the zero ideal$$\ZI\coloneqq \ker\varphi$$
Note that this deviates from the usual meaning of "zero ideal", which is the boring ideal $\{0\}$.
By the the [(first) isomorphism theorem](https://en.wikipedia.org/wiki/Isomorphism_theorems),
$\PF\cong\P/\ZI$, which means we can uniquely represent a polynomial function by representatives
that we will later call "reduced polynomials".
Of course, $\ZI$ is infinite (every non-zero ideal in $\P$ is),
but by [Hilbert's basis theorem](https://en.wikipedia.org/wiki/Hilbert%27s_basis_theorem),
it is finitely generated, so what we really want, is a set of generators.

<div class="theorem">
<div>Theorem: Vanishing Binary Polynomials</div>
Let $P\in\P$. $p=0$ if and only if $P\in(P_0, \dots, P_d)=\ZI$,
where $d$ is the smallest integer such that $n\mid d!$, and
$$P_i=\frac{n}{\gcd(n, i!)}\prod_{j=0}^{i-1}(X-j)$$
Additionally, $P_2, P_4, \dots, P_d$ is a minimal generating set for $\ZI$.
</div>

This might seems complicated at first, but why these evaluate to zero is actually rather intuitive,
once you understand what is going on.
I've seen two ways of proving this.
Singmaster [\[1\]](#ref-1) sets up a clever induction.
This is in my opinion the more elementary proof so I suggest you check it out if you want to see a proof.
In the Appendix he mentions a different way of proving this using the
[Newton "series"](https://en.wikipedia.org/wiki/Finite_difference#Newton's_series) (it is a finite sum for polynomials).
[\[2\]](#ref-2) also follows this approach.

To get some understanding of these polynomials and why they evaluate to zero we will consider polynomials of degree less than three.
Let $F\in\P$ evaluate to zero, that is $f(x)=0$ for all $x\in\Z_n$.
It is relatively easy to see that the only such polynomial of degree less than 2 is $F=0$.
Let's think through the case $\deg F = 2$.
An idea you might have, is that since $(X-a)\mid F$ for all $x$,
the product
$$X\cdot(X-1)\cdot\ldots\cdot(X-n+1)\mid F$$
But this can't be true for degree reasons alone, e.g. $8X^2+8X$ evaluates to zero mod 16 but the product has degree 16.
We know that $f(0) = f(1) = 0$, so
$$X\mid F\quad\text{and}\quad (X-1)\mid F$$
As before, a priori this doesn't mean $X(X-1)\mid F$, but in this case it actually is true.
Since $X\mid F$, we can write $F=XQ$.
We know $f(1)=0$, but on the other hand $f(1)=1\cdot q(1)$, so $q(1)=0$, which implies $(X-1)\mid Q$.
So overall we can write
$$F=c\cdot X\cdot (X-1)$$
We now have to find all $c$ such that $f$ evaluates to zero.
We know that the product $X(X-1)$ will be even, since one of the factors is even.
It is either zero, in which case any $c$ is okay, or in the "worst case" two (for $x=2$).
So it suffices to choose $c=\frac{n}{2}$.
$$F=\frac{nX(X-1)}{2} = \frac{n}{2}X^2+\frac{n}{2}X$$
This is the definition of $P_2$ in the theorem above!
Generalizing this logic to higher degrees to see that all polynomials that evaluate to zero are indeed generated by the $P_i$
is not straightforward but also not too difficult.
Again, see the induction in [\[1\]](#ref-1).

What we can do, is understand the definition of $P_i$ better, and see why those polynomials indeed evaluate to zero.
Let's think about the product $X\cdot(X-1)\cdot\ldots\cdot(X-i+1)$ in the definition of $P_i$ in $\Z$ instead of $\Z_n$.
Note that I will sweep various details under the rug here, as they just distract from the core idea,
but rest assured, they can be fixed relatively easily.
Plugging in any value $c$ for $X$, it will be the product of $i$ consecutive numbers,
which we can write as
$$\frac{c!}{(c-i)!} = \binom{c}{i}i!$$
so it is divisible by $i!$. (The product of $i$ consecutive integers is always divisible by $i!$).
In the "worst case" the product is $i!$ itself.

What we want to do now, is multiply that product by something, that makes the result zero mod $n$,
i.e. such that the result is a multiple of $n$.
If we want the smallest factor that is sufficient,
we want the result to be the least common multiple of $n$ and $i!$.
By the identity
$$\text{lcm}(a, b)\cdot\gcd(a, b)=a\cdot b$$
for natural numbers $a$, $b$, we can find the factor
$$\frac{n}{\gcd(n, i!)}$$
that you can see in the definition of $P_i$. 

What I haven't seen mentioned anywhere, is that the resulting generating set is not minimal.
This is only really useful in that it allows you to save some memory.
$P_0=n$ and $P_1=nX$ both of which are zero mod $n$, so they can be removed.
These polynomials are included when considering polynomials over $\Z$
which evaluate to zero mod $n$.

But these are not the only ones.
Let $i<d$ be an even integer.
We want to show that $P_{i+1}$ redundant.
The leading coefficients of $P_i$ and $P_{i+1}$ are the same,
since $i$ is even and $i+1$ is odd, $\gcd(2^w, i!)=\gcd(2^w, (i+1)!)$.
Calling the leading coefficient $c$, we can factor $P_{i+1}$:
$$P_{i+1} = c\prod_{j=0}^{i}(X-j) = (X-i)\left(c\prod_{j=0}^{i-1}(X-j)\right) = (X-i)P_i$$
Thus $P_{i+1}\in\left(P_i\right)$, i.e. $P_{i+1}$ is generated by $P_i$.

All in all, for odd $i$, $P_i$ is superfluous and we have
$$\ZI=\left(P_2, P_4, \dots, P_d\right)$$

This generating set is minimal, because the coefficient of the leading term is strictly decreasing as the degree increases,
since $\gcd(2^w, (i+2)!)>\gcd(2^w, i!)$.

### Reduced Polynomials
Similar to how there is a (in some sense) good way to choose representatives in
$\Z/n\Z$ as $0, \dots, n-1$, the same is true for $\PF\cong\P/\ZI$.
The reason is that we want to do computations on these polynomials and want the representation to be small.
This means that the degree and the coefficients should be as small as possible.

Let $F=a_0+\dots+a_ex^e\in\Z[X]$ and let $d, P_0, \dots, P_d$ be the ones from the theorem on vanishing binary polynomials above.
We can always find an equivalent polynomial $G$ with $\deg G < d$.
Notice that the leading coefficient of $P_d$ is 1,
so we can eliminate the coefficient $a_i$ of $F$ where $i\geq d$ by multiplying $P_d$ by $a_iX^{d-i}$
and subtracting the result from $F$.

We can reduce the other coefficients of $F$ in a similar way.
Let $l_i$ be the leading coefficient of $P_i$, i.e.$$l_i=\frac{n}{\gcd(n, i!)}$$
which is a power of two.
We can reduce the coefficient $a_i$ into the range $0\leq a_i\leq l_i$ by multiplying $P_i$ by $\lfloor \frac{a_i}{l_i}\rfloor$
and subtracting the result from $F$.

<div class="theorem">
<div>Theorem: Reduced Binary Polynomials</div>
Let $F\in\Z[X]$ and let $d$ be the smallest integer such that $n\mid d!$.
There exists a unique polynomial $G=a_0+\dots+a_{d-1}x^{d-1}\in\Z[X]$ that computes the same function mod $n$, i.e. $f(x)=g(x)\pmod n$,
with$$0 \leq a_i < \frac{n}{\gcd(n, i!)}$$
</div>

This also allows us to count the number of functions that can be represented by polynomials.
<div class="theorem">
<div>Theorem: Number of distinct Polynomials Functions/Permutations</div>
The number of distinct polynomial functions mod $n$ is$$|\PF|=\prod_{i=0}^{d-1}\frac{n}{\gcd(n, i!)}$$
The number of permutations that can be represented by polynomials is$$\frac{|\PF|}{8}$$
</div>

The first part follows from the theorem on reduced binary polynomials.
By the *Characterization of Binary Permutation Polynomials* $a_i$ has to be odd, which excludes half of the functions.
The sums $a_2+a_4+\dots$ and $a_3+a_5+\dots$ have to be even which exclude half again respectively,
so overall an eighth of the polynomial functions are permutations.
<div class="qed-line"></div>

These are only tiny fractions of the number of possible functions and permutations.

When we discuss the inversion of permutation polynomials next,
consider all computations on polynomials (e.g. their composition)
to include reducing the result with at least $P_d$ so that the degree doesn't explode.
We can also quickly bound $d=d(n)$ in terms of $n=2^w$,
which will be useful to determine the complexity of algorithms.
$d$ was defined to be the smallest integer such that $n\mid d!$.
It is easy to see that $d\leq 2w$, since $(2w)!$ is the product of $w$ even numbers (and $w$ odd numbers).
Thus $n = 2^w \mid (2w)!$. In particular $d(n)=O(w)$.

In the cases we care about the most, $w$ itself is also a power of two, e.g. 8, 16, 32, 64.
In those cases $d=w+2$.
Consider how many times 2 divides $w! = 2^c!$.
For every even number greater than zero and not greater than $w$, there is a factor of 2.
Similarly for every multiple of 4, we get another factor of 2, and so on.
There are $2^{c-1}$ such even numbers, $2^{c-2}$ such multiplies of 4, and so on.
So overall, $2^c!$ has exactly $2^0+2^1+\dots+2^{c-1}=2^c-1$ factors of 2.
But we wanted $2^c$ factors of two, i.e. an additional one, which $(w+2)!$ obviously has.

# Inverting Binary Permutation Polynomials
Let $P\in\P$ be a permutation polynomial.
It is not immediately clear that the inverse permutation $p^{-1}$ is even representable by a polynomial.
To see that it is, consider the group of all permutations on $n$ Elements $S_n$.
We have $p^{-1}=p^{m-1}$ where $m$ is the order of $p$,
i.e. the order of the subgroup generated by $p$, $m=|\langle p\rangle|$.
Note that $p^n$ in this context isn't the product $p\cdot\ldots\cdot p$,
it is the composition $p\circ\ldots\circ p$.
But $p^{m-1}$ is representable by a polynomial,
because the composition of polynomials is still a polynomial.
This gives us an extremely inefficient algorithm to invert any permutation polynomial:
We just compute $p^2, p^3, p^4, \dots$ in $\Z[X]/\ZI$.
When the result is the identity, we know that the polynomial in the last step was the inverse.
The problem is of course that the order of the subgroup could be very big,
e.g. $|\langle x\mapsto x+1\rangle|=n$ and $n$ could easily be $2^{64}$ in practice.

However, we can turn this into a practical algorithm.
### Inversion by Composition
<div class="theorem">
<div>Theorem: Order of Binary Permutation Polynomials</div>
Let $P\in\Z[X]$ be a permutation polynomial mod $n=2^w$.
Then the order of $p$ mod $n$ is a power of two, less than or equal to $n$,
i.e.$$\text{ord } p\coloneqq|\langle p\rangle|=2^i$$
where $i\leq w$.</div>
The converse of this theorem is not true, as the example $\sigma$ in Lemma 3 has order 2,
but does not have a polynomial representation as explained there.

The weaker version of this theorem (weaker bound on the order),
follows from [Lagrange's theorem](https://en.wikipedia.org/wiki/Lagrange%27s_theorem_(group_theory))
and the fact that the number of distinct permutation polynomials is a power of two,
as can be seen from the theorem on the number of distinct permutation polynomials mod $n$.

The proof will be by induction on $w$.
For $w=1$, there are only two permutations, the identity of order one, and swapping 0 and 1, of order two.
Let $P\in\Z[X]$ be a permutation polynomial mod $2^w$ with $w>1$.
We know that $P$ is also a permutation polynomial mod $m=n/2$ by Lemma 3.
By the induction hypothesis, $p$ has order $2^i$ mod $m$ where $i < w$.
We have $p^{2^i}(x)=x \pmod m$ for all $x\in\Z_m$.
We will now try to figure out the order mod $n$.
Fix an $x\in\Z_m$.
Let $o$ be the smallest integer such that $p^o(x)=x\pmod m$,
i.e. the length of the cycle containing $x$ mod $m$.
We know that $o$ is a power of two and less than or equal to $2^i$,
since the order of the permutation is both a power of two
and the least common multiple of its cycles lengths.

We now have to distinguish between two cases mod $n$:

Suppose $p^o(x)=x\pmod n$.
By Lemma 4, we know $p^o(x+m)=x+m\pmod n$.
So $p^o$ maps $x$ and $x+m$ to themselves.
Obviously, there is no $j < o$ such that $p^j(x)=x\pmod n$ or $p^j(x+m)=x+m\pmod n$,
as that would contradict that $o$ is the cycle length of $x$ mod $m$.

Otherwise $p^o(x)=x+m\pmod n$.
By Lemma 4, we know $p^o(x+m)=x\pmod n$.
Thus$$p^{2o}(x)=p^o(p^o(x))=p^o(x+m)=x\pmod n$$
And$$p^{2o}(x+m)=p^o(p^o(x+m))=p^o(x)=x+m\pmod n$$
As before, there is no $j < o$ such that $p^j(x)=x+m\pmod n$ or $p^j(x+m)=x\pmod n$.
There can also be no $o < j < 2o$ such that $p^j(x)=x\pmod n$ or $p^j(x+m)=x+m\pmod n$,
since otherwise $p^j(x)=p^{j-o}(p^o(x))=p^{j-o}(x)=x\pmod m$,
which, again, contradicts that $o$ is the cycle length of $x$ mod $m$.

So the cycle length of $x$ mod $n$ has either stayed the same or doubled.
And the cycle length of $x+m$ mod $n$ is the same as that of $x$.
It now easily follows that the order of $p$ mod $n$ has either stayed the same or doubled.
In either case, it is a power of two less than $n$.
<div class="qed-line"></div>

Now, the idea is that $f^{2^w}$ can be computed in $w$ compositions instead of $2^w$,
by using the associativity of function composition
$$f^{2i}=f^{i}\circ f^{i}$$
So the algorithm can compute $f, f^2, f^4, f^8, \dots, f^{2^i}$ until the result is the identity,
i.e. $f^{2^i}(x) = x$ for all $x$.
The inverse is then $f^{2^i-1}$, which can be computed like this
$$f^{2^i-1}=f\circ f^2\circ f^4\circ\dots\circ f^{2^{i-1}}$$
Overall, this will take at most $2w$ compositions.

To implement the algorithm as presented, we would have to store $f, f^2, f^4, \dots$
to do the composition at the end.
The following algorithm avoids this, but otherwise follows the same idea.

```python
# `f`: Permutation Polynomial
# `w`: Integer width (mod 2^w)
# Returns the inverse of `f`
def invert(f, w):
    # `inverse` will contain f, f^3, f^7, f^15, ..., f^(2^i-1)
    inverse = f
    for _ in range(0, w):
        # Compose `inverse` and `f`
        # This will be f^(2^i).
        g = reduce(compose(inverse, f), w)

        # If this is the identity then
        # f^(2^i-1) is the inverse.
        if g.is_identity():
            return inverse
        
        # Compose f^(2^i-1) and f^(2^i)
        # to get f^(2^(i+1)-1) for the
        # next iteration.
        inverse = reduce(compose(inverse, g), w)
```

Let's quickly look at the complexity when everything (composition, reduction, multiplication) is using the naive algorithm.
We will consider additions and multiplications in $\Z_n$ to have unit cost.
Composition $P\circ Q$ is just evaluating $P$ at $Q$ which can be done using
[Horner's method](https://en.wikipedia.org/wiki/Horner's_method) with $n$ multiplications (and additions).
A multiplication and subsequent reduction by $P_d$ is in $O(d^2)$.
So the composition is in $O(d^3)$.
Since $d(n)=O(w)$, this is equivalent to $O(w^3)$.
We have to do $2w$ compositions, so overall the asymptotic complexity of this algorithm is $O(w^4)=O((\log n)^4)$.

### Inversion by Newton's Method
A different algorithm and - as far as I know -
the first general algorithm [\[4\]](#ref-4) was published in 2016.
It is based on [Newton's method](https://en.wikipedia.org/wiki/Newton%27s_method).
Take the following as intuition, not as proof,
we will do a lot of things that shouldn't work and barely make sense.
You could say, we are doing engineering maths 😉.

The usual step in Newton's method is
$$x_{i+1}=x_i-\frac{f(x_i)}{f'(x_i)}$$
where we are trying to approximate a root of $f$.

In our case, given an $F$ we are trying to find $G$ such that $F\circ G = X$.
We can reformulate this as a root finding problem of $F(G)-X$
where $F(G)$ means evaluating $F$ at $G$, i.e. the composition.
We are treating $G$ as a variable, i.e. the $x$ here.
Substituting this for $f$
$$G_{i+1}=G_i-\frac{F(G_i)-X}{\frac{\mathrm{d}}{\mathrm{d}G_i}(F(G_i)-X)}=G_i-\frac{(F\circ G_i)-X}{F'\circ G_i}$$
To evaluate the right-hand side, we need to invert $F'\circ G_i$, which was our original problem.
However, taking the derivative of $(F\circ G)=X$ with respect to $X$,
we get $(F'\circ G_i)\cdot G_i'=1$.
Dividing by $F'\circ G_i$, we get $\frac{1}{F'\circ G_i}=G_i'$.
So overall the step can be written as:
$$G_{i+1}=G_i-G_i'\cdot((F\circ G_i)-X)$$

[\[4\]](#ref-4) cites some french paper for the proof that this will work, which I can't read.
Maybe someone who knows some $p$-adic analysis can prove this.
In particular, I think some generalization of Hensel's lemma can probably prove this.

Experimentally, this always finds a solution with $G_0=X$.
And the number of iterations is about $\log_2 w = \log_2\log_2 n$.
If we trust this experimental observation, then the complexity would be $O(w^3\log w)=O((\log n)^3\log\log n)$.

### Inversion by (Lagrange) Interpolation
The last technique we will look at is [\[5\]](#ref-5),
but the idea of using interpolation was already presented in [\[4\]](#ref-4),
where the authors couldn't quite make it work.

Let us try to naively apply Lagrange interpolation to find a polynomial based on sample points.
We are not trying to invert anything yet, just doing interpolation.
Formally, given distinct $x_1, \dots, x_m\in\Z_n$ and any $y_1, \dots, y_m\in\Z_n$,
we are trying to find $P\in\P$ such that $p(x_i)=y_i$ for all $1\leq i\leq m$.

What you could try to do (the authors of [\[4\]](#ref-4) did this)
is to construct the Lagrange basis polynomials
$$l_i(x)=\prod_{\begin{smallmatrix}1\leq j \leq m\\j\neq i\end{smallmatrix}}\frac{(x-x_j)}{(x_i-x_j)}$$
The solution would then be
$$p(x) = \sum_{i=1}^m y_il_i(x)$$
The problem is that we can't compute the $l_i$ because we have to invert the denominator
which (aside from a few trivial cases) will always be even and thus not invertible.

We could have seen this a different way: If we could do standard Lagrange interpolation,
we could find a polynomial representation for any function $\Z_n\rightarrow \Z_n$,
which is not possible, as not every function is representable by a polynomial.

There is however another formulation of the problem as a system of linear equations,
which can be generalized from fields to the ring $\Z_n$ and lets us apply the
results from [Part 2](/posts/linear-systems-mod-n).

I assume the idea is well-known, so I will go over it quickly.
We have to choose the degree of the polynomial beforehand.
Usually (i.e. over a field) $\deg P = m-1$, as this results in a system with a unique solution,
but in our case, we know that for any polynomial there is a reduced polynomial with $\deg P < d$,
so we can always choose $\deg P = d-1$.

Note that even when $m=n$, i.e. the output for every input in $\Z_n$ is specified,
we will not get a unique solution (if one exists), since we could add any polynomial in the "zero ideal" $\ker\varphi$.
On the other extreme, even if only two points on the polynomial are specified,
there need not exist a polynomial of any degree that passes through these points:
Let $n=2^4=16, x_1=0, y_1=0, x_2=8, y_2=1$.
As we have seen before, $p(x)=p(x+8)\pmod 8$, so we can't have $p(0)=0\pmod{16}$ and $p(8)=1\pmod{16}$.
This underlines the fact that linear algebra over rings is a lot weirder than over fields.

Moving on, what you do is construct the
[Vandermonde matrix](https://en.wikipedia.org/wiki/Vandermonde_matrix)
$\V$ with $\V_{i,j}=x_i^{j-1}$
and the vector $\y$ with $\y_i=y_i$ and then solve $\V\x=\y$.
The vector $\x$ will contain the coefficients of the polynomial, if the system has a solution.
Note, that we need to solve this system in $\Z_n$ which was discussed in
[Part 2](/posts/linear-systems-mod-n).
The algorithms shown there give us an $\x$ as well as a basis for $\ker\V$.
The elements of the (basis of the) kernel can of course also be treated as polynomials.
They are a generating set for all polynomials that evaluate to 0 on the $x_i$, i.e. $p(x_i)=0$.
Some of them will belong to the "zero ideal" $\ker\varphi$ that evaluate to zero everywhere,
but there could also exist others which are non-zero for inputs not equal to any $x_i$.
Differentiating between the two is easy, just reduce the polynomials.
The coefficients of polynomials in the zero-ideal will be reduced to 0.
By the way, the generating set will usually not be minimal,
because we are effectively treating $R[X]$ as an $R$-module here,
meaning the coefficients of linear combinations are in $R$,
whereas for the generating set, we treat $R[X]$ as an $R[X]$-module.

Now, we are finally ready to look at the algorithm for inverting a permutation polynomial $P\in\P$.
1. Compute $x_i=p(i)$ for $0\leq i < d$.
2. Solve the interpolation problem $q(x_i)=i$ by constructing and solving the linear system.
3. $Q$ is the/an inverse.

Once you look at it for a bit, you might think it's rather straightforward,
but there is some subtlety to this.
The intuitive explanation that is not quite correct is this:
We are looking for a polynomial of degree $d-1$ meaning $d$ coefficients,
so we should have $d$ sample points to find a unique polynomial.
We want $q(p(x))=x$ for all $x\in\Z_n$, so plugging in the first $d$ values, we get
$q(p(0))=0, \dots, q(p(d-1))=d-1$.
So we can use $p(0), \dots, p(d-1)$ as the sample points.

The problem with this intuition is that half of it makes sense for polynomials over a field,
while the other half only for polynomials over $\Z_n$.
What we know for sure is that $q(p(i))=i$ for $0\leq i < d$.
We still have to show that this also holds for $i \geq d$,
i.e. there is no solution to the linear system where this doesn't hold for all $i$.
We know, there is one solution where this is true, when $Q$ is an inverse of $P$,
so we need to show that the kernel of the linear system $\ker\V$ only contains
polynomials in the "zero ideal".
Polynomials $F$ in the kernel satisfy $f(i)=0$ for $0\leq i < d$.
This means, we need to show that $f(i)=0$ for $0\leq i < d$ implies $f(i)=0$ for all $i\in\Z_n$.
I don't think there is an easier way to see this than to follow the proof that the $P_i$ generate the "zero ideal".
In that proof you only need to use that $f(i)=0$ for $0\leq i < d$ to get the same generators,
which are 0 everywhere.

<div class="theorem">
<span>Theorem</span>A polynomial function $f\in\PF$ is uniquely determined by $f(0),\dots,f(d-1)$
where $d$ is the smallest positive integer such that $n\mid d!$.
</div>

Note that given values $y_0, \dots, y_{d-1}$, there is not necessarily a polynomial function $f\in\PF$
such that $f(i)=y_i$ for all $i$.
For example for $n=2^w$, we have $f(x)=f(x+2)\pmod 2$.

The authors of [\[5\]](#ref-5) took advantage of the special form of $\V$
to compute the LU-Decomposition which can be used to solve the linear system
without needing to resort to a general algorithm for solving linear systems mod $n$.
The complexity will also be better than that of the general algorithm.
The general LU-Decomposition can also be used to show the uniqueness of the solution.
The authors consider inversions to have unit cost, which I don't think is quite realistic,
and come to the conclusion that the algorithm has quadratic complexity in $w$.

# Conclusion
We've seen the most important theory on binary polynomials:
- We have a characterization of binary permutation polynomials, which also allows us to generate random permutation polynomials
- We can decide when two binary polynomials compute the same function.
- Given a binary permutation polynomial, we can efficiently find an inverse.

<hr>
<a id="alt-proof-characterization"></a>

# Appendix: Characterization of Binary Permutation Polynomials using Hensel's Lemma
A general form of Hensel's Lemma is a statement about lifting factorizations of polynomials mod $p$
to factorizations mod $p^m$.
We will only need the special case of lifting roots:
<div class="theorem">
<div>Hensel Lifting of Simple Roots</div>
Let $F\in\Z[X]$, $p$ be a prime number and $m\geq 1$ an integer.
If $r\in\Z$ is a simple root of $f$ mod $p$, i.e.
$$f(r)=0\bmod{p}\quad \text{and}\quad f'(r)\neq 0\bmod{p}$$
then there exists a unique $s\in\Z_{p^m}$, such that
$$f(s)=0\bmod{p^m}\quad \text{and}\quad r=s\bmod{p}$$
</div>

Now, let $F\in\Z[X]$ be a polynomial.
$F$ is permutation polynomial mod $n$ if and only if $(F-c)$ has a simple root for every $c\in\Z_n$.
Or in other words, if there is a unique $r\in\Z_n$ such that $f(r)=c$ for every $c\in\Z_n$.
Using the Hensel's Lemma we can now find a condition on the polynomial mod $p$ that implies the above.

<div class="theorem">
<span>Theorem</span>Let $F\in\Z[X]$, $p$ be a prime, $m>1$.
$F$ is a permutation polynomial mod $p^m$ if and only if
$f$ is permutation mod $p$ and
$f'(r)\neq0\bmod{p}$ for all $r\in\Z_p$.
</div>

Notice that if a polynomial is a permutation polynomial mod $p^c$ with $c>1$,
then it is a permutation polynomial mod $p^m$ for all $m\in\mathbb{N}$.
In the special case of $p=2$, we already saw this before.

Let $P=a_0+\dots+a_dX^d\in\Z_{2^w}[X]$.
For $P$ to be a permutation, it needs to be a permutation on $\Z_2$.
The following calculations will all be done in $\Z_2$.
Of course $p(0)=a_0$, so $p(1)=1-a_0$ for $p$ to be a permutation.

$$p(1)=a_0+\dots+a_d\stackrel!=1-a_0$$
So $a_1+\dots+a_d=1$, i.e. $a_1+\dots+a_d$ needs to be odd.
Furthermore we need $p'(0)=1$ and $p'(1)=1$:
$$p'(x)=a_1+2a_2x+3a_3x^2+\dots$$
$$p'(0)=a_1\stackrel!=1$$
So $a_1$ needs to be odd.
$$p'(1)=a_1+a_3+a_5+\dots\stackrel!=1$$
So $(a_1+a_3+a_5+\dots)$ needs to be odd as well.
The characterization of Rivest now follows easily:

<div class="theorem">
<div>Theorem: Characterization of Binary Permutation Polynomials</div>
A polynomials $P=a_0+\dots+a_dX^d\in\Z[X]$ is a permutation mod $2^w$ ($w>1$)
if and only if
<ul style="margin-top: 0.2em;margin-bottom: 0">
  <li>$a_1$ is odd
  <li>$a_2+a_4+a_6+\dots$ is even
  <li>$a_3+a_5+a_7+\dots$ is even
</ul>
</div>

# References
\[1\] <a id="ref-1" href="https://doi.org/10.1016/0022-314X(74)90031-6">
Singmaster: On polynomial functions (mod m)
</a>

\[2\] <a id="ref-2" href="https://doi.org/10.1007/BF01950276">
Mullen & Stevens: Polynomial functions (mod m)
</a>

\[3\] <a id="ref-3" href="https://doi.org/10.1006/ffta.2000.0282">
Rivest: Permutation Polynomials Module 2^w
</a>

\[4\] <a id="ref-4" href="https://doi.org/10.1145/2995306.2995310">
Barthelemy et al.: Binary Permutation Polynomial Inversion and Application to Obfuscation Techniques
</a>

\[5\] <a id="ref-5" href="https://doi.org/10.1007/978-3-319-96418-8_3">
Barthelemy et al.: Quadratic Time Algorithm for Inversion of Binary Permutation Polynomials
</a>