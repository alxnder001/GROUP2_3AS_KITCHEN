const Alert = ({ text }) => {
  if (!text) return null;
  return <div className="alert">{text}</div>;
};

export default Alert;
