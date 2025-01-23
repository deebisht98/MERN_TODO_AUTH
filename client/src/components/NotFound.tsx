import { Link } from "@tanstack/react-router";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link to="/" className="text-primary hover:underline">
        Go back home
      </Link>
    </div>
  );
};
