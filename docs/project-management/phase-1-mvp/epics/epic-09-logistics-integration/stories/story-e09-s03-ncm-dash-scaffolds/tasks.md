# E09-S03 Task Breakdown

## Execution Checklist

## T1. NCM provider scaffold

- [ ] Create NcmProvider class implementing LogisticsProvider with NotImplementedError stubs
- [ ] Document that API access requires contacting support@nepalcanmove.com
- [ ] Note key feature: fast COD settlement (24h)
- [ ] Add clear error messages when methods are called

## T2. Dash provider scaffold

- [ ] Create DashProvider class implementing LogisticsProvider with NotImplementedError stubs
- [ ] Document that API access requires contacting dashlogistics.com.np
- [ ] Note features: half-kg pricing, warehousing, cross-border
- [ ] Add clear error messages when methods are called

## T3. Register in factory

- [ ] Add ncm and dash to logistics factory provider registry
- [ ] Factory recognizes both providers by name
- [ ] Helpful error messages thrown when attempting to use unimplemented methods
