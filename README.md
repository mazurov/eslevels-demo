:link:  [**Demo page**](http://mazurov.github.io/eslevels-demo)

# EsLevels demo page

This is a simple web application created to show features of
[eslevels](https://github.com/mazurov/eslevels) javascript library &mdash;
am ECMAScript scope levels analyzer based on
[escope](https://github.com/Constellation/escope) library which original
purpose was to enable scope context coloring in javascript editors
([SublimeText](https://github.com/mazurov/sublime-levels) in first order).

## Install and Run

* First you need to install [node.js](http://nodejs.org/)
* Install grunt and bower packages:

```sh
$> npm install -g grunt-cli bower (with sudo rights)
```
* Clone repository: 

```sh
$> git clone https://github.com/mazurov/eslevels-demo.git
$> cd eslevels-demo
```

* Install required packages

```ssh
$> npm install
$> bower install
```


* Run the server

```ssh
$> grunt server
```

Finally you will see the following page:

<img src="https://raw.github.com/mazurov/eslevels-demo/master/screenshot.gif" height="337"/>
