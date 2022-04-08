import * as React from "react";
import { useDispatch } from "react-redux";
import { isEmptyOrNil } from "Utils";

import { getUserPretaxAccountTransactionHistory } from "Actions/transactions.actions";

type usePreTaxAccountProps = { limit: number; flexAccountKey: string };

export const usePreTaxAccount = (props: usePreTaxAccountProps) => {
  const { flexAccountKey, limit } = props;
  const [loading, setLoading] = React.useState(true);
  const [transactions, setTransactions] = React.useState([]);
  const dispatch = useDispatch();

  const getTransactions = async () => {
    if (isEmptyOrNil(limit) || isEmptyOrNil(flexAccountKey)) {
      setLoading(false);
      setTransactions([]);
      return;
    }

    const res: any = await dispatch(
      getUserPretaxAccountTransactionHistory({
        flexAccountKey,
        limit,
      }),
    );
    if (!res) {
      setLoading(false);
      setTransactions([]);
      return;
    }
    const { transactions } = res;
    const formattedTransactions = !isEmptyOrNil(transactions) ? transactions : [];

    setLoading(false);
    setTransactions(formattedTransactions);
  };

  React.useEffect(() => {
    getTransactions();
  }, [flexAccountKey, limit]);

  return { loading, transactions };
};
