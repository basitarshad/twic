import * as React from "react";
import { connect } from "react-redux";

import { searchForVendorVenues } from "../../../Actions";
import { SearchField } from "./SearchField";
import { ActionsBar } from "./ActionsBar";
import { SearchBarContainer } from "../StyledComponents";

const MapSearchBarContent = (props) => {
  return (
    <>
      <SearchBarContainer>
        <SearchField {...props} />
      </SearchBarContainer>
      <ActionsBar {...props} />
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchForVendorVenues: (params) => dispatch(searchForVendorVenues(params)),
  };
};
export const MapSearchBar = connect(null, mapDispatchToProps)(MapSearchBarContent);
