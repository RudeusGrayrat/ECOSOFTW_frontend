
const Home = () => {
    const graficas = [1, 2];
    return (
        <div className=" overflow-y-auto flex flex-col w-full max-w-full justify-center items-center gap-4  h-[90%] ">
            {
                graficas.map((grafica, index) => (
                    <div key={index} className="w-[95%] h-[45%] border border-green-200 m-2 rounded-lg flex justify-center items-center">
                        Indicador {grafica}
                    </div>
                ))
            }

        </div>
    );
};
export default Home;