# PolicyMind AI frontend

The React workspace for insurance operations. The dashboard, policies, claims, and customers screens read from the Express API. Assistant messages stay in the current chat session. Settings are saved in the current browser.

## Run locally

Start the sibling [backend](../PolicyMind_AI_Backend/README.md) on port 4000, then run the following from this repository in PowerShell.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Set `VITE_API_URL` to the backend's API base URL, including `/api`. If the frontend origin changes, set the backend's `CORS_ORIGIN` to match.

## Source layout

| Folder                      | What belongs here                                     |
| --------------------------- | ----------------------------------------------------- |
| `src/pages`                 | Route-level screens                                   |
| `src/layouts`               | Sidebar, top navigation, and page frame               |
| `src/components`            | Shared controls, dialogs, and loading or error states |
| `src/features`              | Feature-specific charts, forms, and profile settings  |
| `src/api`                   | Axios client and API methods                          |
| `src/hooks`                 | Shared data-loading logic                             |
| `src/types` and `src/utils` | API types and formatting helpers                      |

Run `npm run build` for type checking and a production bundle. Run `npm run lint` and `npm run format:check` to verify source quality.
