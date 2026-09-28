# Élaia Mediterranean Table — Production Deployment Guide

A guide for deploying the production-ready Élaia Mediterranean Table platform to **Vercel** with **Neon PostgreSQL**, **Resend**, and **Cloudinary**.

---

## 1. Prerequisites & Services

1. **Vercel Account**: Hosting and serverless Next.js edge deployment.
2. **Neon Serverless PostgreSQL**: High-performance PostgreSQL database branch.
3. **Resend Account**: Transactional email service for booking confirmations.
4. **Cloudinary Account (Optional)**: Media hosting for staff image uploads.

---

## 2. Environment Variables Configuration

Configure the following environment variables in your Vercel Project Settings under **Settings > Environment Variables**:

| Variable | Description | Required | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL pooled connection string | **Yes** | `postgresql://user:pass@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | 32+ character key for JWT cookie encryption | **Yes** | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical public URL of your website | **Yes** | `https://elaia-table.com` |
| `RESEND_API_KEY` | Resend API key for automated booking emails | Optional | `re_123456789...` |
| `RESEND_FROM_EMAIL` | Verified sender address for reservation emails | Optional | `reservations@elaia-table.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | Optional | `elaia-table` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Optional | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Optional | `abcde_secret...` |

---

## 3. Database Migration & Seeding on Neon

### Step 1: Push Schema to Neon
Run the Prisma schema synchronization against your remote database:
```bash
npx prisma db push
```

### Step 2: Seed Production Data
Execute the seed script to populate default categories, authentic dishes, chefs, testimonials, gallery assets, and default accounts:
```bash
npx prisma db seed
```

### Default Accounts Created:
- **Administrator**: `admin@elaia-table.com` / `ElaiaAdmin2024!`
- **Staff**: `staff@elaia-table.com` / `ElaiaStaff2024!`
*(Ensure you update these passwords upon initial production login).*

---

## 4. Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **Add New > Project**.
3. Import the `mediterranean_restaurant` repository.
4. Under **Build and Output Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build` (or `npm run build`)
   - **Output Directory**: `.next`
5. Under **Environment Variables**, add `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL`.
6. Click **Deploy**.

---

## 5. Verification & Health Checks

Once deployed, verify the following core flows:
1. **Public Site (`/`)**: Confirms hero image loads without layout shift, and menu preview carousel scrolls smoothly.
2. **Menu Page (`/menu`)**: Test category filter tabs, dietary preferences (Gluten-Free, Vegetarian), and dish detail modals.
3. **Table Reservations (`/reservation`)**: Book a table for tomorrow evening -> verify confirmation reference (e.g. `ELA-xxxxx`) and download `.ics` calendar invite.
4. **Staff Login (`/admin/login`)**: Log in with default staff or admin credentials.
5. **Operational Controls (`/admin/reservations`)**: Change a reservation status from `CONFIRMED` to `COMPLETED` or `CANCELLED`.
6. **Menu Controls (`/admin/menu`)**: Toggle a dish availability switch and verify the dish immediately reflects its status on the public menu.
