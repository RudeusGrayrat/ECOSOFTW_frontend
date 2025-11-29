
const CardPlegable = ({ title, children }) => {

    return (
        <div className=" shadow-md bg-[#f3f3f3a1] rounded-lg mr-4 m-4">
            <button
                className="my-2 bg-[#ffffff] text-start shadow-md p-4 mb-6 rounded-lg w-full font-semibold text-xl"
            >
                {title}
            </button>
            <div className="mx-10 pb-6 ">{children}</div>
        </div>
    );
};

export default CardPlegable;
