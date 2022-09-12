import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import WeddingLayout from "../../components/WeddingLayout";

const Seating: NextPageWithLayout = () => {
  return (
    <>Home Page</>
  );
};

Seating.getLayout = (page: ReactElement) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};

export default Seating;
