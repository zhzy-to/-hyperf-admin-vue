import { post, get } from "~/utils/request";

// 首页统计
export function getStatics() {
    return get("/statistic/order");
}

// 首页图表信息
export function getStaticForChart(type) {
    return get("/statistic/chart", {
        type: type,
    });
}

// 首页店铺统计
export function getStaticForShop(type) {
    return get("statistic/goods", {
        type: type,
    });
}
