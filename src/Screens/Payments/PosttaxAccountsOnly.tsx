import * as React from "react";

import { NoteSection } from "./PaymentComponents";
import { PosttaxAccountsOnlyType } from "./types";

const PosttaxAccountsOnly = (props: PosttaxAccountsOnlyType) => {
  const { wallets } = props;
  return <NoteSection title="Payroll" bulletPoints={wallets} description="You will receive deposits directly from your employer for claims approved under these accounts:" />;
};

export default PosttaxAccountsOnly;
