# Backend Architecture

## Architecture Overview

The backend follows a **hybrid architecture**:
- **PostgREST**: Auto-generated REST API
- **Next.js API Routes**: Custom business logic
- **n8n Workflows**: Orchestration and automation

## PostgREST Layer

**Configuration** (`postgrest.conf`):
```conf
db-uri = "postgres://user:password@db.railway.internal:5432/jobapp"
db-schemas = "public"
db-anon-role = "web_anon"
jwt-secret = "${JWT_SECRET}"
server-port = 3000
```

**Database Roles**:
```sql
CREATE ROLE web_anon NOLOGIN;
GRANT USAGE ON SCHEMA public TO web_anon;
GRANT SELECT ON jobs, job_embeddings TO web_anon;

CREATE ROLE authenticated NOLOGIN;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
```

## Next.js API Routes

### Authentication

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sign } from 'jsonwebtoken';

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Verify credentials
        // Generate PostgREST JWT
        const postgrestToken = sign(
          { role: 'authenticated', user_id: user.id },
          process.env.JWT_SECRET!
        );
        return { ...user, postgrestToken };
      },
    }),
  ],
};
```

### OpenAI Embeddings Proxy

```typescript
// app/api/embeddings/route.ts
export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return NextResponse.json({ embedding: response.data[0].embedding });
}
```

## n8n Workflow Engine

**Key Workflows**:
1. Job Scraping (every 4 hours)
2. AI Customization (webhook trigger)
3. Email Monitoring (every 5 minutes)
4. Interview Prep (calendar webhook)
5. Error Handler (global)

---
