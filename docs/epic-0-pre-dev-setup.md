# Epic 0: Pre-Development Setup

> **Owner**: User (Manual Setup)
> **Estimated Time**: 2-4 hours
> **Must Complete Before**: Epic 1 (Foundation)
> **Status**: Not Started

---

## Overview

This epic contains all manual setup tasks that must be completed by the user before development can begin. These are human-only tasks involving account creation, API key acquisition, and external service configuration.

**Why This Exists**: External API dependencies will block development if not set up proactively. Completing these steps ensures developers can work without interruptions.

---

## User Stories

### Story 0.1: Set Up OpenAI API Access

**As a** developer
**I want** OpenAI API credentials configured
**So that** I can implement AI-powered customization features

**Tasks**:
- [ ] Go to https://platform.openai.com/signup
- [ ] Create account (or sign in)
- [ ] Navigate to API keys section
- [ ] Click "Create new secret key"
- [ ] Name it: "Job Application System - Dev"
- [ ] Copy the key (starts with `sk-proj-...`)
- [ ] Save to password manager
- [ ] Add to `.env.local`: `OPENAI_API_KEY=sk-proj-...`
- [ ] Set up billing: https://platform.openai.com/account/billing
- [ ] Add payment method
- [ ] Set budget limit: $50/month recommended for development

**Acceptance Criteria**:
- ✅ API key obtained and stored securely
- ✅ Billing configured with budget alerts
- ✅ Key added to local environment variables

**Estimated Time**: 15 minutes

---

### Story 0.2: Create Telegram Bot

**As a** developer
**I want** a Telegram bot configured
**So that** I can test notification features

**Tasks**:
- [ ] Open Telegram app
- [ ] Search for `@BotFather`
- [ ] Send `/newbot` command
- [ ] Choose bot name: "Job Application Assistant"
- [ ] Choose username: `your_name_job_bot` (must end in 'bot')
- [ ] Copy the bot token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
- [ ] Save to password manager
- [ ] Add to `.env.local`: `TELEGRAM_BOT_TOKEN=...`
- [ ] Send a test message to your bot
- [ ] Get your Telegram user ID:
  - Send `/start` to `@userinfobot`
  - Copy your numeric ID
- [ ] Add to `.env.local`: `TELEGRAM_USER_ID=...`

**Acceptance Criteria**:
- ✅ Bot created and token obtained
- ✅ User ID obtained
- ✅ Both added to environment variables

**Estimated Time**: 10 minutes

---

### Story 0.3: Set Up Google Calendar API Access

**As a** developer
**I want** Google Calendar API configured
**So that** I can implement interview scheduling

**Note**: ✅ **Works with FREE personal Google account** - no Google Workspace needed!

**Tasks**:
- [ ] Go to https://console.cloud.google.com
- [ ] Sign in with your **personal Gmail account** (free)
- [ ] Create new project: "Job Application System"
- [ ] Enable Google Calendar API:
  - Navigate to "APIs & Services" → "Library"
  - Search "Google Calendar API"
  - Click "Enable"
- [ ] Configure OAuth consent screen (FIRST TIME ONLY):
  - Go to "APIs & Services" → "OAuth consent screen"
  - User Type: **"External"** (FREE - select this!)
  - App name: "Job Application System"
  - User support email: Your email
  - Developer contact: Your email
  - Click "Save and Continue"
  - Scopes: Click "Add or Remove Scopes"
    - Search: `calendar`
    - Check: `https://www.googleapis.com/auth/calendar.events`
    - Click "Update"
  - Test users: Click "Add Users" → Add your email
  - Click "Save and Continue"
  - Summary: Click "Back to Dashboard"
  - **Status will be "Testing"** - this is perfect for personal use!
