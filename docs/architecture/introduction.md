# Introduction

This document outlines the complete fullstack architecture for the Automated Job Application System, a personal productivity tool designed to streamline the job search and application process through AI-powered automation.

## Project Overview

**Purpose**: Automate job discovery, application customization, and interview management to increase application volume (20-50 applications/week) while maintaining quality and personalization.

**Key Features**:
- Automated job scraping from multiple sources
- AI-powered resume and cover letter customization
- Email monitoring and interview extraction
- Telegram notifications for mobile-first workflow
- Semantic job search with vector embeddings
- Application tracking and analytics

**Target Users**: Individual job seekers (personal use, single-user system)

**Starter Template**: N/A - Greenfield Project

## Architecture Philosophy

**Schema-Driven Development**: The PostgreSQL database schema serves as the single source of truth. PostgREST auto-generates REST APIs directly from the schema, eliminating the need for hand-written API endpoints.

**Workflow Orchestration**: Complex business logic and integrations are managed through n8n visual workflows, keeping the application layer thin and focused on UI/UX.

**AI-First**: OpenAI GPT-4o powers content customization, making each application feel personal despite high volume.

**Mobile-First**: Telegram bot integration enables rapid review and action from anywhere.

---
