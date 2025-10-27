import * as React from 'react';

interface IDisplay1PreviewProps {
  children: React.ReactNode;
}

const Display1Preview: React.FunctionComponent<IDisplay1PreviewProps> = (props) => {
  return (
    <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>
      {props.children}
    </span>
  );
};

export default Display1Preview;
