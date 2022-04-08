import Axios from "axios";
import { configure } from "axios-hooks";
import LRU from "lru-cache";
import VersionInfo from "react-native-version-info";

const BASE_URL = `beta.joinforma.com`;
// const BASE_URL = `joinforma.com`;
const cache = new LRU({ max: 10 });
export let axiosInstance;
export let axiosInstanceApi;

type ApiConfigParams = {
  isLoggedIn: boolean;
  authToken: string | null | undefined;
};

const initApiConfig = (params: ApiConfigParams) => {
  const { isLoggedIn, authToken = "" } = params;

  const prefix = isLoggedIn ? "proxy." : "";

  axiosInstance = Axios.create({
    baseURL: `https://${prefix}${BASE_URL}`,
    timeout: 60000,
    params: {
      is_mobile: true,
    },
    headers: {
      "x-source": "mobile",
      "x-mobile-version": VersionInfo.appVersion,
      "x-source-version": VersionInfo.appVersion,
      ...(isLoggedIn ? { "x-auth-token": authToken } : {}),
    },
  });
  axiosInstanceApi = Axios.create({
    baseURL: `https://api.${BASE_URL}/client/`,
    timeout: 60000,
    params: {
      is_mobile: true,
    },
    headers: {
      "x-source": "mobile",
      "x-source-version": VersionInfo.appVersion,
      ...(isLoggedIn ? { "x-auth-token": authToken } : {}),
    },
  });
  configure({ axios: axiosInstanceApi, cache });
};

export default initApiConfig;
