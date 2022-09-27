import { ReactElement } from "react";
import WeddingLayout from "../../components/WeddingLayout";

export default function Seating() {
  return <>Home Page</>;
}

Seating.getLayout = (page: ReactElement) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};
