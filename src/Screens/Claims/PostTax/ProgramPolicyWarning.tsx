import { AppDrawer, AppText } from "Components";
import { ExclaimationPointSvg } from "Components/SvgIcons/ExclaimationPointSvg";
import * as React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Colors, Metrics } from "Themes";
import { isEmptyOrNil, openExternalLink } from "Utils";
import { QuestionsDrawerContent } from "../Components/QuestionsDrawerContent";
import { ProgramPolicyContainer } from "../StyledComponents";

export const ProgramPolicyWarning = (props: { reimbursementPolicyLink: string }) => {
  const { reimbursementPolicyLink } = props;
  const [state, setState] = React.useState<{ programPolicyWarningVisibility: boolean }>({ programPolicyWarningVisibility: false });
  const { programPolicyWarningVisibility } = state;
  const closeDrawer = () => setState({ ...state, programPolicyWarningVisibility: !programPolicyWarningVisibility });

  return (
    <>
      <ProgramPolicyContainer>
        <View style={{ marginTop: 3 }}>
          <ExclaimationPointSvg />
        </View>
        <View style={{ marginLeft: Metrics.baseMargin, paddingRight: Metrics.doubleBaseMargin }}>
          <AppText>
            Your
            <TouchableWithoutFeedback
              onPress={() => {
                !isEmptyOrNil(reimbursementPolicyLink) && openExternalLink(reimbursementPolicyLink);
              }}
            >
              <AppText style={{ color: Colors.blue }}> program policy </AppText>
            </TouchableWithoutFeedback>
            does not allow for
            <TouchableWithoutFeedback
              onPress={() => {
                setState({ ...state, programPolicyWarningVisibility: !programPolicyWarningVisibility });
              }}
            >
              <AppText style={{ color: Colors.blue }}> Reimbursment Plans </AppText>
            </TouchableWithoutFeedback>
            to rollover to the next year.
          </AppText>
        </View>
      </ProgramPolicyContainer>
      <AppDrawer
        isDrawerOpen={programPolicyWarningVisibility}
        onCloseHandler={closeDrawer}
        DrawerContent={() => (
          <QuestionsDrawerContent
            title="Reimbursement Plans"
            primaryString="Why is this less than my total claim amount?"
            secondaryString="Your program policy does not allow for claims on Reimbursement Plans to rollover into the new year. This is the estimated total amount you'll be reimbursed be the end of the year, if you don't spend any more from this account."
          />
        )}
        drawerContainerStyle={{ paddingHorizontal: 0 }}
      />
    </>
  );
};
