import * as React from 'react';
const { connect } = require('react-redux');
import {Dispatch} from "react-redux";
import {push} from "react-router-redux";
import ReactBootstrapSlider from "react-bootstrap-slider";
import {DispatchProps, filterStyle} from "./filters";
import {ApplicationState} from "../../redux/application_state";
import {currentYear, years} from "../../selectors/index";
import {OrderedSet} from "immutable";
import {MyLocation} from "../../helpers/url_helper";
import {commonStyle} from "../../containers/App/index";

interface YearFiltersProps {
  location: MyLocation;
  year?: number;
  years?: OrderedSet<number>;
  disabled?: boolean;
}

@connect(
  (state: ApplicationState, ownProps: YearFiltersProps): YearFiltersProps => ({
    ...ownProps,
    year: currentYear(state),
    years: years(state),
  }),
  (dispatch: Dispatch<ApplicationState>) => ({ onAction: dispatch }),
)
export class YearFilters extends React.Component<YearFiltersProps & DispatchProps, any> {
  public render() {
    const { year, years } = this.props;

    return (
      <div className={filterStyle.year_slider}>
        <div className={`slider-title ${commonStyle.title}`}>Anul afișat</div>
        <ReactBootstrapSlider min={years.first()} max={years.last()} tooltip="hide"
                              ticks={years.toArray()}
                              disabled={this.props.disabled ? "disabled" : ""}
                              ticks_labels={years.toArray()}
                              handleChange={this.fireChangeYear.bind(this)} value={year} />
      </div>
    );
  }

  private fireChangeYear(event: any) {
    const {query, pathname} = this.props.location;
    this.props.onAction(push({pathname, query: {...query, year: event.target.value}}));
  }
}
