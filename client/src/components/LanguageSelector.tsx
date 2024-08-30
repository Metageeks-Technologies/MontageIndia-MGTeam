"use client";
import Script from "next/script";
import React, {useState, useEffect, useRef} from "react";
import {getPrefLangCookie, setPrefLangCookie} from "../utils/cookies";

interface Language {
    label: string;
    value: string;
    src: string;
}

const languages: Language[] = [
    {label: "English", value: "en", src: "https://flagcdn.com/h60/us.png"},
    {label: "Spanish", value: "es", src: "https://flagcdn.com/h60/es.png"},
    {label: "French", value: "fr", src: "https://flagcdn.com/h60/fr.png"},
    {label: "German", value: "de", src: "https://flagcdn.com/h60/de.png"},
    {label: "Italian", value: "it", src: "https://flagcdn.com/h60/it.png"},
    {label: "Portuguese", value: "pt", src: "https://flagcdn.com/h60/pt.png"},
    {label: "Russian", value: "ru", src: "https://flagcdn.com/h60/ru.png"},
    // Add more languages as needed
];

const includedLanguages: string = languages.map( lang => lang.value ).join( "," );


declare global {
    interface Window {
        google: {
            translate: {
                TranslateElement: {
                    new( config: any, element: string ): void;
                    InlineLayout: {
                        SIMPLE: string;
                    };
                };
                Element: any;
            };
        };
        googleTranslateElementInit: () => void;
    }
} 

export function GoogleTranslate (): JSX.Element {
    const [currentLang, setCurrentLang] = useState( "en" );
    const [isGoogleTranslateReady, setIsGoogleTranslateReady] = useState( false );
    const googleTranslateElementRef = useRef<HTMLDivElement>( null );

    useEffect( () => {
        // console.log( "Component mounted" );
        const savedLang = getPrefLangCookie().split( '/' ).pop() || "en";
        // console.log( "Initial saved language:", savedLang );
        setCurrentLang( savedLang );

        const script = document.createElement( "script" );
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild( script );

        window.googleTranslateElementInit = () => {
            // console.log( "Google Translate initializing" );
            if ( googleTranslateElementRef.current ) {
                new window.google.translate.TranslateElement( {
                    pageLanguage: "auto",
                    includedLanguages,
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                }, googleTranslateElementRef.current.id );
                // console.log( "Google Translate initialized" );
                setIsGoogleTranslateReady( true );
            } else {
                console.error( "Google Translate element ref not found" );
            }
        };

        return () => {
            document.body.removeChild( script );
        };
    }, [currentLang] );

    const changeLang = ( event: React.ChangeEvent<HTMLSelectElement> ) => {
        const langCode = event.target.value;
        if ( currentLang !== langCode ) {
            setCurrentLang( langCode );
            const cookieValue = `/auto/${langCode}`;
            setPrefLangCookie( cookieValue ); 
        } else {
            console.log( "Language unchanged" );
        }
    };


    return (
        <div>
            <div id="google_translate_element" ref={googleTranslateElementRef} style={{display: 'none'}}></div>
            <select
                onChange={changeLang}
                value={currentLang}
                className="notranslate bg-black text-white border border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
                {languages.map( ( lang ) => (
                    <option key={lang.value} value={lang.value}>
                        <img src={lang.src} alt={lang.label} className="w-6 h-6 inline-block" />
                        {lang.label}
                    </option>
                ) )}
            </select>
        </div>
    );
}
