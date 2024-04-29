"use client";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const [users, setUsers] = useState<User[]>();
  // const res = await fetch("http://localhost:3000/api/users");
  useEffect(() => {
    axios
      .get<User[]>("http://localhost:3000/api/users")
      .then((res) => {
        setUsers(res.data);
        // console.log(res.data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const assignIssue = (userId: string) => {
    const valueUserId = userId === "unassigned" ? null : userId;
    fetch("/api/issues/" + issue.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignedToUserId: valueUserId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          // if you use axios then you need to to do this only .catch() work directly
          throw new Error("Network response was not ok");
        }
        toast.success("Successfully saved!");
      })
      .catch((error) => toast.error("Could not be saved."));
  };

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "unassigned"}
        onValueChange={assignIssue}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestion</Select.Label>
            <Select.Item value="unassigned">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default AssigneeSelect;
