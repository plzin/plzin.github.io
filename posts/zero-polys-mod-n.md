---
title: 'Multivariate Polynomials mod m'
date: '2024-05-06'
macros:
    - N: \mathbb{N}
    - Z: \mathbb{Z}
    - P: \Z[X_1, \ldots, X_n]
    - PF: \mathrm{PF}_m
    - ZI: \frak{null}_{m, n}
    - ZU: \frak{null}_{m, 1}
summary: >-
    We find all multivariate polynomials that are zero mod m.
---

I was asked about this the other day and I only talked about the univariate case in [Part 3 of the MBA series](/posts/perm-poly).
I will present the main result first and then bore you with the proof.

We will consider the polynomials to be over $\Z$ instead of $\Z_m$.
It makes some things slightly cleaner.
We will write
$$(X)_i := \prod_{j=0}^{i-1} (X-j) = X\cdot(X-1)\cdot\ldots\cdot(X-i+1)$$
which is also known as the falling factorial.
Let $P\in\P$, we will write $p_m: \Z^n\longrightarrow \Z_m$, for the induced function mod m.

Let $\ZI$ be the ideal of polynomials in $\P$ that evaluate to zero (mod m) everywhere, i.e.
$$\ZI = \{P\ |\ P\in\P: p_m = 0, \text{i.e.} \forall x\in\Z: p_m(x) = 0\}$$

<div class="theorem">
<div>Generators of $\ZI$</div>
Define
$$Z_{i_1, \ldots, i_n} = \frac{m}{\gcd(i_1!\cdot\ldots\cdot i_n!, m)}(X_1)_{i_1}\cdot\ldots\cdot (X_n)_{i_n}$$

Then
$\ZI = (Z_{0, \ldots, 0}, Z_{0, \ldots, 1}, \ldots, Z_{d, \dots, d})$ (i.e. $\ZI$ is generated by the $Z$s),
where $d$ is the smallest integer such that $m$ divides $d!$.
</div>

Note that this generating set is not at all minimal. We will discuss this at the end.

# Polynomial Bases
(Multivariate) polynomials over a commutative ring $R$ form a free $R$-module.
If you don't know what that means, then just think of it as a vector space.
So in particular, they have a basis.
Let's consider univariate polynomials in $X$ for the moment.
The obvious basis is the monomial basis: $1, X, X^2, \ldots$.
But for our purposes, it turns out that another basis is more useful:
$$1, X, (X)_{2}, (X)_{3}, \ldots$$
These are the falling factorials from the beginning.
I will call it the **Newton basis**.
(I don't think this basis has an official name, but it is closely related to
[Newton's series](https://en.wikipedia.org/wiki/Finite_difference#Newton's_series), so I just made it up.)
It is easy to see that this is a basis because the polynomials are monic and the degree is increasing by 1 from one to the next,
so that we can iteratively do polynomial division with basis polynomials of lower and lower degree.
That this is a basis means that every polynomial in $P\in R[X]$ can be uniquely written as
$$P = \sum_{i=0}^d a_i(X)_{i}$$
for $a_i\in R$ that can be calculated with polynomial division.

Now, consider bivariate polynomials $R[X, Y]$.
<div class="theorem">
<div>Basis of bivariate Polynomials</div>
Let $(B_i)_{i\in\N}$ be a basis for $R[X]$ and $(C_i)_{i\in\N}$ be a basis for $R[Y]$.
Then $(B_i\cdot C_j)_{i,j\in\N}$ is a basis for $R[X, Y]$.
</div>
Proof: It is well known that $R[X, Y] \cong R[X][Y]$, so we can write $P\in R[X, Y]$ as
$$P = \sum_i F_iC_i$$
where each $F_i\in R[X]$.
(Although intuitively clear, formally, this step is not quite so simple, since we only know that the $C_i$ are a basis
when the polynomials are over $R$ not $R[X]$. You can treat the $X$ as an actual variable, then this works, e.g. in
$\mathbb{R}^2$ you can write $(1-s, 2s)$ in the standard basis $(1,0)$, $(0, 1)$ where $s$ is a completely independent variable.)
Now, we can write each
$$F_i = \sum_j G_{i,j} B_j$$
So overall,
$$P = \sum_i F_iC_i = \sum_{i, j} G_{i, j}B_jC_i$$
So $(B_i\cdot C_j)_{i,j\in\N}$ is a basis.
<div class="qed-line"></div>

We can inductively extend this to multivariate polynomials to get
<div class="theorem">
<div>Basis of multivariate Polynomials</div>
Let $(B_{i,j})_{i\in\N, 1\leq j \leq n}$ be bases for $R[X_1], \ldots, R[X_n]$.
Then $(\prod_{j=1}^n B_{i, j})_{i\in\N}$ is a basis for $R[X_1, \ldots, X_n]$.
</div>

