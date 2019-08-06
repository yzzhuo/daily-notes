---
title: dynamic require with require.context
date: 2019-08-06 18:42:57
tags: webpack
category: daily
---

There are some situations that we want to require multiple files and the files we required is changing most of the time.

Although using expressions like `require('./template/' + name + '.ejs')` is supported for dynamic requires, it lacks of flexibility I want.

Finally, I found `require.context` in [webpack document](https://webpack.js.org/guides/dependency-management/) which can meet my requirements.

its' usage is very simple:

```javascript
require.context(directory, useSubdirectories = false, regExp = /^\.\//);
```

So, to require all the target files in a directory or matching a pattern, you can require like the code below:

```javascript
var req = require.context('../components/', true, /\.js$/);
function importAll (r) {
  r.keys().forEach(r);
}
importAll(req);
```

The `req` has 3 properties, `resolve, keys, id`, `keys` is a function that returns an array of all possible requests that the context module can handle, and `req` here is an exported function to execute requiring this module we want.