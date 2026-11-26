const PageIntro = ({ title, subtitle }) => {
  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">{subtitle}</p>
    </section>
  );
};

export default PageIntro;
