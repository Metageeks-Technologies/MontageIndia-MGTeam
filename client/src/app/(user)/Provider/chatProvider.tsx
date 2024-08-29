"use client";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export function ChatProvider ( {children}: {children: React.ReactNode;} ) {
    console.log( `${process.env.NEXT_PUBLIC_CLIENT_URL}`, `${process.env.NEXT_PUBLIC_PROERTY_ID}`, `${process.env.NEXT_APP_WIDGET_ID}` )
    console.log("Caht provider")
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