import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import AssigneeSelectReactQuery from "./AssigneeSelectReactQuery";
import DeleteIssueButton from "./DeleteIssueButton";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import { cache } from "react";

const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);

const SingleIssuePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const session = await getServerSession(authOptions);

  const issue = await fetchIssue(parseInt(id));

  if (!issue) notFound(); // don't use return notFound(); It return null

  // md in taiwind is equvalent to sm in redix
  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="3">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            {/* <AssigneeSelect issue={issue} /> */}
            <AssigneeSelectReactQuery issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const issue = await fetchIssue(parseInt(params.id));

  return {
    title: issue?.title,
    description: "Description of issue " + issue?.id,
  };
}

export default SingleIssuePage;
