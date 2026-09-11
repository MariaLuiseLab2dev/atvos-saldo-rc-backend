import cds from "@sap/cds";
import { DateTime } from "luxon";

const { BuyerRequests, BuyerRequestEvents } = cds.entities('atvos.saldo.rc.entities')

class DashboardService extends cds.ApplicationService {
    init() {
        this.on("kpis", async req => {
            const { month, year } = req.data;

            if (!month || !year) {
                return req.error(400, "Month and Year are required");
            }
            const filterDate = DateTime.fromFormat(`${year}-${month}-01`, 'yyyy-M-d');
            const commonWhere = {
                createdAt: { between: filterDate.toISODate(), and: filterDate.endOf("month").toISODate() }
            };

            const { totalBuys, totalOrders, totalProducts } = (
                await SELECT(BuyerRequests)
                    .columns(
                        "SUM(value) as totalBuys",
                        "COUNT(*) as totalOrders",
                        "SUM(quantity) as totalProducts"

                    )
                    .where(commonWhere)
            )[0];

            return {
                totalBuys,
                totalOrders,
                totalProducts,
                averageLeadTime: (month * 60) + 2025
            }
        });

        this.on("ordersStatus", async req => {
            const { month, year } = req.data;

            if (!month || !year) {
                return req.error(400, "Month and Year are required");
            }
            const filterDate = DateTime.fromFormat(`${year}-${month}-01`, 'yyyy-M-d');

            const { totalOrders } = (
                await SELECT(BuyerRequests)
                    .columns(
                        "COUNT(*) as totalOrders",
                    )
                    .where({
                        createdAt: { between: filterDate.toISODate(), and: filterDate.endOf("month").toISODate() }
                    })
            )[0];

            const early = Math.round(0.2 * totalOrders);
            const pending = Math.round(0.30 * totalOrders);
            const onTime = Math.round(0.40 * totalOrders);
            const outTime = Math.round(0.1 * totalOrders);

            return {
                earlyPercentage: 20,
                pendingPercentage: 30,
                onTimePercentage: 40,
                outTimePercentage: 10,

                early,
                pending,
                onTime,
                outTime
            }
        });

        this.on("productCompare", async req => {
            const { month, year, material1, material2 } = req.data;

            if (!month || !year) {
                return req.error(400, "Month and Year are required");
            }
            const filterDate = DateTime.fromFormat(`${year}-${month}-01`, 'yyyy-M-d');

            const { total1 } = (
                await SELECT(BuyerRequests)
                    .columns(
                        "COUNT(*) as total1",
                    )
                    .where({
                        createdAt: { between: filterDate.toISODate(), and: filterDate.endOf("month").toISODate() },
                        material: material1
                    })
            )[0];

            const { total2 } = (
                await SELECT(BuyerRequests)
                    .columns(
                        "COUNT(*) as total2",
                    )
                    .where({
                        createdAt: { between: filterDate.toISODate(), and: filterDate.endOf("month").toISODate() },
                        material: material2
                    })
            )[0];

            const { total } = (
                await SELECT(BuyerRequests)
                    .columns(
                        "COUNT(*) as total",
                    )
                    .where({
                        createdAt: { between: filterDate.toISODate(), and: filterDate.endOf("month").toISODate() }
                    })
            )[0];

            return {
                percentage1: (total1 / total) * 100,
                percentage2: (total2 / total) * 100,
            }
        });

        this.on("totalPerRegion", async req => {
            const { month, year } = req.data;

            if (!month || !year) {
                return req.error(400, "Month and Year are required");
            }
            const filterDate = DateTime.fromFormat(`${year}-${month}-01`, 'yyyy-M-d');

            const data = await SELECT(BuyerRequestEvents)
                .columns("COUNT(*) as qtd", "createdBy")
                .where({
                    createdAt: { between: filterDate.toISODate(), and: filterDate.endOf("month").toISODate() }
                })
                .groupBy("createdBy")
                .limit(5);

            return data.map(e => ({
                name: e.createdBy,
                regions: [
                    Math.floor(e.qtd * 0.1),
                    Math.floor(e.qtd * 0.2),
                    Math.floor(e.qtd * 0.35),
                    Math.floor(e.qtd * 0.25),
                    Math.floor(e.qtd * 0.4),
                ]
            }));
        });

        this.on("statusPerBuyerGroup", async req => {
            const { month, year } = req.data;

            if (!month || !year) {
                return req.error(400, "Month and Year are required");
            }
            const filterDate = DateTime.fromFormat(`${year}-${month}-01`, 'yyyy-M-d');

            return await SELECT(BuyerRequests)
                .columns("SUM(value) as value", "group.description as name")
                .where({
                    createdAt: { between: filterDate.toISODate(), and: filterDate.endOf("month").toISODate() }
                })
                .groupBy("group.description")
                .limit(5);
        });
        return super.init();
    }
};

export { DashboardService };