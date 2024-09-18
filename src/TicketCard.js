import React from 'react';

const priorityLabels = {
  4: 'Urgent',
  3: 'High',
  2: 'Medium',
  1: 'Low',
  0: 'No Priority',
};

const TicketCard = ({ ticket }) => {
  return (
    <div className="ticket-card">
      <h4>{ticket.title}</h4>
      <p>Status: {ticket.status}</p>
      <p>Priority: {priorityLabels[ticket.priority]}</p>
    </div>
  );
};

export default TicketCard;
