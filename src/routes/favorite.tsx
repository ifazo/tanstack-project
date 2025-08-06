import { createFileRoute } from "@tanstack/react-router";
import { getUser, getToken } from "~/store";

export const Route = createFileRoute("/favorite")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = getUser();
  const token = getToken();
  return (
    <div>
      User: {user ? user.email : "Not logged in"}
      <br />
      Token: {token ? token : "No token available"}
    </div>
  );
}
