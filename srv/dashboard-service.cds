@requires: 'authenticated-user'
service DashboardService {

    function kpis(month: Integer, year: Integer) returns {
        totalBuys: Decimal;
        totalOrders: Integer;
        totalProducts: Integer;
        averageLeadTime: Integer
    };

    function ordersStatus(month: Integer, year: Integer) returns {
        early: Integer;
        earlyPercentage: Integer;

        pending: Integer;
        pendingPercentage: Integer;

        onTime: Integer;
        onTimePercentage: Integer;
        
        outTime: Integer;
        outTimePercentage: Integer;
    }

    function productCompare(month: Integer, year: Integer, material1: String, material2: String) returns {
        percentage1: Double;
        percentage2: Double;
    }

    function totalPerRegion(month: Integer, year: Integer, ) returns array of {
        name: String;
        regions: array of Integer;
    };

    function statusPerBuyerGroup(month: Integer, year: Integer) returns array of {
        name: String;
        value: Double;
    }
}