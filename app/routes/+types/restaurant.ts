export namespace Route {
  export interface MetaArgs {
    [key: string]: any;
  }
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  allergens: string[];
  isVegetarian: boolean;
}

export interface MenuData {
  menuItems: MenuItem[];
  date: string;
  categories: string[];
} 