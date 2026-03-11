# System Architecture
## AI CV Improver & Cover Letter Generator

**Version:** 1.0  
**Author:** Joshua Olaniyi  
**Platform:** Web Application  
**Architecture Style:** AI-enabled Web Application (Serverless-first)

---

# 1. Overview

The AI CV Improver & Cover Letter Generator is a web-based application that helps professionals:

- Improve CV bullet points using AI
- Tailor CVs to job descriptions
- Generate personalized cover letters

The system uses a **serverless architecture** built with **Next.js**, leveraging **LLM APIs** for AI processing.

The architecture prioritizes:

- Fast development
- Low infrastructure overhead
- Scalability
- Secure AI integrations

---

# 2. High-Level Architecture

```
User
↓
Frontend (Next.js)
↓
API Layer (Next.js API Routes)
↓
Service Layer
↓
AI Processing Layer
↓
LLM Provider (OpenAI / Claude)
```

Optional persistence layer (future):

```
┌─────────────┐
│  Supabase   │
│ Database    │
│ Storage     │
└─────────────┘
```

---

# 3. System Layers

## 3.1 Frontend Layer

The frontend is responsible for:

- User interaction
- File uploads
- Displaying AI improvements
- Editing generated content
- Exporting results

### Technologies

| Concern | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Component Library | shadcn/ui |
| Editor | Tiptap (for editable AI output) |

### Responsibilities

- CV upload interface
- Job description input
- AI results display
- Inline editing
- Export actions
- API communication

---

# 4. Frontend Architecture

## Folder Structure

```
/app
  /upload
  /improve
  /cover-letter
  /editor
  /export

/components
  CVUploader.tsx
  CVImprovementPanel.tsx
  JobDescriptionInput.tsx
  CoverLetterPanel.tsx
  Editor.tsx

/lib
  apiClient.ts
```

---

## Core Frontend Components

### CVUploader

Handles:

- Drag-and-drop upload
- File validation
- File submission to backend

Supported formats: `PDF` `DOCX` `TXT`  
Maximum file size: **5MB**

---

### CVImprovementPanel

Displays AI improvements in a side-by-side comparison.

```
Original Bullet
↓
Improved Bullet
```

**Example:**

> Responsible for managing social media accounts

↓

> Managed social media campaigns across 3 platforms, increasing engagement by 42%.

---

### JobDescriptionInput

Fields:
- Job Title
- Company Name
- Job Description

Used for:
- Job description analysis
- Cover letter generation
- CV tailoring

---

### CoverLetterPanel

Displays the generated cover letter.

Available actions: **Edit** · **Regenerate** · **Copy** · **Download**

---

### Editor

Rich text editor for editing improved CV bullets and generated cover letters.

Recommended library: `Tiptap`

---

# 5. API Layer

The API layer connects the frontend to backend services, implemented using **Next.js API Routes** running securely on the server.

## API Folder Structure

```
/app/api
  /upload-cv/route.ts
  /improve-cv/route.ts
  /analyze-job/route.ts
  /generate-cover-letter/route.ts
  /export/route.ts
```

---

# 6. Backend Service Layer

The service layer orchestrates core application logic.

Responsibilities:
- CV parsing
- AI prompt generation
- AI requests
- Result formatting
- Validation

## Service Layer Structure

```
/services
  aiService.ts
  cvParser.ts
  cvImprover.ts
  jobAnalyzer.ts
  coverLetterService.ts
  exportService.ts
```

---

# 7. AI Processing Layer

The AI layer handles natural language processing tasks including:

- CV bullet improvement
- Job description analysis
- Cover letter generation

## LLM Providers

| Role | Provider |
|---|---|
| Primary | OpenAI GPT-4.1 |
| Alternative | Claude 3.5 |
| Fallback | Gemini |

## AI Service Wrapper

File: `services/aiService.ts`

Functions:
- `generateCompletion()`
- `improveCV()`
- `analyzeJobDescription()`
- `generateCoverLetter()`

---

# 8. File Parsing System

The file parser extracts text from uploaded CV files.

## Supported File Types

`PDF` `DOCX` `TXT`

## Parsing Libraries

| File Type | Library |
|---|---|
| PDF | `pdf-parse` |
| DOCX | `mammoth` |

## Parser Service

File: `services/cvParser.ts`

Responsibilities:
- Detect file type
- Extract text
- Normalize formatting
- Identify CV sections

## Example Parser Output

```json
{
  "name": "John Doe",
  "experience": [
    {
      "role": "Product Manager",
      "company": "Company X",
      "duration": "2022-2024",
      "bullets": [
        "Managed product roadmap",
        "Collaborated with engineering teams"
      ]
    }
  ],
  "skills": ["SQL", "Python"]
}
```

