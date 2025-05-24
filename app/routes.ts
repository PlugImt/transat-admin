import {index, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/restaurant", "routes/restaurant.tsx"),
    route("/statistics", "routes/statistics.tsx"),
    route("/laundry", "routes/laundry.tsx"),
    route("/download", "routes/download.tsx"),
    route("/app", "routes/app.tsx")
] satisfies RouteConfig;
