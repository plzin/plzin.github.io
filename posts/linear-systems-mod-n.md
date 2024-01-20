---
title: 'Mixed Boolean-Arithmetic (Part 2): Systems of Linear Equations mod n'
date: '2023-04-24'
macros:
    - x: \mathbf{x}
    - b: \mathbf{b}
    - A: \mathbf{A}
    - D: \mathbf{D}
    - G: \mathbf{G}
    - H: \mathbf{H}
    - S: \mathbf{S}
    - T: \mathbf{T}
    - U: \mathbf{U}
    - Z: \mathbb{Z}
summary: >-
    We discuss systems of linear equations mod n.
    We see how solving a puzzle in a video game can be reduced to such a
    linear system. We then try to actually solve such systems by reducing
    them to systems of diophantine equations and solving those with the
    "Hermite Normal Form" or more directly by "Diagonalization".
---

In this post we are going to try and solve systems of linear congruences, i.e.
$\A\x=\b$, where $\A\in (\Z_n)^{r\times c}$, $\x\in (\Z_n)^c$, $\b\in (\Z_n)^r$ and $\Z_n$ are the integers mod n.
In addition to finding a solution, we will also find a basis[^1] for the kernel which gives us all possible solutions.
If you want to see the motivation for this, see [part one](/posts/mba), but it is not required.

The post will be structured as follows:
1. I'm going to show you a puzzle where this problem is at its core, which you can skip.
2. We will try to apply some standard linear algebra to see where we get stuck.
3. I will present two different solutions.
4. We will discuss the differences between these solutions and wrap up with some future work.

