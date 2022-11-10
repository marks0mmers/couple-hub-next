import Skeleton from "../../components/skeleton";

export default function HomePageLoading() {
  return (
    <main className="flex flex-1 h-full animate-pulse">
      <section className="bg-base-200 flex-1 p-4">
        <Skeleton className="h-28 w-1/2" />
      </section>
    </main>
  );
}
