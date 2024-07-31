// dataOptions.ts

type TDataOptions = {
  name: string;
  value: string;
};

// Admin Roles
export const adminRolesOptions: TDataOptions[] = [
  {name: 'Super Admin',value:"superadmin"},
  {name: 'Admin',value:"admin"}
];

// Categories
export const categoriesOptions: TDataOptions[] = [
  {name: 'technology',value:"technology"},
  {name: 'health',value:"health"},
  {name: 'education',value:"education"},
  {name: 'entertainment',value:"entertainment"},
  {name: 'sports',value:"sports"},
  {name: 'business',value:"business"},
  {name: 'lifestyle',value:"lifestyle"},
];


// Media Types
export const mediaTypesOptions: TDataOptions[] = [
  {name: 'image',value:"image"},
  {name: 'video',value:"video"},
  {name: 'audio',value:"audio"},
];
