# Vercel Deployment & Live MCP Guide for Navya Computech

This guide covers deploying the **Navya Computech** website to Vercel and connecting its live MCP server and OpenAPI connectors to Gemini.

---

## 1. Environment Variables for Vercel

When importing your project into [Vercel](https://vercel.com/new), go to **Settings > Environment Variables** and add the following keys:

| Key | Value / Source | Required? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | *(Copy from your local `.env`)* | **Yes** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Copy from your local `.env`)* | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Copy from your local `.env`)* | **Yes** |
| `ADMIN_EMAIL` | *(Copy from your local `.env`)* | **Yes** |
| `ADMIN_PASSWORD` | *(Copy from your local `.env`)* | **Yes** |
| `AUTH_SECRET` | *(Copy from your local `.env`)* | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` | Recommended |
| `GEMINI_API_KEY` | *(Optional - from https://aistudio.google.com/)* | Optional |

> **Security Note:** In `.gitignore`, `.env` is ignored to prevent committing secrets to public GitHub repositories. Only add secrets in your local `.env` and in the Vercel Dashboard.

---

## 2. Deploying to Vercel

### Option A: Using Vercel Git Integration (Recommended)
1. Push your repository to GitHub / GitLab:
   ```powershell
   git add .
   git commit -m "feat: complete mcp server and vercel preparation"
   git push origin main
   ```
2. In Vercel, click **Add New > Project**, select your repository.
3. Paste the Environment Variables from the table above.
4. Click **Deploy**.

### Option B: Deploying via Vercel CLI
```powershell
npx vercel
```
Follow the prompts to link your project and deploy.

---

## 3. Connecting to Gemini After Deployment

Once deployed, your live URL will be `https://<your-project>.vercel.app`.

### A. In Google AI Studio (Gemini Web)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Start a new chat or prompt with Gemini (e.g. Gemini 2.0 Flash or 1.5 Pro).
3. In the sidebar under **Tools / Function Calling**, click **Add Extension / OpenAPI**.
4. Provide the live OpenAPI URL:
   ```
   https://<your-project>.vercel.app/api/mcp/openapi
   ```
5. Google AI Studio imports all 22 tools automatically. You can now prompt Gemini to fetch courses, search FAQs, or register inquiries directly on your live website.

### B. In Antigravity / Gemini IDE (Live Remote MCP)
Update your local `C:\Users\BHAVYA\.gemini\config\mcp_config.json`:
```json
{
  "mcpServers": {
    "navya-computech": {
      "serverUrl": "https://<your-project>.vercel.app/api/mcp/sse"
    }
  }
}
```

### C. Live Endpoints Reference
- **OpenAPI 3.0 Spec**: `https://<your-project>.vercel.app/api/mcp/openapi`
- **MCP SSE Stream**: `https://<your-project>.vercel.app/api/mcp/sse`
- **MCP JSON-RPC**: `https://<your-project>.vercel.app/api/mcp`
- **Direct REST Tool Call**: `POST https://<your-project>.vercel.app/api/mcp/tools/:toolName`
