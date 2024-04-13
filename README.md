## Chapters

Ch-1: Getting Started
Ch-2: Creating Issues
Ch-3: Viewing Issues
Ch-4: Updating Issues
Ch-5: Deleting Issues
Ch-6: Authentication
Ch-7: Assigning Issues to Users
Ch-8: Filtering, Sorting, and Pagination
Ch-9: Dashboard
Ch-10: Going to Production

## Ch-1: Getting Started

### - How to start and finish a Project

Start from Core feature ahead to Advance feature

## Tables

| CORE (Must have)   | ADVANCED (Nice to have) |
| :----------------- | :---------------------- |
| Createing an issue | User authentication     |
| Viewing issues     | Assigning issues        |
| Updating an issues | Sorting issues          |
| Deleting an issues | Filtering issues        |
|                    | Pagination              |
|                    | Dashboard               |

**Key: Focus one feature at a time. Goal is not for "perfect" solution.**<br>
**Goal is not for "perfect" solution. Make it work first. Then Improve it step by step (Refactoring)**

### - Installation

```jsx
npx create-next-app@latest
```

Manual Installation

```jsx
npm install next@latest react@latest react-dom@latest
```

### - Build the navbar

Install [react icon](https://react-icons.github.io/react-icons)

```bash
npm i react-icons
```

```jsx
// layout.tsx (<main>{children}</main>)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}

// NavBar.tsx  (AiFillBug icon, Dynamic Menu from array of object)
import Link from "next/link";
import { AiFillBug } from "react-icons/ai";

const NavBar = () => {
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];
  return (
    <nav className="flex space-x-6 border-b px-5 mb-5 h-14 items-center">
      <Link href="/">
        <AiFillBug />
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            className="text-zinc-500 hover:text-zinc-800 transition-colors"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};
```

### - Styling the Active Link (Navbar.tsx)

Conditional CSS rendering & Classnames:
Code will be cleaner and what classes will render under what condition

```bash
npm i classnames@2.3.2
```

```jsx
// Conditional CSS rendering
<Link
  key={link.href}
  className={`${
    link.href === currentPath ? "text-zinc-900" : "text-zinc-500"
  } hover:text-zinc-800 transition-colors`}
  href={link.href}
>
  {link.label}
</Link>

// Using ClassName (Code is cleaner)
<Link
key={link.href}
className={classNames({
    "text-zinc-900": link.href === currentPath,
    "text-zinc-500": link.href !== currentPath,
    "hover:text-zinc-800 transition-colors": true,
})}
href={link.href}
>
```

## Ch-2: Creating Issues

### - Install mysql

Wamp for testing

### - Setting Up Prisma

```bash
npm i prisma
```

Initializing Prisma - npx create folder

```bash
npx prisma init
```

Now in prisma/schema.prisma (datasource>provider to mysql)

```jsx
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

.env file [Connection String Format](https://prnt.sc/Z1H-zDfYb5b1) For MySql Database

```jsx
DATABASE_URL = "mysql://root:@localhost:3306/issue-tracker"  ----Connection String no ";" @end----
```

### - Creating the issue model

- Just create simple model. Not assignin issue to user so no relationship

```jsx
// schema.prisma (Model: Pascale Case and singular name)
model Issue {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  description String   @db.Text
  status      Status   @default(OPEN)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  OPEN
  IN_PROGRESS
  CLOSED
}
```

```bash
npx prisma format
```

### - Building an API

```bash
npm i zod@3.22.2
```

Best Practice: Make sure create only one instance of [Prisma Client](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)<br>

```jsx
// prisma/client.ts (Only Once)
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

```

**Make sure async - await is properly placed when building API**

```jsx
// app/api/issues/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});
export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = createIssueSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
```

### - Setting up Radix UI

[radix-ui.com](https://www.radix-ui.com)

1. Install Radix Themes

```bash
npm install @radix-ui/themes
```

2. Import the CSS root app/layout.ts

```jsx
// app/layout.ts
import "@radix-ui/themes/styles.css";
```

3. Add the Theme component - root app/layout.ts

```jsx
// app/layout.ts
import { Theme } from "@radix-ui/themes";

export default function () {
  return (
    <html>
      <body>
        <Theme>
          <MyApp />
        </Theme>
      </body>
    </html>
  );
}

// issues/page.ts
import React from "react";
import { Button } from "@radix-ui/themes";

const IssuesPage = () => {
  return (
    <div>
      <Button>New Issue</Button>
    </div>
  );
};
```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```

### -

```jsx

```
