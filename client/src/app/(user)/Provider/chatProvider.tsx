"use client";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export function ChatProvider ( {children}: {children: React.ReactNode;} ) {

    console.log("Caht provider")
    return (
        <>
            <TawkMessengerReact 
                siteDomain="http://localhost:3000/"
                hideInitialMessage={true} 
                propertyId="property_id"
                widgetId="default" />       
            {children}
        </>
    );
}