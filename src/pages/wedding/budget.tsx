import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import WeddingLayout from "../../components/WeddingLayout";

const Budget: NextPageWithLayout = () => {
  return (
    <>Home Page</>
  );
};

Budget.getLayout = (page: ReactElement) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};

export default Budget;
