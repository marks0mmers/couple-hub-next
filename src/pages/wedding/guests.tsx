import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import WeddingLayout from "../../components/WeddingLayout";

const Guests: NextPageWithLayout = () => {
  return (
    <>Home Page</>
  );
};

Guests.getLayout = (page: ReactElement) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};

export default Guests;
