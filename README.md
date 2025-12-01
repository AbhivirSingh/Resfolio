# Resfolio: AI-Powered Resume Portfolio Generator

**Resfolio** is a sophisticated, resume-driven portfolio generator that leverages Large Language Models (LLMs) to transform static PDF resumes into dynamic, multi-themed personal websites. Built with **Next.js 15**, it features a robust architecture designed for seamless data extraction, real-time preview, and persistent storage.

---

## 🏗️ Architecture

The system follows a modern **Serverless/Edge-ready** architecture using the Next.js App Router. It separates concerns between the interactive frontend, the API layer for processing, and the database for persistence.

```mermaid
graph TD
    subgraph "Client Layer"
        Browser[User Browser]
        AdminUI[Admin Dashboard]
        PublicUI[Public Portfolio]
    end

    subgraph "Application Layer (Next.js)"
        Router[App Router]
        API_Parse[API: /parse-resume]
        API_Update[API: /update-portfolio]
        Auth[Auth Middleware]
    end

    subgraph "Data & Processing"
        PDF_Engine[PDF.js Engine]
        DB[(MongoDB Atlas)]
    end

    subgraph "External Services"
        Perplexity["Perplexity AI (Sonar Pro)"]
    end

    Browser -->|Visits| PublicUI
    Browser -->|Uploads PDF| AdminUI
    
    PublicUI -->|Fetches Data| DB
    AdminUI -->|POST File| API_Parse
    AdminUI -->|POST JSON| API_Update
    
    API_Parse -->|Extract Text| PDF_Engine
    API_Parse -->|Analyze Text| Perplexity
    
    API_Update -->|Upsert Document| DB
```

### Core Modules

1.  **Frontend (Client-Side)**:
    -   **Dynamic Rendering**: The public portfolio (`src/app/page.tsx`) fetches data server-side for SEO optimization.
    -   **Theme Engine**: A context-based theme switcher (`src/context/ThemeContext`) dynamically loads component sets (Modern, Minimalist, etc.) without page reloads.
    -   **Admin Dashboard**: A protected route (`/admin`) handling file uploads, JSON review, and manual data overrides.

2.  **Backend (API Routes)**:
    -   **Resume Parsing Service** (`/api/parse-resume`):
        -   Receives `multipart/form-data`.
        -   Uses `pdfjs-dist` (Legacy Build) to extract raw text from PDFs.
        -   Constructs a prompt for **Perplexity's Sonar Pro** model to structure the text into a strict JSON schema.
    -   **Data Persistence** (`/api/update-portfolio`):
        -   Validates and sanitizes the reviewed JSON.
        -   Performs an *upsert* operation on the MongoDB `Portfolio` collection, ensuring a single source of truth for the user.

3.  **Database (MongoDB)**:
    -   Uses **Mongoose** for schema validation.
    -   Stores a monolithic `PortfolioData` object containing nested arrays for Experience, Education, Projects, etc.

---

## 🔄 Logic Flow: Resume Parsing & Update

The core value proposition of Resfolio is its "Upload-to-Publish" pipeline. The following sequence diagram details the lifecycle of a resume update.

```mermaid
sequenceDiagram
    actor User
    participant Client as Admin UI
    participant API as Next.js API
    participant PDF as PDF.js
    participant LLM as Perplexity AI
    participant DB as MongoDB

    User->>Client: Uploads Resume (PDF)
    Client->>API: POST /api/parse-resume (FormData)
    activate API
    
    API->>PDF: Extract Raw Text
    PDF-->>API: Return String
    
    API->>LLM: Send Text + JSON Schema Prompt
    activate LLM
    LLM-->>API: Return Structured JSON
    deactivate LLM
    
    API-->>Client: Return JSON for Review
    deactivate API
    
    User->>Client: Edits/Approves Data
    Client->>API: POST /api/update-portfolio (JSON)
    activate API
    
    API->>DB: findOneAndUpdate({upsert: true})
    DB-->>API: Success
    
    API-->>Client: 200 OK
    deactivate API
    
    Client->>User: Redirect to Live Portfolio
```

---

## 🛠️ Tech Stack

### Core Framework
-   **Next.js 15 (App Router)**: React framework for server-side rendering and API routes.
-   **TypeScript**: Strict type safety across the entire stack (Shared `PortfolioData` interfaces).
-   **React 19**: Component-based UI library.

### Styling & UI
-   **Tailwind CSS v4**: Utility-first styling.
-   **Framer Motion**: Complex animations (page transitions, scroll reveals).
-   **Lucide React**: Consistent icon set.

### Backend & Data
-   **MongoDB & Mongoose**: NoSQL database for flexible document storage.
-   **Perplexity API**: LLM provider for intelligent text parsing.
-   **PDF.js**: PDF parsing library.

---

## 🚀 Installation & Setup

### Prerequisites
-   **Node.js** v18+
-   **MongoDB** (Local or Atlas)
-   **Perplexity API Key** (for parsing features)

### 1. Clone & Install
```bash
git clone <repository-url>
cd Resfolio
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resfolio

# AI Service
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxxx

# Authentication (Optional/Future)
NEXTAUTH_SECRET=your-secret-key
```

### 3. Run Development Server
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

### 4. Deploy
The application is optimized for deployment on **Vercel**.
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # Backend API Routes
│   ├── admin/              # Admin Dashboard Page
│   └── page.tsx            # Main Portfolio Entry
├── features/               # Feature-based Architecture
│   ├── admin/              # Admin-specific components (Review Logic)
│   └── portfolio/          # Portfolio Themes & Components
│       ├── components/
│       │   └── themes/     # (Modern, Minimalist, Creative, Professional)
├── lib/                    # Core Utilities
│   ├── db.ts               # Database Connection
│   └── data.ts             # Data Fetching Logic
├── models/                 # Mongoose Models
└── types/                  # Shared TypeScript Interfaces
```