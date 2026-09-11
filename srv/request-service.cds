using { atvos.saldo.rc.entities as entities } from '../db/schema';

@requires: 'authenticated-user'
service RequestService {

    @readonly
    @cds.query.limit.default: 100
    @cds.query.limit.max: 100
    entity BuyerRequests as projection on entities.BuyerRequests;

    @readonly
    entity Materials as projection on entities.Materials;

    @readonly
    entity AccountClassifications as projection on entities.AccountClassifications;

    @readonly
    entity BuyerGroups as projection on entities.BuyerGroup;
}