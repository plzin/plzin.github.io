---
title: '$0.\overline{9} \stackrel?= 1$'
plain_title: '0.999... = 1'
date: '2022-04-05'
---

Do you think $0.999\ldots = 1$? How sure are you? Could you prove it? How would you explain it to someone just learning about real numbers?
Or maybe $0.999\ldots$ is just that infinitesimally small bit less than $1$?
I think answering these questions is more difficult than most people realize.

When I learned about this in (probably) 6th grade, I certainly wasn't convinced.
And – truth be told – you simply don't have the tools you need to answer these questions.

# What is this post about?
I will try to answer the question from the point of higher mathematics.
This would usually require some set theory and analysis but I want this post to be accessible to high schoolers with an interest in math.
(High schoolers without such an interest wouldn't be reading this post anyways).
In order to do that I will skip over many details, but I encourage you to look them up if you are interested!
My goal is not for you to understand every last detail of what I'm about to say, but rather to be able to formulate your questions more precisely, so you can look them up more easily, but I hope that if you are only interested in a high level answer to the question, then this post will suffice.

# A "bad" proof

A proof which is sometimes presented is the following:

We know that $\frac{1}{3} = 0.\overline{3}$ by long division, so multiplying both sides by $3$ we get $1=0.\overline{9}$.

I don't know how you feel about this.
For me the reason this is unconvincing (and was unconvincing back when I was in school) is that we say
$\frac{1}{3}$ is exactly equal to $0.\overline{3}$.
During the long division we always have a remainder, so should we also have an infinitesimally small remainder in the limit?
Is $\frac{1}{3}$ really $0.\overline{3}$ or is $\frac{1}{3}$ just this infinitesimally small amount bigger?
I would actually argue the other way around, since $0.\overline{9}$ is *obviously* (for the sake of this argument) less than $1$,
$0.\overline{3}$ has to be less than $\frac{1}{3}$.

We will actually find a way to make this rigorous using hyperreal numbers at the end of this article.

# Proof
Why does $0.999\ldots$ equal $1$?
Well, that's easy: It follows from the definition of real numbers and the way we use decimal numbers to represent real numbers.
Let me explain.

In school you are usually introduced to real numbers you just think of them as "decimal numbers".
For example $1.4$, $0.\overline{3}$ and so on.

Let us try to define the set of real numbers like this:
$$\mathbb{R} \coloneqq \{\ a_n\dots a_1.b_1b_2b_3\dots\ |\ a_i, b_i\in\{0,\dots,9\}\ \}$$

This is just the set of all decimal numbers and I think most high-schoolers would agree that this is the right definition.
But it is not.
If we defined it like this we would have defined $0.\overline{9}$ to be different from $1$.
They are different elements in our set.

Why don't mathematicians define the real numbers like this?
Because it isn't closed under subtraction $-$.
What should $1-0.\overline{9}$ be?
Zero point zero, zero, zero, and after infinitely many zeros a one?
That thing is simply not in our set. You can have infinitely many digits after the dot, sure,
but not something after those infinitely many digits, because we just didn't include that thing in our set.
We could have done that, but that would make things weird wouldn't it?
(We will get to a number system where something like this **is** possible).

But we can fix this.
We just define a new equality. Let us call it $\equiv$.
The correct mathematical jargon would be equivalence relation.
You can think of it as a function $\mathbb{R} \times \mathbb{R} \mapsto \{\text{equal}, \text{not equal}\}$
that tells us when two elements should be considered equal.
(You would then define $\mathbb{R}$ to be the set of equivalence classes, meaning two equal elements don't appear twice in the set).

This equivalence relation would then define that $0.\overline{9} \equiv 1$
and also for example $0.36\overline{9} \equiv 0.37$.

You would also have to find definitions of $+$, $\cdot$ and so on, but then you'd have the usual real numbers.

But this is not a very satisfying answer either, because we just defined $1$ to be equal to $0.\overline{9}$.
The answer to the "question" of a proof would be: By definition of equality on our set.

# How do mathematicians define the real numbers?
There are multiple provably equivalent ways to do this.
We will choose the one that is most practical for us: [Cauchy sequences of rational numbers](https://en.wikipedia.org/wiki/Construction_of_the_real_numbers#Construction_from_Cauchy_sequences).
Just to make sure: A rational number is something that can be expressed as a ratio of two whole numbers like $\frac{13}{37}$.

Basically we are building the real numbers from the rational numbers.
This might seem strange if you've never seen something like this before, we usually just think of the numbers as existing.
In formal mathematics you have to build new objects from objects you have already defined.
Maybe you've seen how to get the complex numbers $\mathbb{C}$ from the real numbers by adjoining $i$ the imaginary root.
You can think of each complex number as a pair of real numbers called the real and imaginary part.
The following construction is similar, although going from rational to real numbers is a bit more involved.

What is a [cauchy sequence](https://brilliant.org/wiki/cauchy-sequences/)?
It is just a sequence (i.e. an infinite list) of rational numbers, such that the elements of the sequence get arbitrarily close to each other (I won't make that more precise here).

This is a cauchy sequence that converges to 0:
$$(1, \tfrac{1}{2}, \tfrac{1}{4}, \tfrac{1}{8}, \dots )$$

This is not a cauchy sequence, because neighboring elements never get closer than 1:
$$(1, 0, 1, 0, 1, 0, \dots)$$

The idea is that the limit of a cauchy sequence is a real number and every real number is the limit of a cauchy sequence.
This will be the starting point for our definition of real number.

Of course there are multiple sequences that converge to the same number, for example:
$$(1, \tfrac{1}{2}, \tfrac{1}{4}, \tfrac{1}{8}, \dots )$$
and
$$(1, \tfrac{1}{10}, \tfrac{1}{100}, \tfrac{1}{1000}, \dots )$$
both converge to 0.

Again, we want to define an equivalence relation that treats them like the same object.
Two sequences are considered equal, if the (element-wise) difference of them converges to 0, i.e. the elements get arbitrarily close to 0.

The real numbers are then just defined as the cauchy sequences of rational numbers with the equality we just defined.
Just how complex numbers "are" pairs of real numbers, real numbers "are" cauchy sequences of rational numbers.
(Technically they are defined as equivalence classes of the equality).

Ok cool, we now have real numbers. Is $0.\overline{9}=1$.
Well, what do you mean by $0.\overline{9}$ and $1$, we only know sequences of rational numbers.
What you can do is define the decimal representation to mean a cauchy sequence
(basically create a function from decimal representation to cauchy sequences of rational numbers).

I will illustrate the natural way to do this using an example.

$$0.\overline{234} \coloneqq (\tfrac{2}{10}, \tfrac{23}{100}, \tfrac{234}{1000}, \tfrac{2342}{10000}, \dots)$$

Basically the n-th element in the sequence is the decimal number if you only keep the first n digits after the dot.
These elements are of course always rational.
This should also make clear why cauchy sequences of rationals correspond to the real numbers we intuitively know.

Let us answer $0.\overline{9}=1$.
We have
$$1 = (1, 1, 1, 1, \dots)$$
and
$$0.\overline{9} = (\tfrac{9}{10}, \tfrac{99}{100}, \tfrac{999}{1000}, \tfrac{9999}{10000}, \dots)$$

Two numbers are equal (by our definition of equality), if their difference converges to zero.
$$(1, 1, 1, 1, \dots) - (\tfrac{9}{10}, \tfrac{99}{100}, \tfrac{999}{1000}, \tfrac{9999}{10000}, \dots) = (\tfrac{1}{10}, \tfrac{1}{100}, \tfrac{1}{1000}, \tfrac{1}{10000}, \dots) $$
This *obviously* converges to 0. (Since I didn't tell you the formal definition of converge, you will have to trust me).

Indeed, $0.\overline{9}$ does equal $1$! By definition of the real numbers.

# Is the Definition of the Real Numbers "correct"?

As we have seen, $0.\overline{9}$ does equal $1$ simply because we defined the real numbers in that way.
In our definition of the real numbers there are no infinitesimally small numbers.
But most people don't think about real numbers as a set of cauchy sequences of rational numbers.
For most people there are no "real numbers", there are just numbers, and those numbers are used to describe our physical reality.
Physical reality is where our intuition comes from after all.
Are real numbers actually real? Is a line in physical space like the real number line? Or is there some indivisible length of space.
Physics certainly uses real numbers everywhere (Quantum Mechanics even uses complex numbers).
Personally, I don't think so. I think reality is much more limited, but that might be the topic of another blog post.

But I hope you understand that this is a different question.
You can ask $0.\overline{9} = 1$ in the mathematical definition of the real numbers where the answer is that they are equal.
And you can ask about the set of numbers that our physical reality is "built upon" and whether $0.\overline{9} = 1$ even makes
sense in that context or whether it is true.
We will probably never know the answer.

# The hyperreal numbers
Let us explore a set of numbers where you could reasonably say that $0.\overline{9} \neq 1$.
If you already know about hyperreal numbers and are ready to write me an e-mail about how that question has nothing to do with hyperreal numbers,
then please keep reading first. I've seen arguments about this online where this was argued and I think it misses the point.
But first, I will describe the hyperreal numbers informally and construct them from the real numbers.

The hyperreal numbers include the real numbers but also infinitesimally small and infinitely big numbers.
In particular a positive infinitesimal $\varepsilon$ is a number such that $0 < \varepsilon < r$ for all positive real numbers $r$.
And a positive infinite number $\omega$ is a number such that $r < \omega$ for all real numbers $r$.
Analogously there also exist negative infinitesimals and negative infinites.

Here is an illustration from [Wikipedia](https://en.wikipedia.org/wiki/Hyperreal_number):

![](https://upload.wikimedia.org/wikipedia/commons/5/53/N%C3%BAmeros_hiperreales.png)

When Leibnitz and Newton introduced calculus they used infinitesimals informally.
For example the derivative of a function $y$ with respect to $x$ is $\frac{\mathrm{d}y}{\mathrm{d}x}$,
where $\mathrm{d}x$ is an infinitesimal change in $x$ and $\mathrm{d}y$ is the resulting change in $y$.
However infinitesimals "were seen as suspect" as [Wikipedia](https://en.wikipedia.org/wiki/Hyperreal_number#From_Leibniz_to_Robinson) will tell you.
Instead calculus was formalized without infinitesimals using the ($\varepsilon$, $\delta$)-definition of the limit.
Only in the 1960s did Abraham Robinson prove that using infinitesimals, in the way he defined them, does not lead to a contradiction.
(Under plausible consistency assumptions & I'm ignoring a few important details here).
Thus we could use infinitesimals to prove things about the real numbers, e.g. calculate the derivative using infinitesimals.
There are now even calculus textbooks that use infinitesimals, most notably the free book [Elementary Calculus: An Infinitesimal Approach](https://people.math.wisc.edu/~keisler/calc.html) and the use of them can make definition such as continuity more intuitive.

To get back to our problem, let us construct the hyperreals from the reals.
The construction is similar to that from rationals to reals, but a lot more complicated if you do it [properly](https://en.wikipedia.org/wiki/Hyperreal_number#The_ultrapower_construction), which we will not do here.
(It did take until the 1960s after all!)

A hyperreal number is a sequence of real numbers.
Note that the sequence need not be cauchy.
Addition and multiplication are defined component wise.
I will use angle brackets to contrast the cauchy sequences of rational numbers in the construction of the reals.

As I said, the real numbers are a "subset" of the hyperreals, because each real $r$ can be viewed as the constant sequence:
$$\langle r, r, r, r, \dots \rangle$$

Let us look at a infinitesimal:
$$\langle \tfrac12, \tfrac14, \tfrac18, \tfrac1{16}, \dots \rangle$$

If this was a cauchy sequence of rational numbers, it would correspond to the real number 0, but in this case it does not.
It is a positive infinitesimal, so it is bigger than 0 but less than any positive real number.

An example of an infinite number would be the reciprocal of the above number:
$$\langle 2, 4, 8, 16, \dots \rangle$$

These were all relatively intuitive examples but in general its not clear what number a sequence corresponds to, e.g.
$$\langle 1, -1, 1, -1, \dots \rangle$$
can correspond to either 1 or -1 depending on the details of the construction.
This also makes comparing two hyperreals difficult, but we are going to ignore these details here and instead use intuitive examples.

Let us get to the nitty gritty, is $0.\overline{9} = 1$ in the hyperreals.
Usually the top comment when this question is asked is something like: "Yes, the question doesn't have anything to do with the hyperreals".
Why do people say that? We've seen that the reals are a supset of the hyperreals and $0.\overline{9}$ is real and equal to 1,
so it is also equal to 1 in the hyperreals.
This is true, we defined $0.\overline{9}$ to be a real number, but it is also missing the point.
If someone has the intuition that $0.\overline{9}$ is infinitesimally smaller than 1 and there exist infinitesimally small numbers in the hyperreals,
then we should be able to somehow formalize that intuition there.
And indeed we can, but we have to redefine what we mean by $0.\overline{9}$ or decimal notation in general.

Instead of defining
$$0.\overline{9} = \textcolor{green}{(} \tfrac{9}{10}, \tfrac{99}{100}, \tfrac{999}{1000}, \tfrac{9999}{10000}, \dots \textcolor{green}{)}$$
which is a real number equal to 1, we define it as
$$0.\overline{9}_H = \textcolor{red}{\langle} \tfrac{9}{10}, \tfrac{99}{100}, \tfrac{999}{1000}, \tfrac{9999}{10000}, \dots \textcolor{red}{\rangle}$$
which is a hyperreal number (notice the different brackets).
To emphasize, the first one is the standard definition which people will assume you use when you talk about $0.\overline{9}$,
the second one is our redefinition for this post, which I will mark with an $H$ to differentiate the two.

Is our newly defined $0.\overline{9}_H$ equal to $1$?
No, because
$$\varepsilon \coloneqq 1 - 0.\overline{9}_H = \langle 1, 1, 1, 1, \dots \rangle - \langle \tfrac{9}{10}, \tfrac{99}{100}, \tfrac{999}{1000}, \tfrac{9999}{10000}, \dots \rangle$$
$$= \langle \tfrac{1}{10}, \tfrac{1}{100}, \tfrac{1}{1000}, \tfrac{1}{10000}, \dots \rangle > 0$$

$\varepsilon$ is a positive infinitesimal!
(I will use the symbol $\varepsilon$ for this exact number throughout the rest of this post).
There is an infinitesimal difference between $0.\overline{9}_H$ and $1$ using this definition.
Instead of the $0.\overline{9}=1$ being a question which is true or false, it has become a question about what definition of $0.\overline{9}$ should be used.

With that knowledge and our new definition of $0.\overline{9}_H$ (or more generally decimal representation), we can revisit the proof from the beginning.
In that proof we said $\frac13 = 0.\overline{3}$ but this turns out to already be wrong with our new definition of decimal representation.
There now is no decimal representation of the (real) number $\frac13$. (You can already see the downside of this definition).
$0.\overline{3}_H$ represents a number which is infinitely close to $\frac13$ but not actually the same.
If you work it out (which will require some careful thinking about the different definitions we've seen), it turns out that
$$\frac13 = 0.\overline{3}_H + \frac{\varepsilon}{3}$$
The difference between $\frac13$ and $0.\overline{3}_H$ is $\frac{\varepsilon}{3}$, which means $0.\overline{3}_H$ is closer to $\frac13$ than $0.\overline{9}_H$ is to $1$, by a factor of 3.
If we multiply both sides by 3 as we did in the proof, then we get
$$1 = 0.\overline{9}_H + \varepsilon$$
which we know is true.

# Should we redefine decimal notation?
No. We've seen that some real numbers don't have a decimal notation then.
It would be a shame if we couldn't write $\frac13$ as a decimal number.

To illustrate another important point consider the following "proof":
Let $x = 0.\overline{9}$. Multiplying by 10 we get $10x = 9.\overline{9}$.
Subtracting $x = 0.\overline{9}$ we get $9x = 9$ and we have $x = 1$.
This is in my opinion one of the most convincing elementary proofs of $0.\overline{9}=1$.
But we know that using our new definition $0.\overline{9}_H$ this is wrong, so what step of the proof does not work in this case?
Think about it for a minute.

<details>
<summary>Answer</summary>
The problem turns out to be that using the new definition $0.\overline{9}_H \cdot 10 \neq 9.\overline{9}_H$, because
$$0.\overline{9}_H \cdot 10 = \langle \tfrac{90}{10}, \tfrac{990}{100}, \tfrac{9990}{1000}, \tfrac{99990}{10000}, \dots \rangle = 10 - 10\varepsilon$$
and
$$9.\overline{9}_H = \langle \tfrac{99}{10}, \tfrac{999}{100}, \tfrac{9999}{1000}, \tfrac{99999}{10000}, \dots \rangle = 10 - \varepsilon$$
The difference between them is infinitesimal ($9\varepsilon$).

If we want multiplication by 10 to correspond to a shift of the decimal point, then our new definition is bad.
In other words, if you believe that multiplying by 10 does correspond to a shift of the decimal point, then you have to believe that $0.\overline{9}=1$.
</details>

# Should we teach hyperreals instead of reals?
Redefining decimal notation *is* a bad idea, but the reason for the existence of hyperreal numbers wasn't to do that, but to reformulate calculus using them.
Should we teach hyperreal numbers?

On the one hand, I think it would be a good idea, because it gives students more ways to model things.
Suppose the situation that an airplane is hijacked by terrorists and headed towards a football stadium with tens of thousands of people.
Should you shoot down the airplane?
I've seen people argue the worth of a human life is infinite and that infinity plus infinity is infinity so because you should not kill people, you should not shoot.
While you can definitely argue that position, infinity plus infinity is not a valid argument. It is not a mathematical truth.
In the hyperreal numbers a positive infinite number $\omega$ is less than $2\omega$.
If you were to measure the worth of some thing with hyperreal numbers you would find that two humans are worth more than one.
But of course in another context this might not be true, e.g. in the [extended real numbers](https://en.wikipedia.org/wiki/Extended_real_number_line) $\infty + \infty = \infty$.

On the university level, there are also the reasons that definitions like continuity and proofs are simplified, which probably doesn't matter in school, because everything is very informal.
[Gödel said this](https://hsm.stackexchange.com/a/3724): "Rather there are good reasons to believe that non-standard analysis, in some version or other, will be the analysis of the future".

On the other hand, it does make some things more complicated.
There are multiple "kinds" of numbers (infinitesimals, infinites, reals).
These could be used in contexts where they are not appropriate, e.g. in physics (infinite force, etc.).
They would only be a tool for calculus, not an object of study itself.
In addition, there is also the conceptual difficulties of infinitely large and small numbers ($\omega - 1$, $\frac10$ is still undefined and not "infinity").

# TLDR
$0.\overline{9}=1$ is true as a question about real numbers.
Real numbers are defined in such a way that there are no infinitesimally small numbers.
You can however define a number system (set) where infinitesimally small numbers exist (such as the hyperreal numbers)
and you could redefine $0.\overline{9}$ to be infinitesimally smaller, but you have to give up some properties of our usual decimal representation.

# Further reading
If you are interested in an introduction to hyperreal numbers on a high school level I recommend the first chapter of the free book [Elementary Calculus: An Infinitesimal Approach](https://people.math.wisc.edu/~keisler/calc.html).
If you already know some higher algebra (rings, fields) you could read the companion to the book textbook [Foundations of Infinitesimal Calculus](https://people.math.wisc.edu/~keisler/foundations.html), which introduces hyperreal numbers to mathematicians.
Lastly, [here](https://web.archive.org/web/20121207075126/http://www.math.umt.edu/tmme/vol7no1/TMME_vol7no1_2010_article1_pp.3_30.pdf) is a paper that discusses the issue of $0.\overline{9}=1$ in more detail on a higher level.