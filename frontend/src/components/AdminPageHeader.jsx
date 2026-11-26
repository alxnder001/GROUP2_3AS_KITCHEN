const AdminPageHeader = ({ title, subtitle, children }) => {
  return (
    <section className="page-header">
      <div className="header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
};

export default AdminPageHeader;
