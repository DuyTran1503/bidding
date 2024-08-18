import { SVGProps } from "react";

const Upload = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18" {...props}>
      <g clipPath="url(#clip0_113_506)">
        <path
          fill={props.color ?? "#000"}
          d="M2.25 14.25h13.5v1.5H2.25v-1.5zm7.5-9.879v8.379h-1.5V4.371L3.697 8.925l-1.06-1.06L9 1.5l6.364 6.364-1.06 1.06L9.75 4.373V4.37z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_113_506">
          <path fill="#fff" d="M0 0H18V18H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default Upload;
