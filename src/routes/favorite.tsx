import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/favorite")({
  component: RouteComponent,
});

function RouteComponent() {
  
  return (
    <div>
      <h1>Favorites</h1>
      <br />
      <p>This is the favorites page.</p>
      <p>Here you can view your favorite items.</p>
    </div>
  );
}
