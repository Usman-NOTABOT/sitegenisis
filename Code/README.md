# How to Use
## Pre-requisites
- Nodejs 10x: https://nodejs.org/dist/latest-v10.x/
- Python 2.x: https://www.python.org/downloads/release/python-2717/
- Windows Build Tools, if you are on Windows: (https://www.npmjs.com/package/windows-build-tools)
## Cartridges

- **app_storefront_controllers**: As the name suggests it contains your controllers. Not only controllers but your models are also there, inside the scripts folder
- **app_storefront_core**: everything that is not a controller or a model goes in here. For example: 
    - templates
    - resource bundles
    - frontend JS scripts and DS scripts
    - SCSS
    - forms metadata
    - static

- **app_storefront_pipelines**: this cartridge contains the legacy backend files. Before SiteGenesis controllers you would have XML files called pipelines that would contain the backend logic. To work with them you must use eclipse along with a salesforce plugin.

- **app_storefront_training**: this is the custom cartridge that you will be using to add all your new files and any modifications to existing files. **Except for frontend js and scss, which should be done in the app_storefront_core cartridge itself**.

- **dw-api-types**: **This is not a cartridge folder**. It is a typescript extension that gives you some nice intellisense when using Visual Studio Code.

- **metadata**: This folder contains the **metadata that you always must update whenever you make changes to Business Manager** such ash:
    - jobs
    - site preferences
    - system/custom objects
    - service framework-
    - content assets and slots
    - ocapi setting

### Getting started
- `cd` into the folder that contains all cartridge folders directory.
- Install node modules:
```sh
npm install
```
This assumes that you already have `npm` installed on your command line. If not, please [install node](http://nodejs.org/download/) first.

**DO NOT USE NODEJS version above 10x. Otherwise Gulp will not work properly.**

To compile, bundle and upload your code we will be using gulp (https://gulpjs.com/)

- Install `gulp` (see below).

#### gulp
Install gulp globally
```sh
npm install -g gulp
```
### Watching
To make the development process easier, running `gulp` on the command line will run the default task and automatically watch any changes in both `scss` and `js` code to run the right compilers.

The `gulp watch` command will  watch all of your directories for changes and upload modified files
to your sandbox. You need to create `dw.json` file in the root directory of the repository to provide credentials
for upload. This file should be in JSON format and include the following:

```js
{
    "hostname": "", // address of your sandbox without protocol. For example: zzrb-107.sandbox.us01.dx.commercecloud.salesforce.com
    "username": "", // your username at Account Manage (https://account.demandware.com/)
    "password": "", // password for the user
    "version": "" // folder to upload to. Default is version1
}
```


Now that you have gulp and its dependencies installed, you can make it watch for changes in your frontend files.
```sh
gulp
```


### SCSS
Before authoring SCSS, make sure to check out the README in the `app_storefront_core/cartridge/scss` directory.

```sh
gulp css
```

This task does 2 things:
- Compile `.scss` code into `.css`
- [Auto-prefix](https://github.com/ai/autoprefixer) for vendor prefixes

This task is also run automatically on any `.scss` file change by using the `gulp watch` task.


### JS
Before authoring JS, make sure to checkout the README in `app_storefront_core/cartridge/js` directory.

The new modular JavaScript architecture relies on [browserify](https://github.com/substack/node-browserify) to compile JS code written in CommonJS standard.

```sh
gulp js
```

This task compiles JS modules in the `js` directory into `static/default/js` directory. The entry point for browserify is `app_storefront_core/cartridge/js/app.js`, and the bundled js is output to `app_storefront_core/cartridge/static/default/js/app.js`.

This task is also run automatically on any `.js` file change by using the `gulp watch` task.


### Build
Instead of running `gulp js` and `gulp css` separately, a convenient alias is provided to combine those tasks

```sh
gulp build
```

### Linting
Run code static analysis and style validator. New code (i.e. pull requests) must not have any errors reported before being accepted.

```sh
gulp lint
```

The equivalent task for grunt, `grunt lint`, is also available.



### Sourcemaps
For sourcemaps support, run `gulp` or `grunt` in development mode by specificying `type` flag, i.e. `gulp --sourcemaps`.

We only support external sourcemaps because Eclipse tend to crash with inline sourcemaps.
As a result, if you're using Grunt, sourcemaps is only available when the build steps are run explicitly, i.e. `grunt js --sourcemaps`. Sourcemaps is not enabled during `watch` mode.

### Doc and styleguide
SiteGenesis also comes with inline code documentation (JSDoc), tutorials and a living style guide. These can be accessed locally at `http://localhost:5000` after running the following command:

```sh
npm run doc
```

The equivalent task for grunt, `grunt doc`, is also available.

### SiteGenesis configuration requirements
Notes :
1. This tests assumes the Site Preferences->Enable Storefront URLs is enabled
2. For some promotion and coupon tests to work, remember to use the latest SG Demo data for your site(s).