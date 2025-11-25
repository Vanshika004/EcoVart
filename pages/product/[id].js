import { useRouter } from "next/router";
import Link from "next/link";

export default function ProductPage() {
  const { query } = useRouter();
  const { id } = query;

  return (
    <div className="container py-12">
      <Link href="/" className="text-sm text-primary">
        ← Back to shop
      </Link>

      <div className="mt-6 card">
        <h1 className="text-2xl font-semibold">Product: {id}</h1>
        <p className="text-sm text-gray-600 mt-2">
          This is a placeholder product page for the MVP.
        </p>
        <div className="mt-6">
          <button className="bg-primary text-white px-4 py-2 rounded">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
