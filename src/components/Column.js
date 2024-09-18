import React from 'react';
import TicketCard from '../TicketCard';

const Column = ({ group, tickets }) => {
  return (
    <div className="kanban-column">
      <h2>{group}</h2>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default Column;
