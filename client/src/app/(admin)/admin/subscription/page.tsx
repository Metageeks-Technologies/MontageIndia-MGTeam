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
    onOpen();
  };

  const updatePlan = async () =>
  {
    const response = await instance.patch(
      `/subscription/plan/${ selectedPlan.id }`,
      selectedPlan
    );
    if ( response.data.success )
    {
      onClose();
      fetchPlans();
      // notifySuccess( "Plan updated successfully" );
      Swal.fire( {
        icon: 'success',
        title: 'Plan updated successfully',
        showConfirmButton: false,
        timer: 1500
      } );

    }
  };
  return (
     <>
    <div className="flex flex-col justify-start items-center min-h-screen rounded-lg overflow-hidden bg-white text-white">
      <div className="w-full font-bold text-xl mb-8  bg-[#7828c8] text-white px-6 py-4" >
        Subscription Plan
      </div>
      {
        loader ? (
          <div className="flex justify-center items-center">
            <Spinner color="secondary" size="lg" />
          </div>  
        ) : (
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
                    plan.period === "yearly" && <SubscriptionCard key={ plan._id } plan={ plan } handleOpen={ handleOpen }  />
                  ) ) }
                </div>
              </Tab>
            </Tabs>
          </div>
        )
      }
      </div>
      <Modal backdrop="transparent" isOpen={ isOpen } onClose={ onClose }>
        <ModalContent>
          { ( onClose ) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                { formTitle }
              </ModalHeader>
              <ModalBody>
                <form>
                  <div className="flex w-full flex-wrap items-center flex-col mb-6 md:mb-0 gap-4">
                    <Input
                      type="text"
                      variant="bordered"
                      label="Plan Name"
                      value={ selectedPlan?.name }
                      onChange={ ( e ) =>
                        setSelectedPlan( {
                          ...selectedPlan,
                          name: e.target.value,
                        } )
                      }
                    />
                    <Textarea
                      maxRows={ 3 }
                      label="Description"
                      variant="bordered"
                      value={ selectedPlan?.description }
                      onChange={ ( e ) =>
                        setSelectedPlan( {
                          ...selectedPlan,
                          description: e.target.value,
                        } )
                      }
                    />
                    <div className="w-full">
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <Input
                          type="text"
                          variant="bordered"
                          label="Price"
                          value={ ( selectedPlan?.amount / 100 ).toString() }
                          onChange={ ( e ) =>
                            setSelectedPlan( {
                              ...selectedPlan,
                              amount: Number( e.target.value ) * 100,
                            } )
                          }
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <select
                            id="currency"
                            name="currency"
                            className="h-full border-l rounded-lg bg-transparent px-2 text-gray-500"
                            value={ selectedPlan.currency }
                            onChange={ ( e ) =>
                              setSelectedPlan( {
                                ...selectedPlan,
                                currency: e.target.value,
                              } )
                            }
                          >
                            {/* <option selected className="px-4 py-2 text-center" value="USD">USD</option> */ }
                            <option
                              selected
                              className="px-4 py-2 text-center"
                              value="INR"
                            >
                              INR
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="text"
                      variant="bordered"
                      label="Credits"
                      value={ selectedPlan?.credits.toString() }
                      onChange={ ( e ) =>
                        setSelectedPlan( {
                          ...selectedPlan,
                          credits: Number( e.target.value ),
                        } )
                      }
                    />
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={ onClose }>
                  Cancel
                </Button>
                <Button color="primary" onPress={ updatePlan }>
                  Update
                </Button>
              </ModalFooter>
            </>
          ) }
        </ModalContent>
      </Modal>

     </>

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
        className="my-2 w-full text-white px-6 py-2 rounded-lg bg-safRed text-lg hover:bg-[#f63c3c] transition-all"
      >
        Update
      </button>
    </div>
  );
};


