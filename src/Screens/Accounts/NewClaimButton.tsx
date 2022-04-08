import * as React from "react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import { PrimaryButton } from "twic_mobile_components";

import { NavigationService } from "Services/index";
import { Colors, Metrics } from "Themes/index";
import { PlusSvgIcon } from "Components/SvgIcons/index";
import { APP_ROUTES } from "../../Navigation";

interface NewClaimButtonProps {
  accountId?: string;
  accountType?: string;
  buttonWidth: number;
}
export const NewClaimButton: React.FC<NewClaimButtonProps> = (props) => {
  const reimbursement = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "reimbursement"], state));
  if (!reimbursement) return null;
  const { accountId, accountType, buttonWidth } = props;
  return (
    <PrimaryButton
      shadowOptions={{ width: "0%", height: 0 }}
      width={buttonWidth}
      buttonColor={Colors.newBlue}
      buttonLabel="New Claim"
      testId="new-claim-button"
      customIcon={() => <PlusSvgIcon fillColor={Colors.white} style={{ marginRight: Metrics.newScreenHorizontalPadding }} />}
      onClickHandler={() => {
        NavigationService.navigate(
          APP_ROUTES.NEW_REIMBURSEMENT,
          accountId && accountType
            ? {
                type: "account",
                walletId: accountId,
                account: accountType,
              }
            : {},
        );
      }}
    />
  );
};
