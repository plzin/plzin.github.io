---
title: 'Mixed Boolean-Arithmetic (Part 4): Deobfuscation'
date: '2023-04-24'
macros:
    - b: \mathbf{b}
    - v: \mathbf{v}
    - x: \mathbf{x}
    - Z: \mathbb{Z}
summary: 'How to deobfuscate (linear) MBA'
---

You should read [Part 1](/posts/mba), before coming here, but reading [Part 2](/posts/linear-systems-mod-n)
is not required.
If you encounter permutation polynomials then you should probably read [Part 3](/posts/perm-poly)
which should be enough to figure out how to deobfuscate them.
We will be focusing on linear MBA.
I will update this post to talk about non-linear MBA at some point,
but generally it is very difficult and I know of no better way
than trying to invert the techniques for generating non-linear MBA.

Deobfuscation is either easy or hard, depending on what your goal is.
As always, it is not easy to define what a "simplified" or simple expression even is.
In particular, simplifying MBA expressions includes simplifying boolean expressions.
It is known that the
[minimization of boolean expressions](https://en.wikipedia.org/wiki/Logic_optimization#Boolean_expression_minimization)
is $\Sigma_2^P$[-complete](https://en.wikipedia.org/wiki/Polynomial_hierarchy),
which is (probably, but not proven to be) "worse" than $\mathsf{NP}$-complete but (probably) "better" than $\mathsf{PSPACE}$-complete.
From that standpoint we are lost, but from a more practical standpoint it does not look so bad.

# What is the Problem?
The input to the algorithm is a program implementing an MBA expression.
The output will be a (hopefully simpler) program that computes the same function.
Obviously it will not always be possible to find a simpler expression.
If the input is `x + y`, the output will be the same.
Finding a minimal expression is not generally feasible for the complexity theoretic reasons outlined in the beginning.

# Approach
The approach is similar to a lot of deobfuscation.
- Identify part of the program that has a form you can work with.
- Try to simplify it.
- Start over, until nothing changes or there are no more parts you can simplify.

The obfuscation algorithm starts with a linear MBA expression
and transforms it into a more complicated but equivalent one.
If you knew, that some function/expression/circuit computed a linear MBA expression,
then you could deobfuscate it as a black box.
One difficulty is verifying that some circuit computes a linear MBA expression,
even if it contains (say) polynomials.
So the first step of the general approach is to find some subexpression that is a linear MBA expression.
We will now discuss simplifying these.

# Linear MBA
Let us consider the toy problem from Part 1 again and try to simplify `2 * (x & y) + (x ^ y)`.
As we've seen there, this is equivalent to `x + y`.
In Part 1 the problem was generating expressions like the former automatically,
while we now have to do the reverse.
The idea is very similar, so let's quickly discuss the former problem in more detail.
We are given an expression which is a linear combination of boolean expressions,
or in other words, a linear MBA expression,
and a list of rewrite operations, which can be linear MBA expressions as well.
The output will then be a random linear combination of the rewrite operations
that is equivalent to the input expression.
This time around, the input expression is the obfuscated one, and we don't have a list of rewrite operations,
and we don't want a random linear combination, but a particularly simple one.
If the obfuscated expression was generated using the same algorithm, we'd ideally want the input expression.
So we are now facing two problems:
- Find a list of rewrite operations
- Find the "smallest" solution

Let's think through the example.
The input expression is the obfuscated expression `2 * (x & y) + (x ^ y)`.
Because we know the solution, we know that the rewrite operations `x`, `y` (i.e. the identity on x and y) are sufficient.
We will use these for now.
As in Part 1, these expressions are specific to a certain integer width, although this one in specific works for any width.
We will just use 8-bit integers and the following notation from Part 1.
$$\langle f\rangle \coloneqq \left[\begin{array}{c}f(0, 0)\\f(0, 1)\\f(1, 0)\\f(1, 1)\end{array}\right]$$
The system then looks like this.
$$c_1\langle x\rangle + c_2\langle y\rangle=\langle 2\cdot(x\land y)+(x\oplus y)\rangle\pmod{2^8}$$
This expands to
$$
c_1\left[\begin{array}{cc}0\\0\\1\\1\\\end{array}\right]
+c_2\left[\begin{array}{cc}0\\1\\0\\1\\\end{array}\right]
=\left[\begin{array}{cc}0 & 0\\0 & 1\\1 & 0\\1 & 1\\\end{array}\right]
\left[\begin{array}{c}c_1\\c_2\\\end{array}\right]=
\left[\begin{array}{c}0\\1\\1\\2\\\end{array}\right]\pmod{2^8}$$
It is relatively easy to see that $c_1=c_2=1$ is the only solution (even mod 256),
meaning $x+y$ is the deobfuscated expression.

There are two problems:
- We had to look at the simplified expression to determine the rewrite operations.
- We were lucky that there was only one solution.

Before we discuss how to choose rewrite operations more generally,
we will consider the same example with the slightly bigger set of rewrite operations:
`x`, `y`, `~x`, `~y`, `1`.
The solutions to the resulting system have the following form
$$
\mathbf{c} = \left[\begin{array}{c}37\\-24\\36\\-25\\-11\\\end{array}\right]
+ a_1\left[\begin{array}{c}-97\\75\\-97\\75\\22\\\end{array}\right]
+ a_2\left[\begin{array}{c}101\\38\\101\\38\\117\\\end{array}\right]
$$
Now we have many solutions, e.g. `-93*x - 38*y - 94*~x - 39*~y - 133`.
Since we are concerned with deobfuscation, this is not good enough,
we want the "smallest" solution.
The following describes the same set of solutions, where the solution `x + y` can easily be read off.
$$\mathbf{c} = \left[\begin{array}{c}1\\1\\0\\0\\0\\\end{array}\right]
+ a_1\left[\begin{array}{c}-1\\1\\-1\\1\\0\\\end{array}\right]
+ a_2\left[\begin{array}{c}-1\\0\\-1\\0\\1\\\end{array}\right]$$

We will now consider these two problems in more detail.

### Rewrite operations
Suppose the MBA expression is just a boolean expression.
The best rewrite operation is the minimal boolean formula,
which is (as discussed in the introduction) very unlikely to have a polynomial time algorithm.
So theoretically there is no good solution here.
Practically things aren't looking so bad.
Usually the input expressions to obfuscate are either purely arithmetic
or purely boolean.

If it is purely boolean, that is easy to tell, by evaluating it at 0, -1 inputs.
If the outputs are also only 0 or -1, then the function is expressible by a boolean expression.
In that case, you can try to find a minimal boolean formula using the truth table we just computed.

Being purely arithmetic in this context means being a linear combination of the variables and a constant.
In that case the rewrite operations can just be the variables (the identity function on the variables)
and -1 (or also 1 as the rewrite operations can be linear combinations of bitwise operations).

The difficult (and probably less common) case is when the input function can only be represented
as a linear combination of (non-trivial) boolean functions.
To ensure the linear system has a solution, we can always use the boolean expressions
that are present in the input.
Thinking practically again, the boolean operations in the non-obfuscated expression
were probably simple as well, so it might be worth it to use $\lnot v_1$, $v_1\land v_2$, $v_1\lor v_2$
(etc.) for all variables $v_1, v_2$.
Note that the number of such rewrite operations will grow quickly with the number of variables,
so this might not always be feasible.

## Small solution
Now that we chose the rewrite operations, we can set up the system of linear equations and solve it.
This gives us a particular solution $\x$ and a basis for the kernel $\b_1,\dots,\b_n$.
All solutions are then of the form $\x + a_1\b_1 + \dots + a_n\b_n$.
I will call the set of solutions $S = \{\x + a_1\b_1 + \dots + a_n\b_n\ |\ a_1,\dots,a_n\in\Z_{2^w}\}$
an affine, modular [lattice](https://en.wikipedia.org/wiki/Lattice_(group)).
'Affine', since the origin is not necessarily in $S$, in reference to affine space.
(You could also call it a coset of a lattice).
'Modular', because everything is in the integers modulo $2^w$.

It might seem obvious what a small solution is,
but there are some subtleties to it.
We will work with 4-bit integers.
Which solution is better $(2, 0)$ or $(0, 15)$?
Since $15 = -1 \pmod{16}$, we probably want the latter.
But the coefficients correspond to different rewrite operations
which can have different complexity.
For example, we would prefer $x+y$ over $(x\land y)+(x\lor y)$.
To deal with both of these problems it is preferable to translate the modular
lattice into a regular integer lattice.

You might think that you can just take the basis vectors and and let them be the basis for the lattice,
but that doesn't work.
(It isn't even really well defined because you have to choose representatives.)
Consider the one dimensional lattice spanned by 3.
The lattice in $\Z$ with basis 3 is just all multiples of 3, but mod 16,
it contains all numbers (congruence classes) 0 to 15,
so the natural generalization to $\Z$ should also be the whole of $\Z$.
We need to be able to add multiples of 16.
So we can instead consider the lattice with the generating set $\{3, 16\}$ in the integers
and this is indeed all of $\Z$.
Of course, this is no longer a basis because they are linearly dependent.
In general we consider the lattice generated by $\b_1,\dots,\b_n,2^we_1,\dots,2^we_n$,
where the $e_i$ is the vector with a 1 in the i-th position and 0s everywhere else.
A priori, it is not even clear that this is a lattice and we still need a basis.
We can obtain a basis ($b_1',\dots,b_n'$) (and thus also a proof that this is in fact a lattice)
by computing the [HNF](https://en.wikipedia.org/wiki/Hermite_normal_form)
of the matrix with the columns/rows being the generators.
The non-zero columns/rows of the HNF will be the basis.
This basis now captures the modularity, i.e. the example lattice that contained
$(0, 15)$ would automatically also contain $(0, -1)$.

### Finding a short vector with CVP
One way of finding a small solution is to find a short vector in the affine lattice.
The idea is to reduce it to a well known algorithmic problem, the
[closest vector problem (CVP)](https://en.wikipedia.org/wiki/Lattice_problem#Closest_vector_problem_(CVP)),
i.e. given a basis for a lattice and a point,
find the/a lattice point that is closest to the point according to the some norm (typically $L^2$).
If we solve the closest vector problem for $\b_1',\dots,\b_n'$ and $\x$,
then we find a vector $\v=\sum a_i\b_i$, such that $\|\x-\v\|$ is minimal,
but $\x-\v$ is a point on the affine lattice,
so it is the smallest lattice point.

We haven't considered the complexity of the rewrite operations yet.
This corresponds to using a different norm where
each coordinate is weighted according to the complexity of the rewrite
operation it stands for.
Usually CVP algorithms assume the $L^2$ norm, but we can emulate this behavior
by just multiplying the entries in the basis $\b_i'$ and particular solution $\x$
and dividing the entries of the result.

The problem with this approach is that it prefers a solution with multiple short
entries to one with a single big entry, e.g. $\|(2, 0)\|_2 > \|(1, 1)\|_2$.
This corresponds to a linear combinations with lots of terms with small coefficients
which is not really what we want.
But this can work well when the optimal solution is a linear combination
with small coefficients, which is often the case.
Perhaps this could be fixed by finding all closest vectors according to the $L^1$
and then choosing the one with the least number of non-zero entries.

Another problem is that CVP algorithms are exponential in the rank of the lattice.
Lattices and problems similar to the CVP are the basis of proposed post-quantum
cryptography, so (hopefully) no polynomial time algorithm exists.
Nevertheless, the instances in practice are probably rather short and solvable
despite the asymptotic complexity.
For example, the lattice instances we generate are always full-rank
but a lot of the basis vectors will probably have a single non-zero entry that contains the modulus.
CVP algorithms will typically take advantage of this additional structure.

### Avoiding high complexity terms
The preferred solution, which doesn't require us to solve the CVP and usually leads to
simpler results, is the abuse the specific form of the basis that we got from the HNF:
The basis is triangular.
What you do when constructing the linear system, is to sort the rewrite operations
in order of decreasing complexity, so that the first coordinate of the solution
corresponds to the most complex operation.

Let's look at an example.
Note that this example doesn't make actual sense, it is just supposed to illustrate the idea.
If you want to see a what a real world example looks like, [click here](/misc/real_world_hnf.txt).

Suppose the first coordinate corresponds to rewrite operation $e_1$.
Think something like $\lnot a \lor (b \land c)$,
The second and third correspond to $e_2$ and $e_3$.
$e_3$ could be something like $a$.
So the first coordinate corresponds to the most complex operation
and the last coordinate to the least complex one.

Suppose the solution we got back from solving the linear system
(and computing the HNF) is this:

$$
x = \left[\begin{array}{c}14 \\ 34 \\ 23\end{array}\right]\hspace{1em}
b_1' = \left[\begin{array}{c}1 \\ 2 \\ 1\end{array}\right]\hspace{1em}
b_2' = \left[\begin{array}{c}0 \\ 3 \\ 1\end{array}\right]\hspace{1em}
b_3' = \left[\begin{array}{c}0 \\ 0 \\ 2\end{array}\right]
$$

Again, the basis doesn't make sense with these rewrite operations, but that doesn't matter for us here.
The particular solution from the solver corresponds to
$$14e_1 + 34e_2 + 23e_3$$

To simplify this further, we want to eliminate the most complex operation
from this solution.
So what we do is subtract $14b_1'$ from $x$ to get
$$x' = x - 14b_1' = \left[\begin{array}{c}0 \\ 6 \\ 9\end{array}\right]$$
Of course, in general it is not guaranteed that we can actually eliminate the entry.
This would happen if there is no solution without that operation.
We continue with the next rewrite operation in the second coordinate.
Because the basis is triangular, we won't destroy the 0 in the first coordinate.
$$x'' = x' - 2b_2' = \left[\begin{array}{c}0 \\ 0 \\ 7\end{array}\right]$$
And finally
$$x''' = x'' - 3b_3' = \left[\begin{array}{c}0 \\ 0 \\ 1\end{array}\right]$$
which means the original expression is equivalent to $e_3$.

This works pretty well, but also is not perfect.
For example, if the sum of some less complex operations corresponds
to a single more complex one, then the complex one will be
eliminated in favor of the sum.

# Conclusion
We have seen how to deobfuscate linear MBA expressions,
but the complexity of the algorithm is exponential in the number of variables
(and thus also in the length of the expression),
but then again, obfuscating is as well.
We are constructing the same truth table in both cases.

Once the truth table is constructed,
we can decide whether the expression is purely boolean,
in which case the problem reduces to finding the simplest
boolean formula for the given truth table.

Otherwise we have to choose some sensible set of
rewrite operations and solve the linear system.
If you just use the solution given by the solver,
this is all you have to do.
You can try this out [here](https://plzin.github.io/mba-wasm/linear_mba.html),
which is meant for obfuscation, but if you disable the "Random solution"
checkbox, you will get the particular solution found by the algorithm.
So input the obfuscated expression at the top and choose the rewrite operations
and generate the "obfuscated expression".
Otherwise you get a lattice of solutions on which you have to find the smallest one.
It is sensible to scale each axis according to the complexity of the rewrite operation in represents.
To find a small point on the lattice you can use a CVP algorithms (preferably for the L^1 norm).
Another way is just eliminating the most complex operations in the solution.
I think the optimal solution is probably some custom lattice algorithm
because neither of the previous methods is really perfect.