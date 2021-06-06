import React from 'react';

const AssignContext = React.createContext({});

export const AssignProvider = AssignContext.Provider;
export const AssignConsumer = AssignContext.Consumer;
export default AssignContext;