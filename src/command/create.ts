import fs from 'fs-extra';
import path from 'path';
import { select, input } from '@inquirer/prompts';
import { clone } from "../utils/clone";

export interface TemplateInfo {
    name: string; // 项目名称
    downloadUrl: string; // 下载地址
    description: string; // 项目描述
    branch: string; // 项目分支
}

// 模板列表信息
export const templates: Map<string, TemplateInfo> = new Map(
    [
        ["Vite-Vue3-TypeScript-template", {
            name: "Vue-Vue3-TypeScript-template",
            downloadUrl: "https://gitee.com/qiguantou/highlights.git",
            description: "Vue3技术栈开发模版",
            branch: "dev1"
        }],
        ["Vite-Vue3", {
            name: "Vue-template",
            downloadUrl: "https://github.com/zhangjiachang-q/jiaoshoujia.git",
            description: "Vue3技术栈开发模版",
            branch: "dev1"
        }],
        ["Vite-template", {
            name: "Vue-template",
            downloadUrl: "git@gitee.com:sohucw/admin-pro.git",
            description: "Vue3技术栈开发模版",
            branch: "dev11"
        }]
    ]
)

export const isOverwrite = async (fileName: string) => {
    console.warn(`${fileName} 文件已存在 !`)
    return select({
        message: '是否覆盖原文件: ',
        choices: [
            { name: '覆盖', value: true },
            { name: '取消', value: false }
        ]
    });
}

// 创建项目命令
export async function create(prjName?: string) {
    // 我们需要将我们的 map 处理成 @inquirer/prompts select 需要的形式
    // 封装成一个方法去处理
    const templateList = Array.from(templates).map((item: [string, TemplateInfo]) => {
        const [name, info] = item;
        return {
            name,
            value: name,
            description: info.description
        }
    });
    // 文件名称未传入需要输入
    if (!prjName) {
        prjName = await input({ message: '请输入项目名称:' })
    }

    // 如果文件已存在需要让用户判断是否覆盖原文件
    const filePath = path.resolve(process.cwd(), prjName)
    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(prjName)
        if (run) {
            await fs.remove(filePath)
        } else {
            return // 不覆盖直接结束
        }
    }

    // 选择模板名称
    const templateName = await select({
        message: '请选择模板',
        choices: templateList
    });
    // 获取模板信息
    const info = templates.get(templateName);
    console.log('模板信息', info);
    // 下载模板代码
    if (info) {
        await clone(info.downloadUrl, prjName, ['-b', info.branch])
    } else {
        console.log('模板不存在');
    }
}