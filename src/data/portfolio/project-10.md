---
title: Gunna – AI Running Coach
image: "./10.png"
imageAlt: Screenshot of the Gunna AI running coach dashboard.
description: A personal training log that turns Apple Watch and Garmin exports into real coaching. Uploads are parsed into per-km splits, heart-rate zones and running-form metrics, then an AI coach that sees your goal and full history gives feedback after every run and plans your training to get to your goal.
github: https://github.com/Guchito/running-coach
link: https://running-coach-flame.vercel.app/
order: 0
---

### **Frontend**

- **Next.js**: App Router, server components and streaming responses.
- **React**: Interactive dashboard, run breakdowns and chat.
- **Tailwind CSS**: Styling and layout.
- **Recharts**: Pace, heart-rate and elevation charts.

### **Backend**

- **PostgreSQL**: Users, runs, goals and messages.
- **Garmin FIT SDK**: Parses `.fit` files from HealthFit, Garmin and Strava.
- **Google Drive API**: Automatic background import of new workouts.
- **Anthropic SDK**: Streaming coach with the full training history in context.

### **Features**

- Per-km splits, heart-rate zones, cadence, stride and ground-contact metrics.
- Goal tracking with a Riegel-projected finish time that moves with your fitness.
- Streaming AI chat that always sees your current goal and run history.
- Email and password auth with scrypt hashing, JWT sessions and per-user data scoping.
