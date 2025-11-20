// app/links/[code]/page.tsx
type Props = {
  params: { code: string };
};

export default async function LinkDetailsPage({ params }: Props) {
  const { code } = params; // this is your successCode

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/links/${code}`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return (
    <div>
      <div>Code: {data.code}</div>
      <div>Original URL: {data.originalUrl}</div>
    </div>
  );
}
