import * as React from 'react';
import type { PortableTextBlockComponent } from '@portabletext/react';
interface IDisplayTextPreviewProps {
  children: React.ReactNode;
}

const DisplayText1: PortableTextBlockComponent = (props) => {
  return (
    <span className="text-d1 text-display">
      {props.children}
    </span>
  );
};

const DisplayText2: PortableTextBlockComponent = (props) => {
  return (
    <span className="text-d2 text-display">
      {props.children}
    </span>
  );
};

const DisplayText3: PortableTextBlockComponent = (props) => {
  return (
    <span className="text-d3 text-display">
      {props.children}
    </span>
  );
};

const DisplayText4: PortableTextBlockComponent = (props) => {
  return (
    <span className="text-d4 text-display">
      {props.children}
    </span>
  );
};

const DisplayText5: PortableTextBlockComponent = (props) => {
  return (
    <span className="text-d5 text-display">
      {props.children}
    </span>
  );
};

const DisplayText6: PortableTextBlockComponent = (props) => {
  return (
    <span className="text-d6">
      {props.children}
    </span>
  );
};

export { DisplayText1, DisplayText2, DisplayText3, DisplayText4, DisplayText5, DisplayText6 };
