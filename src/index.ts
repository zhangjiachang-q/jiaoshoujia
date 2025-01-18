import { Command } from 'commander'
import { version } from '../package.json'
import { create } from './command/create';

// 这里我们用 zjc 当作我的指令名称
// 命令行中使用 zjc xxx 即可触发
const program = new Command('zjc');
program.version(version, '-v --version')
// 调用 version 的参数可以自定义

program.command('create')
    .description('创建一个新项目')
    .argument('[projectName]', '项目名称')
    .action(async (dirName) => {
        create(dirName);
    });
// parse 会解析 process.argv 中的内容
// 也就是我们输入的指令
program.parse();