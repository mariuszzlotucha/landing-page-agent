# landing-page-agent

A CLI chat agent that generates and iterates on a landing page, saving it as
`index.html` + `styles.css` in the project root.

## Setup

```
npm install
cp .env.example .env
```

Set `OPENROUTER_API_KEY` in `.env` (or export it in your shell instead —
a shell-exported value takes precedence over `.env`).

## Usage

```
npm run chat
```

Describe the page you want. The agent saves its work by calling two tools:

- `save_index_html` — writes `index.html` (links to `styles.css`, no inline
  styles or `<style>` blocks)
- `save_styles_css` — writes `styles.css`

On subsequent prompts (e.g. "change the accent color to purple"), the agent
edits the existing files rather than regenerating from scratch. Type `exit`,
`quit`, or `:q` to leave the chat.

If `index.html` and/or `styles.css` already exist when the app starts, their
contents are loaded as context so the agent can keep iterating on them across
restarts — the conversation history itself only lives for the current process.

## Configuration

Set in `.env` (see `.env.example`):

| Variable                 | Required | Default                          |
| ------------------------ | -------- | --------------------------------- |
| `OPENROUTER_API_KEY`     | yes      | —                                  |
| `OPENROUTER_MODEL`       | no       | `openai/gpt-5.6-luna`              |
| `OPENROUTER_TEMPERATURE` | no       | `0.7`                              |
| `OPENROUTER_BASE_URL`    | no       | `https://openrouter.ai/api/v1`     |

## Other scripts

- `npm run dev` — same as `chat`, but restarts on source changes
- `npm run build` — compile TypeScript to `dist/`
- `npm run start` — run the compiled output from `dist/`
- `npm run typecheck` — type-check without emitting

## Project layout

- `src/index.ts` — CLI loop: reads prompts, invokes the agent, prints replies
- `src/model.ts` — chat model configuration
- `src/tools.ts` — `save_index_html` / `save_styles_css` tools
- `src/systemPrompt.ts` — system prompt, including existing-file context
- `src/utils.ts` — small shared helpers (existing-file loading, quit detection)
