import Layout from "../components/Layout";

export default function Home() {
  return (
    <>
      <Layout>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here you will find interesting information regarding your finances.
        </p>
      </Layout>
    </>
  );
}
