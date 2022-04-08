import * as React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { If, Then, Else } from 'react-if';
import styled from 'styled-components/native';
import { propOr } from 'ramda';

import { APP_CONSTANTS, Colors, Utilities } from '../commons';
import { InputField } from './InputField';
import { AppText } from './AppText';
import { AddElementShadow, TransparentButtonsBorder } from './Styles';
import { AutoCompleteFieldProps } from './types';

const { isEmptyOrNil } = Utilities;

export const DependentContainer = styled(View)<{ marginBottom?: number }>`
  padding-left: 20;
  padding-right: 8;
  padding-vertical: 12;
  background-color: ${Colors.white};
  margin-bottom: ${props => propOr(0, 'marginBottom')(props)};
  border-color: ${Colors.lightBoxShadowGrey};
  ${!APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderRadius: 6 })};
  ${APP_CONSTANTS.IS_ANDROID && AddElementShadow()};
`;

export const AutoCompleteText = (props: AutoCompleteFieldProps) => {
  const [query, setQuery] = React.useState<string>('');
  const { label, data, seeAllCallBack, clickableFieldCallBack, seeAllText = 'See all', ...rest } = props;
  const filteredSearch = data.filter(_data => _data.includes(query));
  return (
    <View>
      {/* @ts-ignore */}
      <InputField label={label} value={query} onChangeHandler={value => setQuery(value)} rightIconComponent={() => <TextInput.Icon name={() => <Icon name={'caretdown'} />} {...rest} />} />
      <If condition={!isEmptyOrNil(filteredSearch) && !isEmptyOrNil(query)}>
        <Then>
          <DependentContainer>
            <ScrollView style={{ height: 180 }} nestedScrollEnabled={true}>
              {filteredSearch.map((element: string) => (
                <If condition={!isEmptyOrNil(clickableFieldCallBack)}>
                  <Then>
                    {/* @ts-ignore */}
                    <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => clickableFieldCallBack(element)}>
                      <AppText color={Colors.charcoalDarkGrey}>{element}</AppText>
                    </TouchableOpacity>
                  </Then>
                  <Else>
                    <View style={{ paddingVertical: 8 }}>
                      <AppText color={Colors.charcoalDarkGrey}>{element}</AppText>
                    </View>
                  </Else>
                </If>
              ))}
            </ScrollView>
            <If condition={!isEmptyOrNil(seeAllCallBack)}>
              {/* @ts-ignore */}
              <TouchableOpacity style={{ paddingVertical: 8 }} onPress={() => seeAllCallBack(query)}>
                <AppText
                  color={Colors.blue}
                  style={{
                    marginTop: 10,
                  }}
                >
                  {seeAllText}
                </AppText>
              </TouchableOpacity>
            </If>
          </DependentContainer>
        </Then>
      </If>
    </View>
  );
};
