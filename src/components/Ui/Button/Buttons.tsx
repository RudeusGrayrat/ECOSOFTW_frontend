
const ButtonOk = ({
  type,
  children,
  onClick,
  styles,
  classe,
  stylesButton,
  ...OtherProps
}) => {
  const color =
    type === "ok"
      ? "bg-gradient-to-r from-[#7BCF9E] to-[#3B8359] hover:scale-105 transition-all duration-300  hover:from-[#3B8359] hover:to-[#7BCF9E]"
      : "bg-red-600 hover:scale-105 transition-all duration-200  hover:bg-red-500";
  return (
    <div className={` ${styles ? styles : "m-4 px-8  mx-4 "} `}>
      <button
        onClick={onClick}
        className={` ${color}  text-white ${classe} px-4 py-2 
          rounded-md`}
        {...OtherProps}
      >
        {children}
      </button>
    </div>
  );
};

export default ButtonOk;