Prerequisites for this post are:
- Linear Algebra. You should know what a [field](https://en.wikipedia.org/wiki/Field_(mathematics)) is and how to solve normal systems of linear equations, i.e. [Gaussian Elimination](https://en.wikipedia.org/wiki/Gaussian_elimination).
- Very basic Abstract Algebra. $\Z_n$ is a commutative [ring](https://en.wikipedia.org/wiki/Ring_(mathematics)). The units (elements with a multiplicative inverse) are the elements coprime to $n$.
- Very basic Number Theory, i.e. what a [diophantine equation](https://en.wikipedia.org/wiki/Diophantine_equation) is and having heard of the [(Extended) Euclidean Algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm) wouldn't hurt.

I'm going to define some conventions.
I will identify the elements of $\Z_n$ with the representatives $\{0,\dots,n-1\}$.
Historically equivalence mod n was written $a\equiv b\pmod n$, but I will use an $=$ to be more uniform.
Think of the $\text{mod}\ n$ as meaning: "This expression is to be evaluated in $\Z_n$".
I don't want to write $\A\x\equiv\b$.
If it is clear that we are in $\Z_n$, I won't state the $\text{mod}\ n$.

If you just want to skip the puzzle, [click here](#Solution)!

[^1]: It's not actually a basis, it's a generating set, but it is okay to think of it as a basis for now. It will be discussed in more detail [at the end](#Basis), if you are interested.

# A puzzle
This is a puzzle in a video game called Genshin Impact.

<div>
    <video style="margin-left: auto; margin-right: auto; margin-bottom: 1em; margin-top: 1em; display: block; width: 100%" muted controls>
        <source src="/videos/GI1.mp4" type="video/mp4">
        A video clip of the puzzle would appear here if your browser supported it.
    </video>
</div>

What's going on here?
You can see four stones, each of which can be in 3 states (1, 2, 3).
The goal is for every stone to be in state 3 at the same time.
Changing the state of a stone is done by attacking it, which increments the state, wrapping around if it's 3.
But this does not only change the state of the attacked stone, but also of the neighbor(s) (in this instance).

How does this relate to the "Linear Equations mod $n$" problem?

Let the (state of the) stones be $s_1$, $s_2$, $s_3$, $s_4$ from left to right.
Initially, the state is $s_1=3$, $s_2=1$, $s_3=1$, $s_4=3$.
The "wrapping around" part corresponds to modular arithmetic.
All calculations are done in $\Z_3$ (mod 3).
Because 3 = 0, the initial state is equivalently $s_1=0$, $s_2=1$, $s_3=1$, $s_4=0$.

When the first stone is hit, $s_1$ and $s_2$ are incremented (mod 3).

Let's call the number of times the first stone is hit $x_1$ (similarly for the others).
When the first stone is hit $x_1$ times the state of the system is

$$
\begin{align*}
t_1 &= s_1 + x_1 &\pmod 3\\
t_2 &= s_2 + x_1 &\pmod 3\\
t_3 &= s_3 &\pmod 3\\
t_4 &= s_4 &\pmod 3\\
\end{align*}
$$

where $t_i$ is the state of stone $i$ after the hits.
You can see that the state of stones 1 and 2 was incremented $x_1$ times, while the state of stones 3 and 4 didn't change.
But here we only considered hitting stone 1.
When the other stones are hit $x_i$ times, we get the following:

$$
\begin{align*}
t_1 &= s_1 + x_1 + x_2 &\pmod 3\\
t_2 &= s_2 + x_1 + x_2 + x_3 &\pmod 3\\
t_3 &= s_3 + x_2 + x_3 + x_4 &\pmod 3\\
t_4 &= s_4 + x_3 + x_4 &\pmod 3\\
\end{align*}
$$

Take your time to confirm this is indeed what we want.
Hitting stone 1 $x_1$ times increases the state of stones 1 and 2.
Hitting stone 2 $x_2$ times increases the state of stones 1, 2 and 3.
Hitting stone 3 $x_3$ times increases the state of stones 2, 3 and 4.
And hitting stone 4 $x_4$ times increases the state of stones 3 and 4.

To solve this puzzle, the final state of every stone needs to be 3 or equivalently 0, which means all $t_i=0$.
To get the problem into the form we want, we subtract the initial state $s_i$ in each equation to bring it to the left side.

$$
\begin{align*}
-s_1 &= x_1 + x_2 &\pmod 3\\
-s_2 &= x_1 + x_2 + x_3 &\pmod 3\\
-s_3 &= x_2 + x_3 + x_4 &\pmod 3\\
-s_4 &= x_3 + x_4 &\pmod 3\\
\end{align*}
$$

We can use matrix/vector notation to "simplify" this.

$$
\A = \begin{bmatrix}
    1 & 1 & 0 & 0\\
    1 & 1 & 1 & 0\\
    0 & 1 & 1 & 1\\
    0 & 0 & 1 & 1\\
\end{bmatrix}
\ \ %
\x = \begin{bmatrix}
    x_1\\
    x_2\\
    x_3\\
    x_4\\
\end{bmatrix}
\ \ %
\b = \begin{bmatrix}
    -s_1\\
    -s_2\\
    -s_3\\
    -s_4\\
\end{bmatrix}
= \begin{bmatrix}
    -0\\
    -1\\
    -1\\
    -0\\
\end{bmatrix}
= \begin{bmatrix}
    0\\
    2\\
    2\\
    0\\
\end{bmatrix}
$$

This leaves us with the equation $\A\x=\b$.
I won't write the "mod 3" anymore, just consider all calculations to be in $\Z_3$.

Let's actually try to solve this specific instance of the problem by finding the row echelon form of the matrix.

$$
\left[\begin{array}{rrrr|r}
    1 & 1 & 0 & 0 & 0\\
    1 & 1 & 1 & 0 & 2\\
    0 & 1 & 1 & 1 & 2\\
    0 & 0 & 1 & 1 & 0\\
\end{array}\right]
\stackrel{\text{II=I-II}}\rightarrow
\left[\begin{array}{rrrr|r}
    1 & 1 & 0 & 0 & 0\\
    0 & 0 & 2 & 0 & 1\\
    0 & 1 & 1 & 1 & 2\\
    0 & 0 & 1 & 1 & 0\\
\end{array}\right]
\stackrel{\text{II}\leftrightarrow \text{III}}\rightarrow
\left[\begin{array}{rrrr|r}
    1 & 1 & 0 & 0 & 0\\
    0 & 1 & 1 & 1 & 2\\
    0 & 0 & 2 & 0 & 1\\
    0 & 0 & 1 & 1 & 0\\
\end{array}\right]
\stackrel{\text{IV=IV+III}}\rightarrow
\left[\begin{array}{rrrr|r}
    1 & 1 & 0 & 0 & 0\\
    0 & 1 & 1 & 1 & 2\\
    0 & 0 & 2 & 0 & 1\\
    0 & 0 & 0 & 1 & 1\\
\end{array}\right]
$$

From the fourth row we have $x_4=1$.
From the third row $2x_3=1 \Leftrightarrow x_3=2$.
From the second row $x_2 + x_3 + x_4 = x_2 + 3 = x_2 = 2$.
From the first row $x_1 + x_2 = x_1 + 2 = 0 \Leftrightarrow x_1 = 1$.

So overall

$$
\x = \begin{bmatrix}
    1\\
    2\\
    2\\
    1\\
\end{bmatrix}
$$

You can see in the video that I hit the fourth stone 4 times, but this is equivalent to 1 mod 3.

Since 3 is prime, $\Z_3$ is a field, which means we can just apply usual linear algebra techniques.
$\Z_n$ is not a field in general because not all elements have a multiplicative inverse.
But we needed these to eliminate entries.
For example, in the last step we want to eliminate the first 1 in the last row using the third row.
We have to multiply the third row by the inverse of the first entry $2^{-1}=2$ and subtract it from the last row,
which is equivalent to adding the third row ($-2=1$).
Admittedly, you can avoid this situation in this instance, if you choose other operations in previous steps, but it is not avoidable in general.
We also used this fact when solving for $x_3$ ($2x_3=1 \Leftrightarrow x_3=2$).

<a id="Solution"> </a>
# First attempt
The general idea is to use Gaussian Elimination but there are some problems with it:

### Elementary Row Operations
Suppose this was a – admittedly very simple – row:

$$2x=1\pmod 6$$

It doesn't have a solution, but multiplying it by 2 we get

$$4x=2\pmod 6$$

which is solved by $x=2$.
So what went wrong here?
Why do we have a solution now when we didn't before?
This can't happen over the real numbers or other fields.

Let's first think about what operations on the rows are allowed without changing the space of solutions.
Row operations correspond to left-multiplication of [elementary matrices](https://en.wikipedia.org/wiki/Elementary_matrix).
What makes these operations not change the set of solutions is that they are **invertible**.
Suppose we have an $\x$ that solved the system after an elementary row operation, i.e. such that $\U\A\x=\U\b$ where $\U$ is an elementary matrix (or any invertible matrix actually).
Then we also have $\A\x=\U^{-1}\U\A\x=\U^{-1}\U\b=\b$, meaning $\x$ is also a solution to the original system.

At this point we have to verify which of the elementary matrices are invertible over $\Z_n$.
Let's be more general and consider any commutative ring $R$.
We can find the inverse of a matrix algebraically using [Cramer's rule](https://en.wikipedia.org/wiki/Cramer%27s_rule#Finding_inverse_matrix) as

$$\A^{-1}=\frac1{\det \A} \text{adj}(\A)$$

Where $\text{adj}(\A)$ is the [adjugate](https://en.wikipedia.org/wiki/Adjugate_matrix) of $\A$ which is defined in terms of minors which are themselves defined in terms of determinants,
which – in particular – involve no inverses, so the adjugate can be computed for any matrix in any commutative ring.
What can, however, fail, is for the determinant to be a unit in $R$.
So a matrix $\A$ is invertible iff $\det \A$ is a unit.
In a field, the only non-unit is 0, so a matrix is invertible iff $\det \A \neq 0$, which is the known result from Linear Algebra.

Computing the determinants for the elementary matrices, we find that:
- Swapping two rows is obviously still okay.
The elementary matrix has determinant -1 which is always invertible since it is its own inverse.
- Multiplication of a row by a constant is only okay if the constant is a unit.
The determinant is that constant.
- Addition of a multiple of one row to another is still okay, no matter what we multiply the row by.
The determinant is 1.

### Row Reduction
Suppose $n=6$ and consider this system of linear congruences, which will serve us as an example throughout the post:

$$
\left[\begin{array}{rr|r}
    3 & 5 & 0\\
    4 & 2 & 2\\
\end{array}\right]
$$

Let's think about what Gaussian Elimination would do over the real (or rational) numbers.
To make the first entry of the second row zero, we would subtract $\frac43$ times the first row from it.
Analogously in the modular case, we want to multiply the first row by something, so that the first entry becomes a 4 and then subtract it from the second row.
We want to solve $3x=4$.
If 3 had an inverse mod 6, this would be no problem.
Simply multiply both sides by the inverse of 3 to get $3^{-1}3x=x=3^{-1}4$.
But 3 doesn't have an inverse mod 6.
Furthermore the equation $3x=4$ doesn't have a solution mod 6.
The same goes for switching the role of the rows, which means trying to eliminate the 4.
In general a linear congruence $cx=b\pmod r$ has a solutions if and only if $\gcd(c, r) | b$, so we can eliminate neither entry in the first row and we are stuck.
Perhaps surprisingly, this system still has a solution: $x_1=2$, $x_2=0$, so we will have to find a way around this.

There might be multiple ways to do this, but a very straightforward one is to choose the smallest non-zero element in the column as a pivot and to reduce all other elements using it.
For simplicity, we always swap the row of the pivot to the top.
In this simple case the pivot is the three and we reduce the second row with the first as much as possible, which in this case is just once.

$$
\left[\begin{array}{rr|r}
    3 & 5 & 0\\
    4 & 2 & 2\\
\end{array}\right]
\stackrel{\text{II=II-I}}\rightarrow
\left[\begin{array}{rr|r}
    3 & 5 & 0\\
    1 & 3 & 2\\
\end{array}\right]
$$

Of course, we are still not done with this column, but all entries below the pivot are smaller than the pivot.
Now, we select the pivot, which is 1, and swap it to the top.

$$
\left[\begin{array}{rr|r}
    3 & 5 & 0\\
    1 & 3 & 2\\
\end{array}\right]
\stackrel{\text{I}\leftrightarrow \text{II}}\rightarrow
\left[\begin{array}{rr|r}
    1 & 3 & 2\\
    3 & 5 & 0\\
\end{array}\right]
$$

We can reduce the second row 3 times with the first one.

$$
\left[\begin{array}{rr|r}
    1 & 3 & 2\\
    3 & 5 & 0\\
\end{array}\right]
\stackrel{\text{II=II-3I}}\rightarrow
\left[\begin{array}{rr|r}
    1 & 5 & 2\\
    0 & 2 & 0\\
\end{array}\right]
$$

And we're done!
If the matrix was bigger, we would continue with the next column.

I think this is one of those algorithms where it's easy to see why it terminates.
In each iteration, all elements below the pivot are reduced so that they are strictly smaller than the pivot.
So in the following iteration the pivot will be strictly smaller than in the current iteration.
If, at some point, all other elements below the pivot are 0, we can continue with the next column.
Otherwise, since the pivot is getting smaller in each iteration, it will be 1 at some point,
in which case all other entries can be reduced to 0 and we can continue with the next column.

Anyways, we can read the solution off the final matrix now.
The second row tells us that $2x_2=0$ which means $x_2\in \{0, 3\}$.
And from the first we get $x_1+5x_2=x_1-x_2=2$.
For $x_2=0$ we get $x_1=2$, and for $x_2=3$ we have $x_1=5$.
So overall, the solutions are
$$\x=\left[\begin{array}{r}2\\0\\\end{array}\right],\left[\begin{array}{r}5\\3\\\end{array}\right]$$

While this representation is fine, when $n$ is small, what we really want is a basis for the kernel and any particular solution.
In this case, you can deduce the basis as the difference of the two solutions, so we can write the general solution as

$$\x=\left[\begin{array}{r} 2\\ 0\\ \end{array}\right]+i\cdot\left[\begin{array}{r} 3\\ 3\\ \end{array}\right]$$

#### Back-Substitution is annoying
In general, finding a particular solution and a basis for the kernel is annoying.
Especially when trying to automate it, so I won't go into more detail than I have to here.

Consider this example in $\Z_6$.
$$
\left[\begin{array}{rrr|r}
    1 & 3 & 3 & 5\\
    0 & 2 & 3 & 4\\
    0 & 0 & 2 & 4\\
\end{array}\right]
$$

The last row tells us that
$$2x_3=4\pmod 6$$
The solutions will again be the sum of a particular solution and the solutions to $2x_3=0\pmod 6$.
To find a particular solution, we can translate the problem into a diophantine equation:
$$2x_3+6i=4$$
This can be solved using the [Extended Euclidean Algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm) and we simply discard the solution for i.
Since the numbers are so small here, we can see that $x_3=2$ is a solution.
The solutions to $2x_3=0\pmod 6$ are just
$$x_3=k\cdot\frac6{\gcd(2, 6)}=3k$$
So overall
$$x_3=2+3k$$
You can find the proof of everything we did [here](https://en.wikipedia.org/wiki/Diophantine_equation#One_equation).

Now, to do the next step of back-substitution, we substitute our solution into the equation of the next row.
$$2x_2+3x_3=2x_2+3(2+3k)=2x_2+3k=4\pmod 6$$
We have an additional variable!
This can still be solved by generalizing the method we used above, but I won't do that here.
I just wanted to show you that things get more annoying.
If we step away from trying to solve this algorithmically, we can see that $k$ must be even, because otherwise the sum will be odd, so $k=2l$.
Then we have the same problem as before and know $x_2=2+3m$.
Furthermore, because $k$ is even, we can look at our solution for $x_3$ which now reduces to $x_3=2+3k=2+3(2l)=2+6l=2\pmod 6$.
I will stop here.
I think you can see why this is annoying (but certainly not impossible) to automate.
We have to solve multi-variable linear congruences and the solutions for old variables can still change.
So even if you just wanted any solution to the system, you could not just pick any particular solution for a variable
and then continue back-substitution with that choice, since other rows might require a different choice.

# First solution: Reduction to Diophantine Equations
We're going to construct a system of linear diophantine equations.
It might seem counterintuitive at first, we've just seen that the back-substitution results in diophantine equations which are pretty annoying to solve.
And it's true that this method will also allow you to solve the diophantine equations for back-substitution,
it will actually end up giving us a solution and a basis for the kernel very easily.

Formally, a system of linear diophantine equations is just $\A\x=\b$ where all entries are in $\Z$.
Translating our original problem into this form is rather straightforward.
Recall that $a=b\pmod n$ iff $\exists k\in\Z: a + kn = b$.
Using the example from the beginning, the matrix

$$
\left[\begin{array}{rr|r}
    3 & 5 & 0\\
    4 & 2 & 2\\
\end{array}\right]
$$

is equivalent to the following system of congruences

$$
\begin{align*}
3x_1+5x_2&= 0\pmod 6\\
4x_1+2x_2&= 2\pmod 6
\end{align*}
$$

which is itself equivalent to
$$
\begin{align*}
3x_1+5x_2+6k&= 0\\
4x_1+2x_2+6l&= 2
\end{align*}
$$

Notice, that we need a new variable for each equation since the factors of the modulus do not depend on each other.
The matrix form for this is

$$
\left[\begin{array}{rrrr|r}
    3 & 5 & 6 & 0 & 0\\
    4 & 2 & 0 & 6 & 2\\
\end{array}\right]
$$

So all we have to do, is append $n\mathbf{I}_r$ to the right of $\A$ to get a problem over the integers
which, as a ring, have much nicer properties than the integers mod n.
Now, we have to solve the system of linear diophantine equations which will be the topic of the next section.

Before we delve into that, I want to talk about how to go from a solution to the diophantine equations to a solution for the original system,
which is rather simple.
Suppose $\x'$ is a solution to $\A'\x'=\b$, then $\x'$ contains entries for the modulus which we just have to truncate.
The same goes for the basis vectors of the kernel, but it is possible to introduce linear dependence[^2] here.
For mixed boolean-arithmetic, this doesn't really matter because we just want a random solution.

[^2]: Linear dependence is not the issue per se, but minimality of the generating set. It will be discussed in the [last section](#Basis), if you are interested.

### System of Linear Diophantine Equations
To simplify notation, the matrix is $\A$ again, so we are solving $\A\x=\b$ where the matrices have integer entries.

#### The Hermite Normal Form
We are going to compute the [Hermite Normal Form (HNF)](https://en.wikipedia.org/wiki/Hermite_normal_form) of a certain matrix, that we are going to set up in the next section.
The Hermite normal form is a row echelon form of the matrix where the pivots are positive and the elements above each pivot are positive and smaller than the pivot.

A simple algorithm for computing it is very similar to the row reduction algorithm
for $\Z_n$-matrices that we've seen above but there are some differences.
First, let's figure out what elementary row operations are allowed.
Of course, swapping rows is okay and adding a multiple of one row to another is as well.
We already found out that multiplication of a row by a constant is only okay, if that constant is a unit.
The only units in $\Z$ are 1 and -1.
In the $\Z_n$ case, we didn't need multiplication by units at all, but could've used it to accelerate eliminating entries.
In this case, we need it because the conditions on the HNF state that the pivots are positive.
When choosing a pivot in a column, we choose the element with the smallest absolute value and multiply the row by -1, if it is negative.
Once the pivot is selected, we reduce all elements with it in the same way we've seen before.
When all elements except the pivot are zero, we can use the pivot to reduce all elements above it, so that they are positive and less than the pivot.

I won't work through an example here but you can find the code [here](https://github.com/plzin/mba/blob/main/src/diophantine.rs),
which should hopefully clear up any questions.

As we've already discussed, the application of row operations corresponds to the left-multiplication by elementary matrices.
Let $\A^{(i)}$ be the matrix at step i and $\mathbf{E}^{(i)}$ be elementary matrix of the row operation applied in step i.
Then we have
$$\A^{(i+1)}=\mathbf{E}^{(i)}\A^{(i)}$$

In the end the HNF $\H$ is
$$\H=\A^{(i+1)}=\mathbf{E}^{(i)}\A^{(i)}=\ldots=\mathbf{E}^{(i)}\cdot\ldots\cdot\mathbf{E}^{(0)}\A$$

Let $\U$ be the overall transformation matrix, i.e.
$$\U=\mathbf{E}^{(i)}\cdot\ldots\cdot\mathbf{E}^{(0)}$$

So overall we have
$$\H=\U\A$$

We can compute $\U$ along the way by initializing it to an identity matrix and applying the same row operations to $\U$ that we do to $\A$.
Since the $\mathbf{E}^{(i)}$ are invertible, their product $\U$ is too, which over $\Z$ means that $\det \U = \pm 1$.
Such a matrix is called a [unimodular matrix](https://en.wikipedia.org/wiki/Unimodular_matrix).
Important to note is that – as the "normal form" implies – $\H$ is unique, i.e. there is only one HNF of $\A$.


#### Solving Linear Diophantine Equations
Computing the HNF of $\A$ doesn't give us the solutions directly.
But I promised a way to find the solutions using only the HNF.
The approach is outlined in [this paper](http://www.numbertheory.org/PDFS/ax=b.pdf).
Basically we construct the matrix

$$
\G = \left[\begin{array}{rr}
    \A^T & 0\\
    \b^T & 1\\
\end{array}\right]
$$

and compute the HNF $\H$ which – as discussed above – also gives us an invertible matrix $\U$ such that $\U\G=\H$.
Let's think about what $\H$ will look like.
If $\A\x=\b$ has a solution, then $x_1, \dots, x_c$ exist such that

$$\sum_{i=1}^c x_i\mathbf{a}_i = \b$$

where $\mathbf{a}_i$ is the i-th column of $\A$.
Since the columns of $\A$ appear as rows in $\G$ (which is important because we are using row operations), we can eliminate $\b^T$ using the coefficients $x_i$.
So all in all, $\H$ will contain a row of zeros,
except for the last entry which is a 1 that is inherited from $\G$.
Moreover, $\H$ will contain the HNF of $\A^T$ which might contain rows of zero which will be moved to the bottom.
Let $\H'$ be the non-zero rows of the HNF of $\A^T$, then over all $\H$ takes the form:

$$
\H = \left[\begin{array}{cc}
    \H' & 0\\
    0 & 1\\
    0 & 0\\
\end{array}\right]
$$

The zero rows at the end may or may not exist.
Actually, the argument is not completely sound yet, clearly the $\H$ I just gave you fulfills the HNF conditions and by the above argument
arises from the application of elementary row operations on $\G$. By the uniqueness of the HNF, it is **the** HNF.
This doesn't really help us much yet though, because we want $\x$ and a basis for the kernel.
These will be encoded in $\U$, so let's understand what that matrix looks like.
I think it's easiest if I just tell you the solution and we then verify that it makes sense:

$$
\U = \left[\begin{array}{rr}
    \mathbf{Q} & 0\\
    -\x^T & 1\\
    \mathbf{K}^T & 0\\
\end{array}\right]
$$

Again, the $\mathbf{K^T}$ rows need not exist if the kernel of $\A$ is trivial.
We know that $\U\G=\H$ and will derive a bunch of relations between the sub-matrices contained in $\U$, $\G$ and $\H$ from this.
All this really is, is following the matrix multiplication.
$$\mathbf{Q}\A^T = \H'$$
$\mathbf{Q}$ is just the transformation matrix from the HNF of $\A^T$ which we don't care about.

From the $\x^T$ row, we get
$$-\x^T\A^T + \b^T = 0$$
Taking the transpose and moving $\b$ to the other side
$$\A\x=\b$$
which is what we want and confirms that $\x$ really is the solution we are looking for.

From the $\mathbf{K}^T$ rows, we get
$$\mathbf{K}^T\A^t = 0$$
Again taking the transpose, we get
$$\A\mathbf{K}=0$$
Looking at the columns $\mathbf{k}_1, \dots, \mathbf{k}_m$ of $\mathbf{K}$ we have that
$$\A\mathbf{k}_i=0$$
so the columns are in the kernel of $\A$.
Additionally $\mathbf{k}_1, \dots, \mathbf{k}_m$ are linearly independent since $\U$ is invertible
and by the definition of the HNF they have to span the kernel, since otherwise we would have another zero row in $\H$,
so $\mathbf{k}_1, \dots, \mathbf{k}_m$ is a basis.


#### Hermite Normal Form over $\Z_n$?
Why did we bother to create the diophantine equations?
Couldn't we have just set up the matrix $\G$ in the same way, but with entries in $\Z_n$ and then computed the HNF of it?
No. Well maybe, but I couldn't make it work, but there might be some way to fix the problems, but I couldn't see it.
The problem is that the Hermite Normal Form is not really well defined for $\Z_n$-matrices.

One of the problems is that $\Z_n$ is not even an [integral domain](https://en.wikipedia.org/wiki/Integral_domain) meaning non-trivial zero-divisors exist,
which is a problem when doing euclidean division.
Additionally there is really not a sensible way to define $\lt$ to choose the pivot since the ring is cyclic.
In the example above we just chose the usual $\lt$ on the representatives $\{0, \dots, 5\}$.
Consider the following matrix (still with $n=6$):

$$
\left[\begin{array}{rr}
    2 & 1\\
    4 & 0\\
\end{array}\right]
$$

In the algorithm I just showed you, we would subtract the first row 2 times from the second row and get

$$
\left[\begin{array}{rr}
    2 & 1\\
    4 & 0\\
\end{array}\right]
\stackrel{\text{II=II-2I}}\rightarrow
\left[\begin{array}{rr}
    2 & 1\\
    0 & 4\\
\end{array}\right]
$$

This matrix fulfills the conditions for a HNF, but if we instead add the first row to the second, we get

$$
\left[\begin{array}{rr}
    2 & 1\\
    4 & 0\\
\end{array}\right]
\stackrel{\text{II=II+I}}\rightarrow
\left[\begin{array}{rr}
    2 & 1\\
    0 & 1\\
\end{array}\right]
$$

We then simplify further by subtracting the second row from the first to reduce the element above the pivot.

$$
\left[\begin{array}{rr}
    2 & 1\\
    0 & 1\\
\end{array}\right]
\stackrel{\text{I=I-II}}\rightarrow
\left[\begin{array}{rr}
    2 & 0\\
    0 & 1\\
\end{array}\right]
$$

This matrix also fulfills the conditions for a HNF, so the HNF is no longer unique, which we needed for the above construction.
Additionally the second operation is (arguably) better, because we get a diagonal matrix, but how could we have known to make it in advance.
If you find some way to save this, let me know 😉.

# Second solution: Diagonalization
There is another approach that avoids the translation to diophantine equations entirely.
We can transform the matrix into a diagonal matrix using both row and column operations.
Zeros are allowed on the diagonal.
Whereas the row reduction algorithm over $\Z_n$ was similar to the Hermite normal form, this algorithm will be similar to the [Smith Normal Form (SNF)](https://en.wikipedia.org/wiki/Smith_normal_form).
But again, the SNF is defined for $\Z$-matrices and not unique for $\Z_n$.
Moreover the SNF places restriction on the elements in the diagonal, which causes the most trouble for coming up with an algorithm, but we are not going to need it here.

Note that the "diagonalization" here has nothing to do with the usual one in linear algebra, where you find an invertible matrix $\U$,
such that $\U\A\U^{-1}$ is diagonal, which can't even be done for every matrix.
Instead we are going to find invertible matrices $\S$, $\T$ such that $\D=\S\A\T$ is diagonal, which can always be done.

The algorithm for computing the diagonal matrix uses exactly the same ideas we've already seen.
In the first step we eliminate all entries in the first row and first column except the first entry which is on the diagonal.
We then just continue recursively with the rest of the matrix.

Let's look at an example in $\Z_6$.
We will first use row operations to eliminate the entries in the column.
This is exactly the same thing we've already seen.

$$
\left[\begin{array}{rr}
    3 & 5\\
    4 & 2\\
\end{array}\right]
\stackrel{\text{II=II-I}}\rightarrow
\left[\begin{array}{rr}
    3 & 5\\
    1 & 3\\
\end{array}\right]
\stackrel{\text{I}\leftrightarrow\text{II}}\rightarrow
\left[\begin{array}{rr}
    1 & 3\\
    3 & 5\\
\end{array}\right]
\stackrel{\text{II=II-3I}}\rightarrow
\left[\begin{array}{rr}
    1 & 3\\
    0 & 2\\
\end{array}\right]
$$

We are lucky here, because we can eliminate the 3 in the second column directly.
In general this need not happen.
We would then have to do the same procedure but with column operations, which might make entries in the row reappear.
This is not a problem, however.
Important is, that the diagonal entry, which is also the pivot, is getting smaller
in each iteration, so eventually we will be able to use it to eliminate both the row and column.
Nevertheless, in this instance we can now use a single column operations to eliminate the 3.

$$
\left[\begin{array}{rr}
    1 & 3\\
    0 & 2\\
\end{array}\right]
\stackrel{\text{II=II-3I}}\rightarrow
\left[\begin{array}{rr}
    1 & 0\\
    0 & 2\\
\end{array}\right]
$$

If the matrix was bigger, we would continue with the next row and column.
It is easy to see that the zeros in the first column and row would never be destroyed.

The matrices $\S$ and $\T$ can be computed along the way in the same way as in the HNF. They are

$$
\S=\left[\begin{array}{cc}
    5 & 1\\
    4 & 3\\
\end{array}\right],
\T=\left[\begin{array}{cc}
    1 & 3\\
    0 & 1\\
\end{array}\right]
$$

Once we have $\D$, we can solve $\D\x'=\S\b$ and get the final answer as $\x=\T\x'$.
The proof that $\x$ is a solution to $\A\x=\b$ is straightforward:

$$\D\x'=\S\A\T\x'=\S\b$$

Left-multiplying both sides by $\S^{-1}$

$$\A\T\x'=\b$$

Substituting $\T\x'=\x$

$$\A\x=\b$$

Solving $\D\x'=\S\b$ is straightforward because each row corresponds to a single variable linear congruence whose solution we have already discussed.
We have to multiply the basis of the kernel by $\T$ as well.

Continuing with the example above, we have to solve

$$
\underbrace{\left[\begin{array}{cc}
    1 & 0\\
    0 & 2\\
\end{array}\right]}_{\D}
\left[\begin{array}{c}
    x_1'\\
    x_2'\\
\end{array}\right]
=
\underbrace{\left[\begin{array}{cc}
    5 & 1\\
    4 & 3\\
\end{array}\right]}_{\S}
\underbrace{\left[\begin{array}{c}
    0\\
    2\\
\end{array}\right]}_{\b}
=
\left[\begin{array}{c}
    2\\
    0\\
\end{array}\right]
$$

So we get the linear congruences

$$x_1'=2$$

and

$$2x_2'=0\implies x_2=3i$$

So overall

$$
\x'=\left[\begin{array}{c}
    2\\
    0\\
\end{array}\right]
+i
\left[\begin{array}{c}
    0\\
    3\\
\end{array}\right]
$$

To get $\x$, we left-multiply by $\T$.

$$
\x=\underbrace{\left[\begin{array}{cc}
    1 & 3\\
    0 & 1\\
\end{array}\right]}_{\T}
\underbrace{\left(
\left[\begin{array}{c}
    2\\
    0\\
\end{array}\right]
+i
\left[\begin{array}{c}
    0\\
    3\\
\end{array}\right]
\right)}_{\x'}
=
\left[\begin{array}{c}
    2\\
    0\\
\end{array}\right]
+i
\left[\begin{array}{c}
    3\\
    3\\
\end{array}\right]
$$

This is the same solution we had already gotten using the other method.

# Conclusion and Future Work
We've see two ways to solve systems of linear congruences, so which one should you choose?
In [my mixed boolean-arithmetic implementation](https://github.com/plzin/mba) I implemented the first solution,
but mostly for non technical reasons.
I actually came up with that solution first.
I knew I could translate the linear congruences into linear diophantine equations and Wikipedia told me that those were solved.
Furthermore, you only need to implement an HNF algorithm and build the appropriate matrices.
Systems of linear diophantine equations are very general and allow you to solve many common problems in number theory
(although specific algorithms for the problem are usually faster).
Examples are a single multi-variable linear diophantine equation that we would have had to solve in the back-substitution, as well as the [Chinese Remainder Theorem](https://en.wikipedia.org/wiki/Chinese_remainder_theorem).
However, a big problem is that we need arbitrary precision integers, because the intermediate results can become big.
There might be a way to get around this for systems of linear congruences though, again, let me know if you find a way.
If that is not possible though, the second algorithm is probably better, because the size of the integers is fixed.
Additionally, if you have to solve multiple systems of linear congruences with the same $\A$, you can precompute the matrices $\S$, $\D$, $\T$
and use them to quickly find the solution.

There are some algorithmic improvements in the common core of both algorithms.
When eliminating entries in a row/column we are basically performing the euclidean algorithm but perform the additions on the whole row.
It is possible to do the euclidean algorithm on just the elements and apply the results to the whole column/row.
If you want to find out more, look for any HNF algorithm online, almost all do this, but I think it takes away from the simplicity.

The next section deals with the ways in which I've been using "basis" and "linear independence" wrong, if you are interested, but probably doesn't matter too much to most people.

<a id="Basis"> </a>
# Bases in $\Z_n$
I've been using the word basis very loosely, but in a way that hopefully makes intuitively sense.
The kind of objects we have been dealing with are [modules](https://en.wikipedia.org/wiki/Module_(mathematics)).
A module is a vector space where the scalars are allowed to be a ring instead of a field.
In this post we were dealing with the very natural modules $\Z^m$ as a $\Z$-module and $(\Z_n)^m$ as a $\Z_n$-module.
The same definition of a basis makes sense in a module as well.

Let $M$ be an $R$-module and $G=\{g_1, \dots, g_n\}\subseteq M$.
$G$ is called a [generating set](https://en.wikipedia.org/wiki/Generating_set_of_a_module) if the elements of $G$ span the module, i.e.
if for every $x\in M$, there are $r_1, \dots, r_n\in R$ such that
$$x=\sum_{i=1}^n r_ig_i$$

$G$ is a basis if $G$ is a generating set for $M$ and $G$ is linearly independent, i.e.
$$\sum_{i=1}^n r_ig_i = 0\implies r_1, \dots, r_n = 0$$

(These definitions are easily extended to infinite $G$).
Not every module has a basis (if it has one, it is called a [free module](https://en.wikipedia.org/wiki/Free_module)) and [not all bases have to have the same cardinality](https://en.wikipedia.org/wiki/Invariant_basis_number),
which might give you an idea of how much stranger (and more interesting?) modules are.
Both $\Z^m$ and $(\Z_n)^m$ have the obvious basis and all other bases have the same cardinality.

Let's look at the example from earlier over $\Z_6$

$$
\left[\begin{array}{rr}
    3 & 5\\
    4 & 2\\
\end{array}\right]
$$

Looking at the solution from earlier (or by computing the HNF), we find that the kernel is
$$
\left\{\left[\begin{array}{c}0\\0\end{array}\right],
\left[\begin{array}{c}3\\3\end{array}\right]\right\}
$$
which is generated by $g=\left[\begin{array}{c}3\\3\end{array}\right]$.

But $\{g\}$ is not a basis because it is linearly dependent:
$2g=0$, so we have a non-trivial linear combination of 0.
So while the kernel will always be a submodule, it need not have a basis.
Furthermore, linear dependence does not necessarily mean that a vector can be removed from the generating set, as seen in this example.
Instead, what we really want is a minimal generating set ([which does not always exist](https://mathoverflow.net/questions/33540/existence-of-a-minimal-generating-set-of-a-module),
though in our finite cases it of course does), but we would need a way to compute it.
I don't really need this for MBA so I don't bother,
but you can find a minimal generating set by computing the HNF (or our ill-defined "HNF" mod n)
of the matrix that contains the vectors of the generating set as columns.
All the non-zero columns of the result will generate the same submodule
with as few vectors as possible.

