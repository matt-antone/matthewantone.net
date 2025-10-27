import * as React from 'react';
import TextPreview from './text-preview';

interface ICallToActionPreviewProps {
  body: any;
  layout: "left" | "right";
  formDisplay: "modal" | "inline";
  buttonText: string | null;
}

const CallToActionPreview: React.FunctionComponent<ICallToActionPreviewProps> = (props) => {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        backgroundColor: "silver",
        padding: 16
      }}>
        <TextPreview content={props.body} />
        {props.formDisplay === "modal" && (
          <div>
            {props.buttonText || "Button"}
          </div>
        )}
        {props.formDisplay === "inline" && (
          <div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Message"></textarea>
              <div>{props.buttonText || "Button"}</div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallToActionPreview;
