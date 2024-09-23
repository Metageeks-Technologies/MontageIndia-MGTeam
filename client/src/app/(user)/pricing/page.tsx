"use client";
import {useEffect, useState} from "react";
import {Key} from "@react-types/shared";
import SubscriptionCard from "@/components/subscription/subsciptionCard";
import {Tabs, Tab, Input, Link, Button, Spinner} from "@nextui-org/react";
import instance from "@/utils/axios";
import {SpinnerLoader} from "@/components/loader/loaders";
import UserDropdown from "@/components/userDropdown";

interface SubscriptionPlan {
    _id: string;
    planId: string;
    entity: string;
    interval: number;
    period: string;
    total_count: number;
    customer_notify: boolean;
    item: {
        id: string;
        active: boolean;
        name: string;
        description: string;
        amount: number;
        unit_amount: number;
        currency: string;
        type: string;
        unit: string | null;
    };
    notes: {
        credits: number;
        validity: number;
    };
}

const SubscriptionTable = () => {
    const [loader, setLoader] = useState( false );
    const [plans, setPlans] = useState<SubscriptionPlan[]>( [] );
    const [selected, setSelected] = useState<Key | null | undefined>( "login" );
    const [activeTab, setActiveTab] = useState( "monthly" );

    const handleTabClick = ( tab: string ) => {
        setActiveTab( tab );
    };

    const fetchPlans = async () => {
        try {
            setLoader( true );
            const response = await instance.get( "/subscription/fetchAllPlans", {
                headers: {
                    "ngrok-skip-browser-warning": true,
                },
            } );
            setPlans( response.data.response as SubscriptionPlan[] );
            setLoader( false );
        } catch ( error ) {
            console.error( "Error fetching plans:", error );
            setLoader( false );
        }
    };

    useEffect( () => {
        fetchPlans();
    }, [] );
    return (
        <div className="w-full px-24 flex flex-col justify-start items-center min-h-screen rounded-lg overflow-hidden bg-white text-white">
            <UserDropdown />
            <div className="w-full font-bold text-md md:text-xl mb-8 rounded-lg bg-[#8d529c] text-white px-4 py-2 md:px-6 md:py-4">
                Subscription Plan
            </div>
            {loader ? (
                <SpinnerLoader />
            ) : (
                <div className="w-full flex flex-col justify-center items-center">
                    <div className="mb-4">
                        <ul
                            className="flex justify-center text-sm font-medium text-center"
                            role="tablist"
                        >
                            <li className="me-2" role="presentation">
                                <button
                                    className={`inline-block px-6 py-2 rounded-md ${activeTab === "monthly"
                                        ? "text-white bg-[#8d529c]"
                                        : "hover:text-gray-600 text-black bg-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => handleTabClick( "monthly" )}
                                    role="tab"
                                    aria-controls="monthly"
                                    aria-selected={activeTab === "monthly"}
                                >
                                    Monthly
                                </button>
                            </li>
                            <li className="me-2" role="presentation">
                                <button
                                    className={`inline-block px-6 py-2 rounded-md ${activeTab === "yearly"
                                        ? "text-white bg-[#8d529c]"
                                        : "hover:text-gray-600 text-black bg-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => handleTabClick( "yearly" )}
                                    role="tab"
                                    aria-controls="yearly"
                                    aria-selected={activeTab === "yearly"}
                                >
                                    Yearly
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full px-4" >
                        {
                            activeTab === "monthly" ? (
                                <div className="w-full flex flex-wrap lg:flex-nowrap flex-col md:flex-row justify-center items-center gap-4">
                                    {plans.map(
                                        ( plan ) =>
                                            plan.period === "monthly" && (
                                                <SubscriptionCard plan={plan} />
                                            )
                                    )}
                                </div>
                            ) : (
                                <div className="w-full flex-wrap lg:flex-nowrap flex flex-col md:flex-row justify-center items-center gap-4">
                                    {plans.map(
                                        ( plan ) =>
                                            plan.period === "yearly" && <SubscriptionCard plan={plan} />
                                    )}
                                </div>
                            )
                        }

                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionTable;
