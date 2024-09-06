"use client";

import Footer from '@/components/Footer';
import React, {useState} from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import instance from '@/utils/axios';
import Swal from 'sweetalert2';
import {ThreeDotsLoader} from '@/components/loader/loaders';

const onDemandPage = () => {
    const [loading, setLoading] = useState(false);
    const key=process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const [formData, setFormData] = useState( {
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    } );
    const [errors, setErrors] = useState( {
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    } );

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const {name, value} = e.target;
        setFormData( ( prevFormData ) => ( {
            ...prevFormData,
            [name]: value,
        } ) );
        // Clear error when user starts typing
        setErrors( ( prevErrors ) => ( {
            ...prevErrors,
            [name]: '',
        } ) );
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();
        let hasError = false;
        const newErrors = {...errors};

        // Check for empty fields
        Object.keys( formData ).forEach( ( key ) => {
            if ( !formData[key as keyof typeof formData] ) {
                newErrors[key as keyof typeof errors] = `${key} is a required field`;
                hasError = true;
            }
        } );

        setErrors( newErrors );

        if ( !hasError ) {
            try{
                setLoading(true);
                const response = await instance.post( '/user/onDemand/email', {...formData},{
                    withCredentials: true
                });
                console.log("email response",response);
                if(!response.data.success){
                    Swal.fire({
                        icon: 'error',
                        title: 'Error sending email',
                        text: 'Please try again later',
                    });
                    setLoading(false);
                    return;
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Email sent successfully',
                    text: 'We will get back to you soon',
                });
                setLoading(false);
            }
            catch(e){
                Swal.fire({
                    icon: 'error',
                    title: 'Error sending email',
                    text: 'Please try again later',
                })
                return;
            }
           
            console.log( 'Form submitted:', formData );
            // You can also send the form data to your server here
            setFormData( {
                name: '',
                phone: '',
                email: '',
                subject: '',
                message: ''
            } ); 
        }
    };

    return (
        <div className='bg-white'>
        <div className="mx-auto my-10 p-6 bg-white rounded-lg shadow-md w-1/2 ">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Success Starts Here!</h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block font-medium">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-pageBg-light"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="block font-medium">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="+91 9XXXXXXX56"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-pageBg-light"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block font-medium">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="abc@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-pageBg-light"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="subject" className="block font-medium">
                        Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="subject"
                        placeholder="Write your subject in detail"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-pageBg-light"
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div className="col-span-2">
                    <label htmlFor="message" className="block font-medium">
                        Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-pageBg-light"
                        rows={4}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-center">
                        <input type="checkbox" id="notRobot" className="mr-2" />
                        <label htmlFor="notRobot" className="text-sm">I'm not a robot</label>
                            <ReCAPTCHA
                                sitekey={key as string || ''}
                            />,
                    </div>
                </div>
                    <div className="col-span-2">
                        
                    <button disabled={loading} type="submit" className="justify-center mx-auto bg-webred text-white px-4 py-2 rounded">
                       {loading?(<ThreeDotsLoader/>):(
                        <span>Submit Now</span>
                       )} 
                    </button>
                </div>
            </form>
            </div>
            <Footer/>
        </div>
    );

};

export default onDemandPage;