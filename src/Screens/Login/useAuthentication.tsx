import useAxios from "axios-hooks";
import * as React from "react";
import { Keyboard } from "react-native";
import { isEmptyOrNil } from "Utils";

export const useAuthentication = ({ url, email }) => {
  const [apiResponse, sendApiLink] = useAxios({ url, method: "POST" }, { manual: true });
  const { data = {}, loading, error } = apiResponse;

  const sendApiLinkHandler = React.useCallback(() => {
    Keyboard.dismiss();
    if (!isEmptyOrNil(email)) sendApiLink({ data: { email } });
  }, [email]);

  return { data, loading, error, sendApiLinkHandler };
};
