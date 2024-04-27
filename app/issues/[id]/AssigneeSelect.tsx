import { User } from "@prisma/client";
import { Select } from "@radix-ui/themes";

const AssigneeSelect = async () => {
  const res = await fetch("http://localhost:3000/api/users");
  const users: User[] = await res.json();

  return (
    <Select.Root>
      <Select.Trigger placeholder='Assign...' />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestion</Select.Label>
          {users.map((user) => (
            <Select.Item value={user.id}>{user.name}</Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
