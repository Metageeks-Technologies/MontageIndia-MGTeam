declare module '@tawk.to/tawk-messenger-react' {
  import { ComponentType } from 'react';

  interface TawkMessengerProps {
    propertyId: string;
    widgetId: string; 
    siteDomain: string;
    hideInitialMessage: boolean;
  }

  const TawkMessengerReact: ComponentType<TawkMessengerProps>;

  export default TawkMessengerReact;
}