- [ ] Create OAuth 2.0 credentials:
  - Go to "APIs & Services" → "Credentials"
  - Click "Create Credentials" → "OAuth client ID"
  - Application type: **"Web application"**
  - Name: "Job App - Local Dev"
  - Authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`
  - Click "Create"
- [ ] Copy Client ID and Client Secret
- [ ] Add to `.env.local`:
  ```
  GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx
  ```

**Acceptance Criteria**:
- ✅ Google Cloud project created (FREE)
- ✅ Calendar API enabled (FREE)
- ✅ OAuth consent screen configured in "Testing" mode (FREE)
- ✅ OAuth credentials created
- ✅ Credentials added to environment
- ✅ Test user (you) added to OAuth consent screen

**Estimated Time**: 20 minutes

**Important**: When you first connect your calendar in the app, you'll see:
- Warning: "This app isn't verified by Google"
- This is **normal** for personal apps in Testing mode
- Click "Advanced" → "Go to Job Application System (unsafe)" - this is safe because you're the developer!

---

### Story 0.4: Configure Gmail App Password

**As a** developer
**I want** Gmail IMAP/SMTP access configured
**So that** I can test email monitoring features

**Tasks**:
- [ ] Go to https://myaccount.google.com/security
- [ ] Enable 2-Step Verification (if not already enabled)
- [ ] Navigate to "App passwords" section
- [ ] Click "Generate new app password"
- [ ] Select app: "Mail"
- [ ] Select device: "Other (Custom name)"
- [ ] Name it: "Job Application System"
- [ ] Click "Generate"
- [ ] Copy the 16-character password
- [ ] Add to `.env.local`:
  ```
  EMAIL_ADDRESS=your.email@gmail.com
  EMAIL_PASSWORD=abcd efgh ijkl mnop
  EMAIL_PROVIDER=gmail
  IMAP_HOST=imap.gmail.com
  SMTP_HOST=smtp.gmail.com
  ```

**Acceptance Criteria**:
- ✅ App password generated
- ✅ Email credentials added to environment
- ✅ IMAP/SMTP hosts configured

**Estimated Time**: 10 minutes

---

### Story 0.5: Set Up Railway.app Account

**As a** developer
**I want** Railway.app hosting configured
**So that** I can deploy to production

**Tasks**:
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub account
- [ ] Verify email address
- [ ] Create new project: "Job Application System"
- [ ] Add PostgreSQL service:
  - Click "New" → "Database" → "PostgreSQL"
  - Version: 15
- [ ] Copy `DATABASE_URL` from PostgreSQL service
- [ ] Add payment method (for production use)
- [ ] Set budget alert: $20/month
- [ ] Install Railway CLI:
  ```bash
  npm install -g @railway/cli
  ```
- [ ] Authenticate CLI:
  ```bash
  railway login
  railway link
  ```

**Acceptance Criteria**:
- ✅ Railway account created
- ✅ PostgreSQL database provisioned
- ✅ Railway CLI installed and authenticated
- ✅ Billing configured

**Estimated Time**: 15 minutes

---

### Story 0.6: Create .env.local File

**As a** developer
**I want** all environment variables in one place
**So that** the application runs locally

**Tasks**:
- [ ] Copy `.env.example` to `.env.local`:
  ```bash
  cp .env.example .env.local
  ```
- [ ] Fill in all values from Stories 0.1-0.5
- [ ] Add development-specific values:
  ```
  # App
  NODE_ENV=development
  NEXT_PUBLIC_APP_URL=http://localhost:3001

  # Database (local)
  DATABASE_URL=postgresql://localhost:5432/jobapp_dev

  # Auth
  NEXTAUTH_URL=http://localhost:3001
  NEXTAUTH_SECRET=generate-random-32-char-string
  JWT_SECRET=generate-random-32-char-string

  # OpenAI (from Story 0.1)
  OPENAI_API_KEY=sk-proj-...

  # Telegram (from Story 0.2)
  TELEGRAM_BOT_TOKEN=...
  TELEGRAM_USER_ID=...

  # Google Calendar (from Story 0.3)
  GOOGLE_CLIENT_ID=...
  GOOGLE_CLIENT_SECRET=...

  # Email (from Story 0.4)
  EMAIL_ADDRESS=your.email@gmail.com
  EMAIL_PASSWORD=...
  EMAIL_PROVIDER=gmail
  IMAP_HOST=imap.gmail.com
  SMTP_HOST=smtp.gmail.com

  # n8n
  N8N_WEBHOOK_URL=http://localhost:5678/webhook
  ```
- [ ] Generate secrets:
  ```bash
  # Generate NEXTAUTH_SECRET
  openssl rand -base64 32

  # Generate JWT_SECRET
  openssl rand -base64 32
  ```
- [ ] Verify `.env.local` is in `.gitignore`

**Acceptance Criteria**:
- ✅ `.env.local` file created
- ✅ All required variables populated
- ✅ Secrets generated
- ✅ File excluded from version control

**Estimated Time**: 10 minutes

---

### Story 0.7: Verify External API Access

**As a** developer
**I want** to test all external API connections
**So that** I know setup is complete

**Tasks**:
- [ ] Test OpenAI API:
  ```bash
  curl https://api.openai.com/v1/models \
    -H "Authorization: Bearer $OPENAI_API_KEY"
  ```
  - Expected: JSON response with model list

- [ ] Test Telegram Bot:
  - Send message to your bot
  - Check you receive it

- [ ] Test Google Calendar API:
  - Will be tested in OAuth flow (Epic 4)

- [ ] Test Gmail IMAP:
  ```bash
  # Install testing tool
  npm install -g imap-simple

  # Test connection (create test script)
  node scripts/test-imap.js
  ```

- [ ] Test Railway.app connection:
  ```bash
  railway status
  ```

**Acceptance Criteria**:
- ✅ OpenAI API responds successfully
- ✅ Telegram bot receives messages
- ✅ Gmail IMAP connection successful
- ✅ Railway CLI connected to project

**Estimated Time**: 15 minutes

---

## Epic Summary

**Total Stories**: 7
**Total Estimated Time**: 2-4 hours (user time)
**Blocking**: Yes - Must complete before Epic 1

**Completion Checklist**:
- [ ] Story 0.1: OpenAI API access configured
- [ ] Story 0.2: Telegram bot created
- [ ] Story 0.3: Google Calendar API configured
- [ ] Story 0.4: Gmail app password created
- [ ] Story 0.5: Railway.app account set up
- [ ] Story 0.6: `.env.local` file created
- [ ] Story 0.7: All APIs verified working

**Ready to Proceed When**:
- All 7 stories completed
- All API credentials stored securely
- `.env.local` file populated and tested

---

## Troubleshooting

### OpenAI API Issues
- **Error: Incorrect API key**: Verify key starts with `sk-proj-` and is copied completely
- **Error: Insufficient quota**: Add payment method and credits

### Telegram Bot Issues
- **Bot doesn't respond**: Make sure you sent `/start` to your bot first
- **Can't find user ID**: Use `@userinfobot` in Telegram

### Google Calendar Issues
- **OAuth error**: Check redirect URI exactly matches `http://localhost:3001/api/auth/callback/google`
- **API not enabled**: Verify Calendar API is enabled in Google Cloud Console

### Gmail Issues
- **Authentication failed**: Must use App Password, not regular Gmail password
- **2-Step Verification required**: Enable in Google Account security settings

### Railway Issues
- **CLI not authenticated**: Run `railway login` and follow browser flow
- **Can't link project**: Run `railway link` in project directory

---

## Next Steps

After completing Epic 0, you're ready to begin **Epic 1: Foundation & Core Infrastructure** where developers will:
- Initialize the monorepo
- Set up PostgreSQL with pgvector
- Configure PostgREST
- Build the basic Next.js application structure
