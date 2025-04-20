export namespace Route {
    export interface MetaArgs {
        [key: string]: any;
    }
}

export type Machine = {
    number: number;
    available: boolean;
    time_left: number;
};

export type LaundryData = {
    washing_machine: Machine[];
    dryer: Machine[];
}; 