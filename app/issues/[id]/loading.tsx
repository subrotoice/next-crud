import { Skeleton } from "@/app/components";
import { Box, Card, Flex } from "@radix-ui/themes";

const LoadingIssueDetailsPage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton />
      <Flex className="space-x-3" my="2">
        <Skeleton width="3rem" />
        <Skeleton width="5rem" />
      </Flex>
      <Card mt="4">
        <Skeleton count={5} />
      </Card>
    </Box>
  );
};

export default LoadingIssueDetailsPage;
