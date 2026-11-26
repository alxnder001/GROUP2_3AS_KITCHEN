const SuccessNote = ({ text }) => {
  if (!text) return null;
  return <div className="success">{text}</div>;
};

export default SuccessNote;
