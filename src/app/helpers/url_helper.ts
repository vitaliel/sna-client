const ADMIN_TYPE_MINISTRIES = 1;
const ADMIN_TYPE_OTHER = 2;
const ADMIN_TYPE_COUNTIES = 3;

export interface MyLocation {
  pathname: string;
  query?: any;
}

export interface RouterParams {
  id: string; // indicator ID
  mid?: string; // admin type item id, ie ministry ID or county ID
}

// itemId: county_id or ministry_id
export function reportPath(indicatorId: number, institutionId?: number, itemId?: number): string {
  let result = `/report/${indicatorId}`;

  if (institutionId) {
    result += `/${institutionId}`;
  }

  if (itemId) {
    result += `/${itemId}`;
  }

  return result;
}

// path for ministry, prefix m
export function mreportPath(indicatorId: number, itemId?: number, query?: any): MyLocation {
  let pathname = `/report/${indicatorId}/${ADMIN_TYPE_MINISTRIES}`;

  if (itemId) {
    pathname += `/${itemId}`;
  }

  return {pathname, query};
}

// path for Independence, prefix i
export function ireportPath(indicatorId: number, itemId?: number, query?: any): MyLocation {
  let pathname = `/report/${indicatorId}/${ADMIN_TYPE_OTHER}`;

  if (itemId) {
    pathname += `/${itemId}`;
  }

  return {pathname, query};
}

// path for county, prefix c
export function creportPath(indicatorId: number, itemId?: number, query?: any): MyLocation {
  let pathname = `/report/${indicatorId}/${ADMIN_TYPE_COUNTIES}`;

  if (itemId) {
    pathname += `/${itemId}`;
  }

  return {pathname, query};
}

export function selAdminPath(indId: number, query?: any): MyLocation {
  return {pathname: `/selectAdministration/${indId}`, query};
}

export function routePath(pathname, query?): MyLocation {
  return {pathname, query};
}

export function parseIndicatorId(path: string) {
  const result = path.match(/\/report\/(\d+)/);

  if (result) {
    return parseInt(result[1], 10);
  } else {
    return 0;
  }
}
