# [client & project]

[overview of the project]

## Subversion Server

[insert SVN url]

## CodeKit

http://incident57.com/codekit/

These templates are configured to work with CodeKit. There is a config file in the root of the site: codekit-config.json. CodeKit is used to process JS (concatenation), SCSS (processing and concatenation), Jade (processing and concatenation), and compress images.

### SCSS

http://sass-lang.com/

### Jade

http://jade-lang.com/

## Grid

[describe the grid used on this site]

## Templates Folder Structure

    .
    ├── css
    │   └── [production ready merged/compressed CSS files]
    ├── documentation
    ├── html
    │   └── [processed Jade pages]
    ├── img
    │   └── [all images - production and FPO images]
    ├── js
    │   ├── [production ready merged/compressed JS files]
    │   ├── [sample JSON data]
    │   └── libs
    │       ├── [libraries and plugins to include on the site]
    │       └── [local fallback libraries and plugins - if external reference fails]
    ├── src
    │   ├── components
    │   │   └── [component folder]
    │   │       ├── [html file] (used by the documentation)
    │   │       ├── [jade file] (used by Jade pages)
    │   │       ├── config.json [component JSON object for the documentation]
    │   │       ├── readme.md [component notes]
    │   │       ├── script.js [optional, component specific interactions]
    │   │       └── style.scss [optional, component specific styles]
    │   ├── includes
    │   │   └── [reusable blocks of code that are not a page nor a component]
    │   ├── js
    │   │   ├── plugins.js [linked to all libraries and plugins]
    │   │   ├── script.js [sitewide scripts, also linked to all component JS files]
    │   │   └── libs
    │   │       └── [libraries and plugins to include in plugins.js]
    │   ├── pages
    │   │   └── [page folder]
    │   │       ├── [jade file]
    │   │       ├── config.json [page JSON object for the documentation]
    │   │       └── readme.md [page notes]
    │   └── scss
    │       ├── [global CSS styles logically divided by files]
    │       └── main.scss [sitewide styles, also linked to all SCSS files]
    ├── [codekit configuration file]
    └── [this file]

## PSDs

[talk about the PSDs built for this site, if any]

## ARTICLE vs DIV vs SECTION

To decide which of these three elements is appropriate, choose the first suitable option:

1. Would the enclosed content would make sense on it’s own in a feed reader? If so use ARTICLE
2. Is the enclosed content related? If so use SECTION
3. Finally if there’s no semantic relationship use DIV

from: http://oli.jp/2009/html5-structure1/

