import { tool } from '@langchain/core/tools'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { z } from 'zod'

export const saveIndexHtml = tool(
    async ({html}) => {
        const outputPath = resolve(process.cwd(), 'index.html')
        await writeFile(outputPath, html, 'utf-8')
        return `saved to ${outputPath}`
    }, {
        name: 'save_index_html',
        description: 'Save a complete landing page as index.html in the current project. The HTML must not contain a <style> block or inline styles; it must link to styles.css instead.',
        schema: z.object({
            html: z.string().describe('The complete raw HTML document, including a <link> to styles.css and scripts, but no CSS')
        })
    }
)

export const saveStylesCss = tool(
    async ({css}) => {
        const outputPath = resolve(process.cwd(), 'styles.css')
        await writeFile(outputPath, css, 'utf-8')
        return `saved to ${outputPath}`
    }, {
        name: 'save_styles_css',
        description: 'Save the complete CSS for the landing page as styles.css in the current project',
        schema: z.object({
            css: z.string().describe('The complete raw CSS content for the landing page')
        })
    }
)

export const tools = [saveIndexHtml, saveStylesCss]
