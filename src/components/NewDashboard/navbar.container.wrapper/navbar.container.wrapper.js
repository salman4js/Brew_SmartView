import React from 'react';
import { _renderNavbar } from '../../common.functions/common.functions.view';
import { useParams } from 'react-router-dom';

const NavbarWrapper = (props) => {
  
  // Get the ID from the url!
  const { id } = useParams();
  var accIdAndName = id.split(/[-]/);
  
  return _renderNavbar(id, accIdAndName);
}

export default NavbarWrapper;