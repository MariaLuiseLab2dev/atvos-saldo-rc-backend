namespace atvos.saldo.rc.entities;

using {cuid} from '@sap/cds/common';

entity Materials : cuid {

    description    : String;
    suggestedValue : Decimal;
}

entity AccountClassifications {
    key id          : Integer;
        description : String;
}

entity BuyerGroup {
    key id          : Integer;
        description : String;
}

entity BuyerRequests {
    key request        : Integer64;
        quantity       : Integer;
        value          : Decimal;
        createdAt      : Timestamp;
        
        status         : String enum {
            WAITING;
            APPROVED;
            QUOTATION;
            REJECTED;
        }

        material       : Association to one Materials;
        group          : Association to one BuyerGroup;
        classification : Association to one AccountClassifications;

        events         : Association to many BuyerRequestEvents
                             on events.request = $self;

        transportLogs  : Association to many BuyerRequestTransportLogs
                             on transportLogs.request = $self;
}

entity Events {
    key id      : Integer;
        message : String;
}

entity BuyerRequestEvents : cuid {
    event     : Association to one Events;

    createdAt : Timestamp @cds.on.insert: $now;
    createdBy : String;

    request   : Association to one BuyerRequests;

    status    : String enum {
        COMPLETED;
        NOT_COMPLETED;
    }
}

entity TransportLogs {
    key id     : Integer;
        status : String;
}

entity BuyerRequestTransportLogs : cuid {
    createdAt : Timestamp @cds.on.insert: $now;
    status    : Association to one TransportLogs;

    request   : Association to one BuyerRequests;
}
