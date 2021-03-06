import * as React from 'react';
import {ContentHeader} from '../../components/ContentHeader/index';
import {loadIndicatorsConfig} from '../../redux/modules/indicator/index';
import {ApplicationState, LoadEntryState, isContentLoaded} from '../../redux/application_state';
import {Indicator} from '../../models/indicator';
const { asyncConnect } = require('redux-connect');
const { connect } = require('react-redux');

interface RouteParams {
  id: string;
}

interface ReportProps {
  loader?: LoadEntryState;
  indicators?: Indicator[];
  params?: RouteParams;
}

@asyncConnect([
  loadIndicatorsConfig(),
])
@connect(
  (state: ApplicationState): ReportProps  => ({
    loader: state.reduxAsyncConnect.loadState.indicators,
    indicators: state.reduxAsyncConnect.indicators,
  }),
)

export class Report extends React.Component<ReportProps, any> {
  public render() {
    const {loader, params, indicators} = this.props;

    let title = null;

    if (isContentLoaded(loader)) {
      title = `${params.id}. ${indicators[parseInt(params.id, 10) - 1].name}`;
    }

    return (
      <div className="select-todo">
        <ContentHeader parentTitle ="Prezentare indicatori SNA" title={title}/>
        <div>TODO show report</div>
      </div>
    );
  }
}
