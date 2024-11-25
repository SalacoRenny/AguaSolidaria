import React from 'react';
import '../../components/admin/KPIWidget.css';

function KPIWidget({ title, value }) {
  return (
    <div className="kpi-widget">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default KPIWidget;