---

# 9. Job Description Analysis System

Service file: `services/jobAnalyzer.ts`

Responsibilities:
- Identify required skills
- Extract keywords
- Detect responsibilities

## Example Output

```json
{
  "skills": ["product strategy", "data analysis"],
  "keywords": ["KPIs", "roadmap", "stakeholders"],
  "responsibilities": [...]
}
```

---

# 10. CV Improvement Engine

Service file: `services/cvImprover.ts`

## Processing Pipeline

```
Parsed CV
↓
Bullet segmentation
↓
AI rewriting
↓
Output formatting
```

## Example AI Prompt

```
Rewrite the following CV bullet point.

Rules:
- Use strong action verbs
- Highlight measurable impact
- Improve clarity
- Limit to 30 words

Bullet: {bullet}
```

## Example Output

```json
{
  "original": "Managed marketing campaigns",
  "improved": "Led marketing campaigns that increased qualified leads by 35% in 4 months",
  "reason": "Added measurable impact and stronger verb"
}
```

---

# 11. Cover Letter Generation System

Service file: `services/coverLetterService.ts`

Inputs: `cv_text` · `job_description` · `company_name` · `job_title`

## Generation Steps

1. Analyze job description
2. Extract relevant CV experience
3. Align experience with role
4. Generate structured cover letter

## Prompt Template

```
You are a professional career coach.

Generate a personalized cover letter using the candidate's CV and job description.

Requirements:
- Professional tone
- 200–350 words
- Highlight relevant achievements
- Reference the company name
```

---

# 12. Export System

Service file: `services/exportService.ts`

Supported formats: `PDF` `DOCX`

| Format | Library |
|---|---|
| PDF | `pdf-lib` |
| DOCX | `docx` |

---

# 13. Data Layer (Future Extension)

The MVP version does not require persistent storage. Future versions may integrate **Supabase**.

## Database

`PostgreSQL`

## Example Tables

### `users`
| Column | Type |
|---|---|
| id | uuid |
| email | text |
| created_at | timestamp |

### `cvs`
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| original_text | text |
| improved_text | text |
| created_at | timestamp |

### `cover_letters`
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| job_title | text |
| company_name | text |
| letter_text | text |
| created_at | timestamp |

---

# 14. Storage System (Future)

Uploaded CV files may be stored in **Supabase Storage**.

Bucket name: `user-cvs`

---

# 15. Security

Security measures include:

- File type validation
- File size limits
- API key protection
- Input sanitization

Allowed file types: `PDF` `DOCX` `TXT`  
Maximum file size: **5MB**

---

# 16. Rate Limiting

To prevent abuse of AI endpoints.

Recommended service: **Upstash Redis**  
Example limit: **5 AI requests per minute per user**

---

# 17. Observability

| Concern | Tool |
|---|---|
| Error logging | Sentry |
| Product analytics | PostHog |

Metrics tracked:
- CV uploads
- CV improvements generated
- Cover letters generated
- AI latency
- Error rates

---

# 18. Deployment Architecture

Hosting platform: **Vercel**

| Layer | Infrastructure |
|---|---|
| Frontend | Vercel |
| API Routes | Vercel Serverless Functions |
| AI Layer | OpenAI / Claude APIs |
| Database | Supabase (future) |
| Storage | Supabase Storage (future) |

---

# 19. Development Environment

Recommended tools: `Cursor` `Claude Code` `PNPM` `ESLint` `Prettier`

---

# 20. CI/CD

Continuous deployment using **GitHub + Vercel**.

```
Push to main branch
↓
Automatic build
↓
Deployment to Vercel
```

---

# 21. Scalability

Designed to support **10,000 – 100,000 users**.

Scalability strategy:
- Serverless API routes
- Stateless architecture
- External AI providers
- Managed database services

---

# 22. Future System Extensions

### Resume Scoring Engine

AI scoring based on:
- ATS compatibility
- Keyword coverage
- Clarity
- Measurable achievements

### Resume Tailoring Engine

Generate multiple CV versions optimized for different roles.

### Job Application Tracker

Track application statuses: `Applied` · `Interviewing` · `Offer` · `Rejected`

---

# 23. Summary

The system architecture is designed to ship quickly, minimize infrastructure complexity, and scale as the product grows.

| Layer | Technology |
|---|---|
| Frontend | Next.js + Tailwind |
| Backend | Next.js API Routes |
| AI | OpenAI / Claude |
| Database (future) | Supabase |
| Hosting | Vercel |
