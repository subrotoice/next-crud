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

export default ErrorMessage;
