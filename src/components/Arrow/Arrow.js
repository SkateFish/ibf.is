import React from "react";
import styles from "./Arrow.module.scss";
import cn from 'classnames'
import padding from '../../utils/padding'

const Arrow = ({ color = "blue", rotation = "0deg", top, bottom }) => (
  <div className={cn(styles.root, padding(top, bottom))}>
    <svg
      viewBox="0 0 90 16"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotateZ({rotation})` }}
    >
      <g fill="none" fill-rule="evenodd">
        <path
          d="M88 8H1"
          stroke="#00468A"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        <path
          fill="#00468A"
          d="M81 1.39l.984-.89L90 8l-8.016 7.5-.984-.89L88.031 8z"
        />
      </g>
    </svg>
  </div>
);

export default Arrow;
