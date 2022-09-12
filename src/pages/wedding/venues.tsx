import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import WeddingLayout from "../../components/WeddingLayout";

const Venues: NextPageWithLayout = () => {
  return (
    <>Home Page</>
  );
};

Venues.getLayout = (page: ReactElement) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};

export default Venues;
