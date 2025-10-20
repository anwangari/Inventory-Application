// ============================================
// FILE: client/src/components/common/Card.jsx
// ============================================
import '../../styles/Card.css';

const Card = ({ title, value, icon, trend, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>
      <div className="card-value">{value}</div>
      {trend && (
        <div className={`card-trend ${trend.type}`}>
          {trend.value}
        </div>
      )}
    </div>
  );
};

export default Card;