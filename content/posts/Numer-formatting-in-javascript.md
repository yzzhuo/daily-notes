---
title: Numer formatting in javascript
date: 2019-07-25 15:45:17
tags: javascript
category: daily
---

In some countries like the U.K and U.S, they always like to use a comma to separete groups of thousands. And I encounter a requirement of feature is to format the number using the thousands separators. For example, 

```javascript
12345 => 12,345
```

At first, I come up with the solution of counting the length of number and insert the comma to the string. But then I saw a more quick and simple solution from another developer is to use `toLocaleString`

```javascript
var a = 100000000;
a.toLocaleString(); // => return "100,000,000"
```

Feeling curious about more about it, I look into a javascript's built-in object `Intl  `  which provides language sensitive string comparison, number formatting, and date and time formatting.

And `Intl.NumberFormat` object is a constructor for objects that enable language sensitive number formatting. 

```javascript
new Intl.NumberFormat().format(123213213) // return "123,213,213"
```

There are some options of `Intl.NumberFormat()`, one of them is `useGrouping`, and it's default value is true, which result our format number contains thousands separators.

In addtion, there are lots of useful effects of the  `Intl.NumberFormat()`,  we can use it to format a number as a currency , percent etc.