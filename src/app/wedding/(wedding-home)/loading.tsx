import Skeleton from "../../../components/skeleton";

export default function WeddingHomeLoading() {
  return (
    <div className="p-4 flex gap-4 animate-pulse">
      <div className="form-control flex-1 gap-4">
        <Skeleton className="h-4 w-24 mt-2" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="form-control flex-1 gap-4">
        <Skeleton className="h-4 w-28 mt-2" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="form-control flex-1 gap-4">
        <Skeleton className="h-4 w-28 mt-2" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
