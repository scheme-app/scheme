import { FC } from "react";

type ButtonPropTypes = {
  name: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

const Button: FC<ButtonPropTypes> = ({ name, type, onClick }) => {
  return (
    <button
      className="rounded-lg border-[1.5px] border-[#E4E4E4] px-3 py-1 text-lg font-light text-[#969696] hover:shadow-sm"
      type={type}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
