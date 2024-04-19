import prisma from "@/prisma/client";
import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";

const SingleIssuePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  // await delay(3000);
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue) notFound(); // don't use return notFound(); It return null

  return (
    <Grid columns={{ initial: "1", md: "2" }}>
      <Box>
        <IssueDetails issue={issue} />
      </Box>
      <Box>
        <EditIssueButton issueId={issue.id} />
      </Box>
    </Grid>
  );
};

export default SingleIssuePage;
