---
title: Newton's Method for Permutation Polynomial Inversion
date: '2023-07-19'
macros:
    - Z: \mathbb{Z}
---

This is a proof of why Newton's method works for inverting permutation polynomials,
which in the [post](/posts/perm-poly) I said might require some p-adic analysis,
which is not too far off and I now figured it out.
The purpose of this post is just the proof, I won't be explaining the concepts here.
If you want to learn the math needed, I would suggest you check out
[Dexter Chua's Cambridge notes](https://dec41.user.srcf.net/notes/)
on [Local filds](https://dec41.user.srcf.net/notes/III_M/local_fields.pdf),
which is where I learned this from.

The idea is just that polynomials are power series and power series are a complete local ring,
which let's us use Hensel's Lemma, which (for this purpose) can be thought of as proving the
convergence of Newton's method.


The polynomial $p: R[[X]][Y] \mapsto R[[X]]$ is $F(Y) - Y$.
The derivative is $p' = F'(Y) - 1$.