import { _renderNavbar } from '../../common.functions/common.functions.view';

const NavbarWrapper = (props) => {
  return _renderNavbar(props.params.id, props.params.accIdAndName, props.refreshState, props.goToLocation);
}

export default NavbarWrapper;