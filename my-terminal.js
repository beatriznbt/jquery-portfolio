// Configuração inicial do Figlet
const font = 'Slant'; // Escolha a fonte obtida no Figlet playground
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready); // Carrega a fonte e chama a função 'ready' quando pronto

const directories = {
    education: [
        '',
        '<white>education</white>',

        '* <a href="https://en.wikipedia.org/wiki/Kielce_University_of_Technology">Kielce University of Technology</a> <yellow>"Computer Science"</yellow> 2002-2007 / 2011-2014',
        '* <a href="https://pl.wikipedia.org/wiki/Szko%C5%82a_policealna">Post-secondary</a> Electronic School <yellow>"Computer Systems"</yellow> 2000-2002',
        '* Electronic <a href="https://en.wikipedia.org/wiki/Technikum_(Polish_education)">Technikum</a> with major <yellow>"RTV"</yellow> 1995-2000',
        ''
    ],
    projects: [
        '',
        '<white>Open Source projects</white>',
        [
            ['jQuery Terminal',
             'https://terminal.jcubic.pl',
             'library that adds terminal interface to websites'
            ],
            ['LIPS Scheme','https://lips.js.org', 'Scheme implementation in JavaScript'],
            ['Sysend.js','https://jcu.bi/sysend', 'Communication between open tabs'],
            ['Wayne','https://jcu.bi/wayne', 'Pure in browser HTTP requests'],
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        }),
        ''
    ].flat(),
    skills: [
        '',
        '<white>languages</white>',

        [
            'JavaScript',
            'TypeScript',
            'Python',
            'SQL',
            'PHP',
            'Bash'
        ].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>libraries</white>',
        [
            'React.js',
            'Redux',
            'Jest',
        ].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>tools</white>',
        [
            'Docker',
            'git',
            'GNU/Linux'
        ].map(lib => `* <blue>${lib}</blue>`),
        ''
    ].flat()
};

const dirs = Object.keys(directories);

const root = '~';
let cwd = root;

const user = 'beatriz';
const server = 'gmail.com';

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

function print_dirs() {
     term.echo(dirs.map(dir => {
         return `<blue class="directory">${dir}</blue>`;
     }).join('\n'));
}


function ready() {
    const formatter = new Intl.ListFormat('pt', {
        style: 'long',
        type: 'conjunction',
    });

    const commands = {
        help() {
            term.echo(`List of available commands: ${help}`);
        },
        ls(dir = null) {
            if (dir) {
                if (dir.startsWith('~/')) {
                    const path = dir.substring(2);
                    const dirs = path.split('/');
                    if (dirs.length > 1) {
                        this.error('Invalid directory');
                    } else {
                        const dir = dirs[0];
                        this.echo(directories[dir].join('\n'));
                    }
                } else if (cwd === root) {
                    if (dir in directories) {
                        this.echo(directories[dir].join('\n'));
                    } else {
                        this.error('Invalid directory');
                    }
                } else if (dir === '..') {
                    print_dirs();
                } else {
                    this.error('Invalid directory');
                }
            } else if (cwd === root) {
               print_dirs();
            } else {
                const dir = cwd.substring(2);
                this.echo(directories[dir].join('\n'));
            }
        },
        cd(dir = null) {
            if (dir === null || (dir === '..' && cwd !== root)) {
                cwd = root;
            } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
                cwd = dir;
            } else if (dirs.includes(dir)) {
                cwd = root + '/' + dir;
            } else {
                this.error('Wrong directory');
            }
        },
        credits() {
            // you can return string or a Promise from a command
            return [
                '',
                '<white>Used libraries:</white>',
                '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
                '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
                '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
                '* <a href="https://jokeapi.dev/">Joke API</a>',
                ''
            ].join('\n');
        },
        echo(...args) {
            if (args.length > 0) {
                term.echo(args.join(' '));
            }
        }
    };

    const command_list = Object.keys(commands);
    const formatted_list = command_list.map(cmd => {
        return `[[!;;;;https://example.com#${cmd}][[;white;]${cmd}]]`;
    });
    const help = formatter.format(formatted_list);
    const any_command_re = new RegExp(`^\\s*(${command_list.join('|')})\\b`, 'i');
    $.terminal.new_formatter(function(string) {
        return string.replace(any_command_re, function(match) {
            return `[[;white;]${match}]`;
        });
    });

        
    const term = $('body').terminal(commands, {
        greetings: false,
        checkArity: false,
        completion: true
    });

    term.on('click', 'a', function(e) {
        const href = $(this).attr('href');
        const command = href.slice(href.lastIndexOf('#') + 1);
        term.exec(command, true);
    });

    // Função para renderizar texto ASCII com Figlet
    function render(text) {
        const cols = term.cols();
        return figlet.textSync(text, {
            font: font,
            width: cols,
            whitespaceBreak: true
        });
    }

    // Função para remover espaços e novas linhas extras do fim do texto
    function trim(str) {
        return str.replace(/[\n\s]+$/, '');
    }

    // Função hex para converter cor RGB em hexadecimal
    function hex(color) {
        return '#' + [color.red, color.green, color.blue].map(n => {
            return n.toString(16).padStart(2, '0');
        }).join('');
    }

    // Função rainbow para aplicar efeito de cores do lolcat
    function rainbow(string, seed) {
        return lolcat.rainbow(function(char, color) {
            char = $.terminal.escape_brackets(char); // Escapa caracteres que podem interferir na formatação do terminal
            return `[[;${hex(color)};]${char}]`; // Formata cada caractere com a cor correspondente
        }, string, seed).join('\n');
    }

    const seed = Math.floor(Math.random() * 256); // Gera uma semente aleatória para o efeito de cor

    // Exibe a arte ASCII colorida e a mensagem de boas-vindas
    term.echo(() => {
        const ascii = trim(render('Beatriz Nunes'));
        return `${rainbow(ascii, seed)}\n[[;white;]Bem-vindo(a) ao meu portifólio!]\n`;
    });
}



