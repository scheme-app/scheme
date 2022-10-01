import { FC } from "react";

type ButtonPropTypes = {
  name: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

const Button: FC<ButtonPropTypes> = ({ name, type, onClick }) => {
  return (
    <button
      className="text-md rounded-md border-[1px] border-[#E4E4E4] py-0.5 px-2.5 font-light text-[#969696] hover:text-black hover:shadow-sm"
      type={type}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
