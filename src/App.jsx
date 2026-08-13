import React from 'react';

function App() {
  const data = [
    {
      assignee: 'Alex Rivera',
      app: 'Vault-Core API',
      type: 'FinTech',
      severity: 'Critical',
      start: '2026-05-10',
      due: '2026-05-12',
      countdown: '1 Day',
      status: 'Near Breach',
    },
    {
      assignee: 'Sarah Jenkins',
      app: 'Customer Portal',
      type: 'Web',
      severity: 'High',
      start: '2026-05-09',
      due: '2026-05-13',
      countdown: '2 Days',
      status: 'In Progress',
    },
  ];

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Full Assessment SLA Console</h1>
      <p>Monitoring real-time SLA status across all security assessments</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '20px',
          marginBottom: '30px',
        }}
      >
        <div style={cardStyle}>
          <h3>Total Applications</h3>
          <h1>12</h1>
        </div>

        <div style={cardStyle}>
          <h3>Ongoing Assessments</h3>
          <h1>5</h1>
        </div>

        <div style={cardStyle}>
          <h3>Near SLA Breach</h3>
          <h1>2</h1>
        </div>

        <div style={cardStyle}>
          <h3>Overdue Items</h3>
          <h1>1</h1>
        </div>
      </div>

      <table
export default App;