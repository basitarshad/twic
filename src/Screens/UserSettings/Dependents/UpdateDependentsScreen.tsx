import * as React from "react";
import { pathOr, propOr, toUpper } from "ramda";
import { connect, useSelector } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";

import { formatDependentInfo } from "./meta";
import { FormFieldsType } from "./types";
import { toggleAppScreenLoader, updateUserDependent } from "../../../Actions";
import { NavigationService, UserApiHandlers } from "../../../Services";
import AddUpdateDependentsForm from "./AddUpdateDependentsForm";
import { isEmptyOrNil } from "../../../Utils";
import { UserHelpers } from "../../../Services";
import { PreTaxCardInfoType } from "../../../types";
import { APP_ROUTES } from "../../../Navigation";
import { ScreenContainer } from "../../../Components";

type AddUpdateDependentsScreenType = {
  navigation: any;
  toggleLoader: any;
  updateUserDependent: any;
};

const UpdateDependentsScreen = (props: AddUpdateDependentsScreenType) => {
  const { toggleLoader, navigation, updateUserDependent } = props;
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const dependentBasicInfo = pathOr({}, ["route", "params", "dependentInfo"], props);

  const dependentId = propOr("", "dependentId", dependentBasicInfo);
  const [state, setState] = React.useState({
    dependent: {},
    card: {},
  });

  // Below function is for android hardware back button
  const handleBackButtonClick = () => {
    NavigationService.navigate(APP_ROUTES.USER_PROFILE);
  };

  useBackHandler(() => {
    handleBackButtonClick();
    return true;
  });

  const fetchData = async () => {
    toggleLoader(true);
    const dependentInfo = await UserApiHandlers.getUserDependents(`/${dependentId}`);

    const preTaxCardsResponse = await UserApiHandlers.getPreTaxCards();
    const respondedCards = pathOr([], ["data", "data", "cards"], preTaxCardsResponse);
    const formattedCards = UserHelpers.formatBenefitsCards(respondedCards);
    const dependentCard = formattedCards.find((card: PreTaxCardInfoType) => card.dependentId === dependentId) || {};

    setState({
      ...state,
      card: dependentCard,
      dependent: formatDependentInfo(pathOr({}, ["data", "data", "dependent"], dependentInfo), dependentId),
    });
    toggleLoader(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [navigation]);

  const onSubmitForm = async (values: FormFieldsType) => {
    const { billingAddressLineOne, billingAddressLineTwo, billingState, billingZipCode, firstName, lastName, phoneNumber, dependentId, billingCity } = values;

    const billingAddress = {
      country: toUpper(userCountry),
      city: billingCity,
      line1: billingAddressLineOne,
      line2: billingAddressLineTwo,
      state: billingState,
      zip: billingZipCode,
    };

    const payload = {
      address: { ...billingAddress },
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber,
    };

    // DISPATCH and updates the store
    const response = await updateUserDependent(dependentId, payload);
    if (response === "Success") {
      setState({
        ...state,
        dependent: {
          ...state.dependent,
          firstName: firstName,
          lastName: lastName,
        },
      });
    }
  };

  if (isEmptyOrNil(state.dependent)) return <ScreenContainer />;
  return <AddUpdateDependentsForm dependentInfo={state.dependent} onSubmitForm={onSubmitForm} cardInfo={state.card} refetchDependent={fetchData} />;
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLoader: (loaderVisibility: boolean) => dispatch(toggleAppScreenLoader(loaderVisibility)),
    updateUserDependent: (id, payload) => dispatch(updateUserDependent(id, payload)),
  };
};

export default connect(null, mapDispatchToProps)(UpdateDependentsScreen);
