import clsx from "clsx";

type Props = {
  className?: string;
};

export default function Skeleton({ className = "" }: Props) {
  return (
    <div
      id="skeleton"
      className={clsx(className, "bg-gray-100", "dark:bg-gray-300", "rounded-md")}
    />
  );
}
