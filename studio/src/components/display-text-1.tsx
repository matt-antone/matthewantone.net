import * as React from 'react';

interface IDisplayTextPreviewProps {
  children: React.ReactNode;
}

enum DisplayTextLevels {
  Display1 = '4rem',
  Display2 = '3.5rem',
  Display3 = '3rem',
  Display4 = '2.5rem',
  Display5 = '2rem',
  Display6 = '1.5rem',
}

const DisplayText1: React.FunctionComponent<IDisplayTextPreviewProps> = (props) => {
  return (
    <span style={{ fontSize: DisplayTextLevels.Display1, fontWeight: 'bold' }}>
      {props.children}
    </span>
  );
};

const DisplayText2: React.FunctionComponent<IDisplayTextPreviewProps> = (props) => {
  return (
    <span style={{ fontSize: DisplayTextLevels.Display2, fontWeight: 'bold' }}>
      {props.children}
    </span>
  );
};

const DisplayText3: React.FunctionComponent<IDisplayTextPreviewProps> = (props) => {
  return (
    <span style={{ fontSize: DisplayTextLevels.Display3, fontWeight: 'bold' }}>
      {props.children}
    </span>
  );
};

const DisplayText4: React.FunctionComponent<IDisplayTextPreviewProps> = (props) => {
  return (
    <span style={{ fontSize: DisplayTextLevels.Display4, fontWeight: 'bold' }}>
      {props.children}
    </span>
  );
};

const DisplayText5: React.FunctionComponent<IDisplayTextPreviewProps> = (props) => {
  return (
    <span style={{ fontSize: DisplayTextLevels.Display5, fontWeight: 'bold' }}>
      {props.children}
    </span>
  );
};

const DisplayText6: React.FunctionComponent<IDisplayTextPreviewProps> = (props) => {
  return (
    <span style={{ fontSize: DisplayTextLevels.Display6, fontWeight: 'bold' }}>
      {props.children}
    </span>
  );
};

export { DisplayText1, DisplayText2, DisplayText3, DisplayText4, DisplayText5, DisplayText6 };