Thus the Newton basis for $R[X_1, \ldots, X_n]$ is $((X_1)_{i_1}\cdot\ldots\cdot(X_n)_{i_n})_{i\in\N_0^n}$.

# Univariate $\ZU$
<div class="theorem">
<div>Generators of $\ZU$</div>
$\ZU = (Z_0, \ldots, Z_d)$ where $d$ is the smallest integer such that $m$ divides $d!$.

$$Z_i = \frac{m}{\gcd(i!, m)}(X)_i$$
</div>

This result was already stated in [Part 3 of the MBA series](/posts/perm-poly),
but I didn't prove it and instead referred to [Singmaster](https://doi.org/10.1016/0022-314X(74)90031-6).
We will prove it here ourselves, because (I think) Singmaster's proof is more difficult
to generalize to multiple variables.

The idea is to first show that the $Z_i$ are zero everywhere,
and then that every polynomial that is zero everywhere, is generated by the $Z_i$.

## The $Z_i$ are zero everywhere
Let $Z_i=c(X)_i$.
We will show that the $c$ from the definition is actually optimal, because we will need it later.
Notice that $(k)_i$ is the product of $i$ consecutive integers.
(If you think in $\Z_m$ then they could wrap around, in which case 0 is in the product,
so we are done).
It is a well known fact that the product of $i$ consecutive integers is divisible by $i!$,
which can be proven in one line.
$$(k)_i = \binom{k}{i} i!$$
In particular $(i)_i = i!$.
The right-hand side being zero in $\Z_m$ means being a multiple of $m$ in $\Z$,
so to choose $c$ as small as possible,
we want $$c\cdot i! = \text{lcm}(i!, m)$$
So
$$c=\frac{\text{lcm}(i!, m)}{i!}=\frac{m}{\gcd(i!, m)}$$
by $ab = \gcd(a, b)\text{lcm}(a, b)$ for $a,b\in\N$.
<div class="qed-line"></div>

## A Polynomial that is zero everywhere is generated by the $Z_i$
Let $N\in\ZU$, i.e. $N\in\Z_m[X]$ such that $n(x) = 0$ for all $x$.
We can write $N$ in the Newton basis:
$$N=\sum_i c_i(X)_i$$

We will show inductively that the coefficients have the given form, i.e. that actually $N=\sum_i d_iZ_i$.

For $k=0$, we will consider $n(0)$.
Obviously, $n(0)=c_0$, since $(0)_i=0$ for $i>0$.
So $c_0$ has to be zero (or a multiple of the modulus $m$, if you think of the polynomials as being over $\Z$).

Similarly, for $k>0$, we will consider $n(k)$.
From the induction hypothesis we get that we can write $N$ as:
$$N=\sum_{i\geq k} c_i(X)_i + \sum_{i<k} d_iZ_i$$

We have $(k)_i=0$ for $i>k$ and of course $Z_i(k) = 0$, so
$$n(k) = c_k(k)_k=c_kk!$$
But this is exactly the case we discussed when finding the $c$ for the $Z_i$,
so $c_k$ is a multiple of that $c$, i.e. $c_k=d_k\frac{m}{\gcd(k!, m)}$ and $N$ can be written
$$N=\sum_{i>k} c_i(X)_i + \sum_{i\leq k} d_iZ_i$$

When $k\geq d$, $\frac{m}{\gcd(k!, m)}$ is 1, so further $P_k$ are just $R[X]$-multiples of $P_d$,
and thus not needed in the generating set.
<div class="qed-line"></div>

# Multivariate $\ZI$
One idea you might have, is whether the multivariate $\ZI$ is just the product of the univariate $\ZU$ in each variable,
but this is not true.
For example, consider the polynomial $(2X^2+2X)(2Y^2+2Y)=4X^2Y^2+4X^2Y+4XY^2+4XY$ that is 0 everywhere mod 16,
but $(2X^2+2X)$ is not 0 mod 16.
Nevertheless, the simple (but not quite as simple) generalization of the univariate case that I showed at the beginning is true.

Again, let $N\in\ZI$, i.e. $N\in\Z_m[X_1, \ldots, X_n]$ such that $n(x) = 0$ for all $x$.
Again, we can write $N$ in the Newton basis:
$$N=\sum_{i_1,\ldots,i_n} c_{i_1,\ldots,i_n}(X_1)_{i_1}\ldots(X_n)_{i_n}$$

There very well may be a cleverer way to do this, but we are essentially going to do induction.
But the details of the inductions actually require some thought.
We want to follow the same logic as in the univariate case, i.e. to prove that $c_{k_1,\ldots,k_n}$ has the correct form
(in this case $\frac{m}{\gcd(\prod_j k_j!, m)}$) by considering $n(k_1,\ldots,k_n)$.
Let's look at $n(k_1,\ldots,k_n)$ to reverse-engineer what the induction hypothesis should look like.

