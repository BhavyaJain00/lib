# Navya Computech — Model Context Protocol (MCP) Guide

The **Navya Computech** website functions directly as a **Native Model Context Protocol (MCP) Server and Remote Tool Connector**.

You can connect **Claude CLI**, **Gemini CLI**, **Claude Desktop**, and **Google AI Studio** directly to this website—both on **`localhost:3000`** and when **deployed to production** (e.g. Vercel, Railway, custom domain)—with **zero API keys required in `.env`**.

---

## 🔒 1. Why Zero API Keys in `.env`?

In standard MCP architecture:
- **The Website is the MCP Server (Tool Provider):** Exposes 22 tools (courses, leads, posters, analytics, contacts) and data from Supabase/database over standard endpoints.
- **Claude & Gemini are the MCP Clients (LLMs):** They connect to your website's MCP endpoints to read data and take actions.
- **Authentication is Client-Side:** When you run `claude` (Claude CLI) or `gemini` (Gemini CLI), they authenticate via your Anthropic or Google account (OAuth in your browser). **The website does not need any LLM API key in `.env`!**

---

## 🌐 2. Live Endpoints Built Into Your Website

| Endpoint | Protocol | Purpose | Compatible Clients |
| :--- | :--- | :--- | :--- |
| **`/api/mcp/sse`** | **SSE** (Server-Sent Events) | Streaming remote MCP connection | Claude Desktop, Claude Code CLI, Cursor, mcp-remote |
| **`/api/mcp`** | **Streamable HTTP / JSON-RPC** | Standard HTTP MCP protocol | Gemini CLI, Claude HTTP, Webhooks, Curl |
| **`/api/mcp/openapi`** | **OpenAPI 3.0** | REST Extension Specification | Google AI Studio Extensions, Vertex AI, Custom GPTs |
| **`/api/mcp/tools/:name`** | **REST POST** | Direct tool execution | Any curl/REST API call without JSON-RPC envelope |

---

## ♊ 3. Connecting with Gemini CLI

### Step 1: Install Gemini CLI
If you got `bash: gemini: command not found`, install the official Gemini CLI globally:

```bash
npm install -g @google/gemini-cli@latest
```

### Step 2: Login (Zero Key in Project)
Run:
```bash
gemini
```
Follow the interactive prompt to log in with your Google Account in the browser. It stores your authentication securely in your user profile, so **no key is ever added to `.env`**.

### Step 3: Add Navya Computech MCP Server

#### Option A: Connecting to Localhost (`http://localhost:3000`)
Make sure your site is running with `npm run dev`:
```bash
gemini mcp add --transport http navya-computech http://localhost:3000/api/mcp
```
*(Or use SSE transport: `gemini mcp add --transport sse navya-computech http://localhost:3000/api/mcp/sse`)*

#### Option B: Connecting to Deployed Production Website
Once deployed (e.g. `https://your-domain.vercel.app`):
```bash
gemini mcp add --transport http navya-computech https://your-domain.vercel.app/api/mcp
```

### Step 4: Verify Tools in Gemini CLI
```bash
gemini mcp list
```
You can now ask Gemini questions like:
- *"List all live courses from Navya Computech."*
- *"Show me recent student inquiries."*
- *"What are the institute's placement stats?"*

---

## 🤖 4. Connecting with Claude CLI (Claude Code)

### Step 1: Install Claude Code CLI
```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2: Login
Run:
```bash
claude
```
Authenticate via browser login with your Anthropic account.

### Step 3: Add Navya Computech MCP Server

#### For Localhost:
```bash
claude mcp add --transport sse navya-computech http://localhost:3000/api/mcp/sse
```
*(Or via bridge: `claude mcp add navya-computech -- npx -y mcp-remote http://localhost:3000/api/mcp/sse`)*

#### For Deployed Production Website:
```bash
claude mcp add --transport sse navya-computech https://your-domain.vercel.app/api/mcp/sse
```

### Step 4: Verify in Claude CLI
```bash
claude mcp list
```

---

## 💻 5. Connecting Claude Desktop

Open your Claude Desktop config file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

### For Localhost (`http://localhost:3000`):
```json
{
  "mcpServers": {
    "navya-computech": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp/sse"]
    }
  }
}
```

### For Deployed Production Website (`https://your-domain.vercel.app`):
```json
{
  "mcpServers": {
    "navya-computech": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-domain.vercel.app/api/mcp/sse"]
    }
  }
}
```

*Restart Claude Desktop. All 22 Navya Computech tools will appear under the 🔨 hammer icon.*

---

## 🌟 6. Connecting Google AI Studio / Gemini Web

Google AI Studio allows connecting models to live tools via OpenAPI 3.0:

1. Open **[Google AI Studio](https://aistudio.google.com/)**.
2. Under **Model Parameters / Tools**, select **Add Extension** (or **Add Custom Tool**).
3. Enter your website's OpenAPI specification URL:
   - **Localhost**: `http://localhost:3000/api/mcp/openapi`
   - **Deployed**: `https://your-domain.vercel.app/api/mcp/openapi`
4. Google AI Studio imports all 22 institute tools with full argument schemas!

---

## 🛠️ 7. Full List of 22 Built-in MCP Tools

### 🎓 Courses
1. **`list_courses`**: List all courses (supports `activeOnly: true`).
2. **`get_course`**: Get full course details by slug or ID.
3. **`create_course`**: Add a new course to the database.
4. **`update_course`**: Update syllabus, title, duration, etc.
5. **`delete_course`**: Remove a course.
6. **`toggle_course_status`**: Toggle `isActive` or `featured`.

### 📋 Student Leads & Inquiries
7. **`list_inquiries`**: View inquiries (filterable by `new`, `contacted`, `enrolled`, `closed`).
8. **`get_inquiry`**: Details for an inquiry.
9. **`create_inquiry`**: Record a new student admission lead.
10. **`update_inquiry_status`**: Move lead through the pipeline.
11. **`delete_inquiry`**: Remove an inquiry.
12. **`get_inquiry_analytics`**: Funnel metrics & conversion rate.

### 🖼️ Posters & Banners
13. **`list_posters`**: List homepage promotional slider banners.
14. **`create_poster`**: Create a new slider announcement banner.
15. **`update_poster`**: Edit an existing banner.
16. **`delete_poster`**: Remove a banner.

### 📊 Analytics & Logs
17. **`get_dashboard_analytics`**: Summary counts of courses, queries, banners.
18. **`get_activity_log`**: Chronological audit trail.
19. **`log_site_activity`**: Log custom agent actions.

### ℹ️ Institute Knowledge Base
20. **`get_institute_contact`**: Phone, WhatsApp, email, campus address.
21. **`search_faqs`**: Search admission and course FAQs.
22. **`get_institute_highlights`**: Value propositions, benefits, and stats.

---

## 🧪 8. Quick Verification via Terminal

Start your dev server:
```bash
npm run dev
```

Test endpoints in another terminal tab:
```bash
# 1. Test metadata and health
curl http://localhost:3000/api/mcp

# 2. Test OpenAPI spec
curl http://localhost:3000/api/mcp/openapi

# 3. Test direct REST tool call
curl -X POST http://localhost:3000/api/mcp/tools/list_courses -H "Content-Type: application/json" -d "{\"activeOnly\": true}"

# 4. Test SSE stream
curl -N -s http://localhost:3000/api/mcp/sse
```
