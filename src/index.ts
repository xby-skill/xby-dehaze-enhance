/**
 * xby-dehaze-enhance — DeepSeek Harness OCR 插件
 *
 * 去雾
 * 输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。
 *
 * # 使用方法
 *
 * 1. 安装插件：
 *    dsh plugin --profile web add xby-dehaze-enhance
 *
 * 2. 在聊天中告诉 agent 你的 API 密钥：
 *    "我的小笨羊APIKEY是 xxx"
 *    agent 会自动调用 set_xby_apikey 工具保存密钥
 *
 * 3. 注册的工具：
 *    - set_xby_apikey     — 在聊天中设置 API 密钥（自动持久化）
 *    - dehaze   — 输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件链接。
 *    - dehaze_for_data_base64   — 输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件的BASE64编码。
 *    - dehaze_for_data_file   — 输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件的文件路径。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { DEFAULT_CONFIG } from './config.js'
import { callApi } from './api.js'

export const name = 'xby-dehaze-enhance'

export const inject = ['tools']

/** 持久化文件路径 */
function apiKeyFilePath(): string {
  const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(dshHome, 'storages', 'xby-apikey.json')
}

/** 从持久化文件读取 API 密钥 */
function loadPersistedApiKey(): string {
  try {
    const file = apiKeyFilePath()
    if (existsSync(file)) {
      const data = JSON.parse(readFileSync(file, 'utf-8')) as { apiKey: string }
      return data.apiKey || ''
    }
  } catch { /* 忽略读取错误 */ }
  return ''
}

/** 持久化保存 API 密钥 */
function persistApiKey(apiKey: string): void {
  try {
    const file = apiKeyFilePath()
    const dir = file.substring(0, file.lastIndexOf('/'))
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(file, JSON.stringify({ apiKey }, null, 2), 'utf-8')
  } catch { /* 忽略写入错误 */ }
}

export function apply(ctx: Context, config?: Record<string, any>) {
  const cfg: Record<string, any> = { ...DEFAULT_CONFIG, ...config }

  // 优先级：插件配置 > 持久化文件 > 环境变量
  if (!cfg.apiKey) cfg.apiKey = loadPersistedApiKey()
  if (!cfg.apiKey && typeof process !== 'undefined' && process.env?.XBY_APIKEY) {
    cfg.apiKey = process.env.XBY_APIKEY
  }

  // ── 工具 0: set_xby_apikey — 在聊天中设置 API 密钥 ──
  ctx.tools.register(
    defineTool({
      name: 'set_xby_apikey',
      description: '设置插件的 APIKEY。用户提供密钥后立即调用此工具保存，之后工具即可正常工作。密钥会被持久化，重启后仍然有效。',
      parameters: {
        apiKey: {
          type: 'string',
          required: true,
          description: '小笨羊 APIKEY',
        },
      },
      output: {
        schema: { type: 'string' },
        render: (__args: Record<string, any>, value: string) => [{ type: 'text', text: value }],
      },
      async execute(args: Record<string, any>) {
        const apiKey = args.apiKey
        if (typeof apiKey !== 'string') {
              throw new Error('apiKey 必须是字符串')
        }
        cfg.apiKey = args.apiKey
        persistApiKey(apiKey)
        return 'APIKEY已设置并持久化保存，现在可以正常使用工具了。'
      },
    }),
  )

  // ── 工具 1: dehaze
  ctx.tools.register(
    defineTool({
      name: 'dehaze',
      description: '输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件链接。',
      parameters: {
      dataUrl: {
          type: 'string',
          required: true,
          description: '图片文件链接地址',
        },
      },
      output: {
        schema: { type: 'string' },
        render: (_args: Record<string, any>, value: string) => [{ type: 'text', text: value }],
      },
      async execute(args: Record<string, any>) {
        const result = await callApi(cfg, '1831157965548554', 'dehaze', args)
        if (!result.success) {
          throw new Error(result.message)
        }
        return result.text
      },
    }),
  )

  // ── 工具 2: dehaze_for_data_base64
  ctx.tools.register(
    defineTool({
      name: 'dehaze_for_data_base64',
      description: '输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件的BASE64编码。',
      parameters: {
      dataBase64: {
          type: 'string',
          required: true,
          description: 'base64 encoded data of image file',
        },
      },
      output: {
        schema: { type: 'string' },
        render: (_args: Record<string, any>, value: string) => [{ type: 'text', text: value }],
      },
      async execute(args: Record<string, any>) {
        const result = await callApi(cfg, '1831157965548554', 'dehaze_for_data_base64', args)
        if (!result.success) {
          throw new Error(result.message)
        }
        return result.text
      },
    }),
  )

  // ── 工具 3: dehaze_for_data_file
  ctx.tools.register(
    defineTool({
      name: 'dehaze_for_data_file',
      description: '输入有雾或低可见度模糊的图片，自动去除雾霾与干扰，还原场景清晰细节与真实色彩，适用于航拍图、监控、道路及风景摄影等场景。返回JSON格式数据，包含结果图片下载链接。 需要输入图片文件的文件路径。',
      parameters: {
        filePath: {
          type: 'string',
          required: true,
          description: '文件的本地完整路径',
        },
      },
      output: {
        schema: { type: 'string' },
        render: (_args: Record<string, any>, value: string) => [{ type: 'text', text: value }],
      },
      async execute(args: Record<string, any>) {
        const payload = { ...args }
        try {
           const buffer = readFileSync(payload.filePath)
           payload.dataBase64 = buffer.toString('base64')
           delete payload.filePath
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          throw new Error(`读取文件失败: ${msg}`)
        }

        const result = await callApi(cfg, '1831157965548554', 'dehaze_for_data_base64', payload)
        if (!result.success) {
          throw new Error(result.message)
        }
        return result.text
      },
    }),
  )

  console.log(`[${name}] 插件已加载，注册了 4 个工具`)
}

// 支持对象形式导出
export default { name, inject, apply }
