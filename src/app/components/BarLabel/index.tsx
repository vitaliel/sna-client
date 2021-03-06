import * as React from 'react';

const style = require('./style.css');

interface Props {
  value?: number;
  name?: string;
  x?: number;
  y?: number;
  // textAnchor: string // start,end
  // height: number
  // index: number
  // payload: any
}

export const BarLabel = (props: Props) => {
  return (
    <g>
      <text className={style.BarLabel}
            x={props.x - 30} y={props.y}>{props.value}</text>;
      <text x={props.x} y={props.y}>{props.name}</text>;
    </g>
  );
};
