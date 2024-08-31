"use client";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export function ChatProvider ( {children}: {children: React.ReactNode;} ) { 
    return (
        <>
            <TawkMessengerReact 
                siteDomain={`${process.env.NEXT_PUBLIC_CLIENT_URL}`}
                hideInitialMessage={true} 
                propertyId={`${process.env.NEXT_PUBLIC_PROPERTY_ID}`}
                widgetId={`${process.env.NEXT_PUBLIC_WIDGET_ID}`} />       
            {children}
        </>
    );
}