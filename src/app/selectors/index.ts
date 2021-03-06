import {List, Map, OrderedSet, OrderedMap} from 'immutable';
import {createSelector} from 'reselect';

import {isContentLoaded, MStatEntry, MStats, ApplicationState, CStats} from '../redux/application_state';
import {parseIndicatorId, parseAdminTypeId, ADMIN_TYPE_COUNTIES, parseMinistryId} from '../helpers/url_helper';
import {Indicator} from '../models/indicator';
import {Ministry} from '../models/ministry';

export const areIndicatorsLoaded = (state) => (state.reduxAsyncConnect.indicators ||
  isContentLoaded(state.reduxAsyncConnect.loadState.indicators));
export const areMinistriesStatsLoaded = (state) => state.reduxAsyncConnect.ministriesStats ||
  isContentLoaded(state.reduxAsyncConnect.loadState.ministriesStats);
export const areCountiesStatsLoaded = (state) => state.reduxAsyncConnect.countiesStats ||
  isContentLoaded(state.reduxAsyncConnect.loadState.countiesStats);

const indicatorsState = (state) => List(state.reduxAsyncConnect.indicators);

const mstatsData = (state: ApplicationState): MStats => state.reduxAsyncConnect.ministriesStats;
export const cstatsData = (state: ApplicationState): CStats => state.reduxAsyncConnect.countiesStats;

export const paramIndicatorId = (state) => parseIndicatorId(state.routing.locationBeforeTransitions.pathname);
const paramAdminTypeId = (state) => parseAdminTypeId(state.routing.locationBeforeTransitions.pathname);
export const paramMinistryId = (state) => parseMinistryId(state.routing.locationBeforeTransitions.pathname);
export const paramCategoryId = (state) => parseInt(state.routing.locationBeforeTransitions.query.category_id, 10) || 0;
export const paramYear = (state) => parseInt(state.routing.locationBeforeTransitions.query.year, 10) || 0;
export const chart = (state) => state.routing.locationBeforeTransitions.query.chart;
export const location = (state) => state.routing.locationBeforeTransitions;

export const paramChart = createSelector(
  paramAdminTypeId, chart,
  (adminTypeId, chart) => {
    if (!chart) {
      return adminTypeId === ADMIN_TYPE_COUNTIES ? 'map' : 'bar';
    } else {
      return chart;
    }
});

export const indicators = createSelector(
  areIndicatorsLoaded, indicatorsState,
  (loaded, items) => ( loaded ?  items : List([])),
);

export const currentIndicator = createSelector(
  indicators, paramIndicatorId,
  (items: List<Indicator>, id) => items.find((i) => i.id === id) || items.first(),
);

export const currentIndicatorTitle = createSelector(
  areIndicatorsLoaded, currentIndicator,
  (loaded, indicator) => ( loaded ?  `${indicator.id}. ${indicator.name}` : 'Loading'),
);

export const currentCategory = createSelector(
  areIndicatorsLoaded, currentIndicator, paramCategoryId,
  (loaded, indicator, id) => (
    loaded ? List(indicator.categories).find((c) => c.id === id) || indicator.categories[0] : null
  ),
);

export const mstats = createSelector(
  areMinistriesStatsLoaded, mstatsData,
  (loaded, data: MStats) => List(loaded ? data.stats : []),
);

export const cstats = createSelector(
  areCountiesStatsLoaded, cstatsData,
  (loaded, data: CStats) => List(loaded ? data.stats : []),
);

export const years = createSelector(
  paramAdminTypeId, areMinistriesStatsLoaded, areCountiesStatsLoaded, mstats, cstats,
  (adminTypeId, mLoaded, cLoaded, mRows: List<MStatEntry>, cRows): OrderedSet<number> => {
    const loaded = adminTypeId === ADMIN_TYPE_COUNTIES ? cLoaded : mLoaded;

    if (loaded) {
      const rows = adminTypeId === ADMIN_TYPE_COUNTIES ? cRows : mRows;
      return rows.flatMap(
        (e) => Object.keys(e.v).map((y) => parseInt(y, 10)),
      ).toOrderedSet() as OrderedSet<number>;
    } else {
      return OrderedSet([2016]);
    }
  },
);

export const currentYear = createSelector(
  years, paramYear,
  (items, y): number => {
    if (items.has(y)) {
      return y;
    } else {
      return items.last();
    }
  },
);

export const currentYearStr = createSelector(
  currentYear,
  (y) => y.toString(),
);

export const selectedMinistries = (state: ApplicationState) => state.selectedMinistries;

export const ministries = createSelector(
  areMinistriesStatsLoaded, mstatsData,
  (loaded, data): OrderedMap<number, Ministry> => {
    if (loaded) {
      return OrderedMap<number, Ministry>(data.ministries.map((m) => [m.id, m]));
    } else {
      return OrderedMap<number, Ministry>([]);
    }
  },
);

export const currentMinistry = createSelector(
  paramMinistryId, ministries,
  (id, map) => map.get(id),
);

export const ministriesFilterData = createSelector(
  areMinistriesStatsLoaded, mstatsData, selectedMinistries,
  (loaded, data, selected) => (
    loaded ? data.ministries.map((m) => ({checked: selected.has(m.id), label: m.name, value: m.id})) : []
  ),
);

export const ministryBarChartData = createSelector(
  areMinistriesStatsLoaded, paramIndicatorId, currentCategory, currentYearStr, mstats, ministries, selectedMinistries,
  (loaded, indId, category, year, rows: List<MStatEntry>, ministries: OrderedMap<number, Ministry>, selectedIds) => {
    if (!loaded || !category) {
      return [];
    }

    const all = selectedIds.size === 0;

    const entries = rows.filter((item) => item.i_id === indId &&
      item.c_id === category.id && (all || selectedIds.has(item.m_id)));
    return entries.map((entry) => ({name: ministries.get(entry.m_id).name, value: entry.v[year]})).toArray()
      .sort((a, b) => -1 * (a.value - b.value));
  },
);

const employeeStats = createSelector(
  areMinistriesStatsLoaded, mstatsData, currentYearStr,
  (loaded, data, year) => {
    if (!loaded) {
      return Map();
    }

    return Map<number, number>(data.employees.map((e) => [e.m_id, e.v[year]]));
  },
);

// data [{x:'employeeCount',y: 'statValue',z: 'MinistryName'}]
export const ministriesScatterChartData = createSelector(
  areMinistriesStatsLoaded, paramIndicatorId, currentCategory, currentYear, mstats, ministries, employeeStats,
  selectedMinistries,
  (loaded, indId, category, year, rows: List<MStatEntry>, ministries: OrderedMap<number, Ministry>,
   estats: Map<number, number>, selectedIds) => {
    if (!loaded || !category) {
      return [];
    }
    const all = selectedIds.size === 0;

    const y = year.toString();
    const entries = rows.filter((item) => item.i_id === indId && item.c_id === category.id &&
      (all || selectedIds.has(item.m_id)));
    return entries.map((entry) => (
      {z: ministries.get(entry.m_id).name, x: estats.get(entry.m_id), y: entry.v[y]}
    )).toArray();
  },
);
