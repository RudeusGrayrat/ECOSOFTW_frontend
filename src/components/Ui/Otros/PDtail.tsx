const PDetail = ({ content, value }) => {
  return (
    <p className="text-xl  text-gray-700 my-2">
      <strong className="text-sky-600 mr-2">{content + " : "}</strong>
      {value}
    </p>
  );
};

export default PDetail