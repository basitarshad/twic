import React from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { AutoCompleteText, DatePickerField, InputField, Picker, PrimaryButton, SecondaryButton } from './src';
import Icon from 'react-native-vector-icons/AntDesign';
import { Colors } from './src/commons';
// import { AppHeading } from './src/components/AppStyledComponents';
// import { Metrics } from './src/commons';

const App = () => {
  // const [date, setDate] = React.useState();
  // const [query, setQuery] = React.useState('');
  // const [pickerVal, setPickerVal] = React.useState('');
  // let inputFieldRef = React.useRef(null);

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <View style={{ padding: 20 }}>
        {/* <AutoCompleteText
          label="Category"
          data={['asad', 'ahsan', 'waqar', 'ali', 'awais', 'ahmed', 'bilal', 'haseeb']}
          seeAllCallBack={(searchedString: string) => {
            console.log(searchedString);
          }}
          clickableFieldCallBack={(element: string) => {
            console.log(element);
          }}
        /> */}
        {/* <View style={{ backgroundColor: 'orange' }}>
          <InputField
            // textProps={{
            //   render: () => (
            //     <View style={{ height: 52, width: '100%', justifyContent: 'center', paddingRight: Metrics.screenHorizontalPadding / 2, paddingLeft: 40 }}>
            //       <TouchableOpacity onPress={() => inputFieldRef.current.handleFocus()}>
            //         <AppHeading>Zille</AppHeading>
            //       </TouchableOpacity>
            //     </View>
            //   ),
            // }}
            // rightIconName="menu-down"
            // leftCustomIcon={(e) => <Icon name="close" size={20} color={e.color} />}
            setRef={(ref) => (inputFieldRef.current = ref)}
            label={'input field'}
            // errorMessage="123"
            value={query}
            // iconProps={{
            //   size: 30,
            //   style: {
            //     marginTop: 10,
            //   },
            // }}
            errorMessage="sdasd"
            onChangeHandler={(value) => setQuery(value)}
          />
        </View> */}
        {/* <View style={{ backgroundColor: 'pink', marginTop: 20 }}>
          <Picker
            label="Category"
            placeholderText="Selected Category"
            value={pickerVal}
            onValueChange={(value) => setPickerVal(value)}
            items={[
              { label: 'Limited, RX, Dental and Vision - TWICLPFSA', key: 'Limited, RX, Dental and Vision - TWICLPFSA', value: 'Limited, RX, Dental and Vision - TWICLPFSA' },
              { label: 'Flexible Spending Account', key: 'Flexible Spending Account', value: 'Flexible Spending Account' },
              { label: 'Flexible Spending Account and Dental Vision - TWICLPFSA', key: 'Flexible Spending Account and Dental Vision - TWICLPFSA', value: 'Flexible Spending Account and Dental Vision - TWICLPFSA' },
            ]}
            errorMessage={isEmptyOrNil(pickerVal) ? 'Error' : ''}
            RenderCustomIcon={() => <Icon name="caretdown" size={20} color={'black'} />}
          />
        </View>
        <View style={{ backgroundColor: 'blue', marginTop: 20 }}>
          <DatePickerField label="Date" onConfirmDate={(date: Date) => setDate(date)} errorMessage={isEmptyOrNil(pickerVal) ? 'Error' : ''} value={date} RenderCustomIcon={Icon} iconProps={{ name: 'calendar', size: 18 }} />
        </View> */}
        {/* <PrimaryButton
          buttonColor={Colors.white}
          buttonLabel="File a Claim"
          onClickHandler={() => {
            console.log('click');
          }}
          testId="file-a-claim-button"
          // width={200}
          disabled
          fullWidth
          labelStyle={{ color: Colors.newBlue, marginLeft: 15 }}
          shadowOptions={{ width: 0 }}
          buttonStyle={{ borderColor: '#00000010', borderWidth: 1 }}
          customIcon={() => <Icon name="caretdown" size={12} color={Colors.newBlue} />}
        /> */}
        <PrimaryButton
          // disabledColor={Colors.dimGrey}
          // disabled
          buttonColor={Colors.newBlue}
          buttonLabel="Continue"
          onClickHandler={() => console.log('click')}
          testId="work-email-button"
          fullWidth
          shadowOptions={{ width: 0 }}
        />
        <View style={{ marginTop: 20 }} />
        <SecondaryButton buttonLabel="Secondary Active" fullWidth onClickHandler={() => console.log('click')} customIcon={() => <Icon name="caretdown" size={12} color={Colors.newBlue} />} />
        <View style={{ marginTop: 20 }} />
        <SecondaryButton disabled buttonLabel="Secondary Disabled" fullWidth onClickHandler={() => console.log('click')} />
      </View>
    </SafeAreaView>
  );
};

export default App;
