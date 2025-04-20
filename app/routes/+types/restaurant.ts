export namespace Route {
    export interface MetaArgs {
        [key: string]: any;
    }
}

export interface MenuItem {
    name: string;
    category: string;
    isVegetarian: boolean;
}

export interface MenuResponse {
    grilladesMidi: string[];
    migrateurs: string[];
    cibo: string[];
    accompMidi: string[];
    grilladesSoir: string[];
    accompSoir: string[];
    updatedDate: string;
}

export interface GroupedMenu {
    lunch: {
        [category: string]: {
            items: string[];
            title: string;
            icon: string;
            color: string;
        };
    };
    dinner: {
        [category: string]: {
            items: string[];
            title: string;
            icon: string;
            color: string;
        };
    };
    date: string;
} 