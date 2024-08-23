"use client";
import { useEffect, useState } from "react";
import { Key } from "@react-types/shared";
import
{
  ScrollShadow,
  Modal,
  ModalContent,
  Autocomplete,
  AutocompleteItem,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Textarea,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import instance from "@/utils/axios";
import { notifySuccess } from "@/utils/toast";
import { FaRupeeSign } from "react-icons/fa";
import Swal from "sweetalert2";

interface SubscriptionPlan
{
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

interface Form
{
  itemId: string;
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  credits: number;
  period: string;
  interval: number;
}

interface CardProps
{
  plan: SubscriptionPlan;
  handleOpen: ( plan: SubscriptionPlan ) => void;
}

const SubscriptionPage = () =>
{
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isUpdateMode, setIsUpdateMode ] = useState( false );
  const [ plans, setPlans ] = useState<SubscriptionPlan[]>( [] );
  const [ loader, setLoader ] = useState( false );
  const [ formTitle, setFormTitle ] = useState<string>( "" );
  const [ selectedPlan, setSelectedPlan ] = useState<Form>( {
    id: "",
    itemId: "",
    name: "",
    description: "",
    amount: 0.0,
    currency: "",
    credits: 0,
    period: "",
    interval: 0,
  } );
  const [ selected, setSelected ] = useState<Key | null | undefined>( "monthly" );
  const fetchPlans = async () =>
  {
    try
    {
      const response = await instance.get( "/subscription/fetchAllPlans" );
      setPlans( response.data.response );
    } catch ( error )
    {
      console.error( "Error fetching plans:", error );
    }
  };

  useEffect( () =>
  {
    fetchPlans();
  }, [] );

  const handleOpen = ( plan: SubscriptionPlan ) =>
  {
    setSelectedPlan( {
      itemId: plan.item.id,
      name: plan.item.name,
      description: plan.item.description,
      amount: plan.item.amount,
      currency: plan.item.currency,
      period: plan.period,
      id: plan._id,
      credits: plan.notes.credits,
      interval: plan.interval,
    } );
    setFormTitle( plan.item.name );
    setIsUpdateMode( true );
  };

  const handleCancelUpdate = () =>
  {
    setIsUpdateMode( false );
    setSelectedPlan( {
      id: "",
      itemId: "",
      name: "",
      description: "",
      amount: 0.0,
      currency: "",
      credits: 0,
      period: "",
      interval: 0,
    } );
  };

  const updatePlan = async () =>
  {
    try {
      const response = await instance.patch(
        `/subscription/plan/${ selectedPlan.id }`,
        selectedPlan
      );
      console.log("Response after update:_",response)
      if ( response.data.success )
      {
        setIsUpdateMode( false );
        fetchPlans();
        Swal.fire( {
          icon: 'success',
          title: 'Plan updated successfully',
          showConfirmButton: false,
          timer: 1500
        } );
      }
      else
      {
        Swal.fire( {
          icon: 'error',
          title: 'Error updating plan',
  
        } ); 
      }
      
    } catch (error) {
      console.log("Error in updateing plan:-",error)
    }
  };

  return (
    <div className={ `flex flex-col justify-start items-center m-6  rounded-lg    bg-white ${ isUpdateMode ? '' : 'min-h-screen' } ` }>
      {
        isUpdateMode ? (
          <div className="bg-white w-full p-2 shadow rounded-lg overflow-hidden">
            <div className=" p-4 border-b">
              <h2 className="text-xl font-semibold">Update Plan</h2>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="planName" className="block text-sm font-medium text-gray-700">
                    Plan Name *
                  </label>
                  <input
                    id="planName"
                    type="text"
                    value={ selectedPlan?.name }
                    onChange={ ( e ) => setSelectedPlan( { ...selectedPlan, name: e.target.value } ) }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"

                  />
                </div>
                <div className="grid grid-cols-2 gap-4">


                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={ selectedPlan?.description }
                      onChange={ ( e ) => setSelectedPlan( { ...selectedPlan, description: e.target.value } ) }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"
                      placeholder="Enter category description"
                      required
                      rows={ 5 }
                    />
                  </div>
                  <div>
                    <div className="p-2">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price *
                      </label>
                      <input
                        id="price"
                        type="number"
                        value={ ( selectedPlan?.amount / 100 ).toString() }
                        onChange={ ( e ) => setSelectedPlan( { ...selectedPlan, amount: Number( e.target.value ) * 100 } ) }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"

                      />
                    </div>
                    <div className="p-2">
                      <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                        Credits *
                      </label>
                      <input
                        id="credits"
                        type="number"
                        value={ selectedPlan?.credits.toString() }
                        onChange={ ( e ) => setSelectedPlan( { ...selectedPlan, credits: Number( e.target.value ) } ) }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none   transition duration-150 ease-in-out bg-pageBg-light"

                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button color="secondary" onClick={ handleCancelUpdate }>
                    Cancel
                  </Button>
                  <Button className="bg-webred hover:bg-webgreen-light text-white" onClick={ updatePlan }>
                    Update
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) :
          <>


            <div className="w-full font-bold text-xl mb-8 rounded-t-lg bg-[#7828c8] text-white px-6 py-4">   Subscription Plans
            </div>
            { loader ? (
              <div className="flex justify-center items-center">
                <Spinner color="danger" size="lg" />
              </div>
            ) :
              (
                <div className="flex flex-col justify-center px-8 items-center">
                  <Tabs
                    color={ "secondary" }
                    aria-label="Tabs price"
                    radius="full"
                    size="lg"
                    selectedKey={ selected }
                    onSelectionChange={ setSelected }
                  >
                    <Tab key="Monthly" title="Monthly Plans">
                      <div className="flex flex-wrap justify-center items-center gap-4">
                        { plans.map( ( plan ) => (
                          plan.period === "monthly" && <SubscriptionCard plan={ plan } key={ plan._id } handleOpen={ handleOpen } />
                        ) ) }
                      </div>


                    </Tab>
                    <Tab key="Yearly" title="Yearly Plans">
                      <div className="flex flex-wrap justify-center items-center gap-4">
                        { plans.map( ( plan ) => (
                          plan.period === "yearly" && <SubscriptionCard key={ plan._id } plan={ plan } handleOpen={ handleOpen } />
                        ) ) }
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              )
            } </> }
    </div>
  );
};

export default SubscriptionPage;


const SubscriptionCard: React.FC<CardProps> = ( { plan, handleOpen } ) =>
{

  return (
    <div className="flex-1 text-xl rounded-xl text-black border border-[#E3B4EF]/25 bg-[#FDF8FF] p-10">
      <div className="text-center h-[10vh] font-semibold mb-4">{ plan.item.name }</div>
      <div className="flex justify-center items-center  mb-4 text-center text-[#7828c8]">
        <span className="text-3xl font-bold mr-2"><FaRupeeSign /></span><span className='font-bold text-3xl'> { plan.item.amount / 100 } { plan.item.currency }</span>
      </div>
      <ScrollShadow hideScrollBar size={ 0 } className="h-[20vh] text-center mb-4">
        { plan.item.description }
      </ScrollShadow>

      <div className="text-lg text-center font-bold mb-4">
        Credits: { plan.notes.credits }
      </div>
      <button onClick={ () => handleOpen( plan ) }
        className="my-2 w-full text-white px-6 py-2 rounded-lg bg-webred text-lg hover:bg-[#f63c3c] transition-all"
      >
        Update
      </button>
    </div>
  );
}; 