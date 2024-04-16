import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";

const SingleIssuePage = async ({
  params: { id },
}: {
  params: { id: string };
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

export default SingleIssuePage;
