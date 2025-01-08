"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { IssueSchema } from "@/app/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import {
  Box,
  Button,
  Callout,
  Grid,
  Select,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMdeReact from "react-simplemde-editor";
import { z } from "zod";

type IssueFormData = z.infer<typeof IssueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(IssueSchema),
  });
  // console.log(errors);
  const [error, setError] = useState(""); // to handel error comes form server
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      console.log(data);
      if (issue) await axios.patch(`/api/issues/${issue.id}`, data);
      else await axios.post("/api/issues", data);
      router.push("/issues/list");
      router.refresh();
    } catch (error) {
      // console.log(error);
      setSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-3">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <Grid columns={{ initial: "1", sm: "5" }} gap="3">
          <Box className="md:col-span-4 space-y-3">
            <TextField.Root
              defaultValue={issue?.title}
              placeholder="Title"
              {...register("title")}
            />
            <ErrorMessage>{errors.title?.message}</ErrorMessage>

            <Controller
              name="description"
              control={control}
              defaultValue={issue?.description}
              render={({ field }) => (
                <SimpleMdeReact placeholder="Description" {...field} />
              )}
            />
            <ErrorMessage>{errors.description?.message}</ErrorMessage>
          </Box>
          <Box>
            <Select.Root
              defaultValue={issue?.status}
              onValueChange={(value) => setValue("status", value)}
            >
              <Select.Trigger placeholder="Issue Status" />
              <Select.Content>
                <Select.Item value="OPEN">Open</Select.Item>
                <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
                <Select.Item value="CLOSED">Closed</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Grid>
        <Button type="submit" className="cursor-pointer hover:cursor-pointer">
          {issue ? "Update Issue" : "Submit New Issue"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
