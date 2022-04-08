import { Colors, Images } from "../../Themes";

export const getAccountImage = new Map([
    // PRE TAX
    ["HSA", Images.hsa],
    ["FSA", Images.fsa],
    ["Transit", Images.transit],
    ["Parking", Images.parking],
    ["Biking", Images.biking],
    ["pet", Images.pet],
    ["family", Images.family],
    // POST TAX
    ["wellness", Images.wellness],
    ["commuter", Images.commuter],
    ["rewards", Images.rewards],
    ["communication", Images.communication],
]);
  
export const getAccountColor = new Map([
    // PRE TAX
    ["HSA", Colors.lightRose],
    ["FSA", Colors.lightRose],
    ["Transit", Colors.lightGreen],
    ["Parking", Colors.lightGreen],
    ["Biking", Colors.lightGreen],
    ["pet", Colors.lightBluish],
    ["family", Colors.lightPurple],
    // POST TAX
    ["wellness", Colors.lightOrange],
    ["commuter", Colors.lightGrey],
    ["rewards", Colors.lightOrange],
    ["communication", Colors.lightYellowish],
]);

export const getAccountBackgroundImage = new Map([
    // PRE TAX
    ["HSA", Images.bgHsa],
    ["FSA", Images.bgFsa],
    ["Transit", Images.bgTransit],
    ["Parking", Images.bgParking],
    ["pet", Images.bgPet],
    ["family", Images.bgFamily],
    // POST TAX
    ["wellness", Images.bgWellness],
    ["commuter", Images.bgCommuter],
    ["rewards", Images.bgRewards],
    ["communication", Images.bgCommunication],
  ]);

export const accountInfoText = "Account helps you save up to 30% on taxes when you spend on eligible expenses";
export const getAccountInfo = new Map([
    ["HSA", `Health Savings ${accountInfoText}`],
    ["FSA", `Flexible Savings ${accountInfoText}`],
    ["Transit", `Commmuter Transit ${accountInfoText}`],
    ["Parking", `Commmuter Parking ${accountInfoText}`],
    ["Other", `This is your Other account.`],
]);
  
  