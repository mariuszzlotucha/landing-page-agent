import { tool } from '@langchain/core/tools'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { z } from 'zod'

const validateHtml = (html: string): string | null => {
    const errors: string[] = []
    if (/<style[\s>]/i.test(html)) {
        errors.push('The HTML contains a <style> block. Move all CSS to styles.css.')
    }
    if (!/<link\b[^>]*href=["']?(\.\/)?styles\.css["'\s>]/i.test(html)) {
        errors.push('The HTML does not link to styles.css. Add <link rel="stylesheet" href="styles.css"> to <head>.')
    }
    return errors.length > 0
        ? `Error: index.html was NOT changed. ${errors.join(' ')} Fix these and try again.`
        : null
}

export const saveIndexHtml = tool(
    async ({html}) => {
        const error = validateHtml(html)
        if (error) return error

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

export const editFile = tool(
    async ({file, find, replace, replaceAll}) => {
        const path = resolve(process.cwd(), file)
        let content: string
        try {
            content = await readFile(path, 'utf-8')
        } catch {
            return `Error: ${file} does not exist yet. Create it with the save tool first.`
        }

        const count = content.split(find).length - 1
        if (count === 0) {
            return `Error: the text to find was not found in ${file}. Nothing changed. Check it matches exactly, including whitespace.`
        }
        if (count > 1 && !replaceAll) {
            return `Error: the text to find occurs ${count} times in ${file}. Nothing changed. Include more surrounding context to make it unique, or set replaceAll to true.`
        }

        const updated = replaceAll ? content.split(find).join(replace) : content.replace(find, () => replace)
        if (file === 'index.html') {
            const error = validateHtml(updated)
            if (error) return error
        }

        await writeFile(path, updated, 'utf-8')
        return `replaced ${replaceAll ? count : 1} occurrence(s) in ${path}`
    }, {
        name: 'edit_file',
        description: 'Make a targeted find-and-replace edit in the existing index.html or styles.css without rewriting the whole file. Prefer this over the save tools for small changes such as changing a color, text or a single rule. The find text must match exactly and be unique unless replaceAll is true.',
        schema: z.object({
            file: z.enum(['index.html', 'styles.css']).describe('Which file to edit'),
            find: z.string().min(1).describe('The exact existing text to replace'),
            replace: z.string().describe('The new text'),
            replaceAll: z.boolean().optional().describe('Replace every occurrence instead of requiring a unique match')
        })
    }
)

export const tools = [saveIndexHtml, saveStylesCss, editFile]