$$n(k_1,\ldots,k_n) = \sum_{i_1,\ldots,i_n}c_{i_1,\ldots,i_n} (k_1)_{i_1}\ldots(k_n)_{i_n}$$

If any of the $i_j>k_j$, then $(k_j)_{i_j}=0$ and so the whole term is zero.
This means we can restrict the sum.
$$n(k_1,\ldots,k_n) = \sum_{i_1 \leq k_i, \ldots, i_n \leq k_n}c_{i_1,\ldots,i_n} (k_1)_{i_1}\ldots(k_n)_{i_n}$$

The other terms are not zero in general (i.e. for any polynomial N), but since we are formulating the induction hypothesis,
we can assume those $c_{i_1,\ldots,i_n}$ have the correct form, meaning we can write them as multiples of the $Z_{i_1,\ldots,i_n}$.
We just have to be careful to exclude $i_1=k_1,\ldots,i_n=k_n$, since that is the term we're trying to show is zero.
Over all the induction hypothesis looks like this:

*$N$ has the following form:*
$$N=c_{k_1,\ldots,k_n}(X_1)_{k_1}\ldots(X_n)_{k_n}
+ \sum_{i_1 > k_1 \lor \ldots \lor i_n > k_n} c_{i_1,\ldots,i_n}(X_1)_{i_1}\ldots(X_n)_{i_n}
+ \sum_{\substack{i_1 \leq k_1 \land \ldots\land i_n \leq k_n\\\exists j: i_j \neq k_j}} d_{i_1,\ldots,i_n}Z_{i_1,\ldots,i_n}$$

Here is an illustration for 2 variables where $k_1 = k_2 = 2$. The yellow point at $(2, 2)$ stands for the $c_{2, 2}$ term
that we are trying to show has the wanted form.
The blue dots are the terms of the first sum, which are automatically zero when evaluating $n(k_1, k_2) = n(2, 2)$.
The red dots are the terms of the second sum, which we assume have the correct form already
(because we have shown that they do previously) and are thus also zero.

```js run
svg1
```

We're now 80% done, even though we haven't even shown that $c_{k_1,\ldots,k_n}$ has the correct form given the form of $N$,
which we are going to do now.
As we just discussed, we will consider $n(k_1,\ldots,k_n)$.
By our construction, the only term that is non-zero is:
$$n(k_1,\ldots,k_n) = c_{k_1,\ldots,k_n}(k_1)_{k_1}\ldots(k_n)_{k_n} = c_{k_1,\ldots,k_n}k_1!\ldots k_n!$$

Going through the same logic as in the univariate case, we want this to equal a multiple of the modulus $m$.
But this implies that $c_{k_1,\ldots,k_n}$ is a multiple of the smallest such value which is $\frac{m}{\gcd(k_1!\ldots k_n!, m)}$,
by the exact argument as in the univariate case.

To show this is true for all $k_1,\ldots,k_n$, we can e.g. do induction on $k=k_1+\ldots+k_n$.
For $k=0$, this is trivial.
And the induction step we just proved can be easily used to show this for $k>0$.

For example for 2 variables and $k=3$, we have already shown it for $k<2$,
i.e. the the red points in the following diagram.
And the induction step allows us to conclude it for all points on the boundary.

```js run
svg2
```

<div class="qed-line"></div>

# On Minimality
In the [Part 3 of the MBA series](/posts/perm-poly), I already discussed that for the univariate case,
when the modulus $m$ is a power of two, then every $Z_{2i+1}$ is not needed,
because it is an $\Z[X]$-multiple of the previous $Z_{2i}$, which follows from the fact
that it has the same leading coefficient, as discussed there.
In general, the same idea applies: If $Z_{i_1,\ldots,i_n}$ has the same leading coefficient as any of
$Z_{i_1-1,\ldots,i_n},\ldots,Z_{i_1,\ldots,i_n-1}$, then it is obviously a multiple of that polynomial
and is not needed.
At some point the leading coefficient will be 1, at which point no further polynomials are needed,
because they all have leading coefficient 1.
This way you can algorithmically find the minimal generating set.
Of course if you were gonna store them, you wouldn't really care about the variable names,
so e.g. storing $Z_{2, 1}=8X_1(X_1-1)X_2$ and $Z_{1, 2}=8X_1(X_2)(X_2-1)$ (for $m=16$) is redundant,
because $Z_{2, 1}(X_1, X_2)=Z_{1, 2}(X_2, X_1)$.
In practice you would restrict the list to $i_1\geq\ldots\geq i_n$,
but by the definition of a generating set these are still needed.
