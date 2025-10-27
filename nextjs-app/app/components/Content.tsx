import { PortableText } from 'next-sanity';
import * as React from 'react';

interface IContentProps {
  children: React.ReactNode;
}

export const Content: React.FunctionComponent<IContentProps> = (props) => {
  return (
    <main id="content" className="min-h-[calc(100vh-160px)]">
      {props.children}
    </main>
  );
};

export default Content;
