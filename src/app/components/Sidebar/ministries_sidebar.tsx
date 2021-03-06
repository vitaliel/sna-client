import * as React from 'react';
import {Link} from 'react-router';
import {OrderedMap} from 'immutable';
const {connect} = require('react-redux');

import {BackLink} from '../BackLink/index';
import {selAdminPath, MyLocation, RouteParams, mreportPath} from '../../helpers/url_helper';
import {ChartIcon} from '../ChartIcon/index';
import {Ministry} from '../../models/ministry';
import {ApplicationState} from '../../redux/application_state';
import {areMinistriesStatsLoaded, ministries} from '../../selectors/index';
import SidebarWrapper from '../sidebarWrapper/index';

const style = require('./style.css');

interface Props {
  params?: RouteParams;
  location?: MyLocation;
  ministries?: OrderedMap<number, Ministry>;
  areMinistriesStatsLoaded?: boolean;
}

@connect(
  (state: ApplicationState): Props => ({
    areMinistriesStatsLoaded: areMinistriesStatsLoaded(state),
    ministries: ministries(state),
  }),
)
class MinistriesSidebar extends React.Component<Props, {}> {
  public render() {
    const indId = parseInt(this.props.params.id, 10);

    const menus = this.props.ministries.toIndexedSeq().map((i) => (
      <li key={`item-${i.id}`}>
        <Link to={mreportPath(indId, i.id, this.props.location.query)}>
          {i.name}
        </Link>
      </li>
    ));

    return (
      <div className={style.Sidebar}>
        <BackLink link={selAdminPath(indId, this.props.location.query)} />
        <div className={style.title}>
          <div>Instituție</div>
          <div className={style.viewAll}>
            <ChartIcon />
            <Link to={mreportPath(indId, null, this.props.location.query)}>
              Prezentare Generală
            </Link>
          </div>
        </div>
        <ul className={style.adminType}>
          {menus}
        </ul>
      </div>
    );
  }
}

export default SidebarWrapper(MinistriesSidebar);
