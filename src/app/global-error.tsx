"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-8 text-center">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-[#4caf50] px-6 py-3 font-semibold text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
