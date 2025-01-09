"use client";

import Error from "next/error";

export default function GlobalError({ error }) {
  return (
    <html>
      <body>
        {/* Customize error page here if needed */}
        <Error statusCode={500} title="An unexpected error occurred" />
      </body>
    </html>
  );
}
