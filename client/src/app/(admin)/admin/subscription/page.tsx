"use client";
import { useEffect, useState } from "react";
import { Key } from "@react-types/shared";
import {ScrollShadow,Modal, ModalContent,Autocomplete,AutocompleteItem, ModalHeader, ModalBody, ModalFooter,Tabs, Tab, Input, Link, Button,Textarea, useDisclosure} from "@nextui-org/react";
import instance from "@/utils/axios";
import { notifySuccess } from '@/utils/toast';

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

interface Form{
    itemId: string;
    id:string;
    name: string;
    description: string;
    amount: number;
    currency: string;
    credits: number;
    period: string;
    interval: number;
}

interface CardProps {
  plan: SubscriptionPlan;
  handleOpen: (plan: SubscriptionPlan) => void;
}


export const periods = [
  {label: "Monthly", value: "monthly", description: "user will be charged monthly"},
  {label: "Yearly", value: "yearly", description: "user will be charged yearly"},
]
const SubscriptionPage = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [formTitle, setFormTitle] = useState<string>("");
    const [selectedPlan, setSelectedPlan] = useState<Form>({
        id: "",
        itemId: "",
        name: "",
        description: "",
        amount: 0.00,
        currency: "",
        credits: 0,
        period: "",
        interval: 0
    });
    const [selected, setSelected] = useState<Key | null | undefined>("monthly");
  const fetchPlans = async () => {
    try {
      const response = await instance.get("/payment/fetchAllPlans");
      setPlans(response.data.response);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);


   const handleOpen = (plan: SubscriptionPlan) => {
    setSelectedPlan({
      itemId: plan.item.id,
      name: plan.item.name,
      description: plan.item.description,
      amount: plan.item.amount,
      currency: plan.item.currency,
      period: plan.period,
      id: plan._id,
      credits: plan.notes.credits,
      interval: plan.interval
    });
    setFormTitle(plan.item.name);
    onOpen();
  }

    const updatePlan = async () => {
        const response=await instance.patch(`/payment/plan/${selectedPlan.id}`,selectedPlan);
        if(response.data.success){
          onClose();
          fetchPlans();
          notifySuccess("Plan updated successfully");
        }
    }

  return (
    <>
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-start items-center text-3xl font-bold">
        Subscription
      </div>
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center min-h-screen text-white">
          <div className="flex flex-col justify-center items-center">
            <Tabs
              color={"danger"}
    
              aria-label="Tabs price"
              radius="lg"
              size="lg"
              selectedKey={selected}
              onSelectionChange={setSelected}
            >
              <Tab key="Monthly" title="Monthly Plans">
                <div className="flex flex-wrap justify-center items-start gap-4">
                  {plans.map((plan) => (
                    plan.period==="monthly"&&(
                      <Card key={plan._id} plan={plan} handleOpen={handleOpen} />
                    )
                  ))}
                </div>
              </Tab>
              <Tab key="Yearly" title="Yearly Plans">
                <div className="flex flex-wrap justify-center items-center gap-4">
                  {plans.map((plan) => (
                    plan.period==="yearly"&&(
                       <Card key={plan._id} plan={plan} handleOpen={handleOpen} />
                )))}
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>

     <Modal backdrop="transparent" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{formTitle}</ModalHeader>
              <ModalBody>
               <form>
                <div className="flex w-full flex-wrap items-center flex-col mb-6 md:mb-0 gap-4">
                    <Input type="text" variant="bordered" label="Plan Name" value={selectedPlan?.name} onChange={(e) => setSelectedPlan({...selectedPlan, name: e.target.value})}/>
                    <Textarea maxRows={3} label="Description" variant="bordered" value={selectedPlan?.description} onChange={(e) => setSelectedPlan({...selectedPlan, description: e.target.value})}/>
                    <div className="w-full">
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <Input type="text" variant="bordered" label="Price"  value={selectedPlan?.amount.toString() } onChange={(e) => setSelectedPlan({ ...selectedPlan, amount: Number(e.target.value) })} />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                        <select id="currency" name="currency" className="h-full border-l rounded-lg bg-transparent px-2 text-gray-500" value={selectedPlan.currency} onChange={(e) => setSelectedPlan({ ...selectedPlan, currency: e.target.value })}>
                            {/* <option selected className="px-4 py-2 text-center" value="USD">USD</option> */}
                            <option selected className="px-4 py-2 text-center" value="INR">INR</option>
                        </select>
                        </div>
                    </div>
                    </div>
                     {/* <div className="w-full">
                      <Autocomplete
                        label="Period"
                        variant="bordered"
                        defaultItems={periods}
                        selectedKey={selectedPlan?.period}
                        onSelectionChange={(periodValue) => setSelectedPlan({ ...selectedPlan, period: periodValue })}
                      >
                      {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                      </Autocomplete>
                  </div> */}
                    <Input type="text" variant="bordered" label="Credits" value={selectedPlan?.credits.toString()} onChange={(e) => setSelectedPlan({...selectedPlan,credits: Number(e.target.value)} )} />
                </div>
               </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={updatePlan}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubscriptionPage;


const Card: React.FC<CardProps> = ({ plan, handleOpen }) => {
  return (
    <div className="flex-1 text-xl rounded-xl border border-[#4E67E5]/25 bg-[#080C23] p-10">
      <div className="text-center h-[10vh] mb-4">{plan.item.name}</div>
      <div className="text-6xl mb-4 text-center font-light">
        {plan.item.amount / 100} {plan.item.currency}
      </div>
       <ScrollShadow hideScrollBar size={0} className="h-[20vh] mb-4">
        {plan.item.description}
        </ScrollShadow>

      <ul className="text-lg flex justify-start items-center gap-4 mb-4">
        <li>Credits: {plan.notes.credits}</li>
      </ul>
      <button
        onClick={() => handleOpen(plan)}
        className="my-5 w-full text-white p-5 max-sm:p-2 rounded-3xl bg-var1 text-xl max-sm:text-lg hover:bg-var1-light transition-all"
      >
        Update
      </button>
    </div>
  );
};

