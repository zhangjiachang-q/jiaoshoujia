import simpleGit, { SimpleGitOptions } from 'simple-git';
import createLogger from "progress-estimator";
import chalk from "chalk";

// 初始化一个进度条
const logger = createLogger({ // 初始化进度条
    spinner: {
        interval: 100, // 变换时间 ms
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map((item) => {
            return chalk.green(item)
        }) // 设置加载动画
    }
})

const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(), // 当前工作目录
    binary: 'git',  // 指定git 二进制文件路径
    maxConcurrentProcesses: 6, // 最大并发进程数
    trimmed: false, // 自动去除多余空格
};

export const clone = async (url: string, prjName: string, options: string[]) => {
    const git = simpleGit(gitOptions);
    try {
        // 开始下载代码并展示预估时间进度条
        await logger(git.clone(url, prjName, options), '代码下载中: ', {
            estimate: 9000 // 展示预估时间
        })

        // 下面就是一些相关的提示
        console.log()
        console.log('代码下载成功')
        console.log(chalk.blueBright(`==================================`))
        console.log(chalk.blueBright(`=== 欢迎使用 zjc-cli 脚手架 ===`))
        console.log(chalk.blueBright(`=== 请使用 pnpm i 安装依赖 ===`))
        console.log(chalk.blueBright(`=== 请使用 pnpm run dev 启动项目 ===`))
        console.log(chalk.blueBright(`==================================`))
        console.log()
    } catch (error) {
        console.log(chalk.red('下载失败，具体错误：'));
        console.error(error);
        console.log(chalk.yellow('\n可能的解决方案：'));
        console.log('1. 检查网络连接是否正常');
        console.log('2. 检查是否已配置 SSH key（如果使用 SSH 链接）');
        console.log('3. 尝试使用 HTTPS 链接替代 SSH 链接');
    }
}