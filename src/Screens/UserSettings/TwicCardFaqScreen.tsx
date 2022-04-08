import * as React from "react";
import { View, FlatList } from "react-native";
import { Divider } from "react-native-elements";

import { AppScreenTitleContainer, AppScreenTitle, AppText, RenderHtml, ScreenContainer } from "../../Components";
import { Metrics, Fonts, Colors } from "../../Themes";

const FAQ_LIST = [
  {
    question: "Where can I use my Forma Card?",
    answer:
      "<p>You can use the Forma Card anywhere VISA is accepted online, over the phone or in person.</p><p>If you have a virtual card, we recommend adding your card to your mobile wallet on iPhone and Android phones. This allows you to pay in the physical world where smart payment is accepted.</p>",
  },
  {
    question: "How does the card work?",
    answer: `<p>Forma Card is a prepaid debit card for your employer benefits program and transactions are automatically linked to your Forma account.</p><p>Your Forma Card transactions are subject to approval by the rules set forth by your employer. The transaction may be rejected if it's considered ineligible under your employer’s program policy.</p>`,
  },
  {
    question: "Why was my Forma Card declined?",
    answer: `<p>When the Forma Card is used, the authorization is completed at the point of sale.</p><p>If a transaction is declined, it may be due to the following reasons:</p>
    <ul>
    <li>The attempted purchase is from an unverifiable merchant.</li>
    <li>The attempted purchase is not eligible.</li>
    <li>You do not have sufficient balance in your Forma Wallet to cover the purchase.</li>
    <li>There was an issue with the information you entered.</li>
    </ul>`,
  },
];

const tagStyles = {
  p: {
    marginVertical: 5,
    padding: 0,
    fontFamily: "TTCommons-Regular",
    color: Colors.secondaryText,
  },
  ul: {
    marginVertical: 5,
    padding: 0,
    fontFamily: "TTCommons-Regular",
    color: Colors.secondaryText,
  },
};

const RenderListItem = ({ item }) => {
  const { question, answer } = item;
  return (
    <View style={{ paddingVertical: Metrics.doubleBaseMargin }}>
      <AppText fontSize={Fonts.size.h2} style={{ marginBottom: Metrics.smallMargin }}>
        {question}
      </AppText>
      <RenderHtml
        html={answer}
        tagStyles={tagStyles}
        listsPrefixesRenderers={{
          ul: (_htmlAttribs, _children, _convertedCSSStyles, passProps) => {
            return (
              <View
                style={{
                  marginRight: 10,
                  width: 15 / 2.8,
                  height: 15 / 2.8,
                  marginTop: 5,
                  borderRadius: 15 / 2.8,
                  backgroundColor: Colors.secondaryText,
                }}
              />
            );
          },
        }}
      />
    </View>
  );
};

const TwicScreenFaqScreen = () => {
  return (
    <ScreenContainer>
      <AppScreenTitleContainer>
        <AppScreenTitle>FAQ</AppScreenTitle>
      </AppScreenTitleContainer>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: Metrics.screenHorizontalPadding }}
        data={FAQ_LIST}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => {
          return (
            <>
              {index === 0 && <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />}
              <RenderListItem item={item} />
            </>
          );
        }}
        ItemSeparatorComponent={() => <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

export default TwicScreenFaqScreen;
