---
title: 'Why are polynomials so fundamental?'
date: '2024-02-05'
summary: >-
    A very non-technical, detailed answer to the question of
    why polynomials are so fundamental, that their are forcefully
    taught to high school students. Hopefully interested high school
    students could understand this post, but I think this might be
    something not everyone who has taken math on the university level
    has considered.
---

I was recently reminded of this question when I saw this tweet:

> Is there an intuitive rationale for the necessity of the complex numbers to exist?
> Saying "we needed to solve x^2=-1" is a bit short, why not "x+1=x"?
>
> — François Fleuret ([@francoisfleuret](https://twitter.com/francoisfleuret))
> [January 21, 2024](https://twitter.com/francoisfleuret/status/1749004095795458211)

I will explain at the end how "the necessity of the complex numbers" ultimately stems from
"the necessity of polynomials" but maybe you can already see how.

I think the property of polynomials that I will explain is so obvious in hindsight,
that people who have seen it, often don't even realize that others may not know.

I remember reading a reddit post about this topic years ago where the
top comment was about eigenvalues and the characteristic polynomial of a matrix,
and some other comments where about function approximation and other applications.
While I agree that polynomials would be interesting for those reasons alone,
I think the reason why we force everyone to study them in school is even more fundamental.
I could not find that post but when looking for the question I did find answers that
get to the bottom of what I want to discuss.
For example [this post](https://www.reddit.com/r/math/comments/9jkdy4/why_are_polynomials_an_important_class_of/)
from 5 years ago mentions [this](https://mathoverflow.net/questions/171724/why-are-polynomials-so-useful-in-mathematics)
math overflow question where the first sentence of the top answer is this:

> Polynomials are, essentially by definition,
> precisely the operations one can write down starting from addition and multiplication.

The rest of the answer are about commutative algebra and relate to category theory,
which are maybe in some sense even more fundamental,
but probably not what most people are looking for when asking this question.
(In fact, [the reply](https://www.reddit.com/r/math/comments/9jkdy4/comment/e6teun4/?utm_source=share&utm_medium=web2x&context=3) on reddit is exactly this).

There is also [this](https://www.reddit.com/r/math/comments/uszsfj/what_makes_the_presence_of_polynomials_ubiquitous/)
r/math post from 2 years ago where the top answer is:

> Polynomials are exactly what you can get by adding and multiplying known and unknown things,
> so they necessarily occur at everything that involves basic algebra.

So this post is of course not a new perspective,
but I will try to explain these answers in a bit more detail.
This post will be very non-technical so that (hopefully) someone learning
about polynomials in school for the first time could hopefully understand it.
At least up to the point where I start talking about complex numbers.

# A Tale of Addition, Subtraction, Multiplication, and Division
If you want to understand why polynomials are so important,
you will have to accept that addition, subtraction, and multiplication are important.
Given that they are taught very early on in elementary school and used by
almost everyone, I think this is a reasonable expectation.

The fact that polynomials are important is now almost an immediate consequence.
We will restrict ourselves to the case of a single variable $x$.
Everything remains true with multiple variables, but multiple variables
would make everything more complicated to write down and unnecessarily distract
from the ideas.

<div class="theorem">
<div>Theorem of the Polynomial Normal Form</div>
Any expression involving only

- addition ($+$)
- subtraction ($-$)
- multiplication ($\cdot$)
- numbers
- the variable $x$

can be written as a polynomial expression. That is an expression of the form
$$a_nx^n + a_{n-1}x^{n-1} + \ldots + a_2x^2 + a_1x + a_0$$
where the $a_n$ are numbers called coefficients.
</div>

I don't know if this theorem has an actual name, which is strange because I find it so fundamental.
I have called it "Theorem of the Polynomial Normal Form", because polynomials act as a normal form
for such expressions.
I think once you see this theorem, it is clear that it is true by using
associativity, commutativity and distributivity.
(This can be proven pretty easily by induction on the syntax tree of the expression).
Just in case there is actually someone in highschool who googled this question reading this,
let's just see an example.
Take the following expression:
$$(x - 3)\cdot (3 + x\cdot x\cdot (x - 4)) + x$$

By using associativity, commutativity, and distributivity we can transform this expression
into the usual polynomial form.
First, let's simplify the second bracket.

$$(x - 3)\cdot (3 + x\cdot x\cdot x - x\cdot x\cdot 4) + x$$

Now we can distribute with the first bracket.

$$x\cdot 3 + x\cdot x\cdot x\cdot x - x\cdot x\cdot x\cdot 4 - 3\cdot 3 - 3\cdot x\cdot x\cdot x + 3\cdot x\cdot x\cdot 4 + x$$

I am not yet done, but I think at this point it also clear that it
is very sensible to introduce the notation
$$x^n = \underbrace{x\cdot\ldots\cdot x}_{n\text{-times}}$$
where $n$ is an integer greater than or equal to 0.
Sometimes you see the question "Why don't we "allow" any
(i.e. negative, fractional, or even irrational) exponents in polynomials?".
I think the real reason is that we want "polynomial expressions" to act as a normal form
for expressions using only these three operations.
We just use the notation as a textual replacement to avoid having to write
long chains of multiplications by the same variable.
So a variable in the exponent is also not allowed, because there is no expression
using only addition, subtraction, and multiplication that is equivalent to e.g. $x^x$.

Having said all this, the expression can now be written as
$$3x+x^4-4x^3-9-3x^3+12x^2+x$$

Now we can combine the terms $-4x^3$ and $-3x^3$ as well as $3x$ and $x$,
and sort the terms by degree
$$x^4-7x^3+12x^2+4x-9$$
and we have the form of a polynomial you are used to.

# What about division?
One immediate question is why division is disallowed.
It is one of the four basic arithmetic operations after all.
There are many reasons you could give here, I think the most fundamental is that
division is not defined for all divisors, i.e. 0.
So when you write down such an expression, e.g. $5/(3+x)$,
you can't plug in -3 for x, i.e. the function is not defined everywhere.
Even $x^3/x$ is not really equivalent to $x^2$ because $x^2$ is defined everywhere
whereas $x^3/x$ is not defined for $x=0$.
So for our simplest class of functions (polynomials),
we just want to avoid all that trouble altogether, by only being able to even write
down expressions that can be evaluated everywhere.
But still, there actually is a similar theorem as in the case without division.

<div class="theorem">
<div>Theorem of the Rational "Normal" Form</div>
Any expression involving only

- addition ($+$)
- subtraction ($-$)
- multiplication ($\cdot$)
- **division** ($/$)
- numbers
- the variable $x$

can be written as a quotient of two polynomials, i.e. as $P/Q$
where $P$ and $Q$ are polynomials in the variable $x$.
</div>

Maybe you have had to deal with [rational functions](https://en.wikipedia.org/wiki/Rational_function)
in school and have wondered why anyone cares about those.
It is (in my opinion) because they are the normal form of expressions that allow
all four basic arithmetic operations.
Moreover, this actually gives us another answer to the original question of why
polynomials are so important:

If you want to know where the original expression is undefined,
you have to find the zeros of the denominator polynomial.
If you want to know where the original expression evaluates to zero,
you have to find the zeros of the numerator polynomial.
So even if you include division, the properties of the expressions without division (polynomials)
are still the basis of your understanding.

We have to be a bit careful here with the **normal form**.
The difficulty here is again that the function doesn't have to be defined everywhere
and to be truly equivalent we have to preserve the locations where the function
is undefined, so $x/x$ is not equivalent to $1/1$.
I don't really want to go into the details here or prove anything,
but basically you have to make sure that the final function is still undefined at the same
places as before, but to be a normal form it has to be reduced as much as possible
such that two expression that compute the same function and are undefined at the same places
have the same normal form.
E.g. the normal form of $x^4/x^3$ is $x^2/x$ and not $x/1$.
You can also just allow that your normal form is defined in more places than before
and equal on all previously defined inputs.

# Why not other operations?
Why don't we allow exponentiation, or logarithms, or sine and cosine?
I mean obviously people do consider more complicated expressions than just polynomials,
but I think there is some sense in which addition, multiplication, etc. really
are more fundamental than e.g. sine.

I have an exercise for you. (Don't actually do it).
On a piece of paper without a calculator/computer, compute (say) 5 digits of $\sin(1.1)$.
How do you even start?
How does a calculator do it?
On the other hand: Calculate the first 5 digits of $1.34\cdot 4.87$.
You can probably do this on a piece of paper.
So the basic arithmetic operations we can somehow do on a piece of paper but sine is not as easy.

One way to actually define sine is actually as an "infinite sum" (also called [series](https://en.wikipedia.org/wiki/Series_(mathematics))).
In this case it is actually a [power series](https://en.wikipedia.org/wiki/Power_series),
which is like an infinite polynomial.
Expressions have to have finite length so the complete infinite sum isn't actually an expression.
This is the beginning of that sum:

$$\sin(x) = x - \frac{x^3}{2\cdot 3} + \frac{x^5}{2\cdot 3\cdot 4\cdot 5}
- \frac{x^7}{2\cdot 3\cdot 4\cdot 5\cdot 6\cdot 7} + \ldots$$

This is called the [Taylor series](https://en.wikipedia.org/wiki/Taylor_series) of sine.
It only involves the basic arithmetic operations but an infinite amount of them!
But when you start evaluating it for any particular value of $x$, you will notice that
the terms of this sum start getting smaller and smaller at some point.
So when you want to know the result to any particular precision,
you can just stop when those digits don't change anymore.
This is a way to calculate the approximate value of sine for any number.
Your calculator would also do it in a similar way, potentially using more complicated
algorithms, but I think you would be hard pressed to find an algorithm that
doesn't use the basic arithmetic operations somewhere.
In fact, you'd have a hard time even defining sine formally without first defining basic arithmetic.

I don't wanna spend too much time on this, but basically when you actually formally define
most other functions you know, they are defined in terms of the basic arithmetic operations,
so in that sense they really are more fundamental.

# Wrapping up
I hope you can see how polynomials naturally arise from the four basic arithmetic operations.
Any such expression is equivalent to a quotient of two polynomials
and any such expression without division is equivalent to a polynomial.

For those who know what complex numbers are, we will now discuss how complex numbers
naturally arise from trying to solve polynomial equations.

# Complex Numbers
As the tweet at the beginning of the post suggests,
complex numbers arise when you try to find solutions to the equation $x^2=-1$,
which doesn't have any solutions in the real numbers.
But why $x^2=-1$ and not $x+1=x$, as the tweet suggests?

The first step to make things easier is to rephrase those equations as
root finding problems of polynomials, by just subtracting one side from both sides.
In our case that gives us $x^2+1=0$ and $1=0$.

First things first, if you have ever wondered why we care about the roots of polynomials
so much, it is just because of the simple observation that when trying to solve
$P=Q$, where $P$ and $Q$ are polynomials, we can instead solve $P-Q=0$,
i.e. find the roots of $P-Q$, where $P-Q$ is also still a polynomial.
Secondly, if we accept the second equation, i.e. $1=0$, then every number will
just be equal to zero, because we can multiply both sides by that number and get $c=0$.
One way of looking at this is to say that we get a very boring number system with only 0,
but you could also just say this is false, because we started with the real numbers
and it is false there.
If you define the polynomial $P(x) = 1$, then in any kind of sensible number system you define,
no matter what value you plug in for $x$, you will still get 1.
For example $P(i)$ is still 1 in the complex numbers.
So roots of non-zero constant polynomials still have no solutions, or in other words:
Equations where the left and right hand sides only differ by a non-zero constant,
still have no solution.

But okay, still, why $x^2+1$ and not, say, $10x^{10}+3x^2+5$,
which also doesn't have a solution in the real numbers?
It turns out that it doesn't matter!
Given any non-constant polynomial $P$ that doesn't have a solution in the real numbers,
if you adjoin a hypothetical solution, say, $\alpha$, i.e. such that $P(\alpha)=0$,
then your new number system will also contain a solution to $x^2+1$,
which we could call $i$, so essentially you will still get the complex numbers.
In fact, every non-constant polynomial has a root in the complex numbers,
which means that any equation, where the left and right hand sides are expressions
using only basic arithmetic (and don't differ by a non-zero constant), has a solution.
(In fact, it will have exactly as many solutions as the degree of the non-constant
polynomial when counting with multiplicity).
In fact, an even stronger claim is true:
The polynomial (or equations) can contain complex numbers, i.e. the polynomial
can have complex coefficients, e.g. $(3i+2)x^3+ix^2-3x+(4-i)$,
and it will still always have a root in the complex numbers.
This fact is known as the [fundamental theorem of algebra](https://en.wikipedia.org/wiki/Fundamental_theorem_of_algebra).

I hope this makes it clear that the complex numbers arise naturally
when you try to solve any equations where the left and right hand sides
are using only basic arithmetic, which is the same as finding the
roots of polynomials.