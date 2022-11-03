import { FC } from "react";

type ButtonPropTypes = {
  name: string;
  type?: "button" | "submit" | "reset";
  style: "primary" | "secondary" | "delete";
  size?: "small";
  onClick?: () => void;
};

const Button: FC<ButtonPropTypes> = ({ name, style, type, size, onClick }) => {
  return style === "primary" ? (
    <button
      className={`${
        size === "small" ? "text-sm" : "text-md"
      } rounded-md border-[1px] border-[#E4E4E4] py-0.5 px-2 font-light text-[#969696] hover:text-black hover:shadow-sm`}
      type={type}
      onClick={onClick}
    >
      {name}
    </button>
  ) : style == "secondary" ? (
    <button
      className={`${
        size === "small" ? "text-sm" : "text-md"
      } px-2 py-0.5 font-light text-[#969696] hover:text-black`}
      type={type}
      onClick={onClick}
    >
      {name}
    </button>
  ) : (
    <button
      className={`${
        size === "small" ? "text-sm" : "text-md"
      } text-md px-2 py-0.5 font-light text-[#969696] hover:text-red-500`}
      type={type}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export { Button };
