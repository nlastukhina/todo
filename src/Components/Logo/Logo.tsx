import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import './Logo.css';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export const Logo: FC = () => {
  return (
    <NavLink to="/" className="logo">
      <AssignmentTurnedInIcon color="primary" /> TODO
    </NavLink>
  );
};
