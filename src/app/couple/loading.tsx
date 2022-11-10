import Skeleton from "../../components/skeleton";

export default function CoupleLoading() {
  return (
    <main id="couple-page" className="flex-1 p-4 bg-base-200">
      <div className="flex justify-around animate-pulse">
        <Skeleton className="w-72 h-40" />
        <Skeleton className="w-40 h-40" />
        <Skeleton className="w-72 h-40" />
      </div>
    </main>
  );
}
