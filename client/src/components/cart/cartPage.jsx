import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, User} from "@nextui-org/react";

export default function CartPopup() {
  return (
    <Dropdown
      showArrow
      radius="sm"
      classNames={{
        base: "before:bg-default-200",
        content: "p-0 border-small border-divider bg-background",
      }}
    >
      <DropdownTrigger>
        <Button variant="ghost" disableRipple>Cart</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Cart items"
        className="p-3"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
        style={{
          maxHeight: '75vh',
          overflowY: 'auto',
          width: '400px', // Adjust this value as needed
        }}
      >
       <DropdownItem
            isReadOnly
            key="profile"
            className="h-14 gap-2 opacity-100"
          >
            <User
              name="Junior Garcia"
              description="@jrgarciadev"
              classNames={{
                name: "text-default-600",
                description: "text-default-500",
              }}
              avatarProps={{
                size: "sm",
                src: "https://avatars.githubusercontent.com/u/30373425?v=4",
              }}
            />
              </DropdownItem>
               <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
              </DropdownItem>
               <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </DropdownItem>
           <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </DropdownItem>
           <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </DropdownItem>
           <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </DropdownItem>
           <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </DropdownItem>
           <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </DropdownItem>

           <DropdownItem key="item1" className="h-14 gap-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <img src="path_to_image" alt="Item" className="w-12 h-8 object-cover" />
                <span>MOV</span>
              </div>
              <div>
                <span>$79</span>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </DropdownItem>
          
    
      </DropdownMenu>
    </Dropdown>
  );
}