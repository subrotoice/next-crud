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

### - Build the New Issue Page (Look and feel of the page not function)

```jsx
// issues/page.ts
<Button>
  <Link href="/issues/new">New Issue</Link>
</Button>
```

This page has form handling with client "use client"

```jsx
// issues/new/page.ts
"use client";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import React from "react";

const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root placeholder="Title" />
      <TextArea placeholder="Description" />
      <Button>Submit New Issue</Button>
    </div>
  );
};
```

### - Customizing Radix UI Theme

< ThemePanel: [See and customized](https://prnt.sc/p4TeRHtTCoU9)

```jsx
// app/layout.ts
return (
  <html lang="en">
    <body className={inter.className}>
      <Theme accentColor="violet">
        <NavBar />
        <main className="p-5">{children}</main>
        <ThemePanel />
      </Theme>
    </body>
  </html>
);
```

**Change font: Inter font is not applying here because of Radix [Typographoy](https://www.radix-ui.com/themes/docs/theme/typography)**
You can keep css in globals.css/theme-config.css, add this syntax !important;

```jsx
import "@radix-ui/themes/styles.css";
import "./theme-config.css";

import { Inter } from "next/font/google";
import { Theme, ThemePanel } from "@radix-ui/themes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Theme accentColor="violet">
          <NavBar />
          <main className="p-5 radix-themes">{children}</main>
        </Theme>
      </body>
    </html>
  );
}

// globals.css ( !important is urgent )
.radix-themes {
  --default-font-family: var(--font-inter) !important;
}
```

### - Adding a Markdown Editor

[React Simplemde Editor](https://www.npmjs.com/package/react-simplemde-editor)
Install

```bash
npm install --save react-simplemde-editor easymde
```

```jsx
// issues/new/page.tsx (Use SimpleMDE instade of Textarea)
"use client";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor"; // added 1
import "easymde/dist/easymde.min.css"; // added 2

const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root placeholder="Title" />
      <SimpleMDE />
      <Button>Submit New Issue</Button>
    </div>
  );
};
```

### - Handling Form Submission (issues/new/page.tsx)

Install:
"axios": "^1.6.8",
"react-hook-form": "^7.51.3", (Hook form can not work with < SimpleMDE so use controller )

```jsx
// issues/new/page.tsx  (import { useRouter } from "next/navigation"; not next/router)
"use client";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueForm>();

  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async (data) => {
        await axios.post("/api/issues", data);
        router.push("/issues");
      })}
    >
      <TextField.Root placeholder="Title" {...register("title")} />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
      />

      <Button type="submit">Submit New Issue</Button>
    </form>
  );
};
```

### - Handling Errors | Server side validaion (Server side - API)

- Server and Client both validation is must needed. First need to build Server side validation then Client side. Because If we build Client side validation then it will difficult to test server side validation.

```jsx
// issues/new/page.tsx
return (
  <div className="max-w-xl">
    {error && (
      <Callout.Root color="red" className="mb-3">
        <Callout.Text>{error}</Callout.Text>
      </Callout.Root>
    )}
    <form
      className="space-y-3"
      onSubmit={handleSubmit(async (data) => {
        try {
          await axios.post("/api/issues", data);
          router.push("/issues");
        } catch (error) {
          console.log(error); // debugge here
          setError("An unexpected error occurred.");
        }
      })}
    >
      <TextField.Root placeholder="Title" {...register("title")} />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
      />

      <Button type="submit">Submit New Issue</Button>
    </form>
  </div>
);

// api/issues/page.tsx
const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255), // Added MSG
  description: z.string().min(1, "Description is required."),
});
export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = createIssueSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 }); // Added .format()

  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
```

### - Implement Client-Side Validation

1. Install [Resolvers](https://www.npmjs.com/package/@hookform/resolvers)
2. createIssueSchema object bring Out of api/issues/page.ts using refactor because we can not export other thing from a route.ts file to use it in issues/new/page.tsx. [Click](https://prnt.sc/DsgOQO1ikUc7)
3. Work on issues/new/page.tsx

```bash
npm i @hookform/resolvers
```

**Refactor createIssueSchema and move to new file. Because we can export this variable but route.ts only export GET, POST, PUT, DELETE**

```jsx
// api/issues/page.ts
import { z } from "zod";
import prisma from "@/prisma/client";

const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required."),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
........

to----->

import prisma from "@/prisma/client";
import { createIssueSchema } from "../../validationSchema";

export async function POST(request: NextRequest) {
  const body = await request.json();

// ValidationSchema.ts
import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required."),
});

// issues/new/page.tsx (need not create redundent interface we can grab type from zod interface)
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchema";
import { z } from "zod";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const [error, setError] = useState("");

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-3">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/issues", data);
            router.push("/issues");
          } catch (error) {
            console.log(error);
            setError("An unexpected error occurred.");
          }
        })}
      >
        <TextField.Root placeholder="Title" {...register("title")} />
        {errors.title && (
          <Text color="red" as="p">
            {errors.title.message}
          </Text>
        )}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        {errors.description && (
          <Text color="red" as="p">
            {errors.description.message}
          </Text>
        )}
        <Button type="submit">Submit New Issue</Button>
      </form>
    </div>
  );
};
..........

```

### - Extractiong the ErrorMessage Component

- Create seperate component for displaying error message to make it consistant and well organized.
- NB: If a component is only need for a page then create it localy, If you want to reuse it different pages then create in /app/components/myCommponent.tsx

```jsx
// issues/new/page.tsx
<ErrorMessage>{errors.title?.message}</ErrorMessage>;

// app/components/ErrorMessage.tsx
import { Text } from "@radix-ui/themes";
import React, { PropsWithChildren } from "react";

const ErrorMessage = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children && (
        <Text color="red" as="p">
          {children}
        </Text>
      )}
    </>
  );
};
```

### - Adding a Spinner (When submitting form)

[Google: Tailwind Elements Spinner](https://tw-elements.com/docs/standard/components/spinners/)

```jsx
// issues/new/page.tsx
const [isSubmitting, setSubmitting] = useState(false);
<Button type="submit">Submit New Issue {isSubmitting && <Spinner />}</Button>;
<form
  className="space-y-3"
  onSubmit={handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (error) {
      // console.log(error);
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  })}
>

// app/conponents/Spinner.tsx
import React from "react";

const Spinner = () => {
  return (
    <div
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
```

### - Code Organization: Refactoring (Inline function to outside function defination)

- onSubmit: just cut inline function and paste it
- Separation of Concerns: Separate a program into distinct modules each having a separate concern.
  If concerns are well separated, there are more opportunities for code reuse.
- Software Engineering is not Black and White. "This is the best practice! You should always do things this way!" Not like this

```jsx
// issues/new/page.tsx
import ErrorMessage from "@/app/components/ErrorMessage";

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (error) {
      // console.log(error);
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root placeholder="Title" {...register("title")} />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
```

## Ch-3: Viewing Issues

### - Showing the Issues

```jsx
// issues/page.tsx
import prisma from "@/prisma/client";

const IssuesPage = async () => {
  const issues = await prisma.issue.findMany(); // One line fetch all data

  return (
    <div>
      <div className="mb-5">
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                {issue.title}
                <div className="md:hidden">{issue.status}</div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.status}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
```

### - Building the Issue Status Badge

- You can grab any Prisma Model type/interface. [Click](https://prnt.sc/Fg-cvBJFqk04)
- Record is typescript concept using for key-value pair

```jsx
// issues/page.tsx
<IssueStatusBadge status={issue.status} />;

// IssueStatusBadge.tsx
import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const statusMap: Record<
  Status,
  { label: string, color: "red" | "violet" | "green" }
> = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "violet" },
  CLOSED: { label: "Closed", color: "green" },
};
const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};
```

### - Adding Loading Skeletons

- use delay to watch loading skeletons properly.

```bash
npm i delay
```

```jsx
// in issues/page.tsx (before return)
await delay(2000);
```

- Use [React-Loading-Skeleton
  ](https://www.npmjs.com/package/react-loading-skeleton)

```bash
npm i react-loading-skeleton
```

```jsx
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
```

- add a new component IssueAction.tsx in local folder

```jsx
// issues/IssueActions.tsx
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const IssueActions = () => {
  return (
    <div className="mb-5">
      <Button>
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </div>
  );
};

// issues/loading.tsx
import { Table } from "@radix-ui/themes";
import React from "react";
import IssueStatusBadge from "../components/IssueStatusBadge";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import IssueActions from "./IssueActions";

const LoadingIssuePage = () => {
  const issues = [1, 2, 3, 4, 5];
  return (
    <>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue}>
              <Table.Cell>
                <Skeleton />
                <div className="md:hidden">
                  <Skeleton />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};
```

**NB: page.tsx, loading.tsx, layout.tsx anything could be make client component, if it not contain any server function like prisma.model.findMany()**

### - Showing Issue Details - Only fetch data not style

- Add loading page both in new and [id] folder to get ride of skeleton loading of issues folder

```jsx
// issues/[id]/page.tsx
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

const SingleIssuePage = async ({
  params: { id },
}: {
  params: { id: string },
}) => {
  if (typeof id !== "number") notFound();

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue) notFound(); // don't use return notFound(); It return null

  return (
    <div>
      <p>{issue.title}</p>
      <p>{issue.description}</p>
      <p>{issue.status}</p>
      <p>{issue.createdAt.toDateString()}</p>
    </div>
  );
};

// issues/page.tsx
<Link href={`/issues/${issue.id}`}>{issue.title}</Link>;
```

### - Styling the Issue Detail Page

```jsx
// issues/[id]/page.tsx
import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import prisma from "@/prisma/client";

const SingleIssuePage = async ({
  params: { id },
}: {
  params: { id: string },
}) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue) notFound(); // don't use return notFound(); It return null

  return (
    <div>
      <Heading>{issue.title}</Heading>
      <Flex className="space-x-3" my="2">
        <IssueStatusBadge status={issue.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card>
        <p>{issue.description}</p>
      </Card>
    </div>
  );
};
```

### - Adding Markdown Preview

All description show as a paragraph but If we install packege react-markdown then it shows like heading, list, bold etc

```bash
npm i react-markdown
```

Now everything comes properly [See](https://prnt.sc/twmcz8O_L0yh). Only problem is tailwind by default desable some style. So we need to install a packeg which will give beautiful style.

```

```

Step 1: Install

```bash
npm install -D @tailwindcss/typography
```

Step 2: Add to plugins
require('@tailwindcss/typography') put this in plagins array of tailwind.config.ts

```jsx
// tailwind.config.ts
plugins: [require("@tailwindcss/typography")],
```

Step 3: add prose

```jsx
<Card className="prose">
  <ReactMarkdown>{issue.description}</ReactMarkdown>
</Card>
```

```jsx
// issues/[id]/page.tsx
return (
  <div>
    <Heading>{issue.title}</Heading>
    <Flex className="space-x-3" my="2">
      <IssueStatusBadge status={issue.status} />
      <Text>{issue.createdAt.toDateString()}</Text>
    </Flex>
    <Card className="prose" mt="4">
      <ReactMarkdown>{issue.description}</ReactMarkdown>
    </Card>
  </div>
);
```

### - Buliding a Styled Link Component (components/Link.tsx)

- Custom link creation. Combine next link which has client side navigation. Radix link has beautiful look and feel. Hear combine both

```jsx
import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

interface Props {
  href: string;
  children: string;
}

const Link = ({ href, children }: Props) => {
  // next link pass two props
  return (
    <NextLink href={href} passHref legacyBehavior>
      <RadixLink>{children}</RadixLink>
    </NextLink>
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
