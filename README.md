# New Craft 3
Build out the skeleton for a Craft 3 website built with Gulp, Webpack, SCSS, Vue, and EJS.

This Node module will do the following:
- Create a project folder
- Download and set up [WB Starter](https://github.com/wbrowar/WB-Starter)
- Create a MySql (or MariaDB) database for your site
- Install [Craft CMS 3](https://github.com/craftcms/craft)
- Install [Craft Scripts](https://github.com/nystudio107/craft-scripts)
- Set up a `.env.php` file, as per [Craft3-Multi-Environment](https://github.com/nystudio107/craft3-multi-environment)
- Create a GitHub repo and perform an initial commit

This generator is my personal starter for Craft 3 projects. It's opinionated and based around my preferred tools and workflow, but it's open for use and for copying/forking. It's based heavily on @nystudio107's [Craft 3 scaffolding package](https://github.com/nystudio107/craft). If you'd like to have more options, I'd recommend using [nystudio107/craft](https://github.com/nystudio107/craft) or the default [Craft 3 installer](https://github.com/craftcms/craft).

## Requirements
**New Craft 3** is based on a local development workflow.

It's based around using [Laravel Valet](https://github.com/laravel/valet) for local development, so the app is set up to run a site on a Mac, at a `.test` tld, using a `mysql`-driven database at `127.0.0.1`, user is `root`, and password is not set (set to an empty string). Technically, another local server tool could be used if it follows along with these default settings.

Here's a list of required tools used to run **New Craft 3**. Each tool should be updated to it's most recent version, or a relatively new, stable version.

- [Composer](https://getcomposer.org)
- [Gulp CLI](https://github.com/gulpjs/gulp-cli): `npm install -g gulp-cli`
- [ImageMagick](https://www.imagemagick.org): `brew install imagemagick`
- [Node.js](https://nodejs.org/en/)
- [SASS](http://sass-lang.com/): `gem install sass`


## Installation
**New Craft 3** is a Node module that should be installed globally and it downloads the rest of its dependencies via `npm` and `composer`. This means that Craft 3, WB-Starter, Craft Scripts and other dependencies will be up to date every time **New Craft 3** is run.

To set up **New Craft 3**, run `npm install -g new-craft3`.

### Local Config
If you have some default values that you prefer to use for every website, you may create a local config file that will provide defaults to the questions asked in the beginning.

To create a local config file, copy `example.new-craft3.config.json` to your home folder and rename it `.new-craft3.config.json`.

In this file add or edit the following options:

| Option | Default | Description |
| --- | --- | --- |
| `cpTrigger` | "admin" | This replaces the path to Craft’s CP. |
| `dbPrefix` | "craft" | Set a database prefix for if a database will include tables outside of the Craft install. |
| `gitUser` | "" | Your GitHub username. |
| `gitOrg` | "" | A GitHub organization name, if you plan to create sites for an organization. |

Remove any options you don’t want to create a preset for. You will still be able to overwrite any of these presets when setting up a new project.

## Usage
Follow these steps to generate a new Craft 3 website:

1. `cd` into your parked Valet directory
2. Run `new-craft3`
3. Enter in the required information requested by various sets of prompts. Questions are asked by different installation tools—and may change over time, but here are the basics:
  - **New Craft 3**
    - Asks you to name the project by providing a client code (their initials) and a machine-readable name. This creates the project folder, names the database, and names the GitHub repo. For example, providing "wb" as the client and "test" as the project name, my project folder would be created as `wb-test`.
    - Allows you to change the CP Trigger in Craft CMS. For example, changing this to "administrator" would mean to get to Craft's Control Panel you would visit `http://wb-test.test/administrator`
  - **Craft 3**
    - Craft's command line installer will ask you to set up Craft's database and to run the default Craft 3 setup.
    - The database questions will have answers pulled from `.env.php`, so most answers can be bypassed by hitting `return` (the first question about database drivers should be answered with "mysql").
    - You can choose to skip creating a `.env` file since Craft will use the `.env.php` file instead. Read more about how to use this in [Craft3-Multi-Environment's documentation](https://github.com/nystudio107/craft3-multi-environment#using-craft-multi-environment).
    - Install Craft 3 via command line
    
By default and when possible, command line output is suppressed, however, you can see all command output and confirmation logs by adding the `--verbose` option. This could be useful for debugging.

## Options
Arguments that are available when running `new-craft3`:

| Argument | Default | Description |
| --- | --- | --- |
| `--template` | _craft3_1 | Select template to use in WB Starter setup. |
| `--verbose` | *false* | Displays command confirmations and extra command line output. |

## Contributing
To test locally, remove any existing versions of `new-craft3`, clone this repo, and run this command:

```
npm uninstall -g new-craft3 && npm install -g PATH_TO_LOCAL
```