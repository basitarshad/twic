import * as React from "react";
import { View, Image } from "react-native";
import { PrimaryButton } from "twic_mobile_components";
import { AmplitudeAnalytics } from "AppAnalytics";
import { AppDrawer, RowContainer } from "Components/Commons";
import { Divider } from "react-native-elements";
import { openExternalLink } from "Utils";
import { AppText } from "../../Components/Commons/AppStyledComponents";
import { StoreStateType } from "./HomeScreenPreTaxStoresListingScreen";
import { APP_CONSTANTS } from "Constants";
import { Colors, Fonts, Images, Metrics } from "Themes";
import styled from "styled-components";
import { useDispatch } from "react-redux";

const Text = styled(AppText)`
  color: #7e7f83;
  margin-top: 20px;
`;
const iconStyle: any = {
  height: Metrics.icons.large,
  resizeMode: "contain",
};

type StoreModalCardType = { store: StoreStateType; closeDrawer: () => void; preTaxAccountName: string };

const storeDescription = (preTaxAccountName: string, storeName: string) => {
  if (storeName === "HSA Store") {
    return `Remember to use your Forma benefits card for your purchases on HSA Store.com`;
  }
  return `Remember to use your Forma benefits card for your purchase or file a claim in your ${preTaxAccountName} account on Forma so you can be reimbursed.`;
};
const StoreModalCard: React.FC<StoreModalCardType> = ({ store, closeDrawer, preTaxAccountName }) => {
  const dispatch = useDispatch();

  if (!store) return null;
  const openStore = async (url) => {
    openExternalLink(url, () => {
      dispatch(AmplitudeAnalytics.externalStoreViewed({ store_name: store.NAME }));
    });
    closeDrawer();
  };
  return (
    <View style={{ paddingHorizontal: 40, paddingVertical: 20 }}>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <RowContainer justifyContent="center">
          <Image source={store.IMAGE} style={{ ...iconStyle, width: 140 }} />
        </RowContainer>
        <Divider
          style={{
            backgroundColor: "#00000020",
            marginVertical: 25,
          }}
        />
        <Text style={{ color: "#22222D", fontSize: Fonts.size.h2, fontWeight: "700" }}>You’ll be directed to {store.WEB_DOMAIN}</Text>
        <Text>{`You can shop for all kinds of ${preTaxAccountName} eligible products online at this site.`}</Text>
        <Text style={{ marginBottom: 30 }}>{storeDescription(preTaxAccountName, store.NAME)}</Text>
        <PrimaryButton
          width={APP_CONSTANTS.MUI_BTN_WIDTH}
          shadowOptions={{
            width: 0,
            height: 0,
          }}
          buttonColor={Colors.newPrimary}
          buttonLabel="Continue to site"
          onClickHandler={() => openStore(store.LINK)}
        />
      </View>
    </View>
  );
};

type PreTaxStoreModalType = Omit<StoreModalCardType, "closeDrawer"> & {
  setStore: (val: undefined) => void;
};
const PreTaxStoreModal: React.FC<PreTaxStoreModalType> = ({ store, setStore, preTaxAccountName }) => {
  const closeDrawer = () => {
    setStore(undefined);
  };
  return (
    <>
      <AppDrawer isDrawerOpen={!!store} onCloseHandler={closeDrawer} DrawerContent={() => <StoreModalCard store={store} closeDrawer={closeDrawer} preTaxAccountName={preTaxAccountName} />} />
    </>
  );
};
export default PreTaxStoreModal;
