import VerifyClient from "./VerifyClient";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <VerifyClient
      email={params.email ?? ""}
    />
  );
}