const chalk = require('chalk'),
      download = require('download'),
      exec = require('child_process'),
      fs = require('fs-extra'),
      inquirer = require('inquirer'),
      pleasant = require('pleasant-progress');

let projectDir;

// command arguments and options
let name, gitorg;

function run() {
    // get command line arguments and store them into a variable
    const argv = _parseArgv();

    const questions = [{
        type: 'input',
        name: 'clientCode',
        message: 'Client code',
        default: 'wb'
    },{
        type: 'input',
        name: 'projectName',
        message: 'Project name (machine readable)',
        default: 'test'
    },{
        type: 'input',
        name: 'template',
        message: 'WB Starter Template',
        default: '_craft3_1'
    },{
        type: 'input',
        name: 'gitorg',
        message: 'GitHub organization',
        validate: (answer) => {
            return answer !== '';
        }
    }];

    inquirer.prompt(questions).then(function (answers) {
        const name = answers['clientCode'] + '-' + answers['projectName'],
              gitorg = answers['gitorg'],
              template = answers['template'];

        // create project folder
        console.log(chalk.blue.bold('[ Initializing ]'));

        // set project to value of name
        projectDir = './' + name;

        if (!fs.existsSync(projectDir)){
            // create project folder
            fs.mkdirSync(projectDir);

            // change working directory to new project folder
            process.chdir(projectDir);

            // download WB Starter
            _download('https://github.com/wbrowar/WB-Starter/archive/master.zip', () => {
                console.log(chalk.blue.bold('[ Moving Files ]'));
                exec.execSync(`mv SETUP/WB-Starter-master/_source _source`);
                exec.execSync(`mv SETUP/WB-Starter-master/Gulpfile.js Gulpfile.js`);
                exec.execSync(`mv SETUP/WB-Starter-master/package.json package.json`);
                exec.execSync(`mv SETUP/WB-Starter-master/webpack.config.js webpack.config.js`);

                console.log(chalk.blue.bold('[ Create Database ]'));
                exec.execSync(`mysql -u root -e 'CREATE DATABASE IF NOT EXISTS ${name.replace('-', '_')} CHARACTER SET utf8 COLLATE utf8_general_ci'`);

                console.log(chalk.blue.bold('[ Installing Craft ]'));
                exec.spawnSync(`composer create-project -s RC craftcms/craft SETUP/CRAFT --ignore-platform-reqs`, [], { stdio: 'inherit', shell: true });
                exec.execSync(`mv SETUP/CRAFT/* ../${projectDir}`);

                console.log(chalk.blue.bold('[ Running Yarn ]'));
                exec.spawnSync(`yarn`, [], { stdio: 'inherit', shell: true });

                console.log(chalk.blue.bold('[ Running Setup ]'));
                exec.spawnSync(`gulp setup --name=${name} --gitorg=${gitorg} --template=${template}`, [], { stdio: 'inherit', shell: true });
                exec.execSync(`mv _env.php .env.php`);
                exec.execSync(`mv _gitignore .gitignore`);

                console.log(chalk.blue.bold('[ Reading Setup Config File ]'));
                const setupConfig = JSON.parse(fs.readFileSync('./SETUP/setup.config.json'));

                console.log(chalk.blue.bold('[ Running Composer Update ]'));
                exec.spawnSync(`composer update --ignore-platform-reqs`, [], { stdio: 'inherit', shell: true });

                console.log(chalk.blue.bold('[ Setting Up Craft Scripts ]'));
                exec.execSync(`cp scripts/craft3-example.env.sh scripts/.env.sh`);
                exec.execSync(`ln -s scripts/.env.sh vendor/nystudio107/craft-scripts/scripts/.env.sh`);

                console.log(chalk.blue.bold('[ Setting Up Craft ]'));
                exec.spawnSync(`./craft setup`, [], { stdio: 'inherit', shell: true });

                console.log(chalk.blue.bold('[ Installing Craft Plugins ]'));
                for (let i=0; i<setupConfig.installPlugins.length; i++) {
                    exec.execSync(`./craft install/plugin ${setupConfig.installPlugins[i]}`);
                }

                console.log(chalk.blue.bold('[ Running Initial Build Script ]'));
                exec.spawnSync(`npm run prod`, [], { stdio: 'inherit', shell: true });





                console.log(chalk.blue.bold('[ Clean Up Setup ]'));
                exec.execSync(`rm -rf SETUP`);

                // const spawnYarn = exec.spawn(`yarn`);
                // spawnYarn.stdout.on('data', function (data) {
                //     console.log(data.toString());
                // });
                // spawnYarn.stderr.on('data', function (data) {
                //     console.log(data.toString());
                // });

                //exec.exec(`npm run setup`);
                //fs.copySync('SETUP/craft3-defaults-master/composer.json', 'composer.json');
            });

            //exec.exec(`mkdir ${gitorg}`);
        } else {
            throw new Error("A directory of this name already exists. Please choose a different name.");
        }
    });
}

function _download(url, cb) {
    let progress = new pleasant();
    progress.start(chalk.blue.bold('[ Downloading ') + url + chalk.blue.bold(' ]'));
    new download({mode: '775', extract: true})
        .get(url)
        .dest('SETUP')
        .run(function(error) {
            if (error) {
                console.log(error);
                process.exit();
            } else {
                progress.stop();
                cb();
                //console.log(chalk.blue.bold('[ Downloaded ') + url + chalk.blue.bold(' ]'));
            }
        });
}

function _parseArgv() {

    let args = [];
    let options = {};

    process.argv.forEach(function(arg, i) {
        if(i > 1) {
            if (arg.substr(0, 2) === "--") {
                // remove leading dashes
                const str = arg.substr(2);

                // split out to key/value pairs
                if (str.indexOf("=") !== -1) {
                    const strSplit = str.split('=');
                    options[strSplit[0]] = strSplit[1];
                } else {
                    options[str] = true;
                }
            }
            else {
                args.push(arg);
            }
        }
    });

    return {
        args: args,
        options: options
    }
}

exports.run = run;