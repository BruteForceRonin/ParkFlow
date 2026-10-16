const StatCard = ({ title, value, color }) => {
  return (
    <section className={`card border-0 border-top border-4 border-${color}`}>
      <div className="card-header">{title}</div>
      <div className="card-body">
        <h3 className="card-text">{value}</h3>
      </div>
    </section>
  );
};

export default StatCard;